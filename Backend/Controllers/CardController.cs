using Backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using SmartBuy.Data;
using SmartBuy.Models;
using Stripe;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CardController : ControllerBase
{
    private readonly IMongoCollection<MongoCard> _cardCollection;
    private readonly ApplicationDbContext _context;

    public CardController(ApplicationDbContext context, IMongoClient mongoClient)
    {
        _context = context;
        var database = mongoClient.GetDatabase("SmartBuy");
        _cardCollection = database.GetCollection<MongoCard>("Cards");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CardDto>>> GetCards()
    {
        var cards = await _context.Cards
     .Select(c => new CardDto
     {
         Id = c.Id,
         StripePaymentMethodId = c.StripePaymentMethodId,
         Brand = c.Brand,
         Last4 = c.Last4,
         ExpMonth = c.ExpMonth,
         ExpYear = c.ExpYear,
         CardType = c.CardType,
         UserId = c.UserId,
         CreatedAt = c.CreatedAt
     })
     .ToListAsync();


        return Ok(cards);
    }





    [HttpGet("{id}")]
    public async Task<ActionResult<CardDto>> GetCardById(int id)
    {
        var c = await _context.Cards.FindAsync(id);
        if (c == null)
            return NotFound();

        var cardDto = new CardDto
        {
            Id = c.Id,
            StripePaymentMethodId = c.StripePaymentMethodId,
            Brand = c.Brand,
            Last4 = c.Last4,
            ExpMonth = c.ExpMonth,
            ExpYear = c.ExpYear,
            CardType = c.CardType,
            UserId = c.UserId,
            CreatedAt = c.CreatedAt
        };

        return Ok(cardDto);
    }





    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsByUserId(string userId)
    {
        var cards = await _context.Cards
            .Where(c => c.UserId == userId)
            .Select(c => new CardDto
            {
                Id = c.Id,
                StripePaymentMethodId = c.StripePaymentMethodId,
                Brand = c.Brand,
                Last4 = c.Last4,
                ExpMonth = c.ExpMonth,
                ExpYear = c.ExpYear,
                CardType = c.CardType,
                UserId = c.UserId,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        if (cards == null || cards.Count == 0)
        {
            return NotFound();
        }

        return Ok(cards);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCard([FromBody] CardCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Use Stripe SDK to retrieve full card info
        var service = new PaymentMethodService();
        var paymentMethod = await service.GetAsync(dto.StripePaymentMethodId);

        if (paymentMethod.Card == null)
            return BadRequest("Invalid payment method: no card info");

        var card = new SmartBuy.Models.Card
        {
            CardType = dto.CardType,
            StripePaymentMethodId = dto.StripePaymentMethodId,
            UserId = dto.UserId,
            CreatedAt = DateTime.UtcNow,
            Brand = paymentMethod.Card?.Brand ?? string.Empty,
            Last4 = paymentMethod.Card?.Last4 ?? string.Empty,
            ExpMonth = paymentMethod.Card != null ? (int)paymentMethod.Card.ExpMonth : 0,
            ExpYear = paymentMethod.Card != null ? (int)paymentMethod.Card.ExpYear : 0
        };


        _context.Cards.Add(card);
        await _context.SaveChangesAsync();

        var cardDto = card.ToCardDto(); // Map to DTO if you have mapper

        return CreatedAtAction(nameof(GetCardById), new { id = card.Id }, cardDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCard(int id, CardUpdateDto cardDto)
    {
        var card = await _context.Cards.FindAsync(id);
        if (card == null)
        {
            return NotFound();
        }

        card.CardType = cardDto.CardType;
        card.StripePaymentMethodId = cardDto.StripePaymentMethodId;
        card.UserId = cardDto.UserId;
        await _context.SaveChangesAsync();

        return Ok(new CardDto
        {
            Id = card.Id,
            CardType = card.CardType,
            UserId = card.UserId,
            StripePaymentMethodId = card.StripePaymentMethodId,
            CreatedAt = card.CreatedAt
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCard(int id)
    {
        var card = await _context.Cards.FindAsync(id);
        if (card == null)
        {
            return NotFound();
        }

        _context.Cards.Remove(card);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

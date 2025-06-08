using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using SmartBuy.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using SmartBuy.Mappers;

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

    // GET: api/Card
    [HttpGet]
    public async Task<ActionResult> GetCards()
    {
        // Fetch the cards from the MongoDB collection
        var cards = await _cardCollection
            .Find(_ => true) // This will find all cards
            .Project(c => new CardDto
            {
                Id = c.Id,
                CardNumber = c.CardNumber,
                ExpirationDate = c.ExpirationDate,
                CVV = c.CVV,
                CardType = c.CardType,
                UserId = c.UserId,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(cards);
    }


    // GET: api/Card/5
    [HttpGet("{id}")]
    public async Task<ActionResult> GetCardById(int id)
    {
        var card = await _cardCollection
            .Find(c => c.Id == id)
            .FirstOrDefaultAsync();

        if (card == null)
        {
            return NotFound(); // If no card is found, return a 404 Not Found
        }

        return Ok(new CardDto
        {
            Id = card.Id,
            CardNumber = card.CardNumber,
            ExpirationDate = card.ExpirationDate,
            CVV = card.CVV,
            CardType = card.CardType,
            UserId = card.UserId,
            CreatedAt = card.CreatedAt
        });
    }


    // POST: api/Card
    [HttpPost]
    public async Task<ActionResult> CreateCard(CardCreateDto cardDto)
    {
        var card = new Card
        {
            CardNumber = cardDto.CardNumber,
            ExpirationDate = cardDto.ExpirationDate,
            CVV = cardDto.CVV,
            CardType = cardDto.CardType,
            UserId = cardDto.UserId
        };

        _context.Cards.Add(card);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCardById), new { id = card.Id }, new CardDto
        {
            Id = card.Id,
            CardNumber = card.CardNumber,
            ExpirationDate = card.ExpirationDate,
            CVV = card.CVV,
            CardType = card.CardType,
            UserId = card.UserId,
            CreatedAt = card.CreatedAt
        });
    }
    [HttpGet("user/{userId}")]
public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsByUserId(string userId)
{
    var cards = await _cardCollection
        .Find(c => c.UserId == userId)
        .Project(c => new CardDto
        {
            Id = c.Id,
            CardNumber = c.CardNumber,
            ExpirationDate = c.ExpirationDate,
            CVV = c.CVV,
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


    // PUT: api/Card/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCard(int id, [FromBody] CardUpdateDto cardDto)
    {
        var card = await _context.Cards.FindAsync(id);
        if (card == null)
        {
            return NotFound();
        }

        card.CardNumber = cardDto.CardNumber;
        card.ExpirationDate = cardDto.ExpirationDate;
        card.CVV = cardDto.CVV;
        card.CardType = cardDto.CardType;
        card.UserId = cardDto.UserId;
        card.CreatedAt = cardDto.CreatedAt;

        await _context.SaveChangesAsync();
        return Ok(new CardDto
        {
            Id = card.Id,
            CardNumber = card.CardNumber,
            ExpirationDate = card.ExpirationDate,
            CVV = card.CVV,
            CardType = card.CardType,
            UserId = card.UserId,
            CreatedAt = card.CreatedAt
        });
    }

    // DELETE: api/Card/5
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

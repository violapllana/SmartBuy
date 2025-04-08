using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CardController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Card
    [HttpGet]
    public async Task<ActionResult> GetCards()
    {
        var cards = await _context.Cards.Select(c => c.ToCardDto()).ToListAsync();
        return Ok(cards);
    }

    // GET: api/Card/5
    [HttpGet("{id}")]
    public async Task<ActionResult> GetCardById(int id)
    {
        var card = await _context.Cards.FindAsync(id);
        if (card == null)
        {
            return NotFound();
        }
        return Ok(card.ToCardDto());
    }

    // POST: api/Card
    [HttpPost]
    public async Task<ActionResult> CreateCard(CardCreateDto cardDto)
    {
        var card = cardDto.ToCardFromCreateDto();

        _context.Cards.Add(card);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCardById), new { id = card.Id }, card.ToCardDto());
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

        card.Title = cardDto.Title;
        card.Description = cardDto.Description;
        card.Type = cardDto.Type;
        card.CreatedAt = cardDto.CreatedAt;

        await _context.SaveChangesAsync();
        return Ok(card.ToCardDto());
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

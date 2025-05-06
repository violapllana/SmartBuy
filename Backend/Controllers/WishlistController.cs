using Backend.dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/wishlist - Get all wishlist items
        [HttpGet]
        public IActionResult Get()
        {
            var wishlists = _context.Wishlists
                .Select(w => w.toWishlistDto())
                .ToList();

            return Ok(wishlists);
        }

        // GET: api/wishlist/{userId}/{productId}
        [HttpGet("{userId}/{productId}")]
        public async Task<IActionResult> Get(string userId, int productId)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (wishlist == null)
            {
                return NotFound();
            }

            return Ok(wishlist.toWishlistDto());
        }

        // POST: api/wishlist
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] WishlistCreateDto dto)
        {
            var existing = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == dto.UserId && w.ProductId == dto.ProductId);

            if (existing != null)
            {
                return BadRequest($"Product {dto.ProductId} is already in wishlist for User {dto.UserId}.");
            }

            var wishlistModel = dto.toWishlistFromCreateDto();
            _context.Wishlists.Add(wishlistModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { userId = wishlistModel.UserId, productId = wishlistModel.ProductId }, wishlistModel.toWishlistDto());
        }

        // DELETE: api/wishlist/{userId}/{productId}
        [HttpDelete("{userId}/{productId}")]
        public async Task<IActionResult> Delete(string userId, int productId)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (wishlist == null)
            {
                return NotFound();
            }

            _context.Wishlists.Remove(wishlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

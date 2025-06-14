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

       [HttpGet]
public IActionResult Get()
{
    var wishlists = _context.Wishlists
        .Include(w => w.Product)  // ngarko të dhënat e produktit
        .Select(w => w.toWishlistDto())
        .ToList();

    return Ok(wishlists);
}
[HttpGet("{userId}/{productId}")]
public async Task<IActionResult> Get(string userId, int productId)
{
    var wishlist = await _context.Wishlists
        .Include(w => w.Product)  // ngarko produktin
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
// GET: api/Wishlist/user/{userId}
[HttpGet("user/{userId}")]
public async Task<IActionResult> GetByUserId(string userId)
{
    var wishlists = await _context.Wishlists
        .Where(w => w.UserId == userId)
        .Include(w => w.Product)
        .Select(w => w.toWishlistDto())
        .ToListAsync();

    return Ok(wishlists);
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

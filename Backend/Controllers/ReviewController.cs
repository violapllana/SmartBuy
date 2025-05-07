using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.dtos;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using SmartBuy.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMongoCollection<MongoReviews> _reviewCollection;


        public ReviewController(ApplicationDbContext context, IMongoClient mongoClient)
        {
            _context = context;

            var database = mongoClient.GetDatabase("SmartBuy");
            _reviewCollection = database.GetCollection<MongoReviews>("Reviews");
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var reviews = await _reviewCollection.Find(_ => true).ToListAsync();
            var reviewDtos = reviews.Select(r => r.toReviewDto()).ToList();
            return Ok(reviewDtos);
        }

        // GET: api/review/{userId}/{productId} - Get a specific review
        [HttpGet("{userId}/{productId}")]
        public async Task<IActionResult> Get(string userId, int productId)
        {
            // Use MongoDB collection to find the review by userId and productId
            var review = await _reviewCollection
                .Find(r => r.UserId == userId && r.ProductId == productId)
                .FirstOrDefaultAsync();

            if (review == null)
            {
                return NotFound();
            }

            return Ok(review.toReviewDto()); // Using lowercase 'ToReviewDto()' for transformation
        }


        // POST: api/review - Create a new review
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ReviewCreateDto reviewDto)
        {
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == reviewDto.UserId && r.ProductId == reviewDto.ProductId);

            if (existingReview != null)
            {
                return BadRequest($"Review for Product {reviewDto.ProductId} by User {reviewDto.UserId} already exists!");
            }

            var reviewModel = reviewDto.toReviewFromCreateDto(); // Using lowercase 'toReviewFromCreateDto()'

            _context.Reviews.Add(reviewModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { userId = reviewModel.UserId, productId = reviewModel.ProductId }, reviewModel.toReviewDto());
        }

        // DELETE: api/review/{userId}/{productId} - Delete a review
        [HttpDelete("{userId}/{productId}")]
        public async Task<IActionResult> Delete(string userId, int productId)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);

            if (review == null)
            {
                return NotFound($"No review found for Product {productId} by User {userId}.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

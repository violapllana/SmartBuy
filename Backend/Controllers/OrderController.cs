using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using SmartBuy.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using SmartBuy.Mappers;

namespace SmartBuy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;  // SQL Context
        private readonly IMongoCollection<MongoOrder> _mongoCollection;  // MongoDB Collection

        public OrderController(ApplicationDbContext context, IMongoDatabase mongoDatabase)
        {
            _context = context;
            _mongoCollection = mongoDatabase.GetCollection<MongoOrder>("orders");
        }

        // Get Orders from SQL Database
        [HttpGet]
        public async Task<ActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
                .Select(o => o.ToOrderDto())
                .ToListAsync();

            return Ok(orders);
        }

        // Get a specific Order from SQL Database by ID
        [HttpGet("{id}")]
        public async Task<ActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return Ok(order.ToOrderDto());
        }

        // Create Order in SQL Database
        [HttpPost]
        public async Task<ActionResult> CreateOrder(OrderCreateDto orderDto)
        {
            var order = orderDto.ToOrderFromCreateDto();

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order.ToOrderDto());
        }

        // Update Order in SQL Database
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, OrderUpdateDto orderDto)
        {
            var existingOrder = await _context.Orders
                .Include(o => o.OrderProducts)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (existingOrder == null)
                return NotFound();

            existingOrder.UserId = orderDto.UserId;
            existingOrder.OrderDate = orderDto.OrderDate;

            existingOrder.OrderProducts.Clear();
            foreach (var p in orderDto.Products)
            {
                existingOrder.OrderProducts.Add(new OrderProduct
                {
                    ProductId = p.ProductId,
                    Quantity = p.Quantity,
                    Price = p.Price
                });
            }

            await _context.SaveChangesAsync();
            return Ok(existingOrder.ToOrderDto());
        }

        // Delete Order from SQL Database
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Create Order in MongoDB
        [HttpPost("mongo")]
        public async Task<ActionResult> CreateOrderInMongo(MongoOrderCreateDto orderDto)
        {
            var mongoOrder = new MongoOrder
            {
                UserId = orderDto.UserId,
                OrderDate = orderDto.OrderDate,
                Products = orderDto.Products.Select(p => new MongoOrderProduct
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Quantity = p.Quantity,
                    Price = p.Price
                }).ToList()
            };

            await _mongoCollection.InsertOneAsync(mongoOrder);
            return CreatedAtAction(nameof(GetMongoOrderById), new { id = mongoOrder.Id }, mongoOrder);
        }

        // Get Order from MongoDB by ID
        [HttpGet("mongo/{id}")]
        public async Task<ActionResult> GetMongoOrderById(string id)
        {
            var mongoOrder = await _mongoCollection.Find(o => o.Id == id).FirstOrDefaultAsync();
            if (mongoOrder == null)
                return NotFound();

            return Ok(mongoOrder);
        }

        // Get Orders from MongoDB
        [HttpGet("mongo")]
        public async Task<ActionResult> GetMongoOrders()
        {
            var mongoOrders = await _mongoCollection.Find(_ => true).ToListAsync();
            return Ok(mongoOrders);
        }
    }
}
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

        [HttpPost]
        public async Task<ActionResult> CreateOrder(OrderCreateDto orderDto)
        {
            var productApiUrl = "http://localhost:5108"; // ✅ This must match the actual Product API server

            // Step 1: Fetch products from the database
            var productIds = orderDto.Products.Select(p => p.ProductId).ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            // Step 2: Check if there's enough stock for each product
            foreach (var productDto in orderDto.Products)
            {
                var product = products.FirstOrDefault(p => p.Id == productDto.ProductId);
                if (product == null)
                {
                    return BadRequest($"Product with ID {productDto.ProductId} not found.");
                }

                if (product.StockQuantity < productDto.Quantity)
                {
                    return BadRequest($"Not enough stock for product: {product.Name}. Available: {product.StockQuantity}, Requested: {productDto.Quantity}.");
                }
            }

            // Step 3: Calculate the total price of the order
            decimal totalPrice = 0;
            var orderProducts = new List<OrderProduct>();

            foreach (var productDto in orderDto.Products)
            {
                var product = products.FirstOrDefault(p => p.Id == productDto.ProductId);
                if (product != null)
                {
                    totalPrice += product.Price * productDto.Quantity;
                    orderProducts.Add(new OrderProduct
                    {
                        ProductId = productDto.ProductId,
                        Quantity = productDto.Quantity,
                        Price = product.Price
                    });
                }
            }

            // Step 4: Create the order
            var order = new Order
            {
                UserId = orderDto.UserId,
                OrderDate = DateTime.UtcNow,
                OrderProducts = orderProducts
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Step 5: Return the created order with total price
            var orderDtoResponse = new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                Products = order.OrderProducts.Select(op => new OrderProductDto
                {
                    ProductId = op.ProductId,
                    Quantity = op.Quantity,
                    Price = op.Price
                }).ToList(),
                TotalPrice = totalPrice // Add total price here
            };

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, orderDtoResponse);
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
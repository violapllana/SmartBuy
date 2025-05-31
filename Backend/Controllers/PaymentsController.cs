using Microsoft.AspNetCore.Mvc;
using SmartBuy.Data;
using SmartBuy.Models;
using Stripe;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Backend.Mappers;

namespace SmartBuy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PaymentsController> _logger;
        private readonly IConfiguration _configuration;
        private readonly StripeClient _stripeClient;

        public PaymentsController(
            ApplicationDbContext context,
            ILogger<PaymentsController> logger,
            IConfiguration configuration,
            StripeClient stripeClient)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
            _stripeClient = stripeClient;
        }

        [HttpPost("charge")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserId) || request.Amount <= 0 || request.OrderId <= 0)
            {
                return BadRequest("Invalid payment data.");
            }

            var paymentIntentService = new PaymentIntentService(_stripeClient);

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(request.Amount * 100), // Convert to cents
                Currency = "usd",
                ReceiptEmail = request.Email,
                Metadata = new Dictionary<string, string>
                {
                    { "UserId", request.UserId },
                    { "OrderId", request.OrderId.ToString() }
                }
            };

            try
            {
                var intent = await paymentIntentService.CreateAsync(options);

                var payment = new Payment
                {
                    UserId = request.UserId,
                    OrderId = request.OrderId,
                    TotalAmount = request.Amount,
                    TransactionId = intent.Id,
                    PaidAt = DateTime.UtcNow,
                    PaymentStatus = "Pending",
                    PaymentMethod = "Stripe"
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { clientSecret = intent.ClientSecret, transactionId = intent.Id });
            }
            catch (StripeException e)
            {
                _logger.LogError(e, "Stripe payment intent creation failed.");
                return BadRequest(new { error = e.Message });
            }
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] PaymentConfirmation request)
        {
            var intentService = new PaymentIntentService(_stripeClient);

            try
            {
                // Retrieve the Stripe PaymentIntent
                var intent = await intentService.GetAsync(request.TransactionId);

                // Find the local payment by TransactionId
                var payment = await _context.Payments
                    .Include(p => p.Order)
                        .ThenInclude(o => o.OrderProducts)
                            .ThenInclude(op => op.Product)
                    .FirstOrDefaultAsync(p => p.TransactionId == request.TransactionId);

                if (payment == null)
                    return NotFound(new { message = "Payment not found." });

                // Update payment status based on Stripe response
                var isSucceeded = intent.Status == "succeeded";
                payment.PaymentStatus = isSucceeded ? "Succeeded" : "Failed";
                payment.PaidAt = DateTime.UtcNow;

                // If succeeded, update order and stock
                if (isSucceeded)
                {
                    var order = payment.Order;
                    if (order == null)
                        return NotFound(new { message = "Order not found." });

                    foreach (var op in order.OrderProducts)
                    {
                        var product = op.Product;
                        if (product == null)
                            return BadRequest(new { message = $"Product not found for productId {op.ProductId}" });

                        if (product.StockQuantity < op.Quantity)
                        {
                            return BadRequest(new { message = $"Insufficient stock for product {product.Name}" });
                        }

                        product.StockQuantity -= op.Quantity;
                    }

                    order.Status = "Paid"; // You can also use "Completed" if preferred
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment confirmed successfully.", status = payment.PaymentStatus });
            }
            catch (StripeException e)
            {
                _logger.LogError(e, "Stripe payment confirmation failed.");
                return BadRequest(new { error = e.Message });
            }
        }




        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeletePayment([FromRoute] int orderId)
        {
            var payments = await _context.Payments
                .Where(p => p.OrderId == orderId)
                .ToListAsync();

            if (payments == null || !payments.Any())
                return NotFound();

            _context.Payments.RemoveRange(payments);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet]
        public async Task<ActionResult> GetAllPayments()
        {
            var payments = await _context.Payments
                .Select(p => PaymentMapper.ToPaymentDto(p)) // or p.ToPaymentDto() if you made it an extension
                .ToListAsync();

            return Ok(payments);
        }

        public class PaymentRequest
        {
            public string? UserId { get; set; }
            public int OrderId { get; set; }
            public decimal Amount { get; set; }
            public string? Email { get; set; }
        }

        public class PaymentConfirmation
        {
            public string? TransactionId { get; set; }
        }
    }
}

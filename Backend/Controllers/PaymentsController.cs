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
using System.Linq;
using Microsoft.IdentityModel.Tokens;

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

        // POST: api/payments/charge
        [HttpPost("charge")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserId))
                return BadRequest("UserId is required.");
            if (request.Amount <= 0)
                return BadRequest("Amount must be greater than zero.");
            if (request.OrderId <= 0)
                return BadRequest("OrderId must be greater than zero.");
            if (string.IsNullOrWhiteSpace(request.PaymentMethodId))
                return BadRequest("PaymentMethodId is required.");
            if (string.IsNullOrWhiteSpace(request.StripeCustomerId))
                return BadRequest("StripeCustomerId is required.");

            bool alreadyPaid = await _context.Payments
                .AnyAsync(p => p.OrderId == request.OrderId && p.PaymentStatus == "succeeded");

            if (alreadyPaid)
                return BadRequest("This order has already been paid.");

            var paymentIntentService = new PaymentIntentService(_stripeClient);
            var paymentMethodService = new PaymentMethodService(_stripeClient);

            try
            {
                var paymentMethod = await paymentMethodService.GetAsync(request.PaymentMethodId);

                if (paymentMethod.Customer == null || string.IsNullOrEmpty(paymentMethod.Customer.Id))
                {
                    // Attach the payment method to the customer if not already attached
                    await paymentMethodService.AttachAsync(request.PaymentMethodId, new PaymentMethodAttachOptions
                    {
                        Customer = request.StripeCustomerId
                    });
                }
                else if (paymentMethod.Customer.Id != request.StripeCustomerId)
                {
                    return BadRequest(new { error = "Payment method belongs to a different customer." });
                }

                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(request.Amount * 100), // amount in cents
                    Currency = "usd",
                    PaymentMethod = request.PaymentMethodId,
                    Customer = request.StripeCustomerId,
                    ReceiptEmail = request.Email,
                    Confirm = true,
                    OffSession = true,
                    Metadata = new Dictionary<string, string>
            {
                { "UserId", request.UserId },
                { "OrderId", request.OrderId.ToString() }
            }
                };

                var intent = await paymentIntentService.CreateAsync(options);

                // Save to database
                var payment = new Payment
                {
                    UserId = request.UserId,
                    OrderId = request.OrderId,
                    TotalAmount = request.Amount,
                    TransactionId = intent.Id,
                    PaidAt = DateTime.UtcNow,
                    PaymentStatus = intent.Status,
                    PaymentMethod = "Stripe"
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = intent.Status == "succeeded" ? "Payment successful" : "Payment requires action",
                    status = intent.Status,
                    transactionId = intent.Id,
                    requiresAction = intent.Status == "requires_action" || intent.Status == "requires_confirmation",
                    clientSecret = intent.ClientSecret
                });
            }
            catch (StripeException e)
            {
                // Handle the case where authentication is required even for off-session
                if (e.StripeError?.Code == "authentication_required")
                {
                    return Ok(new
                    {
                        error = "Authentication required",
                        requiresAction = true,
                        clientSecret = e.StripeError?.PaymentIntent?.ClientSecret
                    });
                }

                _logger.LogError(e, "Stripe payment intent creation failed.");
                return BadRequest(new { error = e.StripeError?.Message ?? e.Message });
            }
        }

        // POST: api/payments/confirm
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] PaymentConfirmation request)
        {
            var intentService = new PaymentIntentService(_stripeClient);

            try
            {
                var intent = await intentService.GetAsync(request.TransactionId);

                var payment = await _context.Payments
                    .Include(p => p.Order)
                        .ThenInclude(o => o.OrderProducts)
                            .ThenInclude(op => op.Product)
                    .FirstOrDefaultAsync(p => p.TransactionId == request.TransactionId);

                if (payment == null)
                    return NotFound(new { message = "Payment not found." });

                switch (intent.Status)
                {
                    case "succeeded":
                        payment.PaymentStatus = "Succeeded";
                        payment.PaidAt = DateTime.UtcNow;

                        var order = payment.Order;
                        if (order == null)
                            return NotFound(new { message = "Order not found." });

                        foreach (var op in order.OrderProducts)
                        {
                            var product = op.Product;
                            if (product == null)
                                return BadRequest(new { message = $"Product not found for productId {op.ProductId}" });

                            if (product.StockQuantity < op.Quantity)
                                return BadRequest(new { message = $"Insufficient stock for product {product.Name}" });

                            product.StockQuantity -= op.Quantity;
                        }

                        order.Status = "Paid";
                        break;

                    case "requires_payment_method":
                    case "requires_action":
                    case "processing":
                        payment.PaymentStatus = "Pending";
                        break;

                    case "canceled":
                        payment.PaymentStatus = "Canceled";
                        break;

                    default:
                        payment.PaymentStatus = "Failed";
                        break;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = $"Payment status updated: {intent.Status}", status = intent.Status });
            }
            catch (StripeException e)
            {
                _logger.LogError(e, "Stripe payment confirmation failed.");
                return BadRequest(new { error = e.Message });
            }
        }

        // DELETE: api/payments/{orderId}
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

        // GET: api/payments
        [HttpGet]
        public async Task<ActionResult> GetAllPayments()
        {
            var payments = await _context.Payments
                .Select(p => PaymentMapper.ToPaymentDto(p)) // Map to DTO
                .ToListAsync();

            return Ok(payments);
        }

        // DTOs inside controller
        public class PaymentRequest
        {
            public string? UserId { get; set; }
            public int OrderId { get; set; }
            public decimal Amount { get; set; }
            public string? Email { get; set; }
            public string? PaymentMethodId { get; set; } // <-- added
            public string? StripeCustomerId { get; set; } // <-- added
        }

        public class PaymentConfirmation
        {
            public string? TransactionId { get; set; }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using SmartBuy.Data;
using SmartBuy.Models;
using Stripe;
using Stripe.Checkout;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace SmartBuy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PaymentsController> _logger;
        private readonly IConfiguration _configuration;

        public PaymentsController(
            ApplicationDbContext context,
            ILogger<PaymentsController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;

            // Set the Stripe API key
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        [HttpPost("charge")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserId) || request.Amount <= 0 || request.OrderId <= 0)
            {
                return BadRequest("Invalid payment data.");
            }

            var paymentIntentService = new PaymentIntentService();

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

                return Ok(new { clientSecret = intent.ClientSecret });
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
            var intentService = new PaymentIntentService();

            try
            {
                var intent = await intentService.GetAsync(request.TransactionId);

                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.TransactionId == request.TransactionId);

                if (payment == null)
                    return NotFound(new { message = "Payment not found." });

                // Update the payment status
                if (intent.Status == "succeeded")
                {
                    payment.PaymentStatus = "Success";
                }
                else
                {
                    payment.PaymentStatus = "Failed";
                }

                payment.PaidAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment updated", status = payment.PaymentStatus });
            }
            catch (StripeException e)
            {
                _logger.LogError(e, "Stripe payment confirmation failed.");
                return BadRequest(new { error = e.Message });
            }
        }
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

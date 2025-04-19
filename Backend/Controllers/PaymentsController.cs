using Microsoft.AspNetCore.Mvc;
using SmartBuy.Data;
using SmartBuy.Models;
using Stripe;
using Stripe.Checkout;
using Microsoft.EntityFrameworkCore;
using System;
<<<<<<< HEAD
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
=======
using System.Threading.Tasks;
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4

namespace SmartBuy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
<<<<<<< HEAD
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

=======
        private readonly StripeClient _stripeClient;

        public PaymentsController(ApplicationDbContext context, StripeClient stripeClient)
        {
            _context = context;
            _stripeClient = stripeClient;
        }

        // POST: api/payments/charge
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
        [HttpPost("charge")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserId) || request.Amount <= 0 || request.OrderId <= 0)
            {
                return BadRequest("Invalid payment data.");
            }

<<<<<<< HEAD
            var paymentIntentService = new PaymentIntentService();

=======
            var paymentIntentService = new PaymentIntentService(_stripeClient);
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
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

<<<<<<< HEAD
=======
                // Save pending payment to DB
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
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
<<<<<<< HEAD
                _logger.LogError(e, "Stripe payment intent creation failed.");
=======
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
                return BadRequest(new { error = e.Message });
            }
        }

<<<<<<< HEAD
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] PaymentConfirmation request)
        {
            var intentService = new PaymentIntentService();
=======
        // POST: api/payments/confirm
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] PaymentConfirmation request)
        {
            var intentService = new PaymentIntentService(_stripeClient);
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4

            try
            {
                var intent = await intentService.GetAsync(request.TransactionId);

                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.TransactionId == request.TransactionId);

                if (payment == null)
                    return NotFound(new { message = "Payment not found." });

<<<<<<< HEAD
                // Update the payment status
                if (intent.Status == "succeeded")
                {
                    payment.PaymentStatus = "Success";
                }
                else
                {
                    payment.PaymentStatus = "Failed";
                }

=======
                payment.PaymentStatus = intent.Status == "succeeded" ? "Success" : intent.Status;
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
                payment.PaidAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment updated", status = payment.PaymentStatus });
            }
            catch (StripeException e)
            {
<<<<<<< HEAD
                _logger.LogError(e, "Stripe payment confirmation failed.");
=======
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
                return BadRequest(new { error = e.Message });
            }
        }
    }

<<<<<<< HEAD
    public class PaymentRequest
    {
        public string? UserId { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string? Email { get; set; }
=======
    // Request DTOs
    public class PaymentRequest
    {
        public string UserId { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Email { get; set; } = string.Empty;
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
    }

    public class PaymentConfirmation
    {
<<<<<<< HEAD
        public string? TransactionId { get; set; }
=======
        public string TransactionId { get; set; } = string.Empty;
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
    }
}

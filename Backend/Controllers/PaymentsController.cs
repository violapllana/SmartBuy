using Microsoft.AspNetCore.Mvc;
using SmartBuy.Data;
using SmartBuy.Models;
using Stripe;
using Stripe.Checkout;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace SmartBuy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly StripeClient _stripeClient;

        public PaymentsController(ApplicationDbContext context, StripeClient stripeClient)
        {
            _context = context;
            _stripeClient = stripeClient;
        }

        // POST: api/payments/charge
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

                // Save pending payment to DB
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
                return BadRequest(new { error = e.Message });
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
                    .FirstOrDefaultAsync(p => p.TransactionId == request.TransactionId);

                if (payment == null)
                    return NotFound(new { message = "Payment not found." });

                payment.PaymentStatus = intent.Status == "succeeded" ? "Success" : intent.Status;
                payment.PaidAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment updated", status = payment.PaymentStatus });
            }
            catch (StripeException e)
            {
                return BadRequest(new { error = e.Message });
            }
        }
    }

    // Request DTOs
    public class PaymentRequest
    {
        public string UserId { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Email { get; set; } = string.Empty;
    }

    public class PaymentConfirmation
    {
        public string TransactionId { get; set; } = string.Empty;
    }
}

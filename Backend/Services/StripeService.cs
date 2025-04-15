using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Stripe;

namespace Backend.Services
{
    public class StripeService
    {
        private readonly StripeClient _stripeClient;

        public StripeService(StripeClient stripeClient)
        {
            _stripeClient = stripeClient;
        }

        public async Task<PaymentIntent> CreatePaymentIntent(long amount, string currency)
        {
            var paymentIntentCreateOptions = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = currency,
                Confirm = true,
            };

            var paymentIntentService = new PaymentIntentService(_stripeClient);
            return await paymentIntentService.CreateAsync(paymentIntentCreateOptions);
        }
    }

}
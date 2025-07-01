using System.Collections.Generic;
using Backend.SignalR;
using Microsoft.AspNetCore.Identity;

namespace SmartBuy.Models
{
    public class User : IdentityUser
    {
        public string? StripeCustomerId { get; set; }  // <-- Add this property here

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<Card> Cards { get; set; } = new List<Card>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}

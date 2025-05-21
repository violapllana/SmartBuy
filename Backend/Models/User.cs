using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.SignalR;
using Microsoft.AspNetCore.Identity;

namespace SmartBuy.Models
{
    public class User : IdentityUser
    {
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<Card> Cards { get; set; } = new List<Card>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();



    }
}
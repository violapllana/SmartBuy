using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuy.Models
{
    public class RefreshToken
    {
        [Key]
        public string? Token { get; set; } // This represents the actual refresh token

        public DateTime ExpiryDate { get; set; } // Expiry date for the refresh token

        public string? UserId { get; set; } // Foreign key to the user

        public User? User { get; set; }
    }
}
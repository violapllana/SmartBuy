using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuy.Models
{
    public class RegisterModel
    {
        public string? Username { get; set; } = string.Empty;

        [Required]
        public string? Password { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string? Email { get; set; } = string.Empty;
    }
}
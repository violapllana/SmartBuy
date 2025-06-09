using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartBuy.Models
{
    public class Card
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string StripePaymentMethodId { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Brand { get; set; } = string.Empty; // e.g., Visa

        [Required]
        [StringLength(4)]
        public string Last4 { get; set; } = string.Empty; // last 4 digits

        [Required]
        public int ExpMonth { get; set; }

        [Required]
        public int ExpYear { get; set; }

        [Required]
        [StringLength(50)]
        public string CardType { get; set; } = string.Empty; // optional, you can keep it if needed

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

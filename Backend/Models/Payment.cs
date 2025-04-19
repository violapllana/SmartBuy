using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartBuy.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public DateTime PaidAt { get; set; } = DateTime.UtcNow;

        // 🔽 ADD THESE FIELDS BELOW 🔽

        [MaxLength(100)]
        public string TransactionId { get; set; } = string.Empty; // Stripe PaymentIntent Id

        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Stripe";

        [MaxLength(50)]
        public string PaymentStatus { get; set; } = "Pending";
    }
}

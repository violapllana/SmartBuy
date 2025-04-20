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
        [StringLength(16, MinimumLength = 13)] 
        public string CardNumber { get; set; } = string.Empty;


        [Required]
        [StringLength(5)] 
        public string ExpirationDate { get; set; } = string.Empty;

        [Required]
        [StringLength(3)]
        public string CVV { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string CardType { get; set; } = string.Empty;


        public string UserId { get; set; } = string.Empty;


        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

       
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

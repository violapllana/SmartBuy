using System;

namespace Backend.Models
{
    public class MongoWishlist
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int ProductId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

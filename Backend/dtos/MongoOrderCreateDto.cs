
namespace SmartBuy.Models
{
    public class MongoOrderCreateDto
    {
        public string UserId { get; set; } = string.Empty; // Initializes as empty string to avoid null warning
        public List<MongoOrderProductDto> Products { get; set; } = new List<MongoOrderProductDto>(); // Initializes as empty list
        public DateTime? OrderDate { get; internal set; }

        public MongoOrderCreateDto()
        {
            // Optional: You can initialize any additional properties here if needed
        }
    }

    public class MongoOrderProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty; // Initializes as empty string to avoid null warning
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}

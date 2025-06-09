using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class MongoCard
{

    public int Id { get; set; }

    public string StripePaymentMethodId { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty; // e.g., Visa

    public string Last4 { get; set; } = string.Empty; // last 4 digits

    public int ExpMonth { get; set; }

    public int ExpYear { get; set; }

    public string CardType { get; set; } = string.Empty; // optional, you can keep it if needed

    public string UserId { get; set; } = string.Empty;


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}




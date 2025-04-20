using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class MongoCard
{
    public int? Id { get; set; }
    public string? CardNumber { get; set; }
    public string? ExpirationDate { get; set; }
    public string? CVV { get; set; }
    public string? CardType { get; set; }
    public DateTime? CreatedAt { get; set; }
}
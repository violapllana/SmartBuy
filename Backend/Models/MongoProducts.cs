using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace SmartBuy.Models
{

public class MongoProducts
{
    public int? Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? StockQuantity { get; set; }
    public string? Category { get; set; }
    public string? ImageFile { get; set; }
    public DateTime? CreatedAt { get; set; }
}

}
using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace SmartBuy.Models
{
    public class MongoOrder
    {
        public string? Id { get; set; }  // MongoDB specific Id

        public string? UserId { get; set; }  // MongoUser Id

        public DateTime? OrderDate { get; set; }

        public List<MongoOrderProduct>? Products { get; set; }
    }

    public class MongoOrderProduct
    {
        public int? ProductId { get; set; }  // MongoProduct Id

        public string? ProductName { get; set; }

        public int? Quantity { get; set; }

        public decimal? Price { get; set; }  
    }
}

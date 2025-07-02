using System;

namespace Backend.Models
{
    public class MongoShipment
    {
        public int Id { get; set; }

        public DateTime ShipmentDate { get; set; }

        public string? TrackingNumber { get; set; }

        public int OrderId { get; set; }

        public string UserId { get; set; } = string.Empty;
    }
}

using System;
using System.ComponentModel.DataAnnotations.Schema;
using SmartBuy.Models;

namespace Backend.Models
{
    public class Shipment
    {
        public int Id { get; set; }

        public DateTime ShipmentDate { get; set; }

        public string TrackingNumber { get; set; } = string.Empty;

        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        public ShipmentStatus Status { get; set; } = ShipmentStatus.Pending;

        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using SmartBuy.Models;
using Backend.Models;



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
    }
}
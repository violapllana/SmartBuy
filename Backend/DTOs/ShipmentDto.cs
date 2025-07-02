using System;
using Backend.Models;

namespace Backend.dtos
{
    public class ShipmentDto
    {
        public int Id { get; set; }
        public DateTime ShipmentDate { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        public int OrderId { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ShipmentStatus Status { get; set; }
    }
}

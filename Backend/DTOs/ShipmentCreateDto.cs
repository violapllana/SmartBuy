using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.dtos
{
    public class ShipmentCreateDto
    {
        public DateTime ShipmentDate { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        public int OrderId { get; set; }

        public string UserId { get; set; } = string.Empty;
    }
}
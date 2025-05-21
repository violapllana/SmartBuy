using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.dtos
{
    public class ShipmentUpdateDto
    {
         public int Id { get; set; }
     public DateTime ShipmentDate { get; set; }
    public string TrackingNumber { get; set; }

    public int OrderId { get; set; }
    }
}
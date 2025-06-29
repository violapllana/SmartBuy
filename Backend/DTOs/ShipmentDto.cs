using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using SmartBuy.Models;

namespace Backend.dtos
{
    public class ShipmentDto
    {
        public int Id { get; set; }
        public DateTime ShipmentDate { get; set; }
        public string TrackingNumber { get; set; }

        public int OrderId { get; set; }

    }
}
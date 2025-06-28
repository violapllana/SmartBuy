using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
    {
        public enum ShipmentStatus
        {
            Pending,
            Shipped,
            OutForDelivery,
            Delivered,
            Failed
        }
    }

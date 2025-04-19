using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PaidAt { get; set; }
    }

}
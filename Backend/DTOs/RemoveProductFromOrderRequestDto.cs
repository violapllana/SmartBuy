using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs
{
    public class RemoveProductFromOrderRequestDto
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
    }
}
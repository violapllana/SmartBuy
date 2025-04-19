using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Backend.dtos
{
    public class WishlistUpdateDto
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int ProductId { get; set; }
    }
}

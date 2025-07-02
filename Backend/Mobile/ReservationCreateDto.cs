using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers.Mobile
{
    public class ReservationCreateDto
    {

        public string? UserId { get; set; }  // nullable, if booking without login

        public string? Name { get; set; }  // For anonymous or user name
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public DateTime ReservationDateTime { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using SmartBuy.Models;

namespace Backend.Controllers.Mobile
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; }  // nullable, if booking without login
        public User? User { get; set; }

        public string? Name { get; set; }  // For anonymous or user name
        public string? Phone { get; set; }
        public string? Email { get; set; }

        public DateTime ReservationDateTime { get; set; }


        public string Status { get; set; } = "Pending";
    }

}
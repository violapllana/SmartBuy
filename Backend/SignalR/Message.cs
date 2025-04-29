using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using SmartBuy.Models;

namespace Backend.SignalR
{
    public class Message
    {
        [Key]
        public int Id { get; set; }            // Primary key
        public string UserId { get; set; } = string.Empty;


        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        public string? ReceiverId { get; set; } // ID of the receiver
        public string? MessageContent { get; set; } // The content of the message
        public bool ViewedByAdmin { get; set; }
        public DateTime SentAt { get; set; }
    }


}
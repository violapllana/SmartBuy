using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.SignalR
{
    public class Message
    {
        [Key]
        public int Id { get; set; }            // Primary key
        public string? SenderId { get; set; }   // ID of the sender
        public string? ReceiverId { get; set; } // ID of the receiver
        public string? MessageContent { get; set; } // The content of the message
        public DateTime SentAt { get; set; }
    }


}
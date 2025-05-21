using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.SignalR
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? ReceiverId { get; set; }
        public string? MessageContent { get; set; }
        public bool ViewedByAdmin { get; set; } = false;
        public DateTime SentAt { get; set; }
    }

}
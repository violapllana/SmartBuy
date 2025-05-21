using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.SignalR
{
    public class Notification
    {
        public int Id { get; set; }  // Unique identifier for each notification
        public string? AdminId { get; set; }  // ID of the admin receiving the notification
        public string? UserId { get; set; }  // ID of the user who sent the message
        public string? MessageContent { get; set; }  // Content of the message
        public DateTime SentAt { get; set; }  // When the message was sent
        public bool IsRead { get; set; }  // Whether the notification has been read
    }
}
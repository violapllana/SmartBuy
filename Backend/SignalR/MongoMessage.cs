using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.SignalR
{
    public class MongoMessage
    {
        public int Id { get; set; }
        public string? SenderId { get; set; }  // or UserId, depending on your user system
        public string? ReceiverId { get; set; } // You can use either UserId or AdminId
        public string? Content { get; set; }
        public DateTime SentAt { get; set; }
    }
}
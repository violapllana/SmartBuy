using Backend.SignalR;  // Ensure correct namespace for Message
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YourNamespace.SignalR
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        // Send a message, save to DB, and broadcast to all clients
        public async Task SendMessage(string senderId, string receiverId, string messageContent)
        {
            // Save the message to the database
            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                MessageContent = messageContent,
                SentAt = DateTime.UtcNow // You can use DateTime.Now if you want local time
            };

            // Add the message to the DbContext
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Broadcast to all connected clients
            await Clients.All.SendAsync("ReceiveMessage", senderId, receiverId, messageContent);
        }

        // Endpoint to retrieve all messages from the database, ordered by timestamp
        public async Task<List<Message>> GetAllMessages()
        {
            return await _context.Messages.OrderBy(m => m.SentAt).ToListAsync();
        }
    }
}

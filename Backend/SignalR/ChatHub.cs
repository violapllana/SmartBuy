using Microsoft.AspNetCore.SignalR;

using System.Threading.Tasks;
using System;
using SmartBuy.Data;

namespace Backend.SignalR
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        // Method to send a message and save it to the database using MessageDto
        public async Task SendMessage(MessageDto messageDto)
        {
            if (messageDto == null)
            {
                throw new ArgumentNullException(nameof(messageDto));
            }

            // Create a new ChatMessage entity from the MessageDto
            var message = new Message
            {
                UserId = messageDto.UserId,
                ReceiverId = messageDto.ReceiverId,
                MessageContent = messageDto.MessageContent,
                SentAt = messageDto.SentAt,
                ViewedByAdmin = messageDto.ViewedByAdmin
            };

            // Save the message to the database
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Send the message to the receiver via SignalR
            await Clients.User(messageDto.ReceiverId).SendAsync("ReceiveMessage", messageDto.UserId, messageDto.MessageContent);
        }

        // Optional: Logic when a user connects
        public override Task OnConnectedAsync()
        {
            // Logic when a user connects
            return base.OnConnectedAsync();
        }

        // Optional: Logic when a user disconnects
        public override Task OnDisconnectedAsync(Exception exception)
        {
            // Logic when a user disconnects
            return base.OnDisconnectedAsync(exception);
        }
    }
}

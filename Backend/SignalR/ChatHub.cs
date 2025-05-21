using Microsoft.AspNetCore.SignalR;
using SmartBuy.Data;
using System.Collections.Concurrent;

namespace Backend.SignalR
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }
        private static readonly ConcurrentDictionary<string, string> UserConnections = new();

        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext.Request.Query["userId"].ToString();

            if (!string.IsNullOrEmpty(userId))
            {
                UserConnections[userId] = Context.ConnectionId;
                Console.WriteLine($"✅ User {userId} connected with ConnectionId: {Context.ConnectionId}");
            }

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var userId = UserConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
            if (!string.IsNullOrEmpty(userId))
            {
                UserConnections.TryRemove(userId, out _);
                Console.WriteLine($"❌ User {userId} disconnected.");
            }

            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendPrivateMessage(string receiverUserId, string senderName, string message)
        {
            if (UserConnections.TryGetValue(receiverUserId, out var receiverConnectionId))
            {
                await Clients.Client(receiverConnectionId)
                    .SendAsync("ReceiveMessage", senderName, message);

                Console.WriteLine($"📤 Sent from {senderName} to {receiverUserId}: {message}");
            }
            else
            {
                Console.WriteLine($"⚠️ User {receiverUserId} is not connected.");
            }

            // Save the message to the database
            var msg = new Message
            {
                UserId = senderName,
                ReceiverId = receiverUserId,
                MessageContent = message,
                SentAt = DateTime.UtcNow,
                ViewedByAdmin = false
            };

            _context.Messages.Add(msg);  // ✅ This now works
            await _context.SaveChangesAsync();

        }

    }
}

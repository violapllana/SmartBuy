using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using SmartBuy.Data;
using SmartBuy.Models;
using System;

namespace Backend.SignalR
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        private static readonly ConcurrentDictionary<string, string> AdminConnections = new ConcurrentDictionary<string, string>();

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SendMessageAsync(string senderId, string receiverId, string messageContent)
        {
            // Store the message in the database
            var message = new Message
            {
                UserId = senderId,
                ReceiverId = receiverId,
                MessageContent = messageContent,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);  // Add message to the context

            // Get all connected admins
            var adminConnections = AdminConnections.Where(admin => admin.Value != null).ToList();

            if (!adminConnections.Any())
            {
                Console.WriteLine("No admins connected to notify.");
            }
            else
            {
                // Create notifications for each connected admin
                foreach (var adminConnection in adminConnections)
                {
                    var notification = new Notification
                    {
                        AdminId = adminConnection.Key,  // Admin's ID
                        UserId = senderId,  // User's ID (sender)
                        MessageContent = messageContent,
                        SentAt = DateTime.UtcNow,
                        IsRead = false  // Initially, the notification is unread
                    };

                    _context.Notifications.Add(notification);  // Add notification to the context
                }
            }

            // Save both message and notifications to the database
            await _context.SaveChangesAsync();  // Save changes to the database

            Console.WriteLine("Message saved and notifications sent.");
        }





        public void RegisterAdmin(string adminId)
        {
            var connectionId = Context.ConnectionId;
            AdminConnections.AddOrUpdate(adminId, connectionId, (key, oldValue) => connectionId);
            Console.WriteLine($"Admin {adminId} registered with connection {connectionId}");
        }



        public void ListAdminConnections()
        {
            foreach (var admin in AdminConnections)
            {
                Console.WriteLine($"Admin connected: {admin.Key} with connection {admin.Value}");
            }
        }


        public override Task OnDisconnectedAsync(Exception exception)
        {
            // Remove the admin connection when they disconnect
            var adminId = AdminConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
            if (adminId != null)
            {
                AdminConnections.TryRemove(adminId, out _);
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}

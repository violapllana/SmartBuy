using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    // A thread-safe dictionary to store admin connections (using ConcurrentDictionary)
    private static readonly ConcurrentDictionary<string, string> AdminConnections = new ConcurrentDictionary<string, string>();

    // Asynchronous method to send a message to a specific admin
    public async Task SendMessageAsync(string senderId, string receiverId, string messageContent)
    {
        try
        {
            var adminConnectionId = GetAdminConnectionId(receiverId);
            if (adminConnectionId != null)
            {
                await Clients.Client(adminConnectionId).SendAsync("ReceiveMessage", senderId, receiverId, messageContent);
            }
            else
            {
                // Log or handle case where admin is not connected
                await Clients.Caller.SendAsync("Error", "Admin is not connected.");
            }
        }
        catch (Exception ex)
        {
            // Log the exception
            await Clients.Caller.SendAsync("Error", $"Failed to send message: {ex.Message}");
        }
    }

    // Method to register the admin's connection
    public void RegisterAdmin(string adminId)
    {
        var connectionId = Context.ConnectionId;
        // Add or update the admin's connection if not already registered
        AdminConnections.AddOrUpdate(adminId, connectionId, (key, oldValue) => connectionId);
    }

    // Method to retrieve the connection ID for a specific admin
    private string GetAdminConnectionId(string adminId)
    {
        AdminConnections.TryGetValue(adminId, out var connectionId);
        return connectionId;
    }

    // Clean up the connection ID when the admin disconnects
    public override Task OnDisconnectedAsync(Exception exception)
    {
        var adminId = AdminConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;

        if (adminId != null)
        {
            AdminConnections.TryRemove(adminId, out _);
        }

        return base.OnDisconnectedAsync(exception);
    }
}

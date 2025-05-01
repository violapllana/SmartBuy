// ✅ Correct for ASP.NET Core
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        // Make sure your claims contain this; adjust if needed
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}

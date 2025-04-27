using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using Backend.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using SmartBuy.Models;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public ChatController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // Existing: User chatting with admins
        [HttpGet("GetMessagesWithAdmin")]
        public async Task<ActionResult<List<Message>>> GetMessagesWithAdmin()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            var adminIds = admins.Select(a => a.Id).ToList();

            var messages = await _context.Messages
                .Where(m =>
                    (m.UserId == currentUserId && adminIds.Contains(m.ReceiverId)) ||
                    (m.ReceiverId == currentUserId && adminIds.Contains(m.UserId)))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // NEW: Admin chatting with a specific user
        [HttpGet("GetMessagesWithUser/{userId}")]
        public async Task<ActionResult<List<Message>>> GetMessagesWithUser(string userId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return NotFound("Current user not found.");

            var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin");
            if (!isAdmin)
                return Forbid(); // Only Admins can access this endpoint

            var messages = await _context.Messages
                .Where(m =>
                    (m.UserId == currentUserId && m.ReceiverId == userId) ||
                    (m.UserId == userId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // NEW: User fetching messages sent to them
        [HttpGet("GetMessagesForUser")]
        public async Task<ActionResult<List<Message>>> GetMessagesForUser()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var messages = await _context.Messages
                .Where(m => m.ReceiverId == currentUserId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }
    }

}

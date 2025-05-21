using Backend.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using SmartBuy.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Chat/GetMessagesAsync?userId={userId}&otherUserId={otherUserId}
        [HttpGet("GetMessagesAsync")]
        public async Task<ActionResult<List<MessageDto>>> GetMessagesAsync(string userId, string otherUserId)
        {
            // Fetching messages between two users
            var messages = await _context.Messages
                .Where(m => (m.UserId == userId && m.ReceiverId == otherUserId) ||
                            (m.UserId == otherUserId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            if (!messages.Any())
                return NotFound("No messages found between these users.");

            // Mapping the fetched messages to MessageDto
            var messageDtoList = messages.Select(m => new MessageDto
            {
                Id = m.Id,
                UserId = m.UserId,
                ReceiverId = m.ReceiverId,
                MessageContent = m.MessageContent,
                SentAt = m.SentAt
            }).ToList();

            return Ok(messageDtoList);
        }




        [HttpGet("GetNewMessagesAsync")]
        public async Task<ActionResult<List<MessageDto>>> GetNewMessagesAsync(string userId, string otherUserId)
        {
            // Fetching messages between two users
            var messages = await _context.Messages
                .Where(m => (m.UserId == userId && m.ReceiverId == otherUserId) ||
                            (m.UserId == otherUserId && m.ReceiverId == userId) && m.ViewedByAdmin == false)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            if (!messages.Any())
                return NotFound("No messages found between these users.");

            // Mapping the fetched messages to MessageDto
            var messageDtoList = messages.Select(m => new MessageDto
            {
                Id = m.Id,
                UserId = m.UserId,
                ReceiverId = m.ReceiverId,
                MessageContent = m.MessageContent,
                SentAt = m.SentAt
            }).ToList();

            return Ok(messageDtoList);
        }





        // GET: api/Chat/GetMessagesBySender/{userId}
        [HttpGet("GetMessagesBySender/{userId}")]
        public async Task<ActionResult<List<MessageDto>>> GetMessagesBySender(string userId)
        {
            var messages = await _context.Messages
                .Where(m => m.UserId == userId)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    ReceiverId = m.ReceiverId,
                    MessageContent = m.MessageContent,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            if (!messages.Any())
                return NotFound("No sent messages found for this user.");

            return Ok(messages);
        }

        // GET: api/Chat/GetMessagesByReceiver/{userId}
        [HttpGet("GetMessagesByReceiver/{userId}")]
        public async Task<ActionResult<List<MessageDto>>> GetMessagesByReceiver(string userId)
        {
            var messages = await _context.Messages
                .Where(m => m.ReceiverId == userId)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    UserId = m.UserId,
                    ReceiverId = m.ReceiverId,
                    MessageContent = m.MessageContent,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            if (!messages.Any())
                return NotFound("No received messages found for this user.");

            return Ok(messages);
        }




        [HttpPut("view-latest/{userId}")]
        public async Task<ActionResult<MessageDto>> ViewLatestMessageByUser([FromRoute] string userId)
        {
            // Fetch the latest message for the user
            var latestMessage = await _context.Messages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.SentAt)  // Or OrderByDescending(m => m.Id) if Id is auto-incrementing
                .FirstOrDefaultAsync();

            if (latestMessage == null)
            {
                return NotFound();
            }

            // Mark the message as viewed by admin
            latestMessage.ViewedByAdmin = true;
            await _context.SaveChangesAsync();

            // Map your entity to MessageDto
            var messageDto = new MessageDto
            {
                Id = latestMessage.Id,
                UserId = latestMessage.UserId,
                ReceiverId = latestMessage.ReceiverId,
                MessageContent = latestMessage.MessageContent,
                ViewedByAdmin = latestMessage.ViewedByAdmin,
                SentAt = latestMessage.SentAt
            };

            return Ok(messageDto);
        }




        [HttpGet("view-latest/{sender}")]
        public async Task<ActionResult<MessageDto>> ViewLatestMessage([FromRoute] string sender)
        {
            var message = await _context.Messages
                .Where(m => m.UserId == sender)
                .OrderByDescending(m => m.SentAt) // Sort messages by the timestamp (latest first)
                .FirstOrDefaultAsync(); // Get the most recent one

            if (message == null)
            {
                return NotFound();
            }

            // Return the message details, such as whether it's been viewed by an admin
            var messageDto = new MessageDto
            {
                Id = message.Id,
                UserId = message.UserId,
                ReceiverId = message.ReceiverId,
                MessageContent = message.MessageContent,
                ViewedByAdmin = message.ViewedByAdmin,
                SentAt = message.SentAt
            };

            return Ok(messageDto);
        }







        [HttpGet("unread/{receiverId}")]
        public async Task<ActionResult<List<MessageDto>>> NotificationsUnread(string receiverId)
        {
            var messages = await _context.Messages
                .Where(m => m.ReceiverId == receiverId && m.ViewedByAdmin == false)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            if (messages == null || !messages.Any())
            {
                return NoContent(); // 204 No Content if there are no unread messages
            }

            var messageDtos = messages.Select(message => new MessageDto
            {
                Id = message.Id,
                UserId = message.UserId,
                ReceiverId = message.ReceiverId,
                MessageContent = message.MessageContent,
                ViewedByAdmin = message.ViewedByAdmin,
                SentAt = message.SentAt
            }).ToList();

            return Ok(messageDtos); // 200 OK with a list of unread messages
        }




    }



}

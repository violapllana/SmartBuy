using Microsoft.AspNetCore.Mvc;
using SmartBuy.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartBuy.Data;
using Backend.SignalR;
using Microsoft.EntityFrameworkCore;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetMessages")]
        public async Task<ActionResult<List<Message>>> GetMessages()
        {
            var messages = await _context.Messages
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }
    }
}

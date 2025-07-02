using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.dtos;
using Backend.Mappers;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShipmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET all shipments - from SQL Server
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShipmentDto>>> GetShipments()
        {
            var shipments = await _context.Shipments.ToListAsync();
            var shipmentDtos = shipments.Select(s => s.ToShipmentDto()).ToList();
            return Ok(shipmentDtos);
        }

        // ✅ GET shipments by userId
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ShipmentDto>>> GetShipmentsByUserId(string userId)
        {
            var shipments = await _context.Shipments
                .Where(s => s.UserId == userId)
                .ToListAsync();

            if (shipments == null || shipments.Count == 0)
            {
                return NotFound();
            }

            var shipmentDtos = shipments.Select(s => s.ToShipmentDto()).ToList();
            return Ok(shipmentDtos);
        }

        // GET by id - SQL Server
        [HttpGet("{id}")]
        public async Task<ActionResult<ShipmentDto>> GetShipment(int id)
        {
            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null)
                return NotFound();

            return Ok(shipment.ToShipmentDto());
        }

        // POST - SQL Server
        [HttpPost]
        public async Task<ActionResult<ShipmentDto>> CreateShipment(ShipmentCreateDto shipmentDto)
        {
            var shipment = shipmentDto.ToShipmentFromCreateDto();
            _context.Shipments.Add(shipment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShipment), new { id = shipment.Id }, shipment.ToShipmentDto());
        }

        // PUT - SQL Server
        [HttpPut("{id}")]
        public async Task<ActionResult<ShipmentDto>> UpdateShipment(int id, ShipmentUpdateDto shipmentDto)
        {
            if (id != shipmentDto.Id)
                return BadRequest("ID mismatch");

            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null)
                return NotFound();

            shipment.ShipmentDate = shipmentDto.ShipmentDate;
            shipment.TrackingNumber = shipmentDto.TrackingNumber;
            shipment.OrderId = shipmentDto.OrderId;
            shipment.UserId = shipmentDto.UserId;
            shipment.Status = shipmentDto.Status;

            await _context.SaveChangesAsync();

            return Ok(shipment.ToShipmentDto());
        }

        // DELETE - SQL Server
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShipment(int id)
        {
            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null)
                return NotFound();

            _context.Shipments.Remove(shipment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

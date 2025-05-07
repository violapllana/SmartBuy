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
    
    public class ShipmentController :ControllerBase
    {
        private readonly ApplicationDbContext _context;

    public ShipmentController(ApplicationDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<ActionResult> GetShipments()
    {
        var shipments= await _context.Shipments.Select(s => s.ToShipmentDto()).ToListAsync();
        return Ok(shipments);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult> GetShipment(int id)
    {
        var shipment= await _context.Shipments.FindAsync(id);
        if (shipment== null)
        {
            return NotFound();
        }
        return Ok(shipment.ToShipmentDto());
    }
    [HttpPost]
    public async Task<ActionResult> CreateShipment(ShipmentCreateDto shipmentDto)
    {
        var shipment = shipmentDto.ToShipmentFromCreateDto();

        _context.Shipments.Add(shipment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShipment), new { id = shipment.Id }, shipment.ToShipmentDto());
    }
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateShipment([FromRoute] int id, [FromBody] ShipmentUpdateDto shipmentDto)
{
    var shipment = await _context.Shipments.FindAsync(id);

    if (shipment == null)
    {
        return NotFound();
    }

    shipment.ShipmentDate = shipmentDto.ShipmentDate;
    shipment.TrackingNumber = shipmentDto.TrackingNumber;
    shipment.OrderId = shipmentDto.OrderId;

    await _context.SaveChangesAsync();

    return Ok(shipment.ToShipmentDto());
}

[HttpDelete("{id}")]
public async Task<ActionResult> DeleteShipment([FromRoute] int id)
{
    var shipment = await _context.Shipments.FindAsync(id);

    if (shipment == null)
    {
        return NotFound();
    }

    _context.Shipments.Remove(shipment);
    await _context.SaveChangesAsync();

    return NoContent();
}

    }

}
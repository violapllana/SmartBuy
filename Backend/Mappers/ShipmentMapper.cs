using System;
using Backend.dtos;
using Backend.Models;

namespace Backend.Mappers
{
    public static class ShipmentMapper
    {
        public static ShipmentDto ToShipmentDto(this Shipment shipment)
        {
            return new ShipmentDto
            {
                Id = shipment.Id,
                ShipmentDate = shipment.ShipmentDate,
                TrackingNumber = shipment.TrackingNumber,
                OrderId = shipment.OrderId
            };
        }

        public static Shipment ToShipmentFromCreateDto(this ShipmentCreateDto dto)
        {
            return new Shipment
            {
                ShipmentDate = DateTime.UtcNow,
                TrackingNumber = dto.TrackingNumber,
                OrderId = dto.OrderId
            };
        }
    }
}

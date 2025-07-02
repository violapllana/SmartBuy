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
                OrderId = shipment.OrderId,
                UserId = shipment.UserId
            };
        }

        public static Shipment ToShipmentFromCreateDto(this ShipmentCreateDto dto)
        {
            return new Shipment
            {
                ShipmentDate = DateTime.UtcNow,
                TrackingNumber = dto.TrackingNumber,
                OrderId = dto.OrderId,
                UserId = dto.UserId
            };
        }

        public static ShipmentDto toShipmentDto(this MongoShipment shipment)
        {
            return new ShipmentDto
            {
                Id = shipment.Id,
                ShipmentDate = shipment.ShipmentDate,
                TrackingNumber = shipment.TrackingNumber,
                OrderId = shipment.OrderId,
                UserId = shipment.UserId
            };
        }
    }
}

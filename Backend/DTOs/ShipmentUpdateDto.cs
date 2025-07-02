using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
using System.Text.Json.Serialization;

namespace Backend.dtos
{

    public class ShipmentUpdateDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("shipmentDate")]
        public DateTime ShipmentDate { get; set; }

        [JsonPropertyName("trackingNumber")]
        public string? TrackingNumber { get; set; }

        [JsonPropertyName("orderId")]
        public int OrderId { get; set; }

        [JsonPropertyName("userId")]
        public string? UserId { get; set; }

        [JsonPropertyName("shipmentStatus")]
        public ShipmentStatus Status { get; set; }
    }



}
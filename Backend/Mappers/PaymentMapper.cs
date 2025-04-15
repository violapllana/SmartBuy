using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTOs;
using SmartBuy.Models;

namespace Backend.Mappers
{
    public static class PaymentMapper
    {
        public static PaymentDto ToPaymentDto(Payment payment)
        {
            return new PaymentDto
            {
                Id = payment.Id,
                UserId = payment.UserId,
                OrderId = payment.OrderId,
                TotalAmount = payment.TotalAmount,
                PaidAt = payment.PaidAt
            };
        }

        public static Payment ToPaymentFromCreateDto(PaymentCreateDto dto)
        {
            return new Payment
            {
                UserId = dto.UserId,
                OrderId = dto.OrderId,
                TotalAmount = dto.TotalAmount,
                PaidAt = DateTime.UtcNow // assuming payment is made at creation
            };
        }
    }
}
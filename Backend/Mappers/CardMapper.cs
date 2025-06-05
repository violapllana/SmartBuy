using System;
using Backend.DTOs;
using SmartBuy.Models;

namespace Backend.Mappers
{
    public static class CardMapper
    {
        public static CardDto ToCardDto(this Card card)
        {
            return new CardDto
            {
                Id = card.Id,
                // Removed CardNumber, ExpirationDate, CVV
                CardType = card.CardType,
                UserId = card.UserId,
                CreatedAt = card.CreatedAt,
                StripePaymentMethodId = card.StripePaymentMethodId
            };
        }

        public static Card ToCardFromCreateDto(this CardCreateDto dto, string userId)
        {
            return new Card
            {
                CardType = dto.CardType,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                StripePaymentMethodId = dto.StripePaymentMethodId
                // No ExpirationDate here since Stripe manages it
            };
        }

        public static CardDto ToCardDto(this MongoCard card)
        {
            return new CardDto
            {
                Id = card.Id,
                // Removed CardNumber, ExpirationDate, CVV
                CardType = card.CardType,
                UserId = card.UserId,
                CreatedAt = card.CreatedAt,
                StripePaymentMethodId = card.StripePaymentMethodId
            };
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using SmartBuy.Models;
using Backend.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;



namespace Backend.Mappers
{

    public static class CardMapper
    {
        public static CardDto ToCardDto(this Card card)
        {
            return new CardDto
            {
                Id = card.Id,
                CardNumber = card.CardNumber,
                ExpirationDate = card.ExpirationDate,
                CVV = card.CVV,
                CardType = card.CardType,
                UserId = card.UserId,
                CreatedAt = card.CreatedAt
            };
        }

        public static Card ToCardFromCreateDto(this CardCreateDto dto, string userId)
        {
            return new Card
            {
                CardNumber = dto.CardNumber,
                ExpirationDate = dto.ExpirationDate,
                CVV = dto.CVV,
                CardType = dto.CardType,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };
        }


        public static CardDto ToCardDto(this MongoCard card)
        {
            return new CardDto
            {
                Id = card.Id,
                CardNumber = card.CardNumber,
                ExpirationDate = card.ExpirationDate,
                CVV = card.CVV,
                CardType = card.CardType,
                UserId = card.UserId,
                CreatedAt = card.CreatedAt
            };
        }
    }

}
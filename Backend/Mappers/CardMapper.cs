public static class CardMapper
{
    public static CardDto ToCardDto(this Card card)
    {
        return new CardDto
        {
            Id = card.Id,
            Title = card.Title,
            Description = card.Description,
            Type = card.Type,
            CreatedAt = card.CreatedAt
        };
    }

    public static Card ToCardFromCreateDto(this CardCreateDto dto)
    {
        return new Card
        {
            Title = dto.Title,
            Description = dto.Description,
            Type = dto.Type,
            CreatedAt = DateTime.UtcNow
        };
    }
}

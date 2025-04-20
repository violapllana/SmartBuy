using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CardUpdateDto
{
    public int Id { get; set; }

    public string CardNumber { get; set; } = string.Empty;

    public string ExpirationDate { get; set; } = string.Empty;

    public string CVV { get; set; } = string.Empty;

    public string CardType { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

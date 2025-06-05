using System;
using System.ComponentModel.DataAnnotations;

public class CardDto
{
    public int Id { get; set; }

    public string StripePaymentMethodId { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty; // e.g., Visa, MasterCard

    public string Last4 { get; set; } = string.Empty; // Only last 4 digits

    public int ExpMonth { get; set; }

    public int ExpYear { get; set; }

    public string CardType { get; set; } = string.Empty; // optional display label

    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

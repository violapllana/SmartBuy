using System;
using System.ComponentModel.DataAnnotations;

public class CardUpdateDto
{
    public int Id { get; set; }
    public string CardType { get; set; } = string.Empty;
    public string StripePaymentMethodId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

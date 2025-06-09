using System;
using System.ComponentModel.DataAnnotations;

public class CardCreateDto
{
    [Required]
    [StringLength(50)]
    public string CardType { get; set; } = string.Empty;

    [Required]
    public string StripePaymentMethodId { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    // Optional: You can extract ExpMonth and ExpYear from Stripe if needed,
    // otherwise you may remove this if Stripe handles it entirely.
}

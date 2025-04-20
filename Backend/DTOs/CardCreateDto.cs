using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


public class CardCreateDto
{
    [Required]
    [StringLength(16, MinimumLength = 13)]
    public string CardNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(5)] 
    public string ExpirationDate { get; set; } = string.Empty;

    [Required]
    [StringLength(3)]
    public string CVV { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string CardType { get; set; } = string.Empty;

            public string UserId { get; set; } = string.Empty;
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class OrderCreateDto
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public List<OrderProductCreateDto> Products { get; set; } = new();
}

public class OrderProductCreateDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public decimal Price { get; set; }
}

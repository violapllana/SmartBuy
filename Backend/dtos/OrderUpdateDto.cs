using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class OrderUpdateDto
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [Required]
    public List<OrderProductUpdateDto> Products { get; set; } = new();
}

public class OrderProductUpdateDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public decimal Price { get; set; }
    public string Status { get; set; } = string.Empty;

}

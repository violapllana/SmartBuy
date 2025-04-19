using System;
using System.Collections.Generic;

public class OrderDto
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public List<OrderProductDto> Products { get; set; } = new();
    public decimal TotalPrice { get; set; }
<<<<<<< HEAD
=======

>>>>>>> 85eaf15954609c59b9a77659cec3fce0d0b796c7
}

public class OrderProductDto
{
    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }
}

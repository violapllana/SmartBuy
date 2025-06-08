using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using SmartBuy.Models;

namespace SmartBuy.Mappers
{
    public static class OrderMapper
    {
        public static OrderDto ToOrderDto(this Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Products = order.OrderProducts.Select(op => new OrderProductDto
                {
                    ProductId = op.ProductId,
                    Quantity = op.Quantity,
                    Price = op.Price,
                    ProductName = op.Product?.Name ?? "Unknown",        // <-- add this
                    ProductImage = op.Product?.ImageFile                  // <-- add this (replace with actual image field)
                }).ToList(),

                TotalPrice = order.OrderProducts.Sum(op => op.Price * op.Quantity)
            };
        }


        public static async Task<Order> ToOrderFromCreateDtoAsync(this OrderCreateDto dto, ApplicationDbContext context)
        {
            var productIds = dto.Products.Select(p => p.ProductId).ToList();
            var products = await context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            return new Order
            {
                UserId = dto.UserId,
                OrderDate = DateTime.UtcNow,
                OrderProducts = dto.Products.Select(p =>
                {
                    var product = products.FirstOrDefault(pr => pr.Id == p.ProductId);
                    return new OrderProduct
                    {
                        ProductId = p.ProductId,
                        Quantity = p.Quantity,
                        Price = product?.Price ?? 0
                    };
                }).ToList()
            };
        }
    }
}

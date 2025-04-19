<<<<<<< HEAD
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
=======
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
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
                Products = order.OrderProducts.Select(op => new OrderProductDto
                {
                    ProductId = op.ProductId,
                    Quantity = op.Quantity,
                    Price = op.Price
<<<<<<< HEAD
                }).ToList(),
                TotalPrice = order.OrderProducts.Sum(op => op.Price * op.Quantity) // Add this line
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
=======
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
                }).ToList()
            };
        }

<<<<<<< HEAD
=======
        public static Order ToOrderFromCreateDto(this OrderCreateDto dto)
        {
            return new Order
            {
                UserId = dto.UserId,
                OrderDate = DateTime.UtcNow,
                OrderProducts = dto.Products.Select(p => new OrderProduct
                {
                    ProductId = p.ProductId,
                    Quantity = p.Quantity,
                    Price = p.Price
                }).ToList()
            };
        }
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
    }
}
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
                }).ToList()
            };
        }

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
    }
}

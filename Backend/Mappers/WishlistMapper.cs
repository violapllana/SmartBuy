using Backend.dtos;

public static class WishlistMapper
{
  public static WishlistDto toWishlistDto(this Wishlist wishlist)
{
    return new WishlistDto
    {
        Id = wishlist.Id,
        UserId = wishlist.UserId,
        ProductId = wishlist.ProductId,
        CreatedAt = wishlist.CreatedAt,
        Product = wishlist.Product != null ? new ProductDto
        {
            Id = wishlist.Product.Id,
            Name = wishlist.Product.Name,
            Description = wishlist.Product.Description,
            Price = wishlist.Product.Price,
            StockQuantity = wishlist.Product.StockQuantity,
            Category = wishlist.Product.Category,
            ImageFile = wishlist.Product.ImageFile,
            CreatedAt = wishlist.Product.CreatedAt
        } : null
    };
}


    public static Wishlist toWishlistFromCreateDto(this WishlistCreateDto dto)
    {
        return new Wishlist
        {
            UserId = dto.UserId,
            ProductId = dto.ProductId,
            CreatedAt = DateTime.UtcNow
        };
    }
}

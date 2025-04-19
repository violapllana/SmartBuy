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
            CreatedAt = wishlist.CreatedAt
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

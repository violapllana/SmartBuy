public static class ProductMapper
{
    public static ProductDto ToProductDto(this Product productModel)
    {
        return new ProductDto
        {
            Id = productModel.Id,
            Name = productModel.Name,
            Description = productModel.Description,
            Price = productModel.Price,
            StockQuantity = productModel.StockQuantity,
            Category = productModel.Category,
            ImageFile = productModel.ImageFile, // ndryshuar nga ImageUrl
            CreatedAt = productModel.CreatedAt
        };
    }

    public static Product ToProductFromCreateDto(this ProductCreateDto productDto)
    {
        return new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            StockQuantity = productDto.StockQuantity,
            Category = productDto.Category,
            CreatedAt = DateTime.UtcNow
            // ImagePath vendoset në controller pas ruajtjes së skedarit
        };
    }
}


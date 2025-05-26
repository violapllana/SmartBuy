using Microsoft.AspNetCore.Http;

public class ProductCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Category { get; set; } = string.Empty;
    
    public IFormFile? ImageFile { get; set; }  // Prano file nga React
}

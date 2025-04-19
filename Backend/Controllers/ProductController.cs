using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;


[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetProducts()
    {
        var products = await _context.Products.Select(p => p.ToProductDto()).ToListAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetProductId(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product.ToProductDto());
    }

<<<<<<< HEAD



    [HttpPut("update-stock/{id}")]
    public async Task<IActionResult> UpdateProductStock(int id, [FromBody] StockUpdateDto stockUpdateDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        // Check if the stock is sufficient
        if (product.StockQuantity < stockUpdateDto.StockQuantity)
        {
            return BadRequest("Not enough stock available.");
        }

        // Update the stock quantity
        product.StockQuantity -= stockUpdateDto.StockQuantity;

        await _context.SaveChangesAsync();

        return Ok(product.ToProductDto());
    }







=======
>>>>>>> 2d732f72102b85abd0a8f3dc13c7c2ade2ca91d4
    [HttpPost]
    public async Task<ActionResult> CreateProduct(ProductCreateDto productDto)
    {
        var product = productDto.ToProductFromCreateDto();

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductId), new { id = product.Id }, product.ToProductDto());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto productDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.StockQuantity = productDto.StockQuantity;
        product.Category = productDto.Category;
        product.ImageUrl = productDto.ImageUrl;
        product.CreatedAt = productDto.CreatedAt;

        await _context.SaveChangesAsync();
        return Ok(product.ToProductDto());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
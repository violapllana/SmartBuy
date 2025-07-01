using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;
using SmartBuy.Models;
using SmartBuy.Mappers;
using System.IO;
using Microsoft.AspNetCore.Hosting;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
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

    [HttpPut("update-stock/{id}")]
    public async Task<IActionResult> UpdateProductStock(int id, [FromBody] StockUpdateDto stockUpdateDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        if (product.StockQuantity < stockUpdateDto.StockQuantity)
        {
            return BadRequest("Not enough stock available.");
        }

        product.StockQuantity -= stockUpdateDto.StockQuantity;
        await _context.SaveChangesAsync();

        return Ok(product.ToProductDto());
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult> CreateProduct([FromForm] ProductCreateDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            StockQuantity = productDto.StockQuantity,
            Category = productDto.Category,
            CreatedAt = DateTime.UtcNow
        };

        if (productDto.ImageFile != null)
        {
            var imagesPath = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(imagesPath))
            {
                Directory.CreateDirectory(imagesPath);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.ImageFile.FileName);
            var filePath = Path.Combine(imagesPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await productDto.ImageFile.CopyToAsync(stream);
            }

            product.ImageFile = "/images/" + uniqueFileName;
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductId), new { id = product.Id }, product.ToProductDto());
    }

    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto productDto)
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
        product.CreatedAt = productDto.CreatedAt;

        if (productDto.ImageFile != null)
        {
            var imagesPath = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(imagesPath))
            {
                Directory.CreateDirectory(imagesPath);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.ImageFile.FileName);
            var filePath = Path.Combine(imagesPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await productDto.ImageFile.CopyToAsync(stream);
            }

            product.ImageFile = "/images/" + uniqueFileName;
        }

        await _context.SaveChangesAsync();
        return Ok(product.ToProductDto());
    }



    [HttpGet("random")]
    public async Task<ActionResult> GetRandomProducts()
    {
        int count = await _context.Products.CountAsync();

        if (count <= 4)
        {
            var allProducts = await _context.Products
                .Select(p => p.ToProductDto())
                .ToListAsync();

            return Ok(allProducts);
        }

        var randomProducts = await _context.Products
            .OrderBy(p => Guid.NewGuid()) // <-- Randomizes at the DB level
            .Take(4)
            .Select(p => p.ToProductDto())
            .ToListAsync();

        return Ok(randomProducts);
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








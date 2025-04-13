using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Models;

namespace SmartBuy.Data
{
    public class ApplicationDbContext : IdentityDbContext<User> // Correct base class
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }


        public DbSet<User> Users { get; set; }  // Example table
        public DbSet<RefreshToken> RefreshToken { get; set; }  // Example table
        public DbSet<Product> Products {get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }

         
         protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Define the relationship between Review, User, and Product
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany()   // Assuming a user can have many reviews
            .HasForeignKey(r => r.UserId);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Product)
            .WithMany()   // Assuming a product can have many reviews
            .HasForeignKey(r => r.ProductId);
    }


    }
}

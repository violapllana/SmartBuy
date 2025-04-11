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
        // public new DbSet<User> Users { get; set; }

        public DbSet<RefreshToken> RefreshToken { get; set; }  // Example table
        public DbSet<Product> Products {get; set; }
        public DbSet<Card> Cards { get; set; }
     
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }


    }
}

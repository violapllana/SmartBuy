using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using SmartBuy.Data;
using SmartBuy.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration.UserSecrets;
using Backend.Models;

public class DataSyncBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IMongoDatabase _mongoDatabase;
    private readonly ILogger<DataSyncBackgroundService> _logger;

    public DataSyncBackgroundService(IServiceScopeFactory scopeFactory, IMongoDatabase mongoDatabase, ILogger<DataSyncBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _mongoDatabase = mongoDatabase;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Syncing data from SQL Server to MongoDB...");
            await SyncDataAsync();
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // Sync every 5 minutes
        }
    }

    private async Task SyncDataAsync()
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var sqlContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            var users = await sqlContext.Users.ToListAsync();
            var products = await sqlContext.Products.ToListAsync();
            var cards = await sqlContext.Cards.ToListAsync();
            var reviews = await sqlContext.Reviews.ToListAsync();
            var wishlists = await sqlContext.Wishlists.ToListAsync();
            var orders = await sqlContext.Orders.ToListAsync();

            var userCollection = _mongoDatabase.GetCollection<MongoUser>("Users");
            var productCollection = _mongoDatabase.GetCollection<MongoProducts>("Products");
            var cardCollection = _mongoDatabase.GetCollection<MongoCard>("Cards");
            var reviewCollection = _mongoDatabase.GetCollection<MongoReviews>("Reviews");
            var wishlistCollection = _mongoDatabase.GetCollection<MongoWishlist>("Wishlists");
            var orderCollection = _mongoDatabase.GetCollection<MongoOrder>("Orders");
//users
            foreach (var sqlUser in users)
            {
                var mongoUser = new MongoUser
                {
                    Id = sqlUser.Id.ToString(),
                    UserName = sqlUser.UserName,
                    Email = sqlUser.Email,
                    PasswordHash = sqlUser.PasswordHash
                };

                var filter = Builders<MongoUser>.Filter.Eq(u => u.Id, mongoUser.Id);
                var update = Builders<MongoUser>.Update
                    .Set(u => u.UserName, mongoUser.UserName)
                    .Set(u => u.Email, mongoUser.Email)
                    .Set(u => u.PasswordHash, mongoUser.PasswordHash);

                await userCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

//products

            foreach (var sqlProduct in products)
            {
                var mongoProduct = new MongoProducts
                {
                    Id = sqlProduct.Id,
                    Name = sqlProduct.Name,
                    Description = sqlProduct.Description,
                    Price = sqlProduct.Price,
                    StockQuantity = sqlProduct.StockQuantity,
                    Category = sqlProduct.Category,
                    ImageUrl = sqlProduct.ImageUrl,
                    CreatedAt = sqlProduct.CreatedAt
                };

                var filter = Builders<MongoProducts>.Filter.Eq(p => p.Id, mongoProduct.Id);
                var update = Builders<MongoProducts>.Update
                    .Set(p => p.Name, mongoProduct.Name)
                    .Set(p => p.Description, mongoProduct.Description)
                    .Set(p => p.Price, mongoProduct.Price)
                    .Set(p => p.StockQuantity, mongoProduct.StockQuantity)
                    .Set(p => p.Category, mongoProduct.Category)
                    .Set(p => p.ImageUrl, mongoProduct.ImageUrl)
                    .Set(p => p.CreatedAt, mongoProduct.CreatedAt);

                await productCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }
  //cards    
            
            foreach (var sqlCard in cards)
            {
    var mongoCard = new MongoCard
    {
        Id = sqlCard.Id, 
        Title = sqlCard.Title,
        Description = sqlCard.Description,
        Type = sqlCard.Type,
        CreatedAt = sqlCard.CreatedAt
    };

    var filter = Builders<MongoCard>.Filter.Eq(c => c.Id, mongoCard.Id);
    var update = Builders<MongoCard>.Update
        .Set(c => c.Title, mongoCard.Title)
        .Set(c => c.Description, mongoCard.Description)
        .Set(c => c.Type, mongoCard.Type)
        .Set(c => c.CreatedAt, mongoCard.CreatedAt);

    await cardCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }
  //orders
foreach (var sqlOrder in orders)
{
    var mongoOrder = new MongoOrder
    {
        Id = sqlOrder.Id.ToString(),
        UserId = sqlOrder.UserId,
        OrderDate = sqlOrder.OrderDate,
        Products = sqlOrder.OrderProducts.Select(op => new MongoOrderProduct
        {
            ProductId = op.ProductId,
            ProductName = op.Product?.Name,  // Duke pasur parasysh se mund të ketë një lidhje për emrin e produktit
            Quantity = op.Quantity,
            Price = op.Price
        }).ToList()
    };

    var filter = Builders<MongoOrder>.Filter.Eq(o => o.Id, mongoOrder.Id);
    var update = Builders<MongoOrder>.Update
        .Set(o => o.UserId, mongoOrder.UserId)
        .Set(o => o.OrderDate, mongoOrder.OrderDate)
        .Set(o => o.Products, mongoOrder.Products);

    await orderCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
}



//reviews

            foreach (var sqlReview in reviews)
            {
    var mongoReview = new MongoReviews
    {
        Id = sqlReview.Id,
        UserId = sqlReview.UserId,
        ProductId = sqlReview.ProductId,
        Rating = sqlReview.Rating,
        Comment = sqlReview.Comment,
        CreatedAt = sqlReview.CreatedAt
    };

    var filter = Builders<MongoReviews>.Filter.Eq(r => r.Id, mongoReview.Id);
    var update = Builders<MongoReviews>.Update
        .Set(r => r.UserId, mongoReview.UserId)
        .Set(r => r.ProductId, mongoReview.ProductId)
        .Set(r => r.Rating, mongoReview.Rating)
        .Set(r => r.Comment, mongoReview.Comment)
        .Set(r => r.CreatedAt, mongoReview.CreatedAt);

    await reviewCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

//wishlists

          foreach (var sqlWishlist in wishlists)
          {
    var mongoWishlist = new MongoWishlist
    {
        Id = sqlWishlist.Id,
        UserId = sqlWishlist.UserId,
        ProductId = sqlWishlist.ProductId,
        CreatedAt = sqlWishlist.CreatedAt
    };

    var filter = Builders<MongoWishlist>.Filter.Eq(w => w.Id, mongoWishlist.Id);
    var update = Builders<MongoWishlist>.Update
        .Set(w => w.UserId, mongoWishlist.UserId)
        .Set(w => w.ProductId, mongoWishlist.ProductId)
        .Set(w => w.CreatedAt, mongoWishlist.CreatedAt);

    await wishlistCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
          }

           
        }
    }
    
}



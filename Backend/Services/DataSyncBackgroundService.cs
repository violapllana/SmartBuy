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

            var userCollection = _mongoDatabase.GetCollection<MongoUser>("Users");
            var productCollection = _mongoDatabase.GetCollection<MongoProducts>("Products");

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
        }
    }
}
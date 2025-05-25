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
using Backend.Models;
using Backend.SignalR;

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
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
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
            var orders = await sqlContext.Orders.Include(o => o.OrderProducts).ThenInclude(op => op.Product).ToListAsync();
            var messages = await sqlContext.Messages.ToListAsync();
            var shipments = await sqlContext.Shipments.ToListAsync();


            var userCollection = _mongoDatabase.GetCollection<MongoUser>("Users");
            var productCollection = _mongoDatabase.GetCollection<MongoProducts>("Products");
            var cardCollection = _mongoDatabase.GetCollection<MongoCard>("Cards");
            var reviewCollection = _mongoDatabase.GetCollection<MongoReviews>("Reviews");
            var wishlistCollection = _mongoDatabase.GetCollection<MongoWishlist>("Wishlists");
            var orderCollection = _mongoDatabase.GetCollection<MongoOrder>("Orders");
            var messageCollection = _mongoDatabase.GetCollection<MongoMessage>("Messages");
            var shipmentCollection = _mongoDatabase.GetCollection<MongoShipment>("Shipments");


            // USERS
            foreach (var sqlUser in users)
            {
                var mongoUser = new MongoUser
                {
                    Id = sqlUser.Id.ToString(),
                    UserName = sqlUser.UserName,
                    Email = sqlUser.Email,
                    PasswordHash = sqlUser.PasswordHash
                };

                var filter = Builders<MongoUser>.Filter.Eq("Id", mongoUser.Id);
                var update = Builders<MongoUser>.Update
                    .Set("UserName", mongoUser.UserName)
                    .Set("Email", mongoUser.Email)
                    .Set("PasswordHash", mongoUser.PasswordHash);

                await userCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            var sqlUserIds = users.Select(u => u.Id.ToString()).ToList();
            var userDeleteFilter = Builders<MongoUser>.Filter.Nin("Id", sqlUserIds);
            await userCollection.DeleteManyAsync(userDeleteFilter);

            // PRODUCTS
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
                    ImageFile = sqlProduct.ImageFile,
                    CreatedAt = sqlProduct.CreatedAt
                };

                var filter = Builders<MongoProducts>.Filter.Eq("Id", mongoProduct.Id);
                var update = Builders<MongoProducts>.Update
                    .Set("Name", mongoProduct.Name)
                    .Set("Description", mongoProduct.Description)
                    .Set("Price", mongoProduct.Price)
                    .Set("StockQuantity", mongoProduct.StockQuantity)
                    .Set("Category", mongoProduct.Category)
                    .Set("ImageFile", mongoProduct.ImageFile)
                    .Set("CreatedAt", mongoProduct.CreatedAt);

                await productCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            var sqlProductIds = products.Select(p => p.Id).ToList();
            var productDeleteFilter = Builders<MongoProducts>.Filter.Nin("Id", sqlProductIds);
            await productCollection.DeleteManyAsync(productDeleteFilter);

            // // CARDS
            // foreach (var sqlCard in cards)
            // {
            //     var mongoCard = new MongoCard
            //     {
            //         Id = sqlCard.Id,
            //         Title = sqlCard.Title,
            //         Description = sqlCard.Description,
            //         Type = sqlCard.Type,
            //         CreatedAt = sqlCard.CreatedAt
            //     };

            //     var filter = Builders<MongoCard>.Filter.Eq("Id", mongoCard.Id);
            //     var update = Builders<MongoCard>.Update
            //         .Set("Title", mongoCard.Title)
            //         .Set("Description", mongoCard.Description)
            //         .Set("Type", mongoCard.Type)
            //         .Set("CreatedAt", mongoCard.CreatedAt);

            //     await cardCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            // }

            // var sqlCardIds = cards.Select(c => c.Id).ToList();
            // var cardDeleteFilter = Builders<MongoCard>.Filter.Nin("Id", sqlCardIds);
            // await cardCollection.DeleteManyAsync(cardDeleteFilter);


            // CARDS
            foreach (var sqlCard in cards)
            {
                var mongoCard = new MongoCard
                {
                    Id = sqlCard.Id,
                    CardNumber = sqlCard.CardNumber,
                    ExpirationDate = sqlCard.ExpirationDate,
                    CVV = sqlCard.CVV,
                    CardType = sqlCard.CardType,
                    CreatedAt = sqlCard.CreatedAt
                };

                var filter = Builders<MongoCard>.Filter.Eq("Id", mongoCard.Id);
                var update = Builders<MongoCard>.Update
                    .Set("CardNumber", mongoCard.CardNumber)
                    .Set("ExpirationDate", mongoCard.ExpirationDate)
                    .Set("CVV", mongoCard.CVV)
                    .Set("CardType", mongoCard.CardType)
                    .Set("CreatedAt", mongoCard.CreatedAt);

                await cardCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            var sqlCardIds = cards.Select(c => c.Id).ToList();
            var cardDeleteFilter = Builders<MongoCard>.Filter.Nin("Id", sqlCardIds);
            await cardCollection.DeleteManyAsync(cardDeleteFilter);

            // REVIEWS
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

                var filter = Builders<MongoReviews>.Filter.Eq("Id", mongoReview.Id);
                var update = Builders<MongoReviews>.Update
                    .Set("UserId", mongoReview.UserId)
                    .Set("ProductId", mongoReview.ProductId)
                    .Set("Rating", mongoReview.Rating)
                    .Set("Comment", mongoReview.Comment)
                    .Set("CreatedAt", mongoReview.CreatedAt);

                await reviewCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            var sqlReviewIds = reviews.Select(r => r.Id).ToList();
            var reviewDeleteFilter = Builders<MongoReviews>.Filter.Nin("Id", sqlReviewIds);
            await reviewCollection.DeleteManyAsync(reviewDeleteFilter);

            // WISHLISTS
            foreach (var sqlWishlist in wishlists)
            {
                var mongoWishlist = new MongoWishlist
                {
                    Id = sqlWishlist.Id,
                    UserId = sqlWishlist.UserId,
                    ProductId = sqlWishlist.ProductId,
                    CreatedAt = sqlWishlist.CreatedAt
                };

                var filter = Builders<MongoWishlist>.Filter.Eq("Id", mongoWishlist.Id);
                var update = Builders<MongoWishlist>.Update
                    .Set("UserId", mongoWishlist.UserId)
                    .Set("ProductId", mongoWishlist.ProductId)
                    .Set("CreatedAt", mongoWishlist.CreatedAt);

                await wishlistCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            var sqlWishlistIds = wishlists.Select(w => w.Id).ToList();
            var wishlistDeleteFilter = Builders<MongoWishlist>.Filter.Nin("Id", sqlWishlistIds);
            await wishlistCollection.DeleteManyAsync(wishlistDeleteFilter);

            // ORDERS
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
                        ProductName = op.Product?.Name,
                        Quantity = op.Quantity,
                        Price = op.Price
                    }).ToList()
                };

                var filter = Builders<MongoOrder>.Filter.Eq("Id", mongoOrder.Id);
                var update = Builders<MongoOrder>.Update
                    .Set("UserId", mongoOrder.UserId)
                    .Set("OrderDate", mongoOrder.OrderDate)
                    .Set("Products", mongoOrder.Products);

                await orderCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            var sqlOrderIds = orders.Select(o => o.Id.ToString()).ToList();
            var orderDeleteFilter = Builders<MongoOrder>.Filter.Nin("Id", sqlOrderIds);
            await orderCollection.DeleteManyAsync(orderDeleteFilter);

            foreach (var sqlMessage in messages)
            {
                var mongoMessage = new MongoMessage
                {
                    Id = sqlMessage.Id,
                    UserId = sqlMessage.UserId,
                    ReceiverId = sqlMessage.ReceiverId,
                    Content = sqlMessage.MessageContent,
                    SentAt = sqlMessage.SentAt
                };

                var filter = Builders<MongoMessage>.Filter.Eq("Id", mongoMessage.Id);
                var update = Builders<MongoMessage>.Update
                    .Set("UserId", mongoMessage.UserId)
                    .Set("ReceiverId", mongoMessage.ReceiverId)
                    .Set("Content", mongoMessage.Content)
                    .Set("SentAt", mongoMessage.SentAt);

                await messageCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            // Optional: Delete messages from MongoDB that are no longer in SQL Server
            var sqlMessageIds = messages.Select(m => m.Id).ToList();
            var messageDeleteFilter = Builders<MongoMessage>.Filter.Nin("Id", sqlMessageIds);
            await messageCollection.DeleteManyAsync(messageDeleteFilter);




            foreach (var sqlShipment in shipments)
            {
                var mongoShipment = new MongoShipment
                {
                    Id = sqlShipment.Id,
                    ShipmentDate = sqlShipment.ShipmentDate,
                    TrackingNumber = sqlShipment.TrackingNumber,
                    OrderId = sqlShipment.OrderId,
                };

                var filter = Builders<MongoShipment>.Filter.Eq("Id", mongoShipment.Id);
                var update = Builders<MongoShipment>.Update
                    .Set("ShipmentDate", mongoShipment.ShipmentDate)
                    .Set("TrackingNumber", mongoShipment.TrackingNumber)
                    .Set("OrderId", mongoShipment.OrderId);  // Missing semicolon here

                await shipmentCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }

            // Optional: Delete messages from MongoDB that are no longer in SQL Server
            var sqlShipmentsIds = shipments.Select(s => s.Id).ToList();  // You should use 'shipments' instead of 'messages'
            var shipmentDeleteFilter = Builders<MongoShipment>.Filter.Nin("Id", sqlShipmentsIds);
            await shipmentCollection.DeleteManyAsync(shipmentDeleteFilter);

        }
    }

}



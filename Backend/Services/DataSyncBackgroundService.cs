using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using SmartBuy.Data;
using SmartBuy.Models;

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
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // Sync every 1 minute
        }
    }

    private async Task SyncDataAsync()
    {
        // Use a scope to get the SQL Server context
        using (var scope = _scopeFactory.CreateScope())
        {
            var sqlContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var users = await sqlContext.Users.ToListAsync(); // Fetch users from SQL Server

            // MongoDB logic to insert/update users
            var userCollection = _mongoDatabase.GetCollection<MongoUser>("Users");

            foreach (var sqlUser in users)
            {
                var mongoUser = new MongoUser
                {
                    Id = sqlUser.Id.ToString(),  // Converting SQL Server Id to MongoDB string Id
                    UserName = sqlUser.UserName,
                    Email = sqlUser.Email,
                    PasswordHash = sqlUser.PasswordHash  // Syncing PasswordHash
                };

                var filter = Builders<MongoUser>.Filter.Eq(u => u.Id, mongoUser.Id);
                var update = Builders<MongoUser>.Update
                    .Set(u => u.UserName, mongoUser.UserName)
                    .Set(u => u.Email, mongoUser.Email)
                    .Set(u => u.PasswordHash, mongoUser.PasswordHash);  // Updating PasswordHash

                // Upsert the user into MongoDB (insert or update)
                await userCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
            }
        }
    }
}

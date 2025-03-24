using MongoDB.Driver;
using SmartBuy.Models;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(string connectionString, string dbName)
    {
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(dbName);
    }

    public IMongoCollection<MongoUser> Users => _database.GetCollection<MongoUser>("users");
}

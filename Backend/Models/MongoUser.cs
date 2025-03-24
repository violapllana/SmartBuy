using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace SmartBuy.Models
{

    public class MongoUser
    {
        public string? Id { get; set; }  // MongoDB specific Id
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? NormalizedUserName { get; set; }
        public string? NormalizedEmail { get; set; }
        public string? PasswordHash { get; set; }  // Added PasswordHash property
    }


}
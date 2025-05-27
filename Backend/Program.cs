using SmartBuy.Data;
using SmartBuy.Models;
using SmartBuy.Services;
using MongoDB.Driver;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Backend.Models;
using Microsoft.Extensions.Options;
using Stripe;
using Backend.SignalR;

var builder = WebApplication.CreateBuilder(args);






// Add Controllers
builder.Services.AddControllers(); // Register controllers









// Add Swagger Services
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSwaggerGen(c =>
{
    // Specify OpenAPI version
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartBuy API", Version = "1.0" });

    // Add Security Definition for Bearer Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});











// MongoDB Configuration
var mongoConnectionString = Environment.GetEnvironmentVariable("MongoDB__ConnectionString");
var mongoDatabaseName = Environment.GetEnvironmentVariable("MongoDB__DatabaseName");



if (string.IsNullOrEmpty(mongoConnectionString) || string.IsNullOrEmpty(mongoDatabaseName))
{
    throw new InvalidOperationException("MongoDB configuration is missing.");
}








// Register MongoDB context
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
    new MongoClient(mongoConnectionString)); // Register MongoDB Client
builder.Services.AddSingleton(serviceProvider =>
    serviceProvider.GetRequiredService<IMongoClient>().GetDatabase(mongoDatabaseName)); // Register MongoDB Database

Console.WriteLine("Mongo Conn String: " + mongoConnectionString);
Console.WriteLine("Mongo Database Name: " + mongoDatabaseName);

var stripeSettings = new StripeSettings
{
    SecretKey = Environment.GetEnvironmentVariable("STRIPE__SECRETKEY"),
    PublishableKey = Environment.GetEnvironmentVariable("STRIPE__PUBLISHABLEKEY")

};

if (string.IsNullOrEmpty(stripeSettings.SecretKey) || string.IsNullOrEmpty(stripeSettings.PublishableKey))
{
    throw new InvalidOperationException("Stripe keys are missing.");
}

Console.WriteLine("Stripe SecretKey: " + stripeSettings.SecretKey);
Console.WriteLine("Stripe Publishable Key: " + stripeSettings.PublishableKey);

// Set Stripe's global API key (optional if using StripeClient)
Stripe.StripeConfiguration.ApiKey = stripeSettings.SecretKey;

// Register StripeSettings instance
builder.Services.AddSingleton(stripeSettings);

// Register StripeClient with secret key from StripeSettings
builder.Services.AddSingleton<StripeClient>(sp =>
{
    var settings = sp.GetRequiredService<StripeSettings>();
    return new StripeClient(settings.SecretKey);
});


// Database Configuration for SQL Server
var connectionString = Environment.GetEnvironmentVariable("SMARTBUY_CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string is missing.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
Console.WriteLine("Sql Server Conn String: " + connectionString);

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// JWT Setup
var jwtIssuer = builder.Configuration.GetValue<string>("JWT:Issuer");
var jwtAudience = builder.Configuration.GetValue<string>("JWT:Audience");
var jwtSigninKey = builder.Configuration.GetValue<string>("JWT:SigninKey");

if (string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience) || string.IsNullOrEmpty(jwtSigninKey))
{
    throw new InvalidOperationException("JWT configuration is missing.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigninKey"])),
        RoleClaimType = ClaimTypes.Role
    };
}).AddCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    options.SlidingExpiration = true;
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.WithOrigins(
                   "http://localhost:3000",   // React web app (dev)
                   "http://localhost:8081"    // React Native Web default port
               )
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});


builder.Services.AddSignalR();  // Add SignalR service


builder.Services.AddScoped<ITokenService, SmartBuy.Services.TokenService>();




builder.Services.AddHostedService<DataSyncBackgroundService>();

builder.Services.AddScoped<ChatHub>(); // Add this

builder.Logging.AddConsole();




builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
builder.Services.AddSingleton<StripeClient>(serviceProvider =>
{
    var stripeSettings = serviceProvider.GetRequiredService<IOptions<StripeSettings>>().Value;
    return new StripeClient(stripeSettings.SecretKey);
});

// Add Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
    options.AddPolicy("UserOnly", policy =>
        policy.RequireRole("User"));
});


// Build the application
var app = builder.Build();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
// app.UseHttpsRedirection();
app.MapControllers(); // This should come after the authentication and authorization middlewares.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");

app.UseWebSockets(); // This allows WebSocket connections for SignalR



app.MapHub<ChatHub>("/chatHub");

// Ensure roles exist at startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await EnsureRoles(services);
}

// Middleware Configuration
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // Enable detailed errors in dev
}


app.UseStaticFiles(); // për të lejuar servimin e imazheve

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartBuy API v1");
});







// Ensure Roles Exist
static async Task EnsureRoles(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roleNames = { "Admin", "User" };

    foreach (var roleName in roleNames)
    {
        var roleExists = await roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}






app.Run();


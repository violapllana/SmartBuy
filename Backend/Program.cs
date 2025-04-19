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
using YourNamespace.SignalR;
<<<<<<< HEAD

=======
>>>>>>> 85eaf15954609c59b9a77659cec3fce0d0b796c7

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers(); // Register controllers
builder.Services.AddSignalR();  // Add SignalR service

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

// Get Stripe Secret and Publishable keys from environment variables
var stripeSecretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");
var stripePublishableKey = Environment.GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY");

// Ensure the environment variables are set
if (string.IsNullOrEmpty(stripeSecretKey) || string.IsNullOrEmpty(stripePublishableKey))
{
    throw new InvalidOperationException("Stripe keys are missing.");
}
Console.WriteLine("Stripe SecretKey: " + stripeSecretKey);
Console.WriteLine("Stripe Publishable Key: " + stripePublishableKey);


// Configure Stripe settings
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
builder.Services.AddSingleton<StripeClient>(serviceProvider =>
{
    var stripeSettings = serviceProvider.GetRequiredService<IOptions<StripeSettings>>().Value;
    return new StripeClient(stripeSettings.SecretKey); // Use SecretKey for StripeClient
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigninKey)),
        RoleClaimType = ClaimTypes.Role
    };
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

builder.Services.AddScoped<ITokenService, SmartBuy.Services.TokenService>();
builder.Services.AddHostedService<DataSyncBackgroundService>();

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
        policy.RequireRole("ADMIN"));
    options.AddPolicy("UserOnly", policy =>
        policy.RequireRole("USER"));
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

app.UseCors("CorsPolicy");

app.MapHub<ChatHub>("/chatHub");

app.Run();

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

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartBuy API v1");
});

// Ensure Roles Exist
static async Task EnsureRoles(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roleNames = { "ADMIN", "USER" };

    foreach (var roleName in roleNames)
    {
        var roleExists = await roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}
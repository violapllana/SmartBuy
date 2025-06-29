using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartBuy.Models;
using SmartBuy.Services;
using Stripe;

public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService; // Assuming you have an ITokenService

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _tokenService = tokenService; // Initialize the token service
    }

    // Register action
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new User
        {
            UserName = model.Username,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            await AssignUserRoles(user, model.Username);

            // Create Stripe customer
            var customerService = new CustomerService();

            var customerOptions = new CustomerCreateOptions
            {
                Email = user.Email,
                Name = user.UserName
            };

            try
            {
                var customer = await customerService.CreateAsync(customerOptions);

                // Save Stripe customer ID in user
                user.StripeCustomerId = customer.Id;
                await _userManager.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Failed to create Stripe customer.", Details = ex.Message });
            }

            return Ok(new { Message = "User registered successfully." });
        }

        return BadRequest(result.Errors);
    }

    // Login action
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
                return Unauthorized(new { Message = "User not found." });

            await AssignUserRoles(user, model.Username);

            var token = await GenerateJwtToken(user);
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user);

            return Ok(new
            {
                AccessToken = token,
                RefreshToken = refreshToken,
                UserName = user.UserName,
                Email = user.Email
            });
        }

        return Unauthorized(new { Message = "Invalid login attempt." });
    }

    // Assign roles based on username
    private async Task AssignUserRoles(User user, string username)
    {
        var specialUsers = new[] { "seladin", "alban", "viola", "rea" };
        if (specialUsers.Contains(username.ToLower()))
        {
            await EnsureRole(user, "Admin");
            await RemoveRole(user, "User");
        }
        else
        {
            await EnsureRole(user, "User");
            await RemoveRole(user, "Admin");
        }
    }


    private async Task EnsureRole(User user, string role)
    {
        if (!await _userManager.IsInRoleAsync(user, role))
        {
            await _userManager.AddToRoleAsync(user, role);
        }
    }

    private async Task RemoveRole(User user, string role)
    {
        if (await _userManager.IsInRoleAsync(user, role))
        {
            await _userManager.RemoveFromRoleAsync(user, role);
        }
    }

    // Generate JWT token
    private async Task<string> GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["JWT:SigninKey"]);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            Audience = _configuration["JWT:Audience"],
            Issuer = _configuration["JWT:Issuer"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    // Refresh token action
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
            return BadRequest(new { Message = "Refresh token is required." });

        var storedRefreshToken = await _tokenService.GetRefreshTokenAsync(refreshToken);
        if (storedRefreshToken == null)
            return Unauthorized(new { Message = "Invalid or expired refresh token." });

        var user = await _userManager.FindByIdAsync(storedRefreshToken.UserId);
        if (user == null)
            return Unauthorized(new { Message = "User not found." });

        var newJwtToken = await GenerateJwtToken(user);
        var newRefreshToken = await _tokenService.GenerateRefreshTokenAsync(user);

        return Ok(new
        {
            AccessToken = newJwtToken,
            RefreshToken = newRefreshToken
        });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = _userManager.Users.ToList();
        if (users == null || !users.Any())
        {
            return NotFound(new { Message = "No users found." });
        }

        var userDtos = users.Select(user => new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.StripeCustomerId

        }).ToList();

        return Ok(userDtos);
    }


    [HttpGet("userid/{username}")]
    public async Task<IActionResult> GetUserIdByUsername(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            return BadRequest(new { Message = "Username is required." });
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return NotFound(new { Message = $"User with username '{username}' not found." });
        }

        return Ok(new { userId = user.Id });
    }



    [HttpGet("users/email")]
    public async Task<IActionResult> GetUserEmail([FromQuery] string username)
    {
        if (string.IsNullOrEmpty(username))
        {
            return BadRequest(new { Message = "Username is required." });
        }

        var user = await _userManager.FindByNameAsync(username);

        if (user == null)
        {
            return NotFound(new { Message = "User not found." });
        }

        return Ok(new { Email = user.Email });
    }

    [HttpGet("users/stripe-customer-id")]
    public async Task<IActionResult> GetStripeCustomerId([FromQuery] string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest(new { Message = "User ID is required." });
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound(new { Message = "User not found." });
        }

        return Ok(new { StripeCustomerId = user.StripeCustomerId });
    }



    [HttpGet("users/getusernamefromid/{id}")]
    public async Task<IActionResult> GetUsernameFromId([FromRoute] string id)
    {
        // Check if id is valid
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("User ID is required.");
        }

        // Fetch the user by ID
        var user = await _userManager.FindByIdAsync(id);

        // Handle case when the user is not found
        if (user == null)
        {
            return NotFound($"User with ID {id} not found.");
        }

        // Return the username
        return Ok(user.UserName);
    }











    [HttpGet("users/admins")]
    public async Task<IActionResult> GetAllAdmins()
    {
        var users = await _userManager.GetUsersInRoleAsync("Admin");

        if (users == null || !users.Any())
        {
            return NotFound(new { Message = "No admin users found." });
        }

        var adminDtos = users.Select(user => new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.StripeCustomerId

        }).ToList();

        return Ok(adminDtos);
    }


    [HttpGet("users/by-username")]
    public async Task<IActionResult> GetUserByUsername([FromQuery] string username)
    {
        if (string.IsNullOrEmpty(username))
        {
            return BadRequest(new { Message = "Username is required." });
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return NotFound(new { Message = $"User with username {username} not found." });
        }

        var userDto = new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.StripeCustomerId
        };

        return Ok(userDto);
    }

    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
        {
            return NotFound(new { Message = "User not found." });
        }

        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            return Ok(new { Message = "User deleted successfully." });
        }

        return BadRequest(new { Message = "Failed to delete user.", Errors = result.Errors });
    }

    [HttpPut("users/update-username")]
    [Authorize]
    public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var existingUser = await _userManager.FindByNameAsync(model.NewUsername);
        if (existingUser != null)
            return BadRequest(new { Message = "Username already taken." });

        user.UserName = model.NewUsername;
        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            return Ok(new { Message = "Username updated successfully." });
        }

        return BadRequest(new { Message = "Failed to update username.", Errors = result.Errors });
    }

    [HttpPut("users/update-password")]
    [Authorize]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new { Message = "User not found." });

        var passwordCheck = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
        if (!passwordCheck)
            return Unauthorized(new { Message = "Current password is incorrect." });

        var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

        if (result.Succeeded)
        {
            return Ok(new { Message = "Password updated successfully." });
        }

        return BadRequest(new { Message = "Failed to update password.", Errors = result.Errors });
    }

    public class UpdateUsernameModel
    {
        public string NewUsername { get; set; }
    }

    public class UpdatePasswordModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}

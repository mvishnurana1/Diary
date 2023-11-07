using System;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;
using API.DTOs.Users;
using API.Helpers.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Users
{
    [Authorize]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(
             IAuthService authService
        )
        {
            _authService = authService;
        }

        [HttpGet("user")]
        public async Task<ActionResult<UserResponseDto>> GetLoggedInUser()
        {
            var token = HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("bearer ", "");
            await Console.Out.WriteLineAsync(token);

            // Make An API Call to the Issuer
            // Get User Profile
            // Attach the DbProperties to the User

            var user = await _authService.GetLoggedInUser(token);
           
            if (user == null)
            {
                return NotFound("No such user found...!");
            }

            return Ok(user);
        }

        public async Task LogOut()
        {
        }

        public async Task Login()
        {
        }
    }
}

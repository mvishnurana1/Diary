﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.DTOs.Users;
using API.Helpers.Services;

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
        public async Task<ActionResult<UserResponseDto>> GetLoggedInUser(string token)
        {
            var user = await _authService.GetLoggedInUser(token);
           
            if (user == null)
            {
                return NotFound("No such user found...!");
            }

            return Ok(user);
        }
    }
}

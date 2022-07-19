using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Helpers.Interfaces;
using API.model;

namespace API.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IUserRespository _userRespository;

        public UsersController(
            ILogger<UsersController> logger,
            IUserRespository userRespository
        )
        {
            _logger = logger;
            _userRespository = userRespository;
        }

        [HttpGet("/getuserbyusername")]
        public async Task<ActionResult<User>> GetUserByUserName([FromQuery] string userName)
        {
            _logger.LogInformation($"GetUserByUserName Controller method Executed with argument - {userName}");

            var user = await _userRespository.FindUserByName(userName);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("/getallusers")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUserse()
        {
            _logger.LogInformation($"GetUserByUserName Controller method Executed with argument");

            var user = await _userRespository.GetAllUsers();
           
            return Ok(user);
        }

        [HttpGet("/getuserbyid")]
        public async Task<ActionResult<IEnumerable<User>>> GetUserByUserID([FromQuery] Guid id)
        {
            _logger.LogInformation($"GetUserByUserName Controller method Executed with argument");

            var user = await _userRespository.GetUserByID(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}

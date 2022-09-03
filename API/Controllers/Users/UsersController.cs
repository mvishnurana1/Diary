using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using API.Helpers.Interfaces;
using API.model;
using AutoMapper;
using API.DTOs.Users;

namespace API.Controllers.Users
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IUserRespository _userRespository;
        private readonly IMapper _mapper;

        public UsersController(
            ILogger<UsersController> logger,
            IUserRespository userRespository,
            IMapper mapper
        )
        {
            _logger = logger;
            _userRespository = userRespository;
            _mapper = mapper;
        }

        [HttpGet("/getuserbyusername")]
        public async Task<ActionResult<User>> GetUserByUserName([FromQuery] string userName)
        {
            _logger.LogInformation($"GetUserByUserName Controller method Executed with argument - {userName} on {DateTime.Now}");

            var user = await _userRespository.FindUserByName(userName);

            if (user == null)
            {
                _logger.LogError($"GetUserByUserName Controller responded with Http-{NotFound().StatusCode}, no user found");
                return NotFound();
            }

            _logger.LogInformation($"GetUserByUserName responded with Http-{Ok().StatusCode} response - {user}");
            return Ok(user);
        }

        [HttpGet("/getallusers")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUserse()
        {
            _logger.LogInformation($"GetAllUserse Controller method Executed with argument on {DateTime.Now}");

            var user = await _userRespository.GetAllUsers();

            var allUsers = _mapper.Map<IEnumerable<User>, IEnumerable<GetAllUsersResponsedDto>>(user);

            _logger.LogInformation($"GetAllUserse responded with Http-{Ok().StatusCode} response - {user}");
            return Ok(allUsers);
        }

        [HttpGet("/getuserbyid")]
        public async Task<ActionResult<IEnumerable<User>>> GetUserByUserID([FromQuery] Guid id)
        {
            _logger.LogInformation($"GetUserByUserID Controller method Executed with argument id - {id} on {DateTime.Now}");

            var user = await _userRespository.GetUserByID(id);

            if (user == null)
            {
                _logger.LogInformation($"GetUserByUserID responded with Http-{NotFound().StatusCode} response - {user}");

                return NotFound();
            }

            _logger.LogInformation($"GetUserByUserID responded with Http-{Ok().StatusCode} response - {user}");
            return Ok(user);
        }
    }
}

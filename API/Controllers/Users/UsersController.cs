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

            var allUsers = _mapper.Map<IEnumerable<User>, IEnumerable<GetAllUsersResponsedDto>>(user);

            return Ok(allUsers);
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

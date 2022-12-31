using API.Helpers.Services;
using API.model;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers.Users
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TodosController : ControllerBase
    {
        private readonly ILogger<DiaryEntryController> _logger;
        private readonly IToDoService _toDoService;
        private readonly IMapper _mapper;

        public TodosController(
            IToDoService toDoService,
            IMapper mapper,
            ILogger<DiaryEntryController> logger
        )
        {
            _toDoService = toDoService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("activetodos")]
        public async Task<ActionResult<List<DailyTodo>>> GetActiveTodos([FromQuery] string userID)
        {

        }

        [HttpPost("addtodo")]
        public async Task<ActionResult<List<DailyTodo>>> AddNewTodo()
        {

        }

        [HttpPut("updatetodo")]
        public async Task<ActionResult<List<DailyTodo>>> GetActiveTodos()
        {

        }
    }
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Helpers.Services;
using API.model;
using API.DTOs.Todos;

namespace API.Controllers.Users
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TodosController : ControllerBase
    {
        private readonly ILogger<DiaryEntryController> _logger;
        private readonly IToDoService _toDoService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public TodosController(
            IToDoService toDoService,
            IMapper mapper,
            ILogger<DiaryEntryController> logger,
            IUserService userService
        )
        {
            _toDoService = toDoService;
            _mapper = mapper;
            _logger = logger;
            _userService = userService;
        }

        [HttpGet("/activetodos")]
        public async Task<ActionResult<List<DailyTodo>>> GetActiveTodos([FromQuery] string userID)
        {
            var id = new Guid(userID);
            var userExists = await _userService.DoesUserExist(id);

            if (String.IsNullOrEmpty(userID) || !userExists)
            {
                return BadRequest();
            }

            var todos = await _toDoService.GetActivityTodosForUser(id);

            return Ok(todos);
        }
 
        [HttpPost("/addtodo")]
        public async Task<ActionResult<List<DailyTodo>>> AddNewTodo([FromQuery] TodoDto todo)
        {
            if (String.IsNullOrWhiteSpace(todo.TodoContent))
            {
                return BadRequest();
            }

            var addedTodo = await _toDoService.AddNewTodo(todo);
            return Ok(addedTodo);
        }

        [HttpPut("/updatetodo")]
        public async Task<ActionResult<List<DailyTodo>>> TaskStatusChange([FromQuery] UpdateTodoCompleteStatusDto completedTodo)
        {
            var activeTodos = await _toDoService.MarkTodoAsCompleted(completedTodo);

            if (activeTodos == null)
            {
                return BadRequest();
            }

            return Ok(activeTodos);
        }
    }
}

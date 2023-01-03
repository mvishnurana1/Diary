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

        [HttpGet("/activetodos")]
        public async Task<ActionResult<List<DailyTodo>>> GetActiveTodos([FromQuery] string userID)
        {
            if (userID == null)
            {
                return BadRequest();
            }

            var id = new Guid(userID);
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
            return Created("Added", addedTodo);
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

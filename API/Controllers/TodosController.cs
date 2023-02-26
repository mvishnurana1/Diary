﻿using System;
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

        public TodosController(
            IToDoService toDoService,
            ILogger<DiaryEntryController> logger,
            IUserService userService
        )
        {
            _toDoService = toDoService;
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

        [HttpGet("/tasksfordate")]
        public async Task<ActionResult<List<DailyTodo>>> GetTasksForLoggedInUserOnDate([FromQuery] DueTasksOnDateDto dto)
        {
            if (String.IsNullOrEmpty(dto.Date))
            {
                return BadRequest();
            }

            var date = DateTime.Parse(dto.Date);
            var id = new Guid(dto.UserID);
            var todos = await _toDoService.GetAllTasksForLoggedInUserOnDate(date, id);

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
            var userExists = await _userService.DoesUserExist(completedTodo.LoggedInUserID);

            if (!userExists)
            {
                return BadRequest();
            }

            var activeTodos = await _toDoService.MarkTodoAsCompleted(completedTodo);

            if (activeTodos == null)
            {
                return BadRequest();
            }

            return Ok(activeTodos);
        }

        [HttpGet("/todoperformance")]
        public async Task<ActionResult<List<double?>>> GetToDoPerformance([FromQuery] Guid loggedInUserID)
        {
            var userExists = await _userService.DoesUserExist(loggedInUserID);

            if (!userExists)
            {
                return BadRequest();
            }

            var activeTodos = await _toDoService.GetTodoPerformance(loggedInUserID);

            return Ok(activeTodos);
        }

        [HttpPut("/renametodoContent")]
        public async Task<ActionResult<List<DailyTodo>>> TaskToDoContentChange([FromQuery] Guid loggedInUserID, Guid todoID, string newName)
        {
            var userExists = await _userService.DoesUserExist(loggedInUserID);

            if (!userExists)
            {
                return BadRequest();
            }

            var activeTodos = await _toDoService.RenameTodo(todoID, newName);

            if (activeTodos == null)
            {
                return BadRequest();
            }

            return Ok(activeTodos);
        }

        [HttpDelete("/deletetodo")]
        public async Task<ActionResult<DailyTodo>> RemoveTodo([FromQuery] Guid loggedInUserID, Guid todoID)
        {
            var userExists = await _userService.DoesUserExist(loggedInUserID);

            if (!userExists)
            {
                return BadRequest();
            }

            var activeTodos = await _toDoService.RemoveTodo(todoID);

            if (activeTodos == null)
            {
                return NotFound();
            }

            return Accepted(activeTodos);
        }
    }
}

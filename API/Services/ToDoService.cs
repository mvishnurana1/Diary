using API.DTOs.Todos;
using API.model;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Services
{
    public interface IToDoService
    {
        Task<DailyTodo> AddNewTodo(TodoDto todo);
        Task<string> MarkTodoAsCompleted(DeleteTodoRequestDto deleteTodoRequestDto);
        Task<List<DailyTodo>> GetActivityTodosForUser(Guid loggedInUserID);
    }

    public class ToDoService : IToDoService
    {
        private readonly DataContext _context;
        private readonly ILogger<ToDoService> _logger;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public ToDoService(DataContext context, ILogger<ToDoService> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<DailyTodo> AddNewTodo(TodoDto todo)
        {
            var newTodo = new DailyTodo()
            {
                Completed = false,
                DateDue = todo.DateDue,
                TodoContent = todo.TodoContent,
                UserID = todo.UserID
            };

            _context.Todo.Add(newTodo);
            await _context.SaveChangesAsync();

            return newTodo;
        }

        public async Task<List<DailyTodo>> GetActivityTodosForUser(Guid loggedInUserID)
        {
            return await Task.Run(() => _context.Todo.Where(t => t.UserID.Equals(loggedInUserID))
                                                     .Where(t => !t.Completed)
                                                     .ToList());
        }

        public async Task<string> MarkTodoAsCompleted(DeleteTodoRequestDto deleteTodoRequestDto)
        {
            var isValidUser = await _userService.DoesUserExist(deleteTodoRequestDto.LoggedInUserID);

            if (isValidUser)
            {
                var todo = await Task.Run(() => _context.Todo
                                     .Where(t => t.UserID == deleteTodoRequestDto.LoggedInUserID)
                                     .Where(t => t.ID == deleteTodoRequestDto.ID)
                                     .FirstOrDefault());
            
                if (todo != null)
                {
                    todo.Completed = true;
                    await _context.SaveChangesAsync();

                    return todo.ID.ToString();
                }
            }

            return null;
        }
    }
}

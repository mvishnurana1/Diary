﻿using API.DTOs.Todos;
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
        Task<string> MarkTodoAsCompleted(UpdateTodoCompleteStatusDto update);
        Task<List<DailyTodo>> GetActivityTodosForUser(Guid loggedInUserID);
        Task<List<DailyTodo>> GetAllTasksForDate(DateTime date);
    }

    public class ToDoService : IToDoService
    {
        private readonly DataContext _context;
        private readonly ILogger<ToDoService> _logger;
        private readonly IMapper _mapper;

        public ToDoService(
            DataContext context, 
            ILogger<ToDoService> logger, 
            IMapper mapper
        )
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<DailyTodo> AddNewTodo(TodoDto todo)
        {
            var newTodo = new DailyTodo()
            {
                Completed = todo.Completed,
                DateDue = todo.DateDue,
                TodoContent = todo.TodoContent,
                UserID = todo.UserID,
                ID = new Guid()
            };

            _context.DailyTodo.Add(newTodo);
            await _context.SaveChangesAsync();

            return newTodo;
        }

        public async Task<List<DailyTodo>> GetActivityTodosForUser(Guid loggedInUserID)
        {
            return await Task.Run(() => _context.DailyTodo.Where(t => t.UserID.Equals(loggedInUserID))
                                                     .Where(t => !t.Completed)
                                                     .ToList());
        }

        public async Task<string> MarkTodoAsCompleted(UpdateTodoCompleteStatusDto update)
        {
            var user = await Task.Run(() => _context.User.Where(u => u.UserID == update.LoggedInUserID).FirstOrDefault());

            if (user != null)
            {
                var todo = await Task.Run(() => _context.DailyTodo
                                        .Where(t => t.UserID == update.LoggedInUserID)
                                        .Where(t => t.ID == update.ID)
                                        .FirstOrDefault());

                if (todo != null)
                {
                    todo.Completed = update.NewStatus;
                    await _context.SaveChangesAsync();

                    if (todo.Completed)
                    {
                        // get the number of todos for the current date
                        // re-calculate the ratio of todo vs done
                    }

                    return todo.ID.ToString();
                }
            }

            return null;
        }

        public async Task<List<DailyTodo>> GetAllTasksForDate(DateTime date)
        {
            return await Task.Run(() => _context.DailyTodo.Where(dt => dt.DateDue == date).ToList());
        }
    }
}

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
        Task<string> MarkTodoAsCompleted(UpdateTodoCompleteStatusDto update);
        Task<List<DailyTodo>> GetActivityTodosForUser(Guid loggedInUserID);
        Task<List<DailyTodo>> GetAllTasksForLoggedInUserOnDate(DateTime date, Guid userID);
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
                DateCreated = todo.DateCreated,
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
            var todo = await Task.Run(() => _context.DailyTodo
                                    .Where(t => t.UserID == update.LoggedInUserID)
                                    .Where(t => t.ID == update.DailyTodoID)
                                    .FirstOrDefault());

            if (todo != null)
            {
                if (update.IsCompleted == true)
                {
                    todo.DateCompleted = update.UpdateDateTime;
                }

                todo.Completed = update.IsCompleted;
                await _context.SaveChangesAsync();

                // TODO: Get the number of tasks due today for the date
                var numberOfTasksDueForDate = await FetchNumberOfTotalTodosCreatedForDate(todo.DateCreated);

                // vs number of tasks completed today:
                var tasksCompletedForDate = await FetchNumberOfTotalTodosCompletedOnDate(todo.DateCreated);

                var existingUserPerforamanceRatio = await FetchTodosPerformanceForUserOnDate(todo.DateCreated, update.LoggedInUserID);

                if (numberOfTasksDueForDate > 0)
                {
                    var performanceRatio = Convert.ToDouble((tasksCompletedForDate / numberOfTasksDueForDate) * 100);

                    // If existingUserPerforamanceRatio ?
                    var performance = new ToDoPerformance()
                    {
                        Achievement = performanceRatio,
                        Date = update.UpdateDateTime,
                        UserID = update.LoggedInUserID
                    };

                    _context.ToDoPerformance.Add(performance);
                    await _context.SaveChangesAsync();

                    return todo.ID.ToString();
                }
            }

            return null;
        }

        public async Task<List<DailyTodo>> GetAllTasksForLoggedInUserOnDate(DateTime date, Guid userID)
        {
            return await Task.Run(() => _context.DailyTodo
                                                .Where(dt => dt.DateCreated == date)
                                                .Where(dt => dt.UserID == userID)
                                                .ToList());
        }

        private async Task<ToDoPerformance> FetchTodosPerformanceForUserOnDate(DateTime date, Guid userID)
        {
            return await Task.Run(() => _context.ToDoPerformance.Where(x => x.UserID == userID)
                                                                .Where(x => x.Date == date)
                                                                .FirstOrDefault()); 
        }

        private async Task<int> FetchNumberOfTotalTodosCreatedForDate(DateTime date)
        {
            var allTasksCreatedOnTheDate = await Task.Run(() => _context.DailyTodo
                                            .Where(ct => ct.DateCompleted == date)
                                            .ToList());

            return allTasksCreatedOnTheDate.Count;
        }

        private async Task<int> FetchNumberOfTotalTodosCompletedOnDate(DateTime date)
        {
            var allTasksCompletedOnTheDate = await Task.Run(() => _context.DailyTodo
                                            .Where(ct => ct.DateCompleted == date)
                                            .Where(ct => ct.Completed)
                                            .ToList());

            return allTasksCompletedOnTheDate.Count;
        }
    }
}

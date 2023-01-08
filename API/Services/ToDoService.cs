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
                if (update.NewStatus == true)
                {
                    todo.DateCompleted = update.UpdateDateTime;
                }

                todo.Completed = update.NewStatus;
                await _context.SaveChangesAsync();

                // TODO: Get the number of tasks due today vs number of tasks completed today:
                // Fetch users performance for the date, if it exists?
                // Recalculate the performance 
                // Save changes
                var performance = new ToDoPerformance()
                {
                    Achievement = await EvaluateTodaysToDoPerformance(update.LoggedInUserID, update.UpdateDateTime),
                    Date = update.UpdateDateTime,
                    UserID = update.LoggedInUserID
                };

                _context.ToDoPerformance.Add(performance);
                await _context.SaveChangesAsync();

                Console.WriteLine(performance);

                return todo.ID.ToString();
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

        private async Task<Double> EvaluateTodaysToDoPerformance(Guid userID, DateTime updatedDate)
        {
            // All Tasks due for completion on 'that' date
            var allTasksDueForTheDate = await Task.Run(() => _context.DailyTodo
                                                  .Where(dt => dt.DateCreated == updatedDate)
                                                  .Where(dt => dt.UserID == userID)
                                                  .ToList());

            // All Tasks completed on 'that' date
            var allTasksCompletedOnTheDate = await Task.Run(() => _context.DailyTodo
                                                        .Where(ct => ct.Completed)
                                                        .Where(ct => ct.DateCompleted == updatedDate)
                                                        .ToList());

            if (allTasksDueForTheDate.Count > 0)
            {
                return allTasksCompletedOnTheDate.Count/ allTasksDueForTheDate.Count;
            }

            return 0;
        }

        private async Task<ToDoPerformance> UpdatePerformance()
        {
            return new ToDoPerformance()
            {

            };
        }

        private async Task<ToDoPerformance> FetchTodosPerformance(DateTime date, Guid UserID)
        {


            return new ToDoPerformance()
            {

            };
        }
    }
}

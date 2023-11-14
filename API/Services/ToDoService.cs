using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using AutoMapper;
using Microsoft.Extensions.Logging;
using API.DTOs.AchivementDtos;
using API.DTOs.Todos;
using API.model;

namespace API.Helpers.Services
{
    public interface IToDoService
    {
        Task<DailyTodo> AddNewTodo(TodoDto todo);
        Task<List<DailyTodo>> GetActivityTodosForUser(Guid loggedInUserID);
        Task<Boolean> CheckIfTodoExistsForUser(TodoDto todo);
        Task<List<DailyTodo>> GetAllTasksForLoggedInUserOnDate(DateTime date, Guid userID);
        Task<List<AchievementTodoDto>> GetLastMonthsTodoPerformance(Guid loggedInUserID);
        Task<List<AchievementTodoDto>> GetToDoPerformanceForTheTimeFrame(Guid loggedInUserID, DateTime startDateTime, DateTime endDateTime);
        Task<string> MarkTodoAsCompleted(UpdateTodoCompleteStatusDto update);
        Task<DailyTodo> RemoveTodo(Guid todoID);
        Task<DailyTodo> RenameTodo(Guid todoID, string newName);
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

        public async Task<bool> CheckIfTodoExistsForUser(TodoDto todo)
        {
            var todos = await GetAllTasksForLoggedInUserOnDate(todo.DateCreated, todo.UserID);

            return todos.Where(x => x.TodoContent == todo.TodoContent).Count() == 0;   
        }

        public async Task<DailyTodo> RenameTodo(Guid todoID, string newName)
        {
            var todo = await FetchTodo(todoID);

            if (todo != null)
            {
                todo.TodoContent = newName;
                await _context.SaveChangesAsync();

                return todo;
            }

            return null;
        }

        public async Task<DailyTodo> RemoveTodo(Guid todoID)
        {
            var todo = await FetchTodo(todoID);

            var todos = await GetAllTasksForLoggedInUserOnDate(todo.DateCreated, todo.UserID);

            if (todo != null)
            {
                _context.DailyTodo.Remove(todo);
                await _context.SaveChangesAsync();

                await EvaluatePerformanceForDate(todo.UserID, todo.DateCreated, todos);

                return todo;
            }

            return null;
        }

        public async Task<DailyTodo> AddNewTodo(TodoDto todo)
        {
            var todos = await GetAllTasksForLoggedInUserOnDate(todo.DateCreated, todo.UserID);

            var newTodo = new DailyTodo()
            {
                Completed = todo.Completed,
                DateCompleted = todo.DateCompleted,
                DateCreated = todo.DateCreated,
                TodoContent = todo.TodoContent,
                UserID = todo.UserID,
            };

            todos.Add(newTodo);

            _context.DailyTodo.Add(newTodo);
            await _context.SaveChangesAsync();

            await EvaluatePerformanceForDate(todo.UserID, todo.DateCreated, todos);

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

            var todos = await GetAllTasksForLoggedInUserOnDate(todo.DateCreated, todo.UserID);

            if (todo != null)
            {
                if (update.IsCompleted == true)
                {
                    todo.DateCompleted = update.UpdateDateTime;
                }

                await EvaluatePerformanceForDate(todo.UserID, todo.DateCreated, todos);
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

        public async Task<List<AchievementTodoDto>> GetLastMonthsTodoPerformance(Guid loggedInUserID)
        {
            var dateMonthAgo = DateTime.Now.AddMonths(-1);
            var todaysDate = DateTime.Now;

            var x = await Task.Run(() => _context.ToDoPerformance.Where(tdp => tdp.UserID == loggedInUserID)
                                                .Where(x => (x.Date > dateMonthAgo) && (x.Date <= todaysDate))
                                                .ToList());

            return _mapper.Map<List<ToDoPerformance>, List<AchievementTodoDto>>(x);
        }

        public async Task<List<AchievementTodoDto>> GetToDoPerformanceForTheTimeFrame(Guid loggedInUserID, DateTime startDateTime, DateTime endDateTime)
        {
            var x = await Task.Run(() => _context.ToDoPerformance.Where(tdp => tdp.UserID == loggedInUserID)
                                                .Where(x => (x.Date > startDateTime) && (x.Date <= endDateTime))
                                                .ToList());

            return _mapper.Map<List<ToDoPerformance>, List<AchievementTodoDto>>(x);
        }

        private async Task EvaluatePerformanceForDate(Guid loggedInUserID, DateTime date, List<DailyTodo> todoList)
        {
            var totalTodosCreatedOnDate = await FetchNumberOfTotalTodosCreatedForDate(date);
            var totalTodosCompletedOnDate = await FetchNumberOfTotalTodosCompletedOnDate(date);

            var performanceRatio = CalculatePerformance(totalTodosCompletedOnDate, totalTodosCreatedOnDate);

            var existingUserPerforamanceRatio = await FetchTodosPerformanceForUserOnDate(date, loggedInUserID);

            if (existingUserPerforamanceRatio == null)
            {
                var newPerformance = new ToDoPerformance()
                {
                    Achievement = performanceRatio,
                    Date = date,
                    UserID = loggedInUserID,
                };

                await _context.ToDoPerformance.AddAsync(newPerformance);
            }
            else
            {
                existingUserPerforamanceRatio.Achievement = performanceRatio;
            }

            await _context.SaveChangesAsync();
        }

        private async Task<DailyTodo> FetchTodo(Guid todoID)
        {
            return await Task.Run(() => _context.DailyTodo.Where(x => x.ID == todoID).FirstOrDefault());
        }

        private double CalculatePerformance(decimal tasksCompletedForDate, decimal numberOfTasksDueForDate)
        {
            return numberOfTasksDueForDate > 0
                                           ? Convert.ToDouble(((tasksCompletedForDate / numberOfTasksDueForDate) * 100m))
                                           : 0;
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
                                                     .Where(ct => ct.DateCreated == date)
                                                     .ToList());

            return allTasksCreatedOnTheDate.Count;
        }

        private async Task<int> FetchNumberOfTotalTodosCompletedOnDate(DateTime date)
        {
            var allTasksCompletedOnTheDate = await Task.Run(() => _context.DailyTodo
                                                       .Where(ct => ct.DateCompleted == date)
                                                       .Where(ct => ct.Completed == true)
                                                       .ToList());

            return allTasksCompletedOnTheDate.Count;
        }
    }
}

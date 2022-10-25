using API.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Helpers.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<DailyTodo>> AddTodaysTask(string content);
        Task<IEnumerable<DailyTodo>> RemoveTodaysTask(string content);
    }

    public class ToDoService : ITaskService
    {
        public async Task<IEnumerable<DailyTodo>> AddTodaysTask(string content)
        {
            var x = new List<DailyTodo>();
            return await Task.Run(() => x);
        }

        public async Task<IEnumerable<DailyTodo>> RemoveTodaysTask(string content)
        {
            var x = new List<DailyTodo>();
            return await Task.Run(() => x);
        }
    }

    public interface IMonthPriority
    {
        Task<IEnumerable<Priority>> AddMonthPriority(string content);
        Task<IEnumerable<Priority>> RemoveMonthPriority(string content);
    }

    public class MonthPrioritiesService : IMonthPriority
    {
        public async Task<IEnumerable<Priority>> AddMonthPriority(string content)
        {
            var x = new List<Priority>();
            return await Task.Run(() => x);
        }

        public async Task<IEnumerable<Priority>> RemoveMonthPriority(string content)
        {
            var x = new List<Priority>();
            return await Task.Run(() => x);
        }
    }
}

using API.DTOs.Priority;
using API.model;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Services
{
    public interface IMonthPriority
    {
        Task<IEnumerable<Priority>> AddMonthPriority(PriorityDto priority);
        Task<IEnumerable<Priority>> RemoveMonthPriority(string content);
    }

    public class MonthPrioritiesService : IMonthPriority
    {
        private readonly DataContext _context;
        private readonly ILogger<MonthPrioritiesService> _logger;

        public MonthPrioritiesService(
            DataContext dataContext,
            ILogger<MonthPrioritiesService> logger
        )
        {
            _context = dataContext;
            _logger = logger;
        }

        public async Task<IEnumerable<Priority>> AddMonthPriority(PriorityDto priority)
        {
            var user = await Task.Run(() => _context.User.FirstOrDefault(u => u.UserID == priority.UserID));

            if (user != null)
            {
                Priority pri = new Priority()
                {
                    Month = priority.Month,
                    PriorityContent = priority.PriorityContent,
                    User = user,
                };

                _context.Priority.Add(pri);
                await _context.SaveChangesAsync();

                return await GetAllPrioritiesForMonth(user.UserID);
            }

            return null;
        }

        public async Task<IEnumerable<Priority>> RemoveMonthPriority(string content)
        {
            var x = new List<Priority>();
            return await Task.Run(() => x);
        }

        public async Task<IEnumerable<Priority>> GetAllPrioritiesForMonth(Guid userID)
        {
            var priorities = await Task.Run(() => _context.Priority.Where(p => (p.User.UserID == userID) && p.Month.Month == DateTime.Now.Month));

            return priorities;
        }
    }
}

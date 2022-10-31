using API.DTOs.Priority;
using API.model;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Services
{
    public interface IMonthPriority
    {
        Task<IEnumerable<PriorityResponseDto>> AddMonthPriority(PriorityDto priority);
        Task<IEnumerable<PriorityResponseDto>> RemoveMonthPriority(RemovePriorityDto priority);
        Task<IEnumerable<PriorityResponseDto>> GetAllPrioritiesForMonth(Guid userID);
    }

    public class MonthPrioritiesService : IMonthPriority
    {
        private readonly DataContext _context;
        private readonly ILogger<MonthPrioritiesService> _logger;
        private readonly IMapper _mapper;

        public MonthPrioritiesService(
            DataContext dataContext,
            ILogger<MonthPrioritiesService> logger,
            IMapper mapper
        )
        {
            _context = dataContext;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PriorityResponseDto>> AddMonthPriority(PriorityDto priority)
        {
            var user = await GetUser(priority.UserID);

            if (user != null)
            {
                Priority pri = new Priority()
                {
                    Month = DateTime.Parse(priority.Month),
                    PriorityContent = priority.PriorityContent,
                    User = user,
                };

                _context.Priority.Add(pri);
                await _context.SaveChangesAsync();

                return await GetAllPrioritiesForMonth(user.UserID);
            }

            return null;
        }

        public async Task<IEnumerable<PriorityResponseDto>> RemoveMonthPriority(RemovePriorityDto priority)
        {
            var user = await GetUser(priority.UserID);
            var prioprityToDelete = _context.Priority.FirstOrDefault(p => p.ID == priority.ID);
            if (user != null && prioprityToDelete != null)
            {
                _context.Priority.Remove(prioprityToDelete);
                await _context.SaveChangesAsync();

                return await GetAllPrioritiesForMonth(user.UserID);
            } else
            {
                return null;
            }
        }

        public async Task<IEnumerable<PriorityResponseDto>> GetAllPrioritiesForMonth(Guid userID)
        {
            var priorities = await Task.Run(() => _context.Priority.Where(p => (p.User.UserID == userID) && p.Month.Month == DateTime.Now.Month)
                                                                   .ToList());

            return _mapper.Map<List<Priority>, List<PriorityResponseDto>>(priorities);
        }

        private async Task<User> GetUser(Guid userID)
        {
            var user = await Task.Run(() => _context.User.FirstOrDefault(u => u.UserID == userID));

            return user;
        }
    }
}

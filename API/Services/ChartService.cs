using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs.ChartsDto;

namespace API.Helpers.Services
{
    public interface IChartService
    {
        /// <summary>
        /// returns Todo performance for the last month by default, if both the dates aren't passed
        /// </summary>
        Task<List<ChartItem>> GetToDoPerformanceForLoggedInUserForThePassedTimeFrame(Guid userID, DateTime? startDateTime, DateTime? endDateTime);
    }

    public class ChartService : IChartService
    {
        private readonly DataContext _context;

        public ChartService(
            DataContext context
        )
        {
            _context = context;
        }

        /// <summary>
        /// returns Todo performance for the last month by default, if both the dates aren't passed
        /// </summary>
        public async Task<List<ChartItem>> GetToDoPerformanceForLoggedInUserForThePassedTimeFrame(Guid userID, DateTime? startDateTime, DateTime? endDateTime)
        {
            if (!startDateTime.HasValue || !endDateTime.HasValue)
            {
                startDateTime = DateTime.Now.AddDays(-28).Date;
                endDateTime = DateTime.Now.Date;
            }

            var performanceList = await Task.Run(() => _context.ToDoPerformance.Where(tdp => tdp.UserID == userID)
                                                                               .Where(d => d.Date >= startDateTime && d.Date <= endDateTime)
                                                                               .Select(x => new ChartItem()
                                                                               {
                                                                                   Date = x.Date,
                                                                                   PerformanceValue = x.Achievement
                                                                               })
                                                                               .ToList());
            return performanceList;
        }
    }
}

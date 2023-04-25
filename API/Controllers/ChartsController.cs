using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Helpers.Services;
using API.DTOs.ChartsDto;

namespace API.Controllers.Users
{
    public class ChartsController : ControllerBase
    {
        public readonly IChartService _chartService;
        private readonly IUserService _userService;

        public ChartsController(
            IChartService chartService,
            IUserService userService
        )
        {
            _chartService = chartService;
            _userService = userService;
        }

        [HttpGet("/todoperformancefortimeframe")]
        public async Task<ActionResult<List<ChartItem>>> GetTodoPerformanceForLoggedInUserForTimeFrame(Guid userID, DateTime? startTime, DateTime? endTime)
        {
            if (!await _userService.DoesUserExist(userID))
            {
                return BadRequest("User not found!");
            }

            var lists = await _chartService.GetToDoPerformanceForLoggedInUserForThePassedTimeFrame(userID, startTime, endTime);

            return lists;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Helpers.Services;
using API.DTOs.Priority;

namespace API.Controllers.Users
{
    public class PriorityController : ControllerBase
    {
        private readonly ILogger<PriorityController> _logger;
        private readonly IMonthPriority _monthPriorityService;

        public PriorityController(
            ILogger<PriorityController> logger,
            IMonthPriority monthPriorityService
        )
        {
            _logger = logger;
            _monthPriorityService = monthPriorityService;
        }

        [HttpGet("/addpriorities")]
        public async Task<ActionResult<List<PriorityResponseDto>>> GetActivePrioritiesOfMonth([FromQuery] PriorityDto priority)
        {
            if (priority.UserID == Guid.Empty || String.IsNullOrEmpty(priority.PriorityContent))
            {
                return BadRequest();
            }

            var x = await _monthPriorityService.AddMonthPriority(priority);

            return Ok(x);
        }

        [HttpGet("/removepriority")]
        public async Task<ActionResult<List<PriorityResponseDto>>> RemoveActivePrioritiesOfMonth([FromQuery] RemovePriorityDto priority)
        {
            if (priority.UserID == Guid.Empty || priority.ID == Guid.Empty)
            {
                return BadRequest();
            }

            var x = await _monthPriorityService.RemoveMonthPriority(priority);

            return Ok(x);
        }

        [HttpGet("/priorities")]
        public async Task<ActionResult<List<PriorityResponseDto>>> GetActivePriorityForCurrentMonth([FromQuery] Guid UserID)
        {
            if (UserID == Guid.Empty)
            {
                return BadRequest();
            }

            var priorities = await _monthPriorityService.GetAllPrioritiesForMonth(UserID);

            return Ok(priorities);
        }
    }
}

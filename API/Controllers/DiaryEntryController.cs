using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using API.Helpers.Services;
using API.Helpers.Entities;
using API.model;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class DiaryEntryController : ControllerBase
    {
        private readonly ILogger<DiaryEntryController> _logger;
        private readonly IDiaryService _diaryService;

        public DiaryEntryController(
            ILogger<DiaryEntryController> logger,
            IDiaryService diaryService
        )
        {
            _logger = logger;
            _diaryService = diaryService;
        }

        [HttpGet("/get")]
        public async Task<ActionResult<string>> GetEntryByDate([FromQuery] GetDiaryEntryByDateRequestDto request)
        {
            _logger.LogInformation($"GetEntryByDate Controller Executed with argument - {request.Date} on {DateTime.Now}");

            if (request.Date > DateTime.Now)
            {
                _logger.LogError($"GetEntryByDate responded with {BadRequest().StatusCode} because of future date");
                return BadRequest();
            }

            var entry = await _diaryService.GetEntryContentByDate(request);

            _logger.LogInformation($"GetEntryByDate responded with Http-{Ok().StatusCode} response - {entry}");

            return Ok(entry);
        }

        [HttpGet("/searchbycontent")]
        public async Task<ActionResult<IEnumerable<SearchByContentResponseDto>>> SearchByContent([FromQuery] SearchViaContentRequestDto request)
        {
            _logger.LogInformation($"SearchByContent Controller Executed with argument - {request.Content} & {request.UserID} on {DateTime.Now}");

            if (String.IsNullOrEmpty(request.Content) || request.UserID == Guid.Empty)
            {
                return BadRequest();
            }

            var searchResults = await _diaryService.SearchEntriesByContent(request);

            _logger.LogInformation($"SearchByContent responded with Http-{Ok().StatusCode} response - {searchResults.Count()}");
            return Ok(searchResults);
        }

        [HttpGet("/getdates")]
        public async Task<ActionResult<IEnumerable<DiaryEntry>>> GetAllDatesWithEntriesForUser([FromQuery] Guid loggedInUserID)
        {
            _logger.LogInformation($"GetAllDatesWithEntriesForUser Controller Executed with argument - {loggedInUserID} on {DateTime.Now}");

            if (loggedInUserID == Guid.Empty)
            {
                return BadRequest();
            }

            var searchResults = await _diaryService.GetAllDatesWithEntriesForUser(loggedInUserID);

            _logger.LogInformation($"GetAllDatesWithEntriesForUser responded with Http-{Ok().StatusCode} response - {searchResults}");
            return Ok(searchResults);
        }

        [HttpPost("/post")]
        public async Task<ActionResult<PostDiaryEntryDto>> PostEntry([FromBody] PostDiaryEntryDto entry)
        {
            if (entry.Content == null)
            {
                _logger.LogInformation($"PostEntry Controller Executed with argument - entry value - {entry}");

                return BadRequest();
            }

            _logger.LogInformation($"PostEntry Controller Executed with argument - {entry?.Content}, {entry.UserID} & {entry?.SubmittedDateTime} on {DateTime.Now}");

            var parsedDate = DateTime.Parse(entry.SubmittedDateTime);

            if (String.IsNullOrEmpty(entry.Content) || parsedDate > DateTime.Now)
            {
                _logger.LogError($"PostEntry Controller responded with argument Http-{BadRequest().StatusCode} because Empty content passed");
                return BadRequest();
            }

            var newEntry = await _diaryService.AddNewEntries(entry, parsedDate);

            if (newEntry == null)
            {
                _logger.LogError($"PostEntry Controller responded with argument Http-{StatusCode(500)} because no Entry found");
                return StatusCode(500);
            }

            _logger.LogInformation($"PostEntry responded with Http-{Ok().StatusCode} response - {newEntry}");
            return Created("201", newEntry);
        }
    }
}

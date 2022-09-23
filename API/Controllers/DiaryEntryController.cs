using System;
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

            var entry = await _diaryService.GetEntryByDate(request);

            _logger.LogInformation($"GetEntryByDate responded with Http-{Ok().StatusCode} response - {entry}");
            
            return Ok(entry);
        }

        [HttpGet("/searchbycontent")]
        public async Task<ActionResult<IEnumerable<DiaryEntry>>> SearchByContent([FromQuery] string content)
        {
            _logger.LogInformation($"SearchByContent Controller Executed with argument - {content} on {DateTime.Now}");

            if (String.IsNullOrEmpty(content))
            {
                return BadRequest();
            }

            var searchResults = await _diaryService.SearchEntriesByContent(content);

            _logger.LogInformation($"SearchByContent responded with Http-{Ok().StatusCode} response - {searchResults}");
            return Ok(searchResults);
        }

        [HttpPost("/post")]
        // Consider making this FromQuery
        public async Task<ActionResult<DiaryEntry>> PostEntry(PostDiaryEntryDto entry)
        {
            _logger.LogInformation($"PostEntry Controller Executed with argument - {entry.Content} & {entry.SubmittedDateTime} on {DateTime.Now}");

            if (String.IsNullOrEmpty(entry.Content))
            {
                _logger.LogError($"PostEntry Controller responded with argument Http-{BadRequest().StatusCode} because Empty content passed");
                return BadRequest();
            }

            var newEntry = await _diaryService.AddNewEntries(entry);

            if (newEntry == null)
            {
                _logger.LogError($"PostEntry Controller responded with argument Http-{NotFound().StatusCode} because no Entry found");
                return NotFound();
            }

            _logger.LogInformation($"PostEntry responded with Http-{Ok().StatusCode} response - {newEntry}");
            return Created("201", newEntry);
        }
    }
}

using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Helpers.Interfaces;
using API.Helpers.Entities;
using API.model;

namespace API.Controllers
{
    // [Authorize]
    [ApiController]
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
        public async Task<ActionResult<DiaryEntry>> GetEntryByDate([FromQuery] DateTime date)
        {
            _logger.LogInformation($"GetEntryByDate Controller Executed with argument - {date} on {DateTime.Now}");

            if (date > DateTime.Now)
            {
                _logger.LogError($"GetEntryByDate responded with {BadRequest().StatusCode} because of future date");
                return BadRequest();
            }

            var entry = await _diaryService.GetEntryByDate(date);

            _logger.LogInformation($"GetEntryByDate responded with Http-{Ok().StatusCode} response - {entry?.DiaryEntry?.EntryID}");
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
                _logger.LogError($"PostEntry Controller responded with argument Http-{Conflict().StatusCode} because no Entry found");
                return Conflict();
            }

            _logger.LogInformation($"PostEntry responded with Http-{Ok().StatusCode} response - {newEntry}");
            return Created("201", newEntry);
        }
    }
}

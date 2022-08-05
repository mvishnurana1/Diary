using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Helpers.Interfaces;
using API.Helpers.Entities;
using API.model;
using Microsoft.AspNetCore.Authorization;

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
            _logger.LogInformation($"GetEntryByDate Controller Executed with argument - {date}");

            var entry = await _diaryService.GetEntryByDate(date);

            return Ok(entry);
        }

        [HttpGet("/searchbycontent")]
        public async Task<ActionResult<IEnumerable<DiaryEntry>>> SearchByContent([FromQuery] string content)
        {
            _logger.LogInformation($"SearchByContent Controller Executed with argument - {content}");

            if (String.IsNullOrEmpty(content))
            {
                return BadRequest();
            }

            var searchResults = await _diaryService.SearchEntriesByContent(content);

            return Ok(searchResults);
        }

        [HttpPost("/post")]
        public async Task<ActionResult<DiaryEntry>> PostEntry(PostDiaryEntryDto entry)
        {
            _logger.LogInformation($"PostEntry Controller Executed with argument - {entry.Content} & {entry.SubmittedDateTime}");

            if (String.IsNullOrEmpty(entry.Content))
            {
                return BadRequest();
            }

            var diaryEntry = new PostDiaryEntryDto()
            {
                SubmittedDateTime = entry.SubmittedDateTime,
                Content = entry.Content.Trim(),
                UserID = entry.UserID
            };

            var newEntry = await _diaryService.AddNewEntries(diaryEntry);

            if (newEntry == null)
            {
                return Conflict();
            }

            return Created("201", newEntry);
        }
    }
}

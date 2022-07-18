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
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly ILogger<NotesController> _logger;
        private readonly IDiaryService _diaryService;

        public NotesController(
            ILogger<NotesController> logger,
            IDiaryService diaryService
        )
        {
            _logger = logger;
            _diaryService = diaryService;
        }

        //[Authorize]
        [HttpGet("/get")]
        public async Task<ActionResult<DiaryEntry>> GetEntryByDate([FromQuery] DateTime date)
        {
            _logger.LogInformation($"GetEntryByDate Controller Executed with argument - {date}");

            var entry = await _diaryService.GetEntryByDate(date);

            if (entry == null)
            {
                return NotFound();
            }

            return Ok(entry);
        }

        //[Authorize]
        [HttpGet("/searchbycontent")]
        public async Task<ActionResult<IEnumerable<DiaryEntry>>> SearchByContent([FromQuery] string content)
        {
            _logger.LogInformation($"SearchByContent Controller Executed with argument - {content}");

            if (String.IsNullOrEmpty(content))
            {
                return BadRequest();
            }

            var x = await _diaryService.SearchEntriesByContent(content);

            return Ok(x);
        }

        //[Authorize]
        [HttpPost("/post")]
        public async Task<ActionResult<DiaryEntry>> PostEntry(PostDiaryEntry entry)
        {
            _logger.LogInformation($"PostEntry Controller Executed with argument - {entry.Content} & {entry.SubmittedDateTime}");

            if (String.IsNullOrEmpty(entry.Content))
            {
                return BadRequest();
            }

            var diaryEntry = new DiaryEntry()
            {
                EntryID = Guid.NewGuid(),
                SubmittedDateTime = entry.SubmittedDateTime,
                Content = entry.Content.Trim()
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

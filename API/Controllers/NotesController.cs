using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.model;
using API.Helpers.Services;
using System.Collections.Generic;
using API.Helpers.Interfaces;
using System.Threading.Tasks;
using API.Helpers.Entities;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
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

        [HttpGet("/get/{date}")]
        public ActionResult<IEnumerable<DiaryEntry>> GetEntryByDate(DateTime date)
        {
            Console.WriteLine(date);

            var x = _diaryService.GetEntryByDate(date);

            return Ok(x);
        }

        [HttpGet("/searchbycontent/{content}")]
        public ActionResult<IEnumerable<DiaryEntry>> SearchByContent(string content)
        {
            var x = _diaryService.SearchEntriesByContent(content);
            return Ok(x);
        }

        [HttpPost("/post")]
        public ActionResult<DiaryEntry> PostEntry([FromBody] PostDiaryEntry entry)
        {
            _logger.LogInformation($"Executed at {entry.SubmittedDateTime}");

            if (String.IsNullOrEmpty(entry.Content))
            {
                return BadRequest();
            }

            var diaryEntry = new DiaryEntry()
            {
                EntryID = Guid.NewGuid(),
                SubmittedDateTime = entry.SubmittedDateTime,
                Content = entry.Content
            };

            var x = _diaryService.AddNewEntries(diaryEntry);

            return StatusCode(201, x.Result);
        }
    }
}

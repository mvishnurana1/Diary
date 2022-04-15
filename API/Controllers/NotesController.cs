using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.model;
using API.Helpers.Services;
using System.Collections.Generic;
using API.Helpers.Interfaces;

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

        [HttpGet("{date}")]
        public IEnumerable<DiaryEntry> GetEntryByDate(DateTime date)
        {
            _logger.LogInformation($"Executed at {DateTime.UtcNow.ToLongTimeString()}");

            var x = _diaryService.GetEntryByDate(date);

            return x;
        }

        [HttpGet("{content}")]
        public IEnumerable<DiaryEntry> SearchByContent(string content)
        {
            _logger.LogInformation($"Executed at {DateTime.UtcNow.ToLongTimeString()}");

            var x = _diaryService.SearchEntriesByContext(content);

            return x;
        }

        //[HttpPost]
        //public async Task<ActionResult<DiaryEntry>> PostNotes(PostDiaryEntry entry)
        //{
        //    try
        //    {
        //        if (entry == null)
        //        {
        //            return BadRequest();
        //        }



        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError,
        //        "Error creating new employee record");
        //    }
        //}
    }
}

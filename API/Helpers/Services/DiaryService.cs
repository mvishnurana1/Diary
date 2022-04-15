using API.Helpers.Entities;
using API.Helpers.Interfaces;
using API.model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Services
{
    public class DiaryService : IDiaryService
    {
        private readonly DataContext _context;
        private readonly ILogger<DiaryService> _logger;

        public DiaryService(
            DataContext dataContext,
            ILogger<DiaryService> logger
        )
        {
            _context = dataContext;
            _logger = logger;
        }

        public DiaryEntry AddNewEntries(PostDiaryEntry newEntry)
        {
            return new DiaryEntry() { };
        }

        public IEnumerable<DiaryEntry> GetEntryByDate(DateTime date)
        {
            return  _context.Entries.Where(x => x.SubmittedDateTime.Date == date.Date).ToList();
        }

        public DiaryEntry UpdateEntry(DateTime date)
        {
            return new DiaryEntry() { };
        }

        public DiaryEntry DeleteEntry(DateTime date)
        {
            return new DiaryEntry() { };
        }

        public IEnumerable<DiaryEntry> SearchEntriesByContext(string content)
        {

            return new List<DiaryEntry> { };
        }
    }
}

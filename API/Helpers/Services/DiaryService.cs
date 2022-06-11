using API.Helpers.Interfaces;
using API.model;
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

        public async Task<DiaryEntry> AddNewEntries(DiaryEntry newEntry)
        {
            var date = newEntry.SubmittedDateTime;
            var entry = GetEntryByDate(date);

            if (entry != null)
            {
                DeleteEntry(entry);
            }
                
            _context.Entries.Add(newEntry);
            await _context.SaveChangesAsync();

            return newEntry;
        }

        public DiaryEntry GetEntryByDate(DateTime date)
        {
            return _context.Entries
                    .Where(x => x.SubmittedDateTime.Date == date.Date)
                    .FirstOrDefault();
        }

        private void DeleteEntry(DiaryEntry entry)
        {
            _context.Entries.Remove(entry);
        }

        public IEnumerable<DiaryEntry> SearchEntriesByContent(string content)
        {
            return _context.Entries
                            .Where(x => x.Content.Contains(content))
                            .OrderBy(x => x.SubmittedDateTime)
                            .ToList();
        }
    }
}

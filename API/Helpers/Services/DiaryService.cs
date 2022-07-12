using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using API.Helpers.Interfaces;
using API.model;

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
            var entry = await GetEntryByDate(date);

            if (entry != null)
            {
                await DeleteEntry(entry);
            }
                
            _context.Entries.Add(newEntry);
            await _context.SaveChangesAsync();

            return newEntry;
        }

        public async Task<DiaryEntry> GetEntryByDate(DateTime date)
        {
            return await Task.Run(() => _context.Entries
                    .Where(x => x.SubmittedDateTime.Date == date.Date)
                    .FirstOrDefault()); 
        }

        private async Task DeleteEntry(DiaryEntry entry)
        {
            await Task.Run(() => _context.Entries.Remove(entry));
        }

        public async Task<IEnumerable<DiaryEntry>> SearchEntriesByContent(string content)
        {
            return await Task.Run(() => _context.Entries
                            .Where(x => x.Content.Contains(content))
                            .OrderBy(x => x.SubmittedDateTime)
                            .ToList());
        }
    }
}

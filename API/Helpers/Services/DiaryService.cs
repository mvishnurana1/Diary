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

        public async Task<DiaryEntry> AddNewEntries(DiaryEntry newEntry)
        {
            try
            {
                var date = newEntry.SubmittedDateTime;

                var entry = GetEntryByDate(date).FirstOrDefault();

                if (entry != null)
                {
                    entry.Content = newEntry.Content;
                    entry.SubmittedDateTime = newEntry.SubmittedDateTime;
                    
                    _context.Entries.Add(entry);
                } else
                {
                    _context.Entries.Add(newEntry);
                }

                await _context.SaveChangesAsync();
            } catch(Exception ex)
            {
                _logger.LogInformation($"Executed at {ex}");
            }

            return newEntry;
        }

        public async Task<DiaryEntry> UpdateEntry(DateTime date, DiaryEntry newContent)
        {
            var x = GetEntryByDate(date).FirstOrDefault();
                
            if (x == null) {
                return null;
            }

            try
            {
                x.Content = newContent.Content;
                x.SubmittedDateTime = newContent.SubmittedDateTime;
                _context.Update(x);

                await _context.SaveChangesAsync();
            } catch(Exception ex)
            {
                _logger.LogInformation($"Executed at {ex}");
            }

            return newContent;
        }

        public IEnumerable<DiaryEntry> GetEntryByDate(DateTime date)
        {
            return  _context.Entries
                    .Where(x => x.SubmittedDateTime.Date == date.Date)
                    .ToList();
        }

        public DiaryEntry DeleteEntryByDate(DateTime date)
        {
            return new DiaryEntry() { };
        }

        public IEnumerable<DiaryEntry> SearchEntriesByContent(string content)
        {
            return _context.Entries
                            .Where(x => x.Content.Contains(content))
                            .ToList();
        }
        
        public DiaryEntry DeleteEntryByID(Guid id)
        {
            return new DiaryEntry() { };
        }

        public DiaryEntry DeleteEntryByID(DateTime date)
        {
            throw new NotImplementedException();
        }
    }
}

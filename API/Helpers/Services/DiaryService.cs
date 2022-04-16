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
                _context.Entries.Add(newEntry);
                await _context.SaveChangesAsync();
            } catch(Exception ex)
            {
                Console.WriteLine(ex);
            }

            return newEntry;
        }

        public IEnumerable<DiaryEntry> GetEntryByDate(DateTime date)
        {
            return  _context.Entries
                    .Where(x => x.SubmittedDateTime.Date == date.Date)
                    .ToList();
        }

        public DiaryEntry UpdateEntry(DateTime date)
        {
            return new DiaryEntry() { };
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

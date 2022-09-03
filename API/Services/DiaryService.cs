using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using API.Helpers.Interfaces;
using API.model;
using API.Helpers.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers.Services
{
    public class DiaryService : IDiaryService
    {
        private readonly DataContext _context;
        private readonly ILogger<DiaryService> _logger;
        private readonly IMapper _mapper;

        public DiaryService(
            DataContext dataContext,
            ILogger<DiaryService> logger,
            IMapper mapper
        )
        {
            _context = dataContext;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<PostDiaryEntryDto> AddNewEntries(PostDiaryEntryDto newEntry)
        {
            _logger.LogInformation($"AddNewEntries() Service method Executed with argument - {newEntry}");

            if (newEntry.UserID == Guid.Empty)
            {
                throw new ArgumentException("No Such User Found!");
            }

            var userDetails = await GetEntryForUserByDateTime(newEntry.UserID, newEntry.SubmittedDateTime.Date);

            if (userDetails.Entries.Count > 0)
            {
                var entry = await UpdateEntry(userDetails.Entries.FirstOrDefault(), newEntry);
                return entry;
            }
        
            var newerEntry = _mapper.Map<PostDiaryEntryDto, DiaryEntry>(newEntry);

            _context.Entries.Add(newerEntry);
            await _context.SaveChangesAsync();

            return newEntry;
        }

        public async Task<DiaryEntryResponseDto> GetEntryByDate(DateTime date)
        {
            _logger.LogInformation($"GetEntryByDate() Service method Executed with argument - {date}");

            var entry = await Task.Run(() => _context.Entries
                              .Where(e => e.SubmittedDateTime.Date == date.Date)
                              .FirstOrDefault());

            if (entry == null)
            {
                return new DiaryEntryResponseDto();
            }

            var userID = entry.UserID;

            var user = await Task.Run(() => _context.User
                    .Where(x => x.UserID == userID)
                    .FirstOrDefault());

            return new DiaryEntryResponseDto()
            {
                Email = user.Email,
                UserName = user.UserName,
                DiaryEntry = entry
            };
        }

        public async Task<IEnumerable<DiaryEntry>> SearchEntriesByContent(string content)
        {
            _logger.LogInformation($"SearchEntriesByContent() Service method Executed with argument - {content}");

            return await Task.Run(() => _context.Entries
                            .Where(x => x.Content.Contains(content))
                            .OrderBy(x => x.SubmittedDateTime)
                            .ToList());
        }

        private async Task<PostDiaryEntryDto> UpdateEntry(DiaryEntry entry, PostDiaryEntryDto newEntry)
        {
            var dbDiaryEntry = await _context.Entries.FindAsync(entry.EntryID);

            if (dbDiaryEntry.EntryID == Guid.Empty)
            {
                return null;
            }

            dbDiaryEntry.Content = newEntry.Content;

            await _context.SaveChangesAsync();

            return new PostDiaryEntryDto()
            {
                UserID = dbDiaryEntry.UserID,
                Content = dbDiaryEntry.Content,
                SubmittedDateTime = dbDiaryEntry.SubmittedDateTime
            };
        }

        private async Task<User> GetEntryForUserByDateTime(Guid UserID, DateTime SubmittedDate)
        {
            _logger.LogInformation($"GetEntryForUserByDateTime() Service method Executed with argument - {UserID} & {SubmittedDate}");

            return await Task.Run(() => _context.User
                .Include(i => i.Entries.Where(e => e.SubmittedDateTime.Date == SubmittedDate))
                .FirstOrDefault(u => u.UserID == UserID));
        }
    }
}

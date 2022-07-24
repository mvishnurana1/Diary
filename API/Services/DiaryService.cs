using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using API.Helpers.Interfaces;
using API.model;
using API.Helpers.Entities;

namespace API.Helpers.Services
{
    public class DiaryService : IDiaryService
    {
        private readonly DataContext _context;
        private readonly ILogger<DiaryService> _logger;
        private readonly IUserRespository _userRespository;

        public DiaryService(
            DataContext dataContext,
            ILogger<DiaryService> logger,
            IUserRespository userRespository
        )
        {
            _context = dataContext;
            _logger = logger;
            _userRespository = userRespository;
        }

        public async Task<PostDiaryEntryDto> AddNewEntries(PostDiaryEntryDto newEntry)
        {
            _logger.LogInformation($"AddNewEntries() Service method Executed with argument - {newEntry}");

            var entry = await GetEntryByDate(newEntry.SubmittedDateTime.Date);

            if (entry.DiaryEntry != null)
            {
                await DeleteEntry(entry.DiaryEntry);
            }

            var userID = newEntry.UserID;

            var user = await _userRespository.GetUserByID(userID);

            if (user == null)
            {
                throw new ArgumentException("User not Found!");
            }

            var newerEntry = new DiaryEntry()
            {
                UserID = userID,
                Content = newEntry.Content,
                SubmittedDateTime = newEntry.SubmittedDateTime.Date
            };

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

        private async Task DeleteEntry(DiaryEntry entry)
        {
            _logger.LogInformation($"DeleteEntry() Service method Executed with argument - {entry}");

            await Task.Run(() => _context.Entries.Remove(entry));
        }
    }
}

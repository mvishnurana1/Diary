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
        private readonly IUserRespository _userRespository;
        private readonly IMapper _mapper;

        public DiaryService(
            DataContext dataContext,
            ILogger<DiaryService> logger,
            IUserRespository userRespository,
            IMapper mapper
        )
        {
            _context = dataContext;
            _logger = logger;
            _userRespository = userRespository;
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
                await DeleteEntry(userDetails.Entries.FirstOrDefault());
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

        private async Task<User> GetEntryForUserByDateTime(Guid UserID, DateTime SubmittedDate)
        {
            _logger.LogInformation($"GetEntryForUserByDateTime() Service method Executed with argument - {UserID} & {SubmittedDate}");

            return await Task.Run(() => _context.User
                .Include(i => i.Entries.Where(e => e.SubmittedDateTime.Date == SubmittedDate))
                .FirstOrDefault(u => u.UserID == UserID));
        }

        private async Task<DiaryEntry> GetDiaryEntryByID(Guid EntryID)
        {
            return await Task.Run(() => _context.Entries.FirstOrDefaultAsync(e => e.EntryID == EntryID));
        }

        private async Task DeleteEntry(DiaryEntry entry)
        {
            _logger.LogInformation($"DeleteEntry() Service method Executed with argument - {entry}");

            await Task.Run(() => _context.Entries.Remove(entry));
        }
    }
}

using System;
using AutoMapper;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using API.model;
using API.Helpers.Entities;

namespace API.Helpers.Services
{
    public interface IDiaryService
    {
        Task<PostDiaryEntryDto> AddNewEntries(PostDiaryEntryDto newEntry);
        Task<string> GetEntryByDate(GetDiaryEntryByDateRequestDto request);
        Task<IEnumerable<DiaryEntry>> SearchEntriesByContent(string content);
    }

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

            var parsedDate = DateTime.Parse(newEntry.SubmittedDateTime);
            var userDetails = await GetResponsibleUserDetails(newEntry.UserID, parsedDate.Date);

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

        public async Task<string> GetEntryByDate(GetDiaryEntryByDateRequestDto request)
        {
            _logger.LogInformation($"GetEntryByDate() Service method Executed with argument - {request.Date}");

            var entry = await Task.Run(() => _context.Entries
                              .Where(e => e.SubmittedDateTime.Date == request.Date.Date)
                              .Where(e => e.UserID == request.UserID)
                              .FirstOrDefault());

            if (request.UserID == entry?.UserID)
            {
                return entry.Content;
            }

            return "";
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
                SubmittedDateTime = dbDiaryEntry.SubmittedDateTime.Date.ToString()
            };
        }

        private async Task<User> GetResponsibleUserDetails(Guid UserID, DateTime SubmittedDate)
        {
            _logger.LogInformation($"GetResponsibleUserDetails() Service method Executed with argument - {UserID} & {SubmittedDate}");

            return await Task.Run(() => _context.User
                .Include(i => i.Entries.Where(e => e.SubmittedDateTime.Date == SubmittedDate))
                .FirstOrDefault(u => u.UserID == UserID));
        }
    }
}

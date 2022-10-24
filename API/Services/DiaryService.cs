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
        Task<PostDiaryEntryDto> AddNewEntries(PostDiaryEntryDto newEntry, DateTime date);
        Task<string> GetEntryContentByDate(GetDiaryEntryByDateRequestDto request);
        Task<IEnumerable<SearchByContentResponseDto>> SearchEntriesByContent(SearchViaContentRequestDto request);
        Task<IEnumerable<DateTime>> GetAllDatesWithEntriesForUser(Guid loggedInUserID);
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

        public async Task<IEnumerable<DateTime>> GetAllDatesWithEntriesForUser(Guid loggedInUserID)
        {
            return await Task.Run(() => _context.Entries.Where(e => e.User.UserID == loggedInUserID)
                                                        .Select(e => e.SubmittedDateTime));
        }

        public async Task<PostDiaryEntryDto> AddNewEntries(PostDiaryEntryDto newEntry, DateTime date)
        {
            _logger.LogInformation($"AddNewEntries() Service method Executed with argument - {newEntry}");

            if (newEntry.UserID == Guid.Empty)
            {
                throw new ArgumentException("No Such User Found!");
            }

            var user = await Task.Run(() => _context.User.FirstOrDefault(user => user.UserID == newEntry.UserID));

            if (!String.IsNullOrEmpty(user.Email))
            {
                var fetchedEntry = await Task.Run(() => _context.Entries.Where(e => (e.User.UserID == newEntry.UserID))
                                                                        .FirstOrDefault(e => e.SubmittedDateTime == date));
                if (!String.IsNullOrEmpty(fetchedEntry?.Content))
                {
                    fetchedEntry.Content = newEntry.Content;

                    _context.Entries.Update(fetchedEntry);
                    await _context.SaveChangesAsync();

                    return _mapper.Map<DiaryEntry, PostDiaryEntryDto>(fetchedEntry);
                } else
                {
                    var entry = new DiaryEntry()
                    {
                        Content = newEntry.Content,
                        EntryID = Guid.NewGuid(),
                        SubmittedDateTime = DateTime.Parse(newEntry.SubmittedDateTime),
                        User = user,
                    };

                    _context.Entries.Add(entry);
                    await _context.SaveChangesAsync();

                    return _mapper.Map<DiaryEntry, PostDiaryEntryDto>(entry);
                }
            }

            return null;
        }

        public async Task<string> GetEntryContentByDate(GetDiaryEntryByDateRequestDto request)
        {
            _logger.LogInformation($"GetEntryContentByDate() Service method Executed with argument - {request.Date}");

            var fetchedUser = await Task.Run(() => _context.User.Where(u => u.UserID == request.UserID).FirstOrDefault());

            var entry = await Task.Run(() => _context.Entries
                                  .Where(e => e.SubmittedDateTime.Date == request.Date.Date)
                                  .Where(e => e.User.UserID == request.UserID)
                                  .FirstOrDefault());
            
            if (entry != null)
            {
                if (request.UserID == fetchedUser.UserID)
                {
                    return entry.Content;
                }
            }

            return "";
        }

        public async Task<IEnumerable<SearchByContentResponseDto>> SearchEntriesByContent(SearchViaContentRequestDto request)
        {
            _logger.LogInformation($"SearchEntriesByContent() Service method Executed with argument - {request.Content}");

            var entryList = await Task.Run(() => _context.Entries
                              .Where(x => x.Content.Contains(request.Content))
                              .Where(x => x.User.UserID == request.UserID)
                              .OrderBy(x => x.SubmittedDateTime)
                              .ToList());

            return _mapper.Map<List<DiaryEntry>, List<SearchByContentResponseDto>>(entryList);
        }
    }
}

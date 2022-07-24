using API.Helpers.Entities;
using API.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Helpers.Interfaces
{
    public interface IDiaryService
    {
        Task<DiaryEntry> AddNewEntries(DiaryEntry newEntry);
        Task<DiaryEntryResponseDto> GetEntryByDate(DateTime date);
        Task<IEnumerable<DiaryEntry>> SearchEntriesByContent(string content);
    }
}

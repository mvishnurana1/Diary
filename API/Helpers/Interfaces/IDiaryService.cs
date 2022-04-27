using API.Helpers.Entities;
using API.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Interfaces
{
    public interface IDiaryService
    {
        Task<DiaryEntry> AddNewEntries(DiaryEntry newEntry);
        IQueryable<DiaryEntry> GetEntryByDate(DateTime date);
        bool DeleteEntry(DiaryEntry entry);
        IEnumerable<DiaryEntry> SearchEntriesByContent(string content);
        Task<DiaryEntry> UpdateEntry(DateTime date, DiaryEntry newContent);
    }
}

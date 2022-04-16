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
        IEnumerable<DiaryEntry> GetEntryByDate(DateTime date);
        DiaryEntry UpdateEntry(DateTime date);
        DiaryEntry DeleteEntryByDate(DateTime date);
        DiaryEntry DeleteEntryByID(DateTime date);
        IEnumerable<DiaryEntry> SearchEntriesByContent(string content);
    }
}

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
        DiaryEntry AddNewEntries(PostDiaryEntry newEntry);
        IEnumerable<DiaryEntry> GetEntryByDate(DateTime date);
        DiaryEntry UpdateEntry(DateTime date);
        DiaryEntry DeleteEntry(DateTime date);
        IEnumerable<DiaryEntry> SearchEntriesByContext(string content);
    }
}

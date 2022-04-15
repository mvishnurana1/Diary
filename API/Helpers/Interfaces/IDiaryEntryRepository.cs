using API.Helpers.Entities;
using API.model;
using System;
using System.Collections.Generic;

namespace API.Helpers.Interfaces
{
    interface IDiaryEntryRepository
    {
        DiaryEntry AddNewEntries(PostDiaryEntry newEntry);
        DiaryEntry GetEntryByDate(DateTime date);
        DiaryEntry UpdateEntry(DateTime date);
        DiaryEntry DeleteEntry(DateTime date);
        IEnumerable<DiaryEntry> SearchEntriesByContext(string content);
    }
}

using API.model;
using System;

namespace API.Helpers.Entities
{
    public class DiaryEntryResponseDto
    {
        public Guid EntryID { get; set; }
        public Guid UserID { get; set; }
        public DateTime SubmittedDateTime { get; set; }
        public string Content { get; set; }
    }
}

using System;
using System.ComponentModel.DataAnnotations;

namespace API.model
{
    public class DiaryEntry
    {
        [Key]
        public Guid EntryID { get; set; } = new Guid();
        public DateTime SubmittedDateTime { get; set; }
        public string Content { get; set; }
    }
}

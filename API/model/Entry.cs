using System;

namespace API.model
{
    public class Entry
    {
        public Guid EntryID { get; set; }
        public DateTime SubmittedDateTime { get; set; }
        public string Content { get; set; }
    }
}

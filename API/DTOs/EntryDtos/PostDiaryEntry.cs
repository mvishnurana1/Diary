using System;

namespace API.Helpers.Entities
{
    public class PostDiaryEntry
    {
        public DateTime SubmittedDateTime { get; set; } = new DateTime();
        public string Content { get; set; }
    }
}

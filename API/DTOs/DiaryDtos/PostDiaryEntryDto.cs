using System;

namespace API.Helpers.Entities
{
    public class PostDiaryEntryDto
    {
        public Guid UserID { get; set; }
        public string Content { get; set; }
        public DateTime SubmittedDateTime { get; set; }
    }
}

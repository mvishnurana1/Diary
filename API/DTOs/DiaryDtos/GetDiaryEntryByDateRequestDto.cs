using System;

namespace API.Helpers.Entities
{
    public class GetDiaryEntryByDateRequestDto
    {
        public Guid UserID { get; set; }
        public DateTime Date { get; set; }
    }
}

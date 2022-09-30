using System;

namespace API.Helpers.Entities
{
    public class SearchViaContentRequestDto
    {
        public Guid UserID { get; set; }
        public string Content { get; set; }
    }
}

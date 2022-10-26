using System;

namespace API.DTOs.Priority
{
    public class PriorityResponseDto
    {
        public Guid ID { get; set; }
        public string PriorityContent { get; set; }
        public DateTime Month { get; set; }
    }
}

using System;

namespace API.DTOs.Priority
{
    public class PriorityDto
    {
        public Guid UserID { get; set; }
        public string Month { get; set; }
        public string PriorityContent { get; set; }
    }
}

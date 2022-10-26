using System;

namespace API.DTOs.Priority
{
    public class RemovePriorityDto
    {
        public Guid UserID { get; set; }
        public Guid ID { get; set; }
    }
}

using System;
using System.ComponentModel.DataAnnotations;

namespace API.model
{
    public class DailyTodo
    {
        [Key]
        public Guid ID { get; set; } = new Guid();

        [Required]
        public DateTime DateCreated { get; set; }

        [Required]
        public bool Completed { get; set; }

        [Required]
        public Guid UserID { get; set; }

        [Required]
        public string TodoContent { get; set; }
        public DateTime? DateCompleted { get; set; }
    }
}

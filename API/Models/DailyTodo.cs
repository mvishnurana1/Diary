using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.model
{
    public class DailyTodo
    {
        [Key]
        public Guid ID { get; set; } = new Guid();

        [Required]
        public DateTime DateDue { get; set; }

        [Required]
        public bool Completed { get; set; }

        [ForeignKey("UserID")]
        public User User { get; set; }

        [Required]
        public string TodoContent { get; set; }
    }
}

﻿namespace API.model
{
    public class DailyTodo
    {
        [Key]
        public Guid ID { get; set; } = new Guid();

        [Required]
        public DateTime DateDue { get; set; }

        [Required]
        public bool Completed { get; set; }

        [Required]
        public Guid UserID { get; set; }

        [Required]
        public string TodoContent { get; set; }
    }
}
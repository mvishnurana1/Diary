﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.model
{
    public class User
    {
        [Key]
        public Guid UserID { get; set; } = new Guid();

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        public ICollection<DiaryEntry> Entries { get; set; } = new List<DiaryEntry>();
        public ICollection<DailyTodo> Todos { get; set; } = new List<DailyTodo>();
        public ICollection<Priority> MonthPriorities { get; set; } = new List<Priority>();
        public ICollection<ToDoPerformance> DailyToDoPerformance { get; set; } = new List<ToDoPerformance>();
    }
}

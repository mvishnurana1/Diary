using System;
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

    public class OAuth0User
    {
        public string GivenName { get; set; }
        public string Sub { get; set; }
        public string FamilyName { get; set; }
        public string NickName { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public string Locale { get; set; }
        public string UpdatedAt { get; set; }
        public string Email { get; set; }
        public string EmailVerified { get; set; }
    }
}

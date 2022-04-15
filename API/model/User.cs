using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.model
{
    public class User
    {
        [Key]
        public Guid UserID { get; set; } = new Guid();
        public string UserName { get; set; }
        public ICollection<DiaryEntry> Entries { get; set; } = new List<DiaryEntry>();
    }
}

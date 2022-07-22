using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.model
{
    public class User
    {
        [Key]
        public Guid ID { get; set; } = new Guid();

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        public ICollection<DiaryEntry> Entries { get; set; } = new List<DiaryEntry>();
    }
}

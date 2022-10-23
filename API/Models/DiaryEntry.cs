using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.model
{
    public class DiaryEntry
    {
        [Key]
        public Guid EntryID { get; set; } = new Guid();

        [ForeignKey("UserID")]
        public User User { get; set; }

        [Required]
        public DateTime SubmittedDateTime { get; set; }

        public string Content { get; set; }
    }
}

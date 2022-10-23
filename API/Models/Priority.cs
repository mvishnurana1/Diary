using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.model
{
    public class Priority
    {
        [Key]
        public Guid ID { get; set; } = new Guid();

        [Required]
        [ForeignKey("UserID")]
        public User User { get; set; }

        [Required]
        public DateTime Month { get; set; }

        [Required]
        public string PriorityContent { get; set; }
    }
}

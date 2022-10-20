namespace API.model
{
    public class Priority
    {
        [Key]
        public Guid ID { get; set; } = new Guid();

        [Required]
        public Guid UserID { get; set; }

        [Required]
        public DateTime Month { get; set; }

        [Required]
        public string PriorityContent { get; set; }
    }
}

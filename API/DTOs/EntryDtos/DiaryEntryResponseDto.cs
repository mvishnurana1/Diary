using API.model;

namespace API.Helpers.Entities
{
    public class DiaryEntryResponseDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public DiaryEntry DiaryEntry { get; set; }
    }
}

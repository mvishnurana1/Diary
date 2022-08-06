using AutoMapper;
using API.model;
using API.Helpers.Entities;

namespace API.Mappings.DiaryProfiles
{
    public class PostDiaryEntryDtoToDiaryEntry : Profile
    {
        public PostDiaryEntryDtoToDiaryEntry()
        {
            CreateMap<PostDiaryEntryDto, DiaryEntry>();
        }
    }
}

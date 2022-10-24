using AutoMapper;
using API.model;
using API.Helpers.Entities;

namespace API.Mappings.DiaryProfiles
{
    public class DiaryEntryToPostDiaryEntryDto : Profile
    {
        public DiaryEntryToPostDiaryEntryDto()
        {
            CreateMap<PostDiaryEntryDto, DiaryEntry>();
        }
    }
}

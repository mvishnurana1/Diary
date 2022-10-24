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

    public class DiaryEntryToPostDiaryEntry : Profile
    {
        public DiaryEntryToPostDiaryEntry()
        {
            CreateMap<DiaryEntry, PostDiaryEntryDto>()
                .ForMember(x => x.UserID, o => o.MapFrom(s => s.User.UserID));
        }
    }

    public class DiaryEntryToSearchByContentResponseDto : Profile
    {
        public DiaryEntryToSearchByContentResponseDto()
        {
            CreateMap<DiaryEntry, SearchByContentResponseDto>();
        }
    }
}

using AutoMapper;
using API.model;
using API.Helpers.Entities;

namespace API.Mappings.DiaryProfiles
{
    public class DiaryEntryResponseDtoToDiaryEntry : Profile
    {
        public DiaryEntryResponseDtoToDiaryEntry()
        {
            CreateMap<DiaryEntryResponseDto, DiaryEntry>();
        }
    }
}

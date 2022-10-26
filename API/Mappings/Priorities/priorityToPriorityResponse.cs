using API.DTOs.Priority;
using API.model;
using AutoMapper;

namespace API.Mappings.Priorities
{
    public class priorityToPriorityResponse : Profile
    {
        public priorityToPriorityResponse()
        {
            CreateMap<Priority, PriorityResponseDto>();
        }
    }
}

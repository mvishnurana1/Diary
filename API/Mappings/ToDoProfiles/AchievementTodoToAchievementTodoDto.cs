using API.DTOs.AchivementDtos;
using API.model;
using AutoMapper;

namespace API.Mappings.ToDoProfiles
{
    public class AchievementTodoToAchievementTodoDto : Profile
    {
        public AchievementTodoToAchievementTodoDto()
        {
            CreateMap<ToDoPerformance, AchievementTodoDto>();
        }
    }
}

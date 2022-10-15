using API.DTOs.Users;
using API.model;
using AutoMapper;

namespace API.Mappings.UserProfies
{
    public class UserResponseDtoProfieToProfile : Profile 
    {
        public UserResponseDtoProfieToProfile()
        {
            CreateMap<UserResponseDto, User>();
        }
    }
}

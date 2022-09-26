using API.DTOs.Users;
using API.model;
using AutoMapper;

namespace API.Mappings.UserProfies
{
    public class UserToUserResponseDtoProfie : Profile
    {
        public UserToUserResponseDtoProfie()
        {
            CreateMap<User, UserResponseDto>();
        }
    }
}

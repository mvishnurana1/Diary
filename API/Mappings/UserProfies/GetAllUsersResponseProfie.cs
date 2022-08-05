using API.DTOs.Users;
using API.model;
using AutoMapper;

namespace API.Mappings.UserProfies
{
    public class GetAllUsersResponseProfie : Profile
    {
        public GetAllUsersResponseProfie()
        {
            CreateMap<User, GetAllUsersResponsedDto>();
        }
    }
}

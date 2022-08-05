using System;

namespace API.DTOs.Users
{
    public class GetAllUsersResponsedDto
    {
        public Guid UserID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}

using API.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Helpers.Interfaces
{
    public interface IUserRespository
    {
        Task<User> GetUserByID(Guid userId);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> FindUserByName(string userName);
    }
}

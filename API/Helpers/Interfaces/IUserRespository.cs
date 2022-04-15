using API.model;
using System;
using System.Collections.Generic;

namespace API.Helpers.Interfaces
{
    interface IUserRespository
    {
        User GetUserByID(Guid id);
        IEnumerable<User> GetAllUsers();
        IEnumerable<User> FindUserByName(string userName);
    }
}

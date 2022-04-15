using API.Helpers.Interfaces;
using API.model;
using System;
using System.Collections.Generic;

namespace API.Helpers.Services
{
    public class UserService : IUserRespository
    {
        public IEnumerable<User> FindUserByName(string userName)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> GetAllUsers()
        {
            throw new NotImplementedException();
        }

        public User GetUserByID(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}

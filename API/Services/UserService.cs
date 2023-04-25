using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using API.model;

namespace API.Helpers.Services
{
    public interface IUserService
    {
        Task<User> GetUserByID(Guid userId);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> FindUserByName(string userName);
        Task<bool> DoesUserExist(Guid userID);
    }

    public partial class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(
            DataContext dataContext,
            ILogger<UserService> logger
        )
        {
            _context = dataContext;
            _logger = logger;
        }

        public async Task<User> FindUserByName(string userName)
        {
            _logger.LogInformation($"FindUserByName() Service method Executed with argument - {userName}");

            return await Task.Run(() => _context.User
                    .Where(x => x.UserName == userName)
                    .ToList()
                    .FirstOrDefault());
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            _logger.LogInformation($"GetAllUsers() Service method Executed");

            return  await Task.Run(() => _context.User);
        }

        public async Task<User> GetUserByID(Guid userId)
        {
            _logger.LogInformation($"GetUserByID() Service method Executed with argument - {userId}");

            return await Task.Run(() => _context.User
                    .Where(x => x.UserID == userId)
                    .ToList()
                    .FirstOrDefault());
        }

        public async Task<bool> DoesUserExist(Guid userID)
        {
            var user = await Task.Run(() => _context.User.Where(u => u.UserID == userID).FirstOrDefault());

            if (!String.IsNullOrEmpty(user.UserID.ToString()))
            {
                return true;
            }

            return false;
        }
    }
}

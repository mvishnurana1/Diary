using System;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using API.DTOs.Users;
using API.model;

namespace API.Helpers.Services
{
    public interface IAuthService
    {
        Task<UserResponseDto> GetLoggedInUser(string token);
    }

    public class AuthService : IAuthService
    {
        private readonly DataContext _context;

        public AuthService(
            DataContext context
        )
        {
            _context = context;
        }

        public async Task<UserResponseDto> GetLoggedInUser(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                var email = jsonToken.Claims.First(x => x.Type == "email").Value;

                var user = await Task.Run(() => _context.User
                                                        .Where(x => x.Email == email)
                                                        .ToList()
                                                        .FirstOrDefault());

                if (user == null)
                {
                    var createdUser = await CreateUser(token);

                    return createdUser;
                }

                var loggedInUser = new UserResponseDto()
                {
                    Email = user.Email,
                    UserID = user.UserID,
                    UserName = user.UserName
                };

                return loggedInUser;
            } catch(Exception)
            {
                return null;
            }
        }

        private async Task<UserResponseDto> CreateUser(string token)
        {
            try
            {
                // Read the token...
                // extract user information from the token...
                // Save it to the Database...
                // return the newly created user...
            } catch (Exception)
            {
                return null;
            }
            return await Task.Run(() => new UserResponseDto());
        }
    }
}

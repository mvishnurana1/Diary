using System;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using API.DTOs.Users;
using API.model;
using AutoMapper;

namespace API.Helpers.Services
{
    public interface IAuthService
    {
        Task<UserResponseDto> GetLoggedInUser(string token);
    }

    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AuthService(
            DataContext context,
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
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

                return _mapper.Map<UserResponseDto>(user);
            } catch(Exception)
            {
                return null;
            }
        }

        private async Task<UserResponseDto> CreateUser(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                var userName = jsonToken.Claims.First(x => x.Type == "nickname").Value;
                var email = jsonToken.Claims.First(x => x.Type == "email").Value;

                var newUser = new User() 
                { 
                    Email = email,
                    UserName = userName,
                };

                await _context.User.AddAsync(newUser);

                return _mapper.Map<UserResponseDto>(newUser);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}

using System;
using System.Threading.Tasks;
using API.DTOs.Users;
using API.model;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using Microsoft.Extensions.Configuration;

namespace API.Helpers.Services
{
    public interface IAuthService
    {
        Task<UserResponseDto> GetLoggedInUser(string token);
        Task<string> GetLoggedInUser();
    }

    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;
        public IConfiguration Configuration { get; }

        public AuthService(
            DataContext context,
            IMapper mapper,
            IHttpContextAccessor httpContext
        )
        {
            _context = context;
            _mapper = mapper;
            _httpContext = httpContext;
        }

        public async Task<UserResponseDto> GetLoggedInUser(string token)
        {
            try
            {
                var user = new User();
                HttpClient client = new HttpClient();
                var url = client.GetAsync($"{Configuration["Auth0:Issuer"]}", new HttpCompletionOption());
                //var handler = new JwtSecurityTokenHandler();
                //var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                //var email = jsonToken.Claims.First(x => x.Type == "email").Value;
                //var userName = jsonToken.Claims.First(x => x.Type == "nickname").Value;

                //var user = await Task.Run(() => _context.User
                //                                        .Where(x => x.Email == email)
                //                                        .ToList()
                //                                        .FirstOrDefault());

                //if (user == null)
                //{
                //    var createdUser = await CreateUser(email, userName);

                //    return createdUser;
                //}
                return _mapper.Map<UserResponseDto>(user);
            } catch(Exception)
            {
                return null;
            }
        }

        public async Task<string> GetLoggedInUser()
        {
            var x = _httpContext.HttpContext.Request.Headers.Authorization;


            return await Task.Run(() => "");
        }

        private async Task<UserResponseDto> CreateUser(string email, string userName)
        {
            try
            {
                var newUser = new User() 
                { 
                    Email = email,
                    UserName = userName,
                };

                await _context.User.AddAsync(newUser);
                await _context.SaveChangesAsync();

                return _mapper.Map<UserResponseDto>(newUser);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}

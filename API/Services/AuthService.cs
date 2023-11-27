using System;
using System.Threading.Tasks;
using API.DTOs.Users;
using API.model;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authentication;
using System.Net.Http;
using Microsoft.Extensions.Configuration;

namespace API.Helpers.Services
{
    public interface IAuthService
    {
        Task<UserResponseDto> GetLoggedInUser(string token);
        Task<string> GetLoggedInUser(string token, string x = null);
    }

    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;
        private readonly HttpClient _httpClient;
        public IConfiguration _configuration { get; }

        public AuthService(
            DataContext context,
            IMapper mapper,
            IHttpContextAccessor httpContext,
            HttpClient httpClient,
            IConfiguration configuration
        )
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _httpContext = httpContext;
            _httpClient = httpClient;
        }

        public async Task<UserResponseDto> GetLoggedInUser(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                var email = jsonToken.Claims.First(x => x.Type == "email").Value;
                var userName = jsonToken.Claims.First(x => x.Type == "nickname").Value;

                var user = await Task.Run(() => _context.User
                                                        .Where(x => x.Email == email)
                                                        .ToList()
                                                        .FirstOrDefault());

                if (user == null)
                {
                    var createdUser = await CreateUser(email, userName);

                    return createdUser;
                }
                return _mapper.Map<UserResponseDto>(user);
            } catch(Exception)
            {
                return null;
            }
        }

        public async Task<string> GetLoggedInUser(string token, string k)
        {
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            //HttpResponseMessage response = await _httpClient.GetAsync($"{_configuration["Auth0:Issuer"]}");
            HttpResponseMessage response = await _httpClient.GetAsync("https://dev-qq2tsu06.au.auth0.com/userinfo");
            if (response.IsSuccessStatusCode)
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                return apiResponse;
            } else
            {
                await Console.Out.WriteLineAsync("Something Went Wrong...!");
            }

            return "Something Went Wrong";
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

using API.DTOs.AuthDto;

namespace API.Helpers.Interfaces
{
    public interface IAuthService
    {
        void SignUp(SignUpDto signUpDetais);
        void Login(LoginDto details);
        void GetLoggedInUser();
        void DeleteAccount();
        void Logout();
    }
}

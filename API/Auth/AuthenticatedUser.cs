using API.model;

namespace API.Auth
{
    public interface IAuthenticatedUser
    {
        string Auth0Id { get; }

        User DbUser { get; set; }

        void Init(string auth0Id);
    }

    public class AuthenticatedUser : IAuthenticatedUser
    {
        public AuthenticatedUser() {}

        public string Auth0Id { get; private set; }

        public User DbUser { get; set; }

        public void Init(string auth0Id)
        {
            Auth0Id = auth0Id;
        }
    }
}

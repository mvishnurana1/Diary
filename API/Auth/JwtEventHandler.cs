using API.model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Auth
{
    public class JwtEventHandler : JwtBearerEvents
    {
        private readonly IAuthenticatedUser user;

        public JwtEventHandler(IAuthenticatedUser user)
        {
            this.user = user;
        }

        public override Task TokenValidated(TokenValidatedContext context)
        {
            var auth0Id = context.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(auth0Id)) user.Init(auth0Id);
            return base.TokenValidated(context);
        }
    }
}

using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Extensions
{
    //47. Adding extension methods
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServiceFromExtension(this IServiceCollection services, IConfiguration config)
        {
            // var builder = services.AddIdentityCore<AppUser>();

            // builder = new IdentityBuilder(builder.UserType, builder.Services);

            // builder.AddEntityFrameworkStores<AppIdentityDbContext>();

            // builder.AddSignInManager<SignInManager<AppUser>>();

            ////46. Adding the authentication middleware
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters{
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                        ValidIssuer = config["Token:Issuer"],
                        ValidateIssuer = true,
                        ValidateAudience = false
                    };
                });

            return services;
        }
    }
}
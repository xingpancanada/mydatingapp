using System.Text;
using Backend.Data;
using Backend.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Extensions
{
    //47. Adding extension methods
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServiceFromExtension(this IServiceCollection services, IConfiguration config)
        {
            //204. Configuring the startup class
            services.AddIdentityCore<AppUser>(opt =>{
                            opt.Password.RequireNonAlphanumeric = false;
                        })
                                .AddRoles<AppRole>()
                                .AddRoleManager<RoleManager<AppRole>>()
                                .AddSignInManager<SignInManager<AppUser>>()
                                .AddRoleValidator<RoleValidator<AppRole>>()
                                .AddEntityFrameworkStores<DataContext>();
           
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                    ValidIssuer = config["Token:Issuer"],
                    ValidateIssuer = true,
                    ValidateAudience = false
                };

                ////223. Authenticating to SignalR
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && 
                            path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

            //210. Adding policy based authorization
            services.AddAuthorization(opt => 
            {
                opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                opt.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
            });



            // var builder = services.AddIdentityCore<AppUser>();

            // builder = new IdentityBuilder(builder.UserType, builder.Services);

            // builder.AddEntityFrameworkStores<AppIdentityDbContext>();

            // builder.AddSignInManager<SignInManager<AppUser>>();

            ////46. Adding the authentication middleware
            // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //     .AddJwtBearer(options => {
            //         options.TokenValidationParameters = new TokenValidationParameters{
            //             ValidateIssuerSigningKey = true,
            //             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
            //             ValidIssuer = config["Token:Issuer"],
            //             ValidateIssuer = true,
            //             ValidateAudience = false
            //         };
            //     });

            return services;
        }
    }
}
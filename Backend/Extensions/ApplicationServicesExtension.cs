using API.Data;
using Backend.Data;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Repositories;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Backend.Extensions
{
    //47. Adding extension methods
    public static class ApplicationServicesExtension
    {
        public static IServiceCollection AddApplicationServicesFromExtension(this IServiceCollection services, IConfiguration config)
        {
            //128
            services.AddScoped<IPhotoService, PhotoService>();
            
            //127
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            //43.Adding token service
            services.AddScoped<ITokenService, TokenService>();

            //93
            services.AddScoped<IUserRepository, UserRepository>();

            //164. ADDING AN ACTION FILTER
            services.AddScoped<LogUserActivity>();

            //174.
            services.AddScoped<ILikesRepository, LikesRepository>();

            //184
            services.AddScoped<IMessageRepository, MessageRepository>();


            //13.Adding a DbContext class
            services.AddDbContext<DataContext>(options => {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });


            ////96. Adding AutoMapper
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);




            return services;
        }
    }
}
using Backend.Data;
using Backend.Interfaces;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Backend.Extensions
{
    //47. Adding extension methods
    public static class ApplicationServicesExtension
    {
        public static IServiceCollection AddApplicationServicesFromExtension(this IServiceCollection services, IConfiguration config)
        {
            //43.Adding token service
            services.AddScoped<ITokenService, TokenService>();

            //13.Adding a DbContext class
            services.AddDbContext<DataContext>(options => {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });


            return services;
        }
    }
}
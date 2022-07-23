using System.Text;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Runtime.Serialization.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Backend.Entities;
using Backend.Data;

namespace Backend.Data
{
    public class Seed
    {
        ////90-91 Seeding data
        //public static async Task SeedUsers(DataContext context)
        ////206. Updating the seed method
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            //if(await context.Users!.AnyAsync()) return;  //return if data exists
            ////206. Updating the seed method
            if(await userManager.Users!.AnyAsync()) return;

            //read data 
            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");

            //transform data into List
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            if (users == null) return;

            ////208. Adding roles to the app
            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach(var user in users)
            {
                //using var hamc = new HMACSHA512();

                user.UserName = user.UserName?.ToLower();
                //user.PasswordHash = hamc.ComputeHash(Encoding.UTF8.GetBytes("Password123456"));
                //user.PasswordSalt = hamc.Key;

                //await context.Users!.AddAsync(user);
                ////206. Updating the seed method
                await userManager.CreateAsync(user, "Password123456");
                await userManager.AddToRoleAsync(user, "Member");
            }

            //await context.SaveChangesAsync();   ////should be here!!!!!!!

            ////206. Updating the seed method
            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Password123456");
            await userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});
        }
    }
}
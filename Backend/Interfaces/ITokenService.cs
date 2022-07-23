using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Interfaces
{
    public interface ITokenService
    {
        //209
        Task<string> CreateTokenAsync(AppUser user);
        //string CreateToken(AppUser user);
    }
}
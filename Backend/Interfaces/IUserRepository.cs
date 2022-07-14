using Backend.Controllers;
using Backend.DTOs;
using Backend.Entities;

namespace Backend.Interfaces
{
    ////93. Creating a repository
    public interface IUserRepository
    {
        void Update(AppUser user);

        Task<bool> SaveAllAsync();

        Task<IEnumerable<AppUser>> GetUsersAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserByUsernameAsync(string username);

        Task<IEnumerable<MemberDto>> GetMembersAsync();
        //Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);

        Task<MemberDto?> GetMemberAsync(string username);
    }
}
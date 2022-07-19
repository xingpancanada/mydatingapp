using Backend.Controllers;
using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;

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
        //156. Using paging class
        Task<PagedList<MemberDto>> GetMembersWithPagingAsync(UserParams userParams);

        Task<MemberDto?> GetMemberAsync(string username);
    }
}
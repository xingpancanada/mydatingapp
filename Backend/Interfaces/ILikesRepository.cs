using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;

namespace Backend.Interfaces
{
    //174
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);  //get Source and Liked details from ids
        Task<AppUser> GetUserWithLikes(int userId);

        // Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId);
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
    }
}
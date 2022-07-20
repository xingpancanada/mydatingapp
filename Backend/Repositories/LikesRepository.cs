using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    //174. Adding like repository
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            var result = await _context.Likes!.FindAsync(sourceUserId, likedUserId);
            return result!;
        }

        // public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId)
        // {
        //     var users = _context.Users.OrderBy(u => u.Username).AsQueryable();
        //     var likes = _context.Likes.AsQueryable();

        //     if (predicate == "liked")
        //     {
        //         likes = likes.Where(like => like.SourceUserId == userId);
        //         users = likes.Select(like => like.LikedUser);
        //     }

        //     if (predicate == "likedBy")
        //     {
        //         likes = likes.Where(like => like.LikedUserId == userId);
        //         users = likes.Select(like => like.SourceUser);
        //     }

        //     return await users.Select(user => new LikeDto{
        //         Username = user.Username,
        //         KnownAs = user.KnownAs,
        //         Age = user.DateOfBirth.CalculateAge(),
        //         PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
        //         City = user.City,
        //         Id = user.Id
        //         }).ToListAsync();
        // }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users!.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes!.AsQueryable();

            if (likesParams.Predicate == "liked")
            {
                //SourceUserId --> LikedUser
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.LikedUser)!;
            }

            if (likesParams.Predicate == "likedBy")
            {
                //LikeUserId --> SourceUser
                likes = likes.Where(like => like.LikedUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser)!;
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos!.FirstOrDefault(p => p.IsMain)!.Url,
                City = user.City,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreatePageAsync(likedUsers, 
                likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            var result = await _context.Users!
                .Include(x => x.LikedUsers)!
                .FirstOrDefaultAsync(x => x.Id == userId);

            return result!;
        }

        
    }
}
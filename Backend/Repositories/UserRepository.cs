using AutoMapper;
using AutoMapper.QueryableExtensions;
using Backend.Controllers;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        public readonly DataContext _context;

        public readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        ////another method to get data by sql cli without mapping, get value directly
        // public async Task<MemberDto?> GetMemberAsync(string username)
        // {
        //     return await _context.Users!
        //         .Where(x => x.Username == username)
        //         .Select(user => new MemberDto
        //             {
        //                 Id = user.Id,
        //                 UserName = user.Username
        //             })
        //         .SingleOrDefaultAsync();
        // }

        ////another method to get data with MAPPER by using ProjectTo
        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            // return await _context.Users!
            //     .Where(x => x.UserName == username)
            //     .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            //     .SingleOrDefaultAsync();

            ////because we need photo url resolver here
            var u = await this.GetUserByUsernameAsync(username);
            var user = _mapper.Map<MemberDto>(u);
            if(user.Photos != null){
                foreach(var photo in user.Photos){
                    if(photo.IsMain == true){
                        user.PhotoUrl = photo.Url;
                    }
                }
            }
            return user;
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
            // var users = await _context.Users
            //       .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)  ////not <IEnumerable<MemberDto>> here!!!!!!
            //       .ToListAsync();

            ////because we need photo url resolver here
            var us = await this.GetUsersAsync();
            var users = _mapper.Map<IEnumerable<MemberDto>>(us); 
            if(users.Count() > 0){
                foreach(var user in users){
                    if(user.Photos != null){
                        foreach(var photo in user.Photos){
                            if(photo.IsMain == true){
                                user.PhotoUrl = photo.Url;
                            }
                        }
                    }
                }
            }
            return users;
        }

        //156. use paging
        public async Task<PagedList<MemberDto>> GetMembersWithPagingAsync(UserParams userParams)
        {
            //159.Adding filtering to the API
            var query = _context.Users!.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);

            //160. Adding additional filters
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob =  DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            //163. Adding sorting functionality
            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            // return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
            return await PagedList<MemberDto>.CreatePageAsync(
                query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(), 
                userParams.PageNumber, 
                userParams.PageSize);
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            var user = await _context.Users!
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.Id == id);
                
            
            return user!;
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            var user =  await _context.Users!
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == username);

            return user!;
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            var users = await _context.Users!
                .Include(p => p.Photos)
                .ToListAsync();

            return users;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}
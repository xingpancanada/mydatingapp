using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    ////16. Adding a new API Controller and use DataContext
    // [ApiController]
    // [Route("api/[controller]")]
    public class UsersController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public UsersController(DataContext dataContext, IUserRepository userRepo, IMapper mapper, IConfiguration config)
        {
            _config = config;
            _mapper = mapper;
            _dataContext = dataContext;
            _userRepo = userRepo;
        }

        //[Authorize]
        //[AllowAnonymous]
        [HttpGet("members")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers()
        {
            var users = await _userRepo.GetMembersAsync();

            return Ok(users);
        }

        //[Authorize]
        [HttpGet("member/{name}")]
        public async Task<ActionResult<MemberDto>> GetMemberByName(string name)
        {
            var user = await _userRepo.GetMemberAsync(name);

            return Ok(user);
        }

        [Authorize]
        //[AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepo.GetUsersAsync();
            var usersReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(usersReturn);
        }

        [Authorize]
        [HttpGet("userid/{id}")]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var user = await _userRepo.GetUserByIdAsync(id);
            var userReturn = _mapper.Map<MemberDto>(user);
            return Ok(userReturn);
        }

        //[Authorize]
        [HttpGet("username/{username}")]
        public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
        {
            var user = await _userRepo.GetUserByUsernameAsync(username);
            var userReturn = _mapper.Map<MemberDto>(user);
            return Ok(userReturn);
        }
    }
}
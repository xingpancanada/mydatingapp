using Backend.Extensions;
using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        private readonly IPhotoService _photoService;

        public UsersController(
            DataContext dataContext, 
            IUserRepository userRepo, 
            IMapper mapper, 
            IConfiguration config,
            IPhotoService photoService)
        {
            _config = config;
            _photoService = photoService;
            _mapper = mapper;
            _dataContext = dataContext;
            _userRepo = userRepo;
        }


        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUserName());

            var photo = user.Photos!.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos!.Remove(photo);

            if (await _userRepo.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the photo");
        }


        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUserName());

            var photo = user.Photos!.FirstOrDefault(x => x.Id == photoId);

            if (photo!.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.Photos!.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _userRepo.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }


        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){
            var username = User.GetUserName();
            var user = await _userRepo.GetUserByUsernameAsync(username);

            if(user == null) return BadRequest("no user");

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null){
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo{
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos == null){
                photo.IsMain = true;
            }

            user.Photos?.Add(photo);

            if (await _userRepo.SaveAllAsync())
            {
                //return _mapper.Map<PhotoDto>(photo);

                ////!!!!add photo and save into user!!!!
                return CreatedAtRoute("GetUser", new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo!");
        }


        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //use ClaimsPrincipleExtensions
            var username = User.GetUserName();

            if(username != null){
                var user = await _userRepo.GetUserByUsernameAsync(username);
                
                _mapper.Map(memberUpdateDto, user);

                _userRepo.Update(user);

                if(await _userRepo.SaveAllAsync()) return NoContent();
            }

            return BadRequest("Failed to update user.");
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
        //[AllowAnonymous]
        [HttpGet("memberswithpaging")]
        ////USE [FromQuery], it is query parameter binding, otherwise error: unsupported media type //156
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembersWithPagingAsync([FromQuery]UserParams userParams)
        {
            //159
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUserName());
            userParams.CurrentUsername = user.UserName;

            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender = user.Gender == "male" ? "female" : "male";
            }

            //156
            var users = await _userRepo.GetMembersWithPagingAsync(userParams);

            //156
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }

        //[Authorize]
        [HttpGet("member/{name}")]
        public async Task<ActionResult<MemberDto>> GetMemberByName(string name)
        {
            var user = await _userRepo.GetMemberAsync(name);

            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
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
        [HttpGet("username/{username}", Name = "getUser")]  //Name="getUser" for CreatedAtRoute 131
        public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
        {
            var user = await _userRepo.GetUserByUsernameAsync(username);
            var userReturn = _mapper.Map<MemberDto>(user);
            return Ok(userReturn);
        }
    }
}
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Backend.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;

        public AccountController(
            DataContext dataContext, 
            ITokenService tokenService,
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            IMapper mapper
        )
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _dataContext = dataContext;
        }

        /////Hash & Salt: 34-41

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //var user = await _dataContext.Users!.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName == loginDto.UserName);
            
            //207
            var user = await _userManager.Users!.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName == loginDto.UserName!.ToLower());

            if (user == null)
            {
                return Unauthorized("Invalid username!");
            }

            // using var hmac = new HMACSHA512(user.PasswordSalt!);
            // var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password!));

            // for (int i = 0; i < computedHash.Length; i++)
            // {
            //     if (computedHash[i] != user.PasswordHash?[i])
            //     {
            //         return Unauthorized("Invalid password!");
            //     }
            // }

            //202////207
            var result = await _signInManager
                .CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized();

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateTokenAsync(user),
                PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username!))
            {
                return BadRequest("Username is taken!");
            }

            // using var hmac = new HMACSHA512();

            // var user = new AppUser
            // {
            //     UserName = registerDto.Username,
            //     PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password!)),
            //     PasswordSalt = hmac.Key
            // };

            // _dataContext.Users!.Add(user);
            // await _dataContext.SaveChangesAsync();


            //202. Setting up the entities
            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username!.ToLower();

            //207
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            //209
            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateTokenAsync(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExists(string username)
        {
            //202////207
            //return await _dataContext.Users!.AnyAsync(x => x.UserName == username.ToLower());
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}
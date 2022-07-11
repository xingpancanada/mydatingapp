using Backend.Data;
using Backend.Entities;
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

        public UsersController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        //[Authorize]
        //[AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await (_dataContext.Users!.ToListAsync()); 
            if(users != null){
                return users;
            }else{
                return BadRequest("No User Found");
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUserById(int id)
        {
            var user = await _dataContext.Users!.FindAsync(id);
            if(user != null){
                return user;
            }else{
                return BadRequest("No User Found");
            }
        }
    }
}
using Backend.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    ///164. Adding an action filter
    [ServiceFilter(typeof(LogUserActivity))]
    ////36. create a base API controller
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        
    }
}
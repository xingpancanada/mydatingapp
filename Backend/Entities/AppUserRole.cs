using Microsoft.AspNetCore.Identity;

namespace Backend.Entities
{
    //202
    public class AppUserRole : IdentityUserRole<int>
    {
        public AppUser? User { get; set; }
        
        public AppRole? Role { get; set; }
    }
}
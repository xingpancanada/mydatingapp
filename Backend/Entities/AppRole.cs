using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

//202. Setting up the entities
namespace Backend.Entities
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole>? UserRoles { get; set; }
    }
}
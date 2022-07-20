using Backend.Extensions;

namespace Backend.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        
        public string? UserName { get; set; }
        //public string? Email { get; set; }
        
        public byte[]? PasswordHash { get; set; }
        public byte[]? PasswordSalt { get; set; }

        public string? KnownAs { get; set; }

        public DateTime DateOfBirth { get; set; }

        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime LastActive { get; set; } = DateTime.Now;

        public string? Gender { get; set; }

        public string? Introduction { get; set; }

        public string? LookingFor { get; set; }

        public string? Interests { get; set; }

        public string? City { get; set; }

        public string? Country { get; set; }

        //one to many
        public ICollection<Photo>? Photos { get; set; }

        // //87  //99 delete and do it in AutoMapper Profiles
        // public int GetAge()
        // {
        //     return DateOfBirth.CalculateAge();
        // }

        //173. many to many 
        public ICollection<UserLike>? LikedByUsers { get; set; }
        public ICollection<UserLike>? LikedUsers { get; set; }
    }
}
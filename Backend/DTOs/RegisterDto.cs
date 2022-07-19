using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string? Username { get; set; }
        
        [Required]
        [MinLength(4), MaxLength(16)]
        public string? Password { get; set; }
         
    }
}
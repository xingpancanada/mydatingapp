using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    //88. Entity Framework Relationship
    [Table("Photos")]    //needn't do dbset<Photo>
    public class Photo
    {
        public int Id { get; set;}

        public string? Url { get; set; }

        public bool IsMain { get; set; }

        public string? PublicId { get; set; }


        //add below 2 lines: it will create model with delete cascade 
        //when delete AppUser, it delete related photos at the same time
        //many to one --> one to many
        public AppUser? AppUser { get; set; }
        
        public int AppUserId { get; set; }
    }
}
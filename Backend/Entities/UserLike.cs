namespace Backend.Entities
{
    //173
    public class UserLike
    {
       public AppUser? SourceUser { get; set; }  //the User that Liked
        public int SourceUserId { get; set; }

        public AppUser? LikedUser { get; set; }  //the User that is Liked By
        public int LikedUserId { get; set; }
    }
}
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<AppUser>? Users { get; set; }
        public DbSet<Photo>? Photos { get; set; }
        
        //173. many to many
        public DbSet<UserLike>? Likes { get; set; }


         protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //173. many to many
            //do HasKey here because UserLike doesn't have primary key
            builder.Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.LikedUserId });

            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)  //one SourceUser have many LikedUsers
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);
                // .OnDelete(DeleteBehavior.NoAction);  //for SQLServer

            builder.Entity<UserLike>()
                .HasOne(s => s.LikedUser)
                .WithMany(l => l.LikedByUsers)  //one LikedUser can be liked by many LikedByUsers
                .HasForeignKey(s => s.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade);
                // .OnDelete(DeleteBehavior.NoAction);  //for SQLServer
        }
    }
}
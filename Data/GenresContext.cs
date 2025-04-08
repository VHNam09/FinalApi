using Microsoft.EntityFrameworkCore;
using MovieApi.Entities;

namespace MovieApi.Data
{
    public class GenresContext : DbContext
    {
        public GenresContext(DbContextOptions<GenresContext> options)
        : base(options) { }



        //DbSet
        public DbSet<Users> Users { get; set; }
        public DbSet<Roles> Roles { get; set; } // 🆕 Thêm bảng Roles
        public DbSet<Movies> Movies { get; set; }
        public DbSet<Favorites> Favorites { get; set; }
        public DbSet<Genres> Genres { get; set; }
        public DbSet<MovieGenres> MovieGenres { get; set; }

        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MovieGenres>()
                .HasOne(mg => mg.Movie)
                .WithMany(m => m.MovieGenres)   
                .HasForeignKey(mg => mg.MovieId);

            modelBuilder.Entity<MovieGenres>()
                .HasOne(mg => mg.Genre)
                .WithMany(g => g.MovieGenres)
                .HasForeignKey(mg => mg.GenreId);


            modelBuilder.Entity<Comment>()
        .HasOne(c => c.User)
        .WithMany(u => u.Comments)
        .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Movie)
                .WithMany(m => m.Comments)
                .HasForeignKey(c => c.MovieId);
        }


    }
}

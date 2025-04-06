using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieApi.Entities
{
    public class Movies : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Đảm bảo Id tự động tăng    

        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ReleaseYear { get; set; }    
        public string Director { get; set; } = string.Empty;
        public string Actors { get; set; } = string.Empty;
        public int Duration { get; set; }
        public string Country { get; set; } = string.Empty;
        public string Poster { get; set; } = string.Empty;
        public string TrailerUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Danh sách người dùng đã yêu thích bộ phim này
        public ICollection<Favorites> Favorites { get; set; } = new List<Favorites>();
        public ICollection<MovieGenres> MovieGenres { get; set; } = new List<MovieGenres>();
 
    }



}

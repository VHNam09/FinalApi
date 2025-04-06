using MovieApi.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieApi.DTOs
{
    public class MovieWithGenresDto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Đảm bảo Id tự động tăng
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int ReleaseYear { get; set; }
        public string Director { get; set; }
        public string Country { get; set; }
        public string Actors { get; set; }  // Thêm thuộc tính Actors
        public string Poster { get; set; }
        public string TrailerUrl { get; set; }
        public int Duration { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<int> GenreIds { get; set; }



    }
}

namespace MovieApi.Dtos
{
    public class MovieWithGenresDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int ReleaseYear { get; set; }
        public string Director { get; set; }
        public string Poster { get; set; }
        public string TrailerUrl { get; internal set; }
        public int Duration { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> GenreIds { get; set; }
       
    }
}

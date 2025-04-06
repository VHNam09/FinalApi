namespace MovieApi.DTOs
{
    public class MovieDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<string> Genres { get; set; }
    }

}

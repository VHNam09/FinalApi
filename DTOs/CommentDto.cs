namespace MovieApi.DTOs
{
    public class CommentDto
    {
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

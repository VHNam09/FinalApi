namespace MovieApi.Entities
{
    public class Comment
    {
        public int Id { get; set; } // ID của bình luận

        public int UserId { get; set; } // Liên kết tới người dùng đã đăng bình luận
        public Users User { get; set; } // Thông tin người dùng

        public int MovieId { get; set; } // Liên kết tới bộ phim mà người dùng bình luận
        public Movies Movie { get; set; } // Thông tin phim

        public string Content { get; set; } // Nội dung bình luận

        public DateTime CreatedAt { get; set; }
    }
}

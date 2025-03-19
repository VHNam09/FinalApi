namespace MovieApi.Entities
{
    public class Favorites : BaseEntity
    {
        public int Id { get; set; } // [Id] INT IDENTITY(1,1) NOT NULL

        // Liên kết đến Users
        public int UserId { get; set; } // [UserId] INT NOT NULL
        public Users User { get; set; } // Navigation Property

        // Liên kết đến Movies
        public int MovieId { get; set; } // [MovieId] INT NOT NULL
        public Movies Movie { get; set; } // Navigation Property

        // Ngày thêm vào danh sách yêu thích
        public DateTime AddedAt { get; set; } = DateTime.UtcNow; // [AddedAt] DATETIME2(7) DEFAULT SYSUTCDATETIME()
    }

}

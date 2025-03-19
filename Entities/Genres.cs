namespace MovieApi.Entities
{
    public class Genres: BaseEntity
    {
        public int Id { get; set; } // [Id] INT IDENTITY(1,1) NOT NULL
        public string Name { get; set; } = string.Empty; // [Name] NVARCHAR(255) NOT NULL
        public string Description { get; set; } = string.Empty; // [Description] NVARCHAR(MAX) NOT NULL
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // [CreatedAt] DATETIME2(7) DEFAULT SYSUTCDATETIME()

        // Danh sách phim thuộc thể loại này (mối quan hệ nhiều-nhiều)
        public ICollection<MovieGenres> MovieGenres { get; set; } = new List<MovieGenres>();
    }

}

using System.Text.Json.Serialization;

namespace MovieApi.Entities
{
    public class MovieGenres:BaseEntity
    {
            public int Id { get; set; } // [Id] INT IDENTITY(1,1) NOT NULL
            public int MovieId { get; set; } // FK từ Movies
            
            public Movies Movie { get; set; } // Navigation Property

            public int GenreId { get; set; } // FK từ Genres
            public Genres Genre { get; set; } // Navigation Property
           


    }
}

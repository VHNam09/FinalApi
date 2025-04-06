using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.DTOs;
using MovieApi.Entities;

namespace MovieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly GenresContext _context;

        public MovieController(GenresContext context)
        {
            _context = context;
        }

        // API lấy danh sách phim kèm thể loại
        [HttpGet("with-genres")]
        public async Task<IActionResult> GetMoviesWithGenres()
        {
            var movies = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Select(m => new MovieWithGenresDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    ReleaseYear = m.ReleaseYear,
                    Director = m.Director,
                    Country = m.Country,
                    Actors = m.Actors,
                    Poster = m.Poster,
                    TrailerUrl = m.TrailerUrl,
                    Duration = m.Duration,
                    GenreIds = m.MovieGenres.Select(mg => mg.Genre.Id).ToList(),
         
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            // Chuẩn hóa dữ liệu trả về
            var result = new
            {
                id = movie.Id,
                title = movie.Title,
                description = movie.Description,
                releaseYear = movie.ReleaseYear,
                director = movie.Director,
                country = movie.Country,
                actors = movie.Actors,
                duration = movie.Duration,
                poster = movie.Poster,
                trailerUrl = movie.TrailerUrl,
                createdAt = movie.CreatedAt,
                genres = movie.MovieGenres.Select(mg => mg.Genre.Name).ToList()
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMovie([FromBody] MovieWithGenresDto movieDto)
        {
            if (movieDto == null)
                return BadRequest("Invalid movie data.");

            // Tạo phim mới
            var movie = new Movies
            {
                Title = movieDto.Title,
                Description = movieDto.Description,
                ReleaseYear = movieDto.ReleaseYear,
                Director = movieDto.Director,
                Country = movieDto.Country,
                Actors = movieDto.Actors,
                Duration = movieDto.Duration,
                Poster = movieDto.Poster,
                TrailerUrl = movieDto.TrailerUrl,
                CreatedAt = DateTime.UtcNow
            };

            // Thêm thể loại nếu có
            if (movieDto.GenreIds != null && movieDto.GenreIds.Any())
            {
                var genres = await _context.Genres
                    .Where(g => movieDto.GenreIds.Contains(g.Id))
                    .ToListAsync();

                movie.MovieGenres = genres.Select(g => new MovieGenres
                {
                    Movie = movie,
                    Genre = g
                }).ToList();
            }

            // Lưu vào database
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            // Trả về MovieDto để tránh lỗi vòng lặp tuần hoàn
            var movieResponse = new MovieWithGenresDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Description = movie.Description,
                ReleaseYear = movie.ReleaseYear,
                Director = movie.Director,
                Country = movie.Country,
                Actors = movie.Actors,
                Duration = movie.Duration,
                Poster = movie.Poster,
                TrailerUrl = movie.TrailerUrl,
                CreatedAt = movie.CreatedAt,
                GenreIds = movie.MovieGenres.Select(mg => mg.Genre.Id).ToList()
            };

            return CreatedAtAction(nameof(GetMovieById), new { id = movie.Id }, movieResponse);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] MovieWithGenresDto movieDto)
        {
            if (movieDto == null)
                return BadRequest("Invalid movie data.");

            if (id != movieDto.Id)
                return BadRequest("ID in URL does not match ID in movie data.");

            // Tìm phim cần cập nhật
            var existingMovie = await _context.Movies
                .Include(m => m.MovieGenres)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (existingMovie == null)
                return NotFound();

            // Cập nhật thông tin phim
            existingMovie.Title = movieDto.Title;
            existingMovie.Description = movieDto.Description;
            existingMovie.ReleaseYear = movieDto.ReleaseYear;
            existingMovie.Director = movieDto.Director;
            existingMovie.Country = movieDto.Country;
            existingMovie.Actors = movieDto.Actors;
            existingMovie.Duration = movieDto.Duration;
            existingMovie.Poster = movieDto.Poster;
            existingMovie.TrailerUrl = movieDto.TrailerUrl;

            // Xử lý thể loại
            if (movieDto.GenreIds != null)
            {
                // Xóa các thể loại hiện tại
                _context.MovieGenres.RemoveRange(existingMovie.MovieGenres);

                // Thêm thể loại mới nếu có
                if (movieDto.GenreIds.Any())
                {
                    var genres = await _context.Genres
                        .Where(g => movieDto.GenreIds.Contains(g.Id))
                        .ToListAsync();

                    existingMovie.MovieGenres = genres.Select(g => new MovieGenres
                    {
                        MovieId = existingMovie.Id,
                        GenreId = g.Id
                    }).ToList();
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
                    return NotFound();
                else
                    throw;
            }

            // Load lại thông tin đầy đủ để trả về
            var updatedMovie = await _context.Movies
                .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                .FirstOrDefaultAsync(m => m.Id == id);

            var movieResponse = new MovieWithGenresDto
            {
                Id = updatedMovie.Id,
                Title = updatedMovie.Title,
                Description = updatedMovie.Description,
                ReleaseYear = updatedMovie.ReleaseYear,
                Director = updatedMovie.Director,
                Country = updatedMovie.Country,
                Actors = updatedMovie.Actors,
                Duration = updatedMovie.Duration,
                Poster = updatedMovie.Poster,
                TrailerUrl = updatedMovie.TrailerUrl,
                CreatedAt = updatedMovie.CreatedAt,
                GenreIds = updatedMovie.MovieGenres.Select(mg => mg.Genre.Id).ToList()
            };

            return Ok(movieResponse);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieGenres)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
                return NotFound();

            // Xóa các liên kết thể loại trước
            _context.MovieGenres.RemoveRange(movie.MovieGenres);

            // Sau đó xóa phim
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieExists(int id)
        {
            return _context.Movies.Any(e => e.Id == id);
        }



        [HttpGet("by-genre/{genreId}")]
        public async Task<IActionResult> GetMoviesByGenre(int genreId)
        {
            var movies = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Where(m => m.MovieGenres.Any(mg => mg.Genre.Id == genreId)) // Lọc theo genreId
                .Select(m => new MovieWithGenresDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    ReleaseYear = m.ReleaseYear,
                    Director = m.Director,
                    Country = m.Country,
                    Actors = m.Actors,
                    Poster = m.Poster,
                    TrailerUrl = m.TrailerUrl,
                    Duration = m.Duration,
                    GenreIds = m.MovieGenres.Select(mg => mg.Genre.Id).ToList(),
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            if (!movies.Any())
                return NotFound("No movies found for this genre.");

            return Ok(movies);
        }





        [HttpGet("by-year/{year}")]
        public async Task<IActionResult> GetMoviesByYear(int year)
        {
            var movies = await _context.Movies
                .Where(m => m.ReleaseYear == year) // Lọc theo năm phát hành
                .Select(m => new MovieWithGenresDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    ReleaseYear = m.ReleaseYear,
                    Director = m.Director,
                    Country = m.Country,
                    Actors = m.Actors,
                    Poster = m.Poster,
                    TrailerUrl = m.TrailerUrl,
                    Duration = m.Duration,
                    GenreIds = m.MovieGenres.Select(mg => mg.Genre.Id).ToList(),
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            if (!movies.Any())
                return NotFound($"No movies found for the year {year}.");

            return Ok(movies);
        }




        [HttpGet("count")]
        public async Task<IActionResult> GetMovieCount()
        {
            var count = await _context.Movies.CountAsync();
            return Ok(count);
        }




        [HttpGet("filtered-sorted")]
        public async Task<IActionResult> GetFilteredSortedMovies([FromQuery] int? genreId, [FromQuery] string? sortOrder)
        {
            var query = _context.Movies.Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre).AsQueryable();

            // Lọc theo thể loại nếu có
            if (genreId.HasValue)
            {
                query = query.Where(m => m.MovieGenres.Any(mg => mg.Genre.Id == genreId));
            }

            // Sắp xếp theo tiêu chí được chọn
            query = sortOrder switch
            {
                "newest" => query.OrderByDescending(m => m.ReleaseYear),
                "Az" => query.OrderBy(m => m.Title),
                _ => query
            };

            var movies = await query
                .Select(m => new MovieWithGenresDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    ReleaseYear = m.ReleaseYear,
                    Director = m.Director,
                    Country = m.Country,
                    Actors = m.Actors,
                    Poster = m.Poster,
                    TrailerUrl = m.TrailerUrl,
                    Duration = m.Duration,
                    GenreIds = m.MovieGenres.Select(mg => mg.Genre.Id).ToList(),
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(movies);
        }



        [HttpPost("add-to-favorites")]
        public async Task<IActionResult> AddToFavorites([FromBody] AddFavoriteDto favoriteDto)
        {
            if (favoriteDto == null)
                return BadRequest("Invalid data.");

            // Kiểm tra movie có tồn tại không
            var movie = await _context.Movies.FindAsync(favoriteDto.MovieId);
            if (movie == null)
                return NotFound("Movie not found.");

            // Kiểm tra nếu phim đã tồn tại trong danh sách yêu thích của user
            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(fm => fm.UserId == favoriteDto.UserId && fm.MovieId == favoriteDto.MovieId);

            if (existingFavorite != null)
                return BadRequest("Movie already in favorites.");

            // Thêm vào danh sách yêu thích
            var favorite = new Favorites
            {
                UserId = favoriteDto.UserId,
                MovieId = favoriteDto.MovieId,
                AddedAt = DateTime.UtcNow
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok("Movie added to favorites successfully.");
        }

        [HttpGet("favorites/{userId}")]
        public async Task<IActionResult> GetFavoriteMovies(int userId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return NotFound("User not found.");
            }

            var favoriteMovies = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Movie) // đảm bảo bạn Include Movie
                .Select(f => new MovieWithGenresDto
                {
                    Id = f.Movie.Id,
                    Title = f.Movie.Title,
                    Poster = f.Movie.Poster
                })
                .ToListAsync();

            return Ok(favoriteMovies);
        }



    }




}




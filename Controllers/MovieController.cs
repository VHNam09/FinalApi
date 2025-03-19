using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.Dtos;
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
                    Poster = m.Poster,
                    TrailerUrl = m.TrailerUrl,
                    Duration = m.Duration,  
                    GenreIds = m.MovieGenres.Select(mg => mg.Genre.Name).ToList(),
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
        // API thêm phim mới (nếu muốn)
        [HttpPost]
        public async Task<IActionResult> AddMovie([FromBody] Movies movie)
        {
            if (movie == null)
                return BadRequest("Invalid movie data");

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMoviesWithGenres), new { id = movie.Id }, movie);
        }
    }
}

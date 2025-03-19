using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.DTOs.Results;

namespace MovieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenresController : ControllerBase
    {
        private readonly GenresContext _context;

        public GenresController(GenresContext context)
        {
            _context = context;
        }

        // API: GET api/genres
        [HttpGet]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await _context.Genres.ToListAsync(); // Lấy tất cả genres
            return Ok(genres); // Trả về dạng JSON
        }


        [HttpGet]
        [Route("check-genres/{movieId}")]
        public async Task<IActionResult> GetAllGenresMovie(int movieId)
        {
            var checkGenres = new List<CheckGenres>();
            var movieGenres = await _context.MovieGenres.Where(e => e.MovieId == movieId).ToListAsync();
            var genres = await _context.Genres.ToListAsync();

            genres.ForEach(e =>
            {
                var checkGenre = new CheckGenres() 
                {
                    Id = e.Id,
                    Name = e.Name,
                    IsCheck = movieGenres.Select(e => e.GenreId).Contains(e.Id),
                };
                checkGenres.Add(checkGenre);
            });

            return Ok(checkGenres);
        }
    }
}

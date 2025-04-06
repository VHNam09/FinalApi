using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.DTOs.Results;
using MovieApi.Entities;

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
            var genres = await _context.Genres
                .Select(g => new
                {
                    g.Id,
                    g.Name,
                    g.Description,
                    g.CreatedAt,
                    // Đếm số lượng phim cho mỗi thể loại từ bảng MovieGenres
                    MovieCount = _context.MovieGenres
                        .Where(mg => mg.GenreId == g.Id)
                        .Count()
                })
                .ToListAsync();

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _context.Genres
                .Include(g => g.MovieGenres)
                    .ThenInclude(mg => mg.Movie)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (genre == null)
            {
                return NotFound();
            }

            // Chuẩn hóa dữ liệu trả về
            var result = new
            {
                id = genre.Id,
                name = genre.Name,
                description = genre.Description,
                createdAt = genre.CreatedAt,
                movieCount = genre.MovieGenres.Count, // Đếm số lượng phim thuộc thể loại này
                movies = genre.MovieGenres.Select(mg => mg.Movie.Title).ToList() // Danh sách các phim thuộc thể loại này
            };

            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> CreateGenre([FromBody] Genres genre)
        {
            if (genre == null)
                return BadRequest("Dữ liệu thể loại không hợp lệ");

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllGenres), new { id = genre.Id }, genre);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditGenre(int id, [FromBody] Genres genre)
        {
            if (genre == null)
                return BadRequest("Dữ liệu thể loại không hợp lệ");

            // Kiểm tra xem thể loại có tồn tại trong cơ sở dữ liệu không
            var existingGenre = await _context.Genres.FindAsync(id);
            if (existingGenre == null)
                return NotFound("Thể loại không tồn tại");

            // Cập nhật các thông tin của thể loại
            existingGenre.Name = genre.Name;
            existingGenre.Description = genre.Description;
            //existingGenre.CreatedAt = genre.CreatedAt; 

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return Ok(existingGenre); // Trả về thông tin thể loại đã cập nhật
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            // Tìm thể loại theo id
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
                return NotFound("Thể loại không tồn tại");

            // Xóa thể loại khỏi cơ sở dữ liệu
            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return NoContent(); // Trả về phản hồi không có nội dung sau khi xóa thành công
        }




    }
}

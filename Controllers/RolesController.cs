using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;

namespace MovieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly GenresContext _context;

        public RolesController(GenresContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGenres()
        {
            var roles = await _context.Roles.ToListAsync(); // Lấy tất cả genres
            return Ok(roles); // Trả về dạng JSON
        }
    }
}

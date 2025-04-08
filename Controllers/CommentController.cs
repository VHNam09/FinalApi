using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.DTOs;
using MovieApi.Entities;

namespace MovieApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly GenresContext _context;

        public CommentController(GenresContext context)
        {
            _context = context;
        }

        [Authorize] // Chỉ cho phép những người đã đăng nhập mới có thể sử dụng phương thức này
        [HttpPost]
        public async Task<IActionResult> PostComment([FromBody] CommentDto commentDto)
        {
            // Kiểm tra xem người dùng đã đăng nhập hay chưa (token được xác thực qua middleware)
            if (User.Identity == null || !User.Identity.IsAuthenticated)
            {
                return Unauthorized("Bạn cần phải đăng nhập để bình luận.");
            }

            // Kiểm tra thông tin bình luận hợp lệ
            if (string.IsNullOrEmpty(commentDto.Content))
            {
                return BadRequest("Nội dung bình luận không được để trống.");
            }

            var comment = new Comment
            {
                UserId = commentDto.UserId,
                MovieId = commentDto.MovieId,
                Content = commentDto.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Bình luận đã được gửi thành công.", CommentId = comment.Id });
        }


        [HttpGet("movie/{movieId}/comments")]
        public async Task<IActionResult> GetCommentsByMovie(int movieId, int page = 1, int limit = 10)
        {
            // Tính toán offset (số mục bỏ qua)
            var skip = (page - 1) * limit;

            // Lấy danh sách bình luận cho một bộ phim
            var comments = await _context.Comments
                .Where(c => c.MovieId == movieId )
                .OrderBy(c => c.CreatedAt) // Sắp xếp theo thời gian tạo bình luận
                .Skip(skip)
                .Take(limit)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    c.UserId,
                    UserName = c.User.Username,  // Lấy tên người dùng từ bảng Users
                    Avatar = "https://ui-avatars.com/api/?name=" + c.User.Username + "&background=random&color=fff" // Tạo avatar tự động
                })
                .ToListAsync();

            if (comments == null || comments.Count == 0)
            {
                return NotFound("Không có bình luận cho bộ phim này.");
            }

            return Ok(comments);
        }

    }
}

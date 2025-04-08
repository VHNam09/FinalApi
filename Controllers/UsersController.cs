using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApi.Data;
using MovieApi.DTOs;
using MovieApi.Entities;

namespace MovieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly GenresContext _context;

        // Constructor để inject MoviesContext vào controller
        public UsersController(GenresContext context)
        {
            _context = context;
        }

        // Action để lấy tất cả người dùng từ bảng Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)  // Đảm bảo tải thông tin Role
                .Select(u => new UserWithRoleDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    RoleName = u.Role.Name,  // Chỉ lấy tên vai trò
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        // Action để lấy một người dùng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)  // Tải thông tin vai trò liên quan
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { Message = $"Không tìm thấy người dùng với ID {id}" });
            }

            return Ok(new UserWithRoleDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                RoleName = user.Role.Name,
                CreatedAt = user.CreatedAt
            });
        }

        // Action để đếm số lượng người dùng có Username = "user"
        [HttpGet("count-by-rolename")]
        public async Task<ActionResult<int>> CountUsersByRoleName([FromQuery] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("RoleName không được để trống.");
            }

            var count = await _context.Users
                .Include(u => u.Role) // thêm Include để join
                .CountAsync(u => u.Role.Name == roleName); // lấy theo Role.Name

            return Ok(count);
        }


        [HttpPost]
        public async Task<ActionResult<UserWithRoleDto>> CreateUser([FromBody] CreateUserDto userDto)
        {
            // Validate input
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra RoleId hợp lệ
            var role = await _context.Roles.FindAsync(userDto.RoleId);
            if (role == null)
            {
                return BadRequest("Vai trò không tồn tại");
            }

            // Kiểm tra username/email đã tồn tại
            if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
            {
                return Conflict($"Tên đăng nhập '{userDto.Username}' đã tồn tại");
            }

            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return Conflict($"Email '{userDto.Email}' đã được sử dụng");
            }

            // Tạo user mới
            var user = new Users
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                RoleId = userDto.RoleId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Trả về thông tin user theo DTO
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserWithRoleDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                RoleName = role.Name,
                CreatedAt = user.CreatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserWithRoleDto>> EditUser(int id, [FromBody] EditUserDto userDto)
        {
            // Kiểm tra tính hợp lệ của dữ liệu nhập vào
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Tìm người dùng theo ID
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { Message = $"Không tìm thấy người dùng với ID {id}" });
            }

            // Kiểm tra RoleId hợp lệ
            var role = await _context.Roles.FindAsync(userDto.RoleId);
            if (role == null)
            {
                return BadRequest("Vai trò không tồn tại");
            }

            // Kiểm tra xem tên đăng nhập có bị trùng với người khác không
            if (await _context.Users.AnyAsync(u => u.Username == userDto.Username && u.Id != id))
            {
                return Conflict($"Tên đăng nhập '{userDto.Username}' đã tồn tại");
            }

            // Kiểm tra xem email có bị trùng với người khác không
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email && u.Id != id))
            {
                return Conflict($"Email '{userDto.Email}' đã được sử dụng");
            }

            // Cập nhật thông tin người dùng
            user.Username = userDto.Username;
            user.Email = userDto.Email;

            // Nếu mật khẩu mới được cung cấp, cập nhật mật khẩu
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            }

            // Cập nhật vai trò của người dùng
            user.RoleId = userDto.RoleId;

            // Cập nhật thời gian thay đổi (tùy chọn)
            //user.UpdatedAt = DateTime.UtcNow;

            // Lưu thay đổi vào cơ sở dữ liệu
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Trả về thông tin người dùng đã cập nhật theo DTO
            return Ok(new UserWithRoleDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                RoleName = role.Name,
                CreatedAt = user.CreatedAt,
                //UpdatedAt = user.UpdatedAt // Nếu bạn muốn trả về thời gian cập nhật
            });
        }





        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // Tìm thể loại theo id
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Người dùng không tồn tại");

            // Xóa thể loại khỏi cơ sở dữ liệu
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent(); // Trả về phản hồi không có nội dung sau khi xóa thành công
        }
    }
}


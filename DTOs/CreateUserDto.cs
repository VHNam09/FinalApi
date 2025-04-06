using System.ComponentModel.DataAnnotations;

namespace MovieApi.DTOs
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên đăng nhập phải từ 3-50 ký tự")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Mật khẩu phải từ 8-100 ký tự")]
        public string Password { get; set; }

        public int RoleId { get; set; } = 1;
        // Mặc định là User (RoleId = 2)

    }
}

namespace MovieApi.DTOs
{
    public class EditUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }  // Optional, nếu người dùng muốn thay đổi mật khẩu
        public int RoleId { get; set; }
    }
}

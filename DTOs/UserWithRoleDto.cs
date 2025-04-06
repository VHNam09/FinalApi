namespace MovieApi.DTOs
{
    public class UserWithRoleDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }  // Chỉ lấy tên vai trò thay vì đối tượng Role
        public DateTime CreatedAt { get; set; }
    }
}

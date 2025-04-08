using System.Text.Json.Serialization;

namespace MovieApi.Entities
{
    public class Users:BaseEntity
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // 🆕 Thêm khóa ngoại đến bảng Roles
        public int RoleId { get; set; } = 2; // Mặc định là "User"
        public Roles Role { get; set; } // Navigation Property

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Favorites> Favorites { get; set; } = new List<Favorites>();

        [JsonIgnore]
        public ICollection<Comment> Comments { get; set; }
    }




}

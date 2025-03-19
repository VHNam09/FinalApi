namespace MovieApi.Entities
{
    public class Roles : BaseEntity
    {
        public int Id { get; set; } // IDENTITY(1,1) trong SQL
        public string Name { get; set; } = string.Empty; // NOT NULL NVARCHAR(100)

        // Danh sách người dùng thuộc vai trò này
        public ICollection<Users> Users { get; set; } = new List<Users>();
    }

}

using System.ComponentModel.DataAnnotations;

namespace WebBanSach.Models.Entities
{
    public class TaiKhoan
    {
        [Key]
        public int Uid { get; set; }
        public string Email { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;

namespace WebBanSach.Models.Entities
{
    public class TacGia
    {
        [Key]
        public string MaTacGia { get; set; } = string.Empty;
        public string HoTenTacGia { get; set; } = string.Empty;
        public string GioiThieu { get; set; } = string.Empty;
        public string AnhDaiDien { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;

namespace WebBanSach.Models.Entities
{
    public class DanhGia
    {
        [Key]
        public int Uid { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public int SoSao { get; set; }
        public string NoiDungDanhGia { get; set; } = string.Empty;
        public string AnhDaiDien { get; set; } = string.Empty;
    }
}

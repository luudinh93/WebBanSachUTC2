using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace WebBanSach.Models.Entities
{
    public class ThongTinSach
    {
        [Key]
        public int Uid { get; set; }
        public string TenSach { get; set; } = string.Empty;
        public string TheLoai { get; set; } = string.Empty;
        public string TieuDeChinh { get; set; } = string.Empty;
        public string TieuDePhu { get; set; } = string.Empty;
        [Precision(18, 2)]
        public decimal GiaGoc { get; set; }
        [Precision(18, 2)]
        public decimal GiaBan { get; set; }
        public string AnhSach { get; set; } = string.Empty;
        public string LinkYoutube { get; set; } = string.Empty;
        public string MaTacGia { get; set; } = string.Empty;
        public string FileDocThu { get; set; } = string.Empty;
    }
}

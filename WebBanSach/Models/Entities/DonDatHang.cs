using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace WebBanSach.Models.Entities
{
    public class DonDatHang
    {
        [Key]
        public int Uid { get; set; }
        public string MaDonHang { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public string TenKhachHang { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string MaHinhThucThanhToan { get; set; } = string.Empty;
        public string MaTinhTrang { get; set; } = string.Empty;
        public DateTime ThoiGianDat { get; set; }
        [Precision(18, 2)]
        public decimal TongTien { get; set; }
        public string GhiChu { get; set; } = string.Empty;
    }
}

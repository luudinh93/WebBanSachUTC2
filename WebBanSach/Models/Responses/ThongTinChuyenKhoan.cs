namespace WebBanSach.Models.Responses
{
    public class ThongTinChuyenKhoan
    {
        public string MaDonHang { get; set; } = string.Empty;
        public string NganHang { get; set; } = string.Empty;
        public string SoTaiKhoan { get; set; } = string.Empty;
        public string TenTaiKhoan { get; set; } = string.Empty;
        public decimal SoTien { get; set; }
        public string NoiDung { get; set; } = string.Empty;
        public string? AnhQR { get; set; }
    }
}

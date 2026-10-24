namespace WebBanSach.Models.Requests
{
    public class DatHangRequest
    {
        public int UidSach { get; set; }
        public int SoLuong { get; set; }
        public string TenKhachHang { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string MaHinhThucThanhToan { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
    }
}

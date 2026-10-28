namespace WebBanSach.Models.Responses
{
    public class ThongTinDonHang
    {
        public string MaDonHang { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public decimal TongTien { get; set; }
        public string MaHinhThucThanhToan { get; set; } = string.Empty;
        public string TenHinhThucThanhToan { get; set; } = string.Empty;

        /// <summary>Chỉ có khi khách chọn chuyển khoản ngân hàng.</summary>
        public ThongTinChuyenKhoan? ChuyenKhoan { get; set; }
    }
}

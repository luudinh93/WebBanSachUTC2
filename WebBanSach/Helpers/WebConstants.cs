namespace WebBanSach.Helpers
{
    public class WebConstants
    {
        // Đặt hàng (phải khớp với js/data.js: maxQuantity, shipping.fee, shipping.freeFrom)
        public const int MaxOrderQuantity = 10;
        public const decimal ShippingFee = 30000m;
        public const decimal FreeShippingFrom = 300000m;

        // Mã hình thức thanh toán (DonDatHang.MaHinhThucThanhToan)
        public const string MaThanhToanCod = "COD";
        public const string MaThanhToanChuyenKhoan = "CHUYEN_KHOAN";

        // Tài khoản nhận chuyển khoản (VietQR)
        public const string NganHangNhan = "VIETINBANK";
        public const string TenNganHangNhan = "VietinBank";
        public const string SoTaiKhoanNhan = "119002953584";
        public const string TenTaiKhoanNhan = "Phân hiệu Trường Đại học Giao thông vận tải tại thành phố Hồ Chí Minh";
        public const string QRLogo = "images/utc2-logo.png";
        public const string QRFolder = "images/qrcode";
        public const string QRColor = "#271756";

        // Email (key trong bảng CaiDats)
        public const string KeyEmailDatHangThanhCong = "SEND_EMAIL_DAT_HANG_THANH_CONG";
        public const string TieuDeEmailDatHangThanhCong = "Xác nhận đơn đặt hàng sách Nhà Giả Kim";
        public const string TenNguoiGuiEmail = "Nhà sách Giả Kim";

        // Mã tình trạng đơn hàng (bảng TinhTrangDonHang)
        public const string MaTinhTrangMoi = "MOI";
    }
}

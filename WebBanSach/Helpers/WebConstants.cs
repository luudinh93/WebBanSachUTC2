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

        // Mã tình trạng đơn hàng (bảng TinhTrangDonHang)
        public const string MaTinhTrangMoi = "MOI";
    }
}

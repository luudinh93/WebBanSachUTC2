using WebBanSach.Models.Entities;
using WebBanSach.Models.Requests;
using WebBanSach.Models.Responses;

namespace WebBanSach.Services
{
    public interface IBookServices
    {
        Task<ThongTinSach?> GetBookAsync();
        Task<TacGia?> GetAuthorAsync(string maTacGia);
        Task<List<DanhGia>> GetReviewsAsync();

        /// <summary>Tạo đơn hàng. Trả về đơn vừa tạo, null nếu sản phẩm không tồn tại.</summary>
        Task<DonDatHang?> CreateOrderAsync(DatHangRequest request);

        /// <summary>Tạo thông tin + ảnh QR (VietQR) để chuyển khoản cho đơn hàng, nội dung là mã đơn.</summary>
        ThongTinChuyenKhoan TaoThongTinChuyenKhoan(DonDatHang donHang);

        /// <summary>Thông tin đơn hàng trả về cho khách sau khi đặt thành công (kèm QR nếu chuyển khoản).</summary>
        ThongTinDonHang TaoThongTinDonHang(DonDatHang donHang);

        /// <summary>Gửi email xác nhận đặt hàng cho khách (nếu có email). Lỗi gửi mail chỉ ghi log, không ném ra ngoài.</summary>
        Task GuiEmailDatHangThanhCongAsync(DonDatHang donHang);

        /// <summary>Gửi email xác nhận ở chế độ nền (không chờ). Chỉ gọi sau khi đơn đã lưu xuống CSDL.</summary>
        void GuiEmailDatHangThanhCongTrongNen(DonDatHang donHang);
    }
}

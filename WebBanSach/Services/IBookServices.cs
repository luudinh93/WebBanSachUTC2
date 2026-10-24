using WebBanSach.Models.Entities;
using WebBanSach.Models.Requests;

namespace WebBanSach.Services
{
    public interface IBookServices
    {
        Task<ThongTinSach?> GetBookAsync();
        Task<TacGia?> GetAuthorAsync(string maTacGia);
        Task<List<DanhGia>> GetReviewsAsync();

        /// <summary>Tạo đơn hàng. Trả về đơn vừa tạo, null nếu sản phẩm không tồn tại.</summary>
        Task<DonDatHang?> CreateOrderAsync(DatHangRequest request);
    }
}

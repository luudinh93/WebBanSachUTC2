using Microsoft.EntityFrameworkCore;
using WebBanSach.Helpers;
using WebBanSach.Models.EF;
using WebBanSach.Models.Entities;
using WebBanSach.Models.Requests;
using WebBanSach.Validators;

namespace WebBanSach.Services
{
    public class BookServices:IBookServices
    {
        private readonly ApplicationDbContext _context;

        public BookServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<ThongTinSach?> GetBookAsync()
        {
            return _context.ThongTinSachs.AsNoTracking().FirstOrDefaultAsync();
        }

        public Task<TacGia?> GetAuthorAsync(string maTacGia)
        {
            return _context.TacGias.AsNoTracking().FirstOrDefaultAsync(x => x.MaTacGia == maTacGia);
        }

        public Task<List<DanhGia>> GetReviewsAsync()
        {
            return _context.DanhGias.AsNoTracking().OrderBy(x => x.Uid).ToListAsync();
        }

        public async Task<DonDatHang?> CreateOrderAsync(DatHangRequest request)
        {
            // Giá luôn lấy từ DB, không tin giá do client gửi
            var sach = await _context.ThongTinSachs.FindAsync(request.UidSach);
            if (sach is null) return null;

            var tamTinh = sach.GiaBan * request.SoLuong;
            var phiGiaoHang = tamTinh >= WebConstants.FreeShippingFrom ? 0m : WebConstants.ShippingFee;
            var now = DateTime.Now;

            var donHang = new DonDatHang
            {
                MaDonHang = $"DH{now:yyMMddHHmmss}{Random.Shared.Next(100, 1000)}",
                SoLuong = request.SoLuong,
                TenKhachHang = request.TenKhachHang.Trim(),
                SDT = DatHangRequestValidator.NormalizePhone(request.SDT),
                DiaChi = request.DiaChi.Trim(),
                MaHinhThucThanhToan = request.MaHinhThucThanhToan,
                MaTinhTrang = WebConstants.MaTinhTrangMoi,
                ThoiGianDat = now,
                TongTien = tamTinh + phiGiaoHang,
                GhiChu = request.GhiChu?.Trim() ?? string.Empty
            };

            _context.DonDatHangs.Add(donHang);
            await _context.SaveChangesAsync();

            return donHang;
        }
    }
}

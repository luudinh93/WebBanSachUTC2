using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebBanSach.Helpers;
using WebBanSach.Models;
using WebBanSach.Models.Requests;
using WebBanSach.Models.Responses;
using WebBanSach.Services;

namespace WebBanSach.Controllers
{
    public class HomeController : Controller
    {
        private readonly IBookServices _bookServices;
        private readonly IValidator<DatHangRequest> _datHangValidator;

        public HomeController(
            IBookServices bookServices,
            IValidator<DatHangRequest> datHangValidator)
        {
            _bookServices = bookServices;
            _datHangValidator = datHangValidator;
        }

        public async Task<IActionResult> Index()
        {
            var book = await _bookServices.GetBookAsync();
            var author = book==null ? null : await _bookServices.GetAuthorAsync(book.MaTacGia);
            var reviews = await _bookServices.GetReviewsAsync();

            ViewData["Book"] = book;
            ViewData["Author"] = author;
            ViewData["Reviews"] = reviews;

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DatHang([FromBody] DatHangRequest? request)
        {
            if (request is null)
                return BadRequest(new Responses { Status = 400, Message = "Dữ liệu đặt hàng không hợp lệ." });

            var validation = await _datHangValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                // client hiển thị "message"
                return BadRequest(new Responses
                {
                    Status = 400,
                    Message = validation.Errors[0].ErrorMessage,
                    Error = string.Join(" | ", validation.Errors.Select(e => e.ErrorMessage))
                });
            }

            var donHang = await _bookServices.CreateOrderAsync(request);
            if (donHang is null)
                return NotFound(new Responses { Status = 404, Message = "Sản phẩm không tồn tại hoặc đã ngừng bán." });

            bool chuyenKhoan = donHang.MaHinhThucThanhToan == WebConstants.MaThanhToanChuyenKhoan;
            var thongTinDonHang = _bookServices.TaoThongTinDonHang(donHang); // tạo ảnh QR trước để email nhúng được

            // Đơn đã lưu xuống CSDL (CreateOrderAsync trả về khác null) mới gửi email, chạy nền để không làm chậm response
            _bookServices.GuiEmailDatHangThanhCongTrongNen(donHang);

            return Ok(new Responses
            {
                Status = 200,
                Message = chuyenKhoan
                    ? "Vui lòng quét mã QR để chuyển khoản và giữ nguyên nội dung chuyển khoản là mã đơn hàng."
                    : "Nhà sách sẽ gọi điện xác nhận trước khi giao hàng.",
                Data = thongTinDonHang
            });
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

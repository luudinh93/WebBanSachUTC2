using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
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

            return Ok(new Responses
            {
                Status = 200,
                Message = $"Đặt hàng thành công! Mã đơn của bạn là {donHang.MaDonHang}. Nhà sách sẽ liên hệ xác nhận với bạn trong thời gian sớm nhất."
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

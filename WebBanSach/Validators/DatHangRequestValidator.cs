using System.Text.RegularExpressions;
using FluentValidation;
using WebBanSach.Helpers;
using WebBanSach.Models.Requests;

namespace WebBanSach.Validators
{
    public class DatHangRequestValidator : AbstractValidator<DatHangRequest>
    {
        // SĐT di động Việt Nam sau khi chuẩn hóa về dạng 0xxxxxxxxx
        private static readonly Regex PhoneRegex = new(@"^0(3|5|7|8|9)\d{8}$", RegexOptions.Compiled);

        public DatHangRequestValidator()
        {
            RuleFor(x => x.UidSach)
                .GreaterThan(0).WithMessage("Sản phẩm không hợp lệ.");

            RuleFor(x => x.SoLuong)
                .InclusiveBetween(1, WebConstants.MaxOrderQuantity)
                .WithMessage($"Số lượng phải từ 1 đến {WebConstants.MaxOrderQuantity} cuốn/đơn.");

            RuleFor(x => x.TenKhachHang)
                .Must(v => !string.IsNullOrWhiteSpace(v)).WithMessage("Vui lòng nhập họ và tên.")
                .Must(v => v.Trim().Length is >= 2 and <= 100).WithMessage("Họ tên cần từ 2 đến 100 ký tự.");

            RuleFor(x => x.SDT)
                .Must(v => !string.IsNullOrWhiteSpace(v)).WithMessage("Vui lòng nhập số điện thoại.")
                .Must(v => PhoneRegex.IsMatch(NormalizePhone(v))).WithMessage("Số điện thoại chưa đúng định dạng Việt Nam.");

            RuleFor(x => x.DiaChi)
                .Must(v => !string.IsNullOrWhiteSpace(v)).WithMessage("Vui lòng nhập địa chỉ nhận hàng.")
                .Must(v => v.Trim().Length is >= 5 and <= 200).WithMessage("Địa chỉ cần từ 5 đến 200 ký tự.");

            RuleFor(x => x.MaHinhThucThanhToan)
                .Must(v => v is WebConstants.MaThanhToanCod or WebConstants.MaThanhToanChuyenKhoan)
                .WithMessage("Phương thức thanh toán không hợp lệ.");

            RuleFor(x => x.GhiChu)
                .MaximumLength(300).WithMessage("Ghi chú tối đa 300 ký tự.");
        }

        /// <summary>Chuẩn hóa SĐT: bỏ ký tự phân cách, +84 / 84 → 0 (giống normalizePhone ở order.js).</summary>
        public static string NormalizePhone(string? raw)
        {
            var p = Regex.Replace(raw ?? string.Empty, @"[\s.\-()]", "");
            if (p.StartsWith("+84")) return "0" + p[3..];
            if (p.StartsWith("84") && p.Length == 11) return "0" + p[2..];
            return p;
        }
    }
}

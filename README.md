# WebBanSach – Landing page bán sách "Nhà Giả Kim"

Website bán một đầu sách (Nhà Giả Kim – Paulo Coelho) viết bằng **ASP.NET Core MVC (.NET 10)**, **Entity Framework Core** và **SQL Server**. Trang gồm giới thiệu sách, tác giả, video, đọc thử, đánh giá của độc giả và form đặt hàng nhanh.

## Tính năng

- **Landing page** lấy dữ liệu sách, tác giả và đánh giá từ database.
- **Đọc thử** với hiệu ứng lật trang (StPageFlip).
- **Slider đánh giá** (Slick carousel) kèm thống kê số sao.
- **Đặt hàng nhanh** trong modal:
  - gửi bằng `fetch`, có spinner trong lúc gửi;
  - validate ở cả client (JavaScript) và server (FluentValidation);
  - chống CSRF bằng `[ValidateAntiForgeryToken]`;
  - giá và tổng tiền luôn tính lại ở server từ database;
  - thông báo thành công hiện ở góc phải trên, tự ẩn sau 5 giây.
- **Tiện ích tạo mã QR** chuyển khoản ngân hàng (QRCoder + SkiaSharp) trong `Helpers/Utils.cs`.

## Công nghệ
| Thành phần | Công nghệ |
|---|---|
| Backend | ASP.NET Core MVC (.NET 10) |
| ORM | Entity Framework Core 10 (SQL Server) |
| Validation | FluentValidation.DependencyInjectionExtensions |
| Giao diện | Razor View, Tailwind CSS v4 (bản browser), Font Awesome |
| JavaScript | Vanilla JS, jQuery + Slick carousel, StPageFlip |
| Mã QR | QRCoder, SkiaSharp |

## Cấu trúc thư mục

```
WebBanSach/
├── WebBanSach.slnx
└── WebBanSach/
    ├── Controllers/        # HomeController (Index, DatHang)
    ├── Helpers/            # WebConstants, Utils (tạo mã QR)
    ├── Migrations/         # Migration EF Core (tạo bảng + seed dữ liệu)
    ├── Models/
    │   ├── EF/             # ApplicationDbContext
    │   ├── Entities/       # Các bảng trong database
    │   ├── Requests/       # DatHangRequest
    │   └── Responses/      # Responses (Status, Message, Error)
    ├── Services/           # IBookServices / BookServices – toàn bộ truy vấn DB
    ├── Validators/         # DatHangRequestValidator (FluentValidation)
    ├── Views/              # Razor views
    └── wwwroot/            # css, js, images
```

Controller không dùng trực tiếp `ApplicationDbContext`. Mọi truy vấn database nằm trong `BookServices` và được inject vào controller qua `IBookServices`.

## Database

Các bảng chỉ có khóa chính, không thiết lập relationship. Việc ghép dữ liệu giữa các bảng được làm trong code C#.

| Bảng | Khóa chính | Mô tả |
|---|---|---|
| `ThongTinSachs` | `Uid` | Thông tin sách: tên, thể loại, tiêu đề, giá gốc, giá bán, ảnh, link YouTube, `MaTacGia` |
| `TacGias` | `MaTacGia` | Tác giả; `GioiThieu` lưu dạng HTML |
| `DanhGias` | `Uid` | Đánh giá của độc giả |
| `DonDatHangs` | `Uid` | Đơn đặt hàng |
| `TinhTrangDonHangs` | `MaTinhTrang` | Danh mục tình trạng đơn hàng |
| `TaiKhoans` | `Uid` | Tài khoản quản trị |
| `CaiDats` | `Uid` | Cấu hình dạng key/value |

Migration `data_seeding` thêm sẵn dữ liệu mẫu cho sách, tác giả và 6 đánh giá.

## Cài đặt và chạy

### Yêu cầu

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- SQL Server (bản Express hoặc LocalDB đều được)
- Công cụ EF Core: `dotnet tool install --global dotnet-ef`

### 1. Clone project

```bash
git clone <url-repo>
cd WebBanSach/WebBanSach
```

### 2. Cấu hình chuỗi kết nối

Ứng dụng đọc chuỗi kết nối tên `WebBanSachCST`. Nên lưu bằng **User Secrets** để không đẩy mật khẩu lên GitHub:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:WebBanSachCST" "Server=localhost;Database=WebBanSach;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True"
```

### 3. Tạo database

```bash
dotnet ef database update
```

Sau đó thêm danh mục tình trạng đơn hàng (đơn mới đặt có mã `MOI`):

```sql
INSERT INTO TinhTrangDonHangs (MaTinhTrang, TenTinhTrang, Ordering) VALUES
(N'MOI',            N'Mới đặt hàng',   1),
(N'DANG_XU_LY',     N'Đang xử lý',     2),
(N'DANG_GIAO_HANG', N'Đang giao hàng', 3),
(N'DA_NHAN',        N'Đã nhận',        4),
(N'HOAN_TRA',       N'Hoàn trả',       5),
(N'DOI_HANG',       N'Đổi hàng',       6);
```

### 4. Chạy ứng dụng

```bash
dotnet run
```

Mở địa chỉ **https** được in ra trong terminal. Cookie session đặt `SecurePolicy = Always` nên cần chạy bằng https.

## Đặt hàng

Form đặt hàng gửi `POST /Home/DatHang` dạng JSON, kèm header `RequestVerificationToken` lấy từ `@Html.AntiForgeryToken()` trong form.

**Request** (`DatHangRequest`):

```json
{
  "uidSach": 1,
  "soLuong": 2,
  "tenKhachHang": "Nguyễn Văn A",
  "sdt": "0912345678",
  "diaChi": "12 Lê Lợi, Phường Bến Thành, TP. Hồ Chí Minh",
  "maHinhThucThanhToan": "COD",
  "ghiChu": "Giao giờ hành chính"
}
```

`maHinhThucThanhToan` nhận một trong hai giá trị: `COD` hoặc `CHUYEN_KHOAN`.

**Response** (`Responses`):

```json
{
  "status": 200,
  "message": "Đặt hàng thành công! Mã đơn của bạn là DH261024103015123. ...",
  "error": null
}
```

Khi dữ liệu không hợp lệ, server trả `400` với `message` là lỗi đầu tiên và `error` là toàn bộ lỗi.

**Quy tắc validate** (giống nhau ở client và server):

- số lượng từ 1 đến 10;
- họ tên từ 2 đến 100 ký tự;
- số điện thoại di động Việt Nam;
- địa chỉ từ 5 đến 200 ký tự;
- ghi chú tối đa 300 ký tự.

Phí giao hàng là 30.000đ, miễn phí cho đơn từ 300.000đ. Các con số này khai báo ở `Helpers/WebConstants.cs` và `wwwroot/js/data.js`, khi đổi cần sửa cả hai nơi.

## Ghi chú

- Dữ liệu cửa hàng (tên, địa chỉ, số điện thoại...) và các trang đọc thử vẫn nằm trong `wwwroot/js/data.js`. Các mục ghi `TODO` là dữ liệu tạm.
- Tailwind CSS đang dùng bản chạy trên trình duyệt để tiện học tập. Khi triển khai thật nên build bằng Tailwind CLI.

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebBanSach.Migrations
{
    /// <inheritdoc />
    public partial class data_seeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "DanhGias",
                columns: new[] { "Uid", "AnhDaiDien", "HoTen", "NoiDungDanhGia", "SoSao" },
                values: new object[,]
                {
                    { 1, "https://randomuser.me/api/portraits/women/44.jpg", "Minh Anh", "Bìa tím rất đẹp, in chữ vàng nổi bật. Câu chuyện nhẹ nhàng nhưng đọc xong cứ nghĩ mãi về “huyền thoại cá nhân” của chính mình.", 5 },
                    { 2, "https://randomuser.me/api/portraits/men/32.jpg", "Quốc Bảo", "Mua làm quà sinh nhật cho em gái, sách được gói cẩn thận. Đây là cuốn mình đọc lại nhiều lần nhất.", 5 },
                    { 3, "https://randomuser.me/api/portraits/women/68.jpg", "Thu Hà", "Văn phong giản dị, dễ đọc. Có vài đoạn mang tính ẩn dụ cần đọc chậm để thấm. Rất đáng để sở hữu.", 4 },
                    { 4, "https://randomuser.me/api/portraits/men/75.jpg", "Hoàng Nam", "Đọc trong một buổi tối mà thấy được tiếp thêm năng lượng. Phù hợp cho những ai đang phân vân trước lựa chọn lớn.", 5 },
                    { 5, "https://randomuser.me/api/portraits/women/12.jpg", "Lan Phương", "Giấy đẹp, chữ dễ đọc. Mình thích nhất đoạn Santiago ở sa mạc cùng nhà giả kim.", 4 },
                    { 6, "https://randomuser.me/api/portraits/men/51.jpg", "Đức Huy", "Cuốn sách nhỏ nhưng chứa nhiều điều lớn. Mỗi lần đọc lại ở một giai đoạn khác nhau lại thấy một ý nghĩa mới.", 5 }
                });

            migrationBuilder.InsertData(
                table: "TacGias",
                columns: new[] { "MaTacGia", "AnhDaiDien", "GioiThieu", "HoTenTacGia" },
                values: new object[] { "paulo-coelho", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz5a4S33Jd6Zetrh5OCxcJ7YCrPKhntb1sb21mn8HU0ULyTAjsRA71Y0&s=10", "<h2>Paulo Coelho – người kể chuyện của những giấc mơ</h2>\n<p>\n    Paulo Coelho sinh năm 1947 tại Rio de Janeiro, Brazil. Trước khi trở thành nhà văn, ông từng viết lời\n    bài hát, làm việc trong lĩnh vực sân khấu và báo chí. Chuyến hành hương trên con đường Santiago de\n    Compostela năm 1986 là bước ngoặt đưa ông đến với sự nghiệp văn chương.\n</p>\n<p>\n    Văn phong của Coelho giản dị, giàu tính biểu tượng và chiêm nghiệm, thường xoay quanh hành trình tìm\n    kiếm bản thân, niềm tin và ý nghĩa cuộc sống. <em>Nhà Giả Kim</em> (<em>O Alquimista</em>, 1988) trở thành\n    tác phẩm nổi tiếng nhất của ông, được dịch ra rất nhiều ngôn ngữ và truyền cảm hứng cho nhiều thế hệ độc giả.\n</p>\n<p>\n    Các tác phẩm tiêu biểu khác: <em>Hành hương</em>, <em>Bên dòng sông Piedra tôi ngồi khóc</em>,\n    <em>Veronika quyết chết</em>, <em>Mười một phút</em>.\n</p>\n<ul class=\"mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3\">\n    <li class=\"fact-chip\"><strong>1947</strong><span>Sinh tại Rio de Janeiro, Brazil</span></li>\n    <li class=\"fact-chip\"><strong>1988</strong><span>Xuất bản <em>O Alquimista</em></span></li>\n    <li class=\"fact-chip\"><strong>2002</strong><span>Thành viên Viện Hàn lâm Văn chương Brazil</span></li>\n</ul>\n<blockquote class=\"quote-block mt-8\">\n    “Khi bạn khao khát một điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.”\n    <footer class=\"mt-2 text-sm font-normal text-ink/70\">— Trích <cite class=\"not-italic\">Nhà Giả Kim</cite></footer>\n</blockquote>", "Paulo Coelho" });

            migrationBuilder.InsertData(
                table: "ThongTinSachs",
                columns: new[] { "Uid", "AnhSach", "FileDocThu", "GiaBan", "GiaGoc", "LinkYoutube", "MaTacGia", "TenSach", "TheLoai", "TieuDeChinh", "TieuDePhu" },
                values: new object[] { 1, "images/sach-nha-gia-kim.png", "", 79000m, 79000m, "https://www.youtube.com/watch?v=SpYfZOEOyG4", "paulo-coelho", "Nhà Giả Kim", "Tiểu thuyết", "Nhà Giả Kim", "Một hành trình đầy cảm hứng về giấc mơ, lòng dũng cảm và việc lắng nghe tiếng gọi của trái tim." });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "TacGias",
                keyColumn: "MaTacGia",
                keyValue: "paulo-coelho");

            migrationBuilder.DeleteData(
                table: "ThongTinSachs",
                keyColumn: "Uid",
                keyValue: 1);
        }
    }
}

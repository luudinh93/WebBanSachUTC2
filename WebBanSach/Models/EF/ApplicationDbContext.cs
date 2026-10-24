using Microsoft.EntityFrameworkCore;
using WebBanSach.Models.Entities;

namespace WebBanSach.Models.EF
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ThongTinSach> ThongTinSachs { get; set; }
        public DbSet<DonDatHang> DonDatHangs { get; set; }
        public DbSet<TinhTrangDonHang> TinhTrangDonHangs { get; set; }
        public DbSet<DanhGia> DanhGias { get; set; }
        public DbSet<CaiDat> CaiDats { get; set; }
        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<TacGia> TacGias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            const string maTacGia = "paulo-coelho";

            modelBuilder.Entity<TacGia>().HasData(new TacGia
            {
                MaTacGia = maTacGia,
                HoTenTacGia = "Paulo Coelho",
                AnhDaiDien = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz5a4S33Jd6Zetrh5OCxcJ7YCrPKhntb1sb21mn8HU0ULyTAjsRA71Y0&s=10",
                GioiThieu = """
                    <h2>Paulo Coelho – người kể chuyện của những giấc mơ</h2>
                    <p>
                        Paulo Coelho sinh năm 1947 tại Rio de Janeiro, Brazil. Trước khi trở thành nhà văn, ông từng viết lời
                        bài hát, làm việc trong lĩnh vực sân khấu và báo chí. Chuyến hành hương trên con đường Santiago de
                        Compostela năm 1986 là bước ngoặt đưa ông đến với sự nghiệp văn chương.
                    </p>
                    <p>
                        Văn phong của Coelho giản dị, giàu tính biểu tượng và chiêm nghiệm, thường xoay quanh hành trình tìm
                        kiếm bản thân, niềm tin và ý nghĩa cuộc sống. <em>Nhà Giả Kim</em> (<em>O Alquimista</em>, 1988) trở thành
                        tác phẩm nổi tiếng nhất của ông, được dịch ra rất nhiều ngôn ngữ và truyền cảm hứng cho nhiều thế hệ độc giả.
                    </p>
                    <p>
                        Các tác phẩm tiêu biểu khác: <em>Hành hương</em>, <em>Bên dòng sông Piedra tôi ngồi khóc</em>,
                        <em>Veronika quyết chết</em>, <em>Mười một phút</em>.
                    </p>
                    <ul class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <li class="fact-chip"><strong>1947</strong><span>Sinh tại Rio de Janeiro, Brazil</span></li>
                        <li class="fact-chip"><strong>1988</strong><span>Xuất bản <em>O Alquimista</em></span></li>
                        <li class="fact-chip"><strong>2002</strong><span>Thành viên Viện Hàn lâm Văn chương Brazil</span></li>
                    </ul>
                    <blockquote class="quote-block mt-8">
                        “Khi bạn khao khát một điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.”
                        <footer class="mt-2 text-sm font-normal text-ink/70">— Trích <cite class="not-italic">Nhà Giả Kim</cite></footer>
                    </blockquote>
                    """
            });

            modelBuilder.Entity<ThongTinSach>().HasData(new ThongTinSach
            {
                Uid = 1,
                TenSach = "Nhà Giả Kim",
                TheLoai = "Tiểu thuyết",
                TieuDeChinh = "Nhà Giả Kim",
                TieuDePhu = "",
                GiaGoc = 79000m,
                GiaBan = 79000m,
                AnhSach = "images/sach-nha-gia-kim.png",
                LinkYoutube = "https://www.youtube.com/watch?v=SpYfZOEOyG4",
                MaTacGia = maTacGia,
                FileDocThu = ""
            });

            modelBuilder.Entity<DanhGia>().HasData(
                new DanhGia
                {
                    Uid = 1, HoTen = "Minh Anh", SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/women/44.jpg",
                    NoiDungDanhGia = "Bìa tím rất đẹp, in chữ vàng nổi bật. Câu chuyện nhẹ nhàng nhưng đọc xong cứ nghĩ mãi về “huyền thoại cá nhân” của chính mình."
                },
                new DanhGia
                {
                    Uid = 2, HoTen = "Quốc Bảo", SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/men/32.jpg",
                    NoiDungDanhGia = "Mua làm quà sinh nhật cho em gái, sách được gói cẩn thận. Đây là cuốn mình đọc lại nhiều lần nhất."
                },
                new DanhGia
                {
                    Uid = 3, HoTen = "Thu Hà", SoSao = 4,
                    AnhDaiDien = "https://randomuser.me/api/portraits/women/68.jpg",
                    NoiDungDanhGia = "Văn phong giản dị, dễ đọc. Có vài đoạn mang tính ẩn dụ cần đọc chậm để thấm. Rất đáng để sở hữu."
                },
                new DanhGia
                {
                    Uid = 4, HoTen = "Hoàng Nam", SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/men/75.jpg",
                    NoiDungDanhGia = "Đọc trong một buổi tối mà thấy được tiếp thêm năng lượng. Phù hợp cho những ai đang phân vân trước lựa chọn lớn."
                },
                new DanhGia
                {
                    Uid = 5, HoTen = "Lan Phương", SoSao = 4,
                    AnhDaiDien = "https://randomuser.me/api/portraits/women/12.jpg",
                    NoiDungDanhGia = "Giấy đẹp, chữ dễ đọc. Mình thích nhất đoạn Santiago ở sa mạc cùng nhà giả kim."
                },
                new DanhGia
                {
                    Uid = 6, HoTen = "Đức Huy", SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/men/51.jpg",
                    NoiDungDanhGia = "Cuốn sách nhỏ nhưng chứa nhiều điều lớn. Mỗi lần đọc lại ở một giai đoạn khác nhau lại thấy một ý nghĩa mới."
                });
        }
    }
}

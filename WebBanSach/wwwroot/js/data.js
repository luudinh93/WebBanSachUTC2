/* =========================================================
   DỮ LIỆU HIỂN THỊ CỦA LANDING PAGE
   ---------------------------------------------------------
   Sửa giá, thông tin nhà sách, video, đánh giá... tại đây,
   không cần động vào HTML.
   ⚠ Các mục có ghi "TODO" là DỮ LIỆU TẠM để dựng giao diện —
     phải thay bằng thông tin thật trước khi đưa lên mạng.
   ⚠ File này là dữ liệu public: KHÔNG đặt API key, token.
   ========================================================= */
window.NGK = window.NGK || {};

window.NGK.data = {
  product: {
    id: 'nha-gia-kim-edition-01',
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    edition: 'Lê Chu Cầu dịch · Nhã Nam',
    cover: 'images/sach-nha-gia-kim.png',
    price: 79000,                     // TODO: GIÁ MẪU – cập nhật giá bán thực tế (VND)
    maxQuantity: 10                   // TODO: theo tồn kho thực tế
  },

  shipping: {
    fee: 30000,                       // TODO: phí giao hàng thực tế
    freeFrom: 300000,                 // TODO: miễn phí ship từ mức này (null nếu không áp dụng)
    policy: 'Giao hàng 2–5 ngày làm việc. Được kiểm tra sách khi nhận; đổi trả trong 7 ngày nếu sách lỗi in ấn.' // TODO
  },

  order: {
    // Endpoint backend tạo đơn. Để trống = chưa có backend → form sẽ báo lỗi rõ ràng,
    // KHÔNG giả vờ đặt hàng thành công.
    apiEndpoint: '/Home/DatHang',
    timeoutMs: 15000
  },

  store: {
    name: 'Nhà sách Giả Kim',         // TODO: tên nhà sách thật
    about: 'Nơi gửi trao những cuốn sách truyền cảm hứng, đóng gói cẩn thận và giao tận tay bạn đọc.',
    address: 'Cập nhật địa chỉ nhà sách', // TODO
    phone: '',                        // TODO: VD '0900000000' (để trống sẽ ẩn link gọi)
    email: '',                        // TODO
    hours: 'Cập nhật giờ mở cửa',     // TODO
    social: {
      facebook: '',                   // TODO: URL thật
      youtube: '',
      tiktok: ''
    }
  },

  /* ---------- Truyền thông & video ----------
     Chỉ đăng bài/video CÓ THẬT, ghi đúng nguồn.
     Hiện chỉ hiển thị video YouTube nổi bật. */
  media: {
    featured: {
      youtubeId: 'SpYfZOEOyG4',       // https://www.youtube.com/watch?v=SpYfZOEOyG4
      title: 'Review sách Nhà Giả Kim – Tác giả Paulo Coelho',
      source: 'YouTube'
    },
    // Thẻ bài viết/video bên dưới video (đang tắt). Muốn bật lại: thêm phần tử
    // <ul id="media-list" class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"></ul> vào index.html
    // và khai báo dạng: { type, icon, source, title, excerpt, url, image }
    items: []
  },

  /* ---------- Đọc thử ----------
     Chỉ dùng trang sách được NXB/chủ sở hữu quyền cho phép.
     Khi có ảnh scan được phép: thêm { image: 'images/preview-pages/p1.webp', alt: '...' }
     Các trang dưới đây là trang GIỚI THIỆU do nhà sách tự biên soạn, không phải nội dung sách. */
  previewPages: [
    {
      layout: 'title',
      label: 'Paulo Coelho',
      heading: 'Nhà Giả Kim',
      body: ['Tiểu thuyết', 'Trang giới thiệu do nhà sách biên soạn']
    },
    {
      label: 'Giới thiệu',
      heading: 'Một câu chuyện ngụ ngôn hiện đại',
      body: [
        'Santiago là một cậu bé chăn cừu ở vùng Andalusia, Tây Ban Nha. Cậu đã chọn cuộc đời rong ruổi để được ngắm nhìn thế giới, cho đến khi một giấc mơ lặp lại thôi thúc cậu lên đường.',
        'Giấc mơ ấy dẫn lối cậu băng qua eo biển, tới những khu chợ đông đúc của châu Phi và sâu vào lòng sa mạc mênh mông — nơi kho báu được cho là đang chờ dưới chân Kim Tự Tháp.'
      ]
    },
    {
      label: 'Nhân vật',
      heading: 'Những người dẫn đường',
      body: [
        'Trên hành trình, Santiago gặp một vị vua già bí ẩn, một thương nhân bán pha lê, một người Anh mê sách giả kim và cô gái Fatima ở ốc đảo.',
        'Mỗi cuộc gặp là một bài học: về can đảm, về sự kiên nhẫn, về tình yêu và về việc đọc những “dấu hiệu” mà cuộc sống gửi tới.'
      ]
    },
    {
      label: 'Hành trình',
      heading: 'Sa mạc và nhà giả kim',
      body: [
        'Sa mạc thử thách Santiago bằng sự im lặng, bằng chiến tranh giữa các bộ tộc và bằng nỗi sợ mất đi những gì cậu đã có.',
        'Chính tại đây, cậu gặp nhà giả kim — người không dạy cậu cách biến chì thành vàng, mà dạy cậu lắng nghe trái tim mình.'
      ],
      quote: '“Khi bạn khao khát một điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.”'
    },
    {
      label: 'Thông điệp',
      heading: 'Huyền thoại cá nhân',
      body: [
        'Mỗi người đều có một “Huyền thoại cá nhân” — điều mà ta thực sự mong muốn được làm trong đời. Phần lớn chúng ta từ bỏ nó vì sợ hãi hoặc vì sự an toàn của thói quen.',
        'Nhà Giả Kim nhắc rằng con đường đi tìm giấc mơ cũng quan trọng như chính kho báu ở cuối con đường.'
      ]
    },
    {
      label: 'Dành cho bạn',
      heading: 'Ai nên đọc cuốn sách này?',
      body: [
        'Những ai đang đứng trước một ngã rẽ, đang tìm động lực để theo đuổi ước mơ, hoặc đơn giản muốn đọc một câu chuyện đẹp, giản dị mà sâu sắc.',
        'Một món quà ý nghĩa cho bạn bè, người thân — đặc biệt là những người sắp bước vào một hành trình mới.'
      ]
    }
  ],

  /* ---------- Đánh giá khách hàng ----------
     Chỉ dùng review THẬT. verified: true chỉ khi đã xác minh đơn hàng.
     gender: 'female' | 'male' → ảnh đại diện ngẫu nhiên từ randomuser.me theo giới tính.
     avatar: 'images/reviews/ten.webp' → dùng ảnh thật (khi khách đồng ý), ưu tiên hơn gender.
     Để items: [] sẽ hiện trạng thái trống. */
  reviews: {
    isDemo: true,
    items: [
      { name: 'Minh Anh', gender: 'female', rating: 5, date: '2026-09-12', verified: false,
        content: 'Bìa tím rất đẹp, in chữ vàng nổi bật. Câu chuyện nhẹ nhàng nhưng đọc xong cứ nghĩ mãi về “huyền thoại cá nhân” của chính mình.' },
      { name: 'Quốc Bảo', gender: 'male', rating: 5, date: '2026-08-30', verified: false,
        content: 'Mua làm quà sinh nhật cho em gái, sách được gói cẩn thận. Đây là cuốn mình đọc lại nhiều lần nhất.' },
      { name: 'Thu Hà', gender: 'female', rating: 4, date: '2026-08-21', verified: false,
        content: 'Văn phong giản dị, dễ đọc. Có vài đoạn mang tính ẩn dụ cần đọc chậm để thấm. Rất đáng để sở hữu.' },
      { name: 'Hoàng Nam', gender: 'male', rating: 5, date: '2026-07-18', verified: false,
        content: 'Đọc trong một buổi tối mà thấy được tiếp thêm năng lượng. Phù hợp cho những ai đang phân vân trước lựa chọn lớn.' },
      { name: 'Lan Phương', gender: 'female', rating: 4, date: '2026-07-02', verified: false,
        content: 'Giấy đẹp, chữ dễ đọc. Mình thích nhất đoạn Santiago ở sa mạc cùng nhà giả kim.' },
      { name: 'Đức Huy', gender: 'male', rating: 5, date: '2026-06-15', verified: false,
        content: 'Cuốn sách nhỏ nhưng chứa nhiều điều lớn. Mỗi lần đọc lại ở một giai đoạn khác nhau lại thấy một ý nghĩa mới.' }
    ]
  },

  /* 34 tỉnh, thành phố (theo sắp xếp đơn vị hành chính từ 01/07/2025).
     TODO: khi có backend, lấy danh mục + mã phường/xã từ API chính thức. */
  provinces: [
    'Thành phố Hà Nội', 'Thành phố Hồ Chí Minh', 'Thành phố Hải Phòng', 'Thành phố Đà Nẵng',
    'Thành phố Cần Thơ', 'Thành phố Huế', 'An Giang', 'Bắc Ninh', 'Cà Mau', 'Cao Bằng',
    'Đắk Lắk', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Tĩnh', 'Hưng Yên',
    'Khánh Hòa', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Nghệ An', 'Ninh Bình',
    'Phú Thọ', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sơn La', 'Tây Ninh',
    'Thái Nguyên', 'Thanh Hóa', 'Tuyên Quang', 'Vĩnh Long'
  ]
};

/* ---------- Dữ liệu từ database ----------
   Index.cshtml gán window.NGK.server (giá, video, đánh giá) trước khi file này chạy.
   Có giá trị nào thì ghi đè lên dữ liệu mẫu ở trên. */
(function (server) {
  if (!server) return;
  var d = window.NGK.data;

  if (server.bookUid) d.product.id = server.bookUid;
  if (typeof server.price === 'number') d.product.price = server.price;
  if (server.youtubeId) d.media.featured.youtubeId = server.youtubeId;

  d.reviews.isDemo = false;
  d.reviews.items = (server.reviews || []).map(function (r) {
    return { name: r.name, rating: r.rating, content: r.content, avatar: r.avatar, verified: false };
  });
})(window.NGK.server);

/* ---------- Tiện ích dùng chung ---------- */
window.NGK.formatVND = function (value) {
  if (typeof value !== 'number' || !isFinite(value)) return 'Liên hệ';
  return value.toLocaleString('vi-VN') + 'đ';
};

window.NGK.escapeHTML = function (str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

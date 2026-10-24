/* =========================================================
   Đánh giá khách hàng
   - Thống kê tính từ dữ liệu: trung bình = Σ(rating × count) / tổng
   - Không có review → trạng thái trống, không giả lập social proof
   ========================================================= */
(function () {
  'use strict';

  var cfg = (window.NGK && window.NGK.data && window.NGK.data.reviews) || { items: [] };
  var esc = window.NGK.escapeHTML;
  var items = cfg.items || [];

  var summaryEl = document.getElementById('rating-summary');
  var listEl = document.getElementById('review-list');
  if (!summaryEl || !listEl) return;

  function starsHTML(value, extraClass) {
    var html = '<span class="stars ' + (extraClass || '') + '" aria-hidden="true">';
    for (var i = 1; i <= 5; i++) {
      if (value >= i) html += '<i class="fa-solid fa-star"></i>';
      else if (value >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
      else html += '<i class="fa-regular fa-star"></i>';
    }
    return html + '</span>';
  }

  function formatScore(n) {
    return n.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function initials(name) {
    var parts = String(name).trim().split(/\s+/);
    var a = parts[0] ? parts[0][0] : '';
    var b = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (a + b).toUpperCase();
  }

  /* --- Ảnh đại diện ngẫu nhiên theo giới tính (randomuser.me, ảnh 0–99) ---
     Không lặp ảnh giữa các khách cùng giới tính. */
  var usedPhotos = { women: [], men: [] };
  function avatarURL(r) {
    if (r.avatar) return r.avatar;
    if (r.gender !== 'female' && r.gender !== 'male') return '';
    var group = r.gender === 'female' ? 'women' : 'men';
    var n;
    do { n = Math.floor(Math.random() * 100); } while (usedPhotos[group].indexOf(n) !== -1);
    usedPhotos[group].push(n);
    return 'https://randomuser.me/api/portraits/' + group + '/' + n + '.jpg';
  }

  // Chữ viết tắt luôn nằm bên dưới, ảnh lỗi thì tự gỡ để lộ chữ viết tắt
  function avatarHTML(r) {
    var src = avatarURL(r);
    return '<span class="review-avatar" aria-hidden="true">' + esc(initials(r.name)) +
      (src ? '<img src="' + esc(src) + '" alt="" width="48" height="48" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
      '</span>';
  }

  /* --- Trạng thái trống --- */
  if (!items.length) {
    summaryEl.innerHTML =
      '<div class="py-6 text-center">' +
      '  <span class="stars stars--lg" aria-hidden="true"><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i></span>' +
      '  <p class="mt-4 font-display text-xl text-royal">Chưa có đánh giá nào</p>' +
      '  <p class="mx-auto mt-2 max-w-md text-sm text-ink/70">Hãy là người đầu tiên chia sẻ cảm nhận sau khi nhận sách — những đánh giá thật sẽ xuất hiện tại đây.</p>' +
      '</div>';
    listEl.parentElement.remove();
    return;
  }

  /* --- Thống kê --- */
  var counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  items.forEach(function (r) {
    var star = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[star]++;
  });
  var total = items.length;
  var sum = 0;
  for (var s = 1; s <= 5; s++) sum += s * counts[s];
  var avg = sum / total;

  var bars = '';
  for (var star = 5; star >= 1; star--) {
    var pct = Math.round((counts[star] / total) * 100);
    bars +=
      '<li class="flex items-center gap-3 text-sm">' +
      '  <span class="w-12 shrink-0 text-ink/80">' + star + ' <i class="fa-solid fa-star text-xs text-antique-gold" aria-hidden="true"></i><span class="sr-only"> sao</span></span>' +
      '  <span class="rating-bar" aria-hidden="true"><span style="width:' + pct + '%;animation-delay:' + ((5 - star) * 0.08) + 's"></span></span>' +
      '  <span class="w-20 shrink-0 text-right text-ink/70">' + pct + '% <span class="sr-only">(' + counts[star] + ' đánh giá)</span></span>' +
      '</li>';
  }

  summaryEl.innerHTML =
    '<div class="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-14">' +
    '  <div class="text-center md:border-r md:border-royal/10 md:pr-14">' +
    '    <p class="font-display text-6xl font-semibold leading-none text-royal">' + formatScore(avg) +
    '      <span class="font-body text-xl font-normal text-ink/50">/ 5</span></p>' +
    '    <div class="mt-3">' + starsHTML(avg, 'stars--lg') + '</div>' +
    '    <p class="sr-only">Điểm trung bình ' + formatScore(avg) + ' trên 5 sao</p>' +
    '    <p class="mt-2 text-sm text-ink/70">Dựa trên ' + total.toLocaleString('vi-VN') + ' đánh giá</p>' +
    '  </div>' +
    '  <ul class="space-y-2.5" aria-label="Phân bố số sao">' + bars + '</ul>' +
    '</div>';

  /* --- Review cards --- */
  listEl.innerHTML = items.map(function (r) {
    return '' +
      '<div class="review-slide">' +
      '<article class="card review-card">' +
      '  <header class="flex items-center gap-3">' +
      '    ' + avatarHTML(r) +
      '    <div class="min-w-0">' +
      '      <h3 class="truncate font-semibold text-royal">' + esc(r.name) + '</h3>' +
      '      <p class="text-xs text-ink/60"><time datetime="' + esc(r.date) + '">' + formatDate(r.date) + '</time></p>' +
      '    </div>' +
      '  </header>' +
      '  <div class="flex items-center gap-3">' + starsHTML(r.rating) +
      '    <span class="sr-only">' + r.rating + ' trên 5 sao</span>' +
      (r.verified ? '<span class="verified-badge"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Đã mua hàng</span>' : '') +
      '  </div>' +
      '  <p class="text-[15px] leading-relaxed text-ink/85">“' + esc(r.content) + '”</p>' +
      '</article>' +
      '</div>';
  }).join('');

  /* --- Slider ngang bằng Slick, tự động chạy từ trái sang phải --- */
  var $ = window.jQuery;
  if (!$ || !$.fn.slick) return; // không tải được Slick → vẫn hiển thị dạng lưới

  // true: card trượt từ trái sang phải; false: chiều mặc định (phải sang trái)
  var LEFT_TO_RIGHT = true;
  var AUTOPLAY_MS = 3500;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $slider = $(listEl);

  $slider.slick({
    rows: 0,              // không bọc thêm div, giữ nguyên markup card
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,      // tự điều khiển autoplay bên dưới để chọn được chiều chạy
    speed: 600,
    cssEase: 'cubic-bezier(.22, .61, .36, 1)',
    infinite: true,
    arrows: false,
    dots: true,
    appendDots: $('[data-review-dots]'),
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  });

  $('[data-review-prev]').on('click', function () { $slider.slick('slickPrev'); restart(); });
  $('[data-review-next]').on('click', function () { $slider.slick('slickNext'); restart(); });

  /* --- Autoplay: slickPrev = nội dung trượt từ trái sang phải --- */
  var timer = null;
  var paused = false;

  function tick() {
    if (paused || document.hidden) return;
    $slider.slick(LEFT_TO_RIGHT ? 'slickPrev' : 'slickNext');
  }
  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(tick, AUTOPLAY_MS);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  function restart() { stop(); start(); }

  // Tạm dừng khi rê chuột hoặc focus bàn phím vào vùng slider
  var area = listEl.parentElement;
  area.addEventListener('mouseenter', function () { paused = true; });
  area.addEventListener('mouseleave', function () { paused = false; });
  area.addEventListener('focusin', function () { paused = true; });
  area.addEventListener('focusout', function () { paused = false; });

  start();
})();

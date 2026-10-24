/* =========================================================
   Đọc thử – hiệu ứng lật trang sách (StPageFlip)
   - Desktop: 2 trang mở như sách thật; mobile: 1 trang
   - Kéo góc trang / vuốt / phím mũi tên / nút điều hướng
   - Nút toàn màn hình phóng to chính cuốn sách
   - Không tải được thư viện → dự phòng cuộn ngang
   ========================================================= */
(function () {
  'use strict';

  var pages = (window.NGK && window.NGK.data && window.NGK.data.previewPages) || [];
  var esc = window.NGK.escapeHTML;

  var root = document.getElementById('preview');
  var book = document.getElementById('flipbook');
  if (!root || !book || !pages.length) return;

  var btnPrev = root.querySelector('[data-preview-prev]');
  var btnNext = root.querySelector('[data-preview-next]');
  var indicator = root.querySelector('[data-preview-indicator]');
  var btnZoom = root.querySelector('[data-preview-zoom]');
  var total = pages.length;

  /* --- Render trang --- */
  var SUN_SVG =
    '<svg viewBox="0 0 120 120" width="88" height="88" aria-hidden="true" style="margin-bottom:6cqw">' +
    '  <circle cx="60" cy="60" r="22" fill="none" stroke="#D8AD61" stroke-width="1.2"/>' +
    '  <circle cx="60" cy="60" r="14" fill="#D8AD61" fill-opacity=".85"/>' +
    '  <g stroke="#D8AD61" stroke-width="1.2" stroke-linecap="round">' +
    '    <line x1="60" y1="10" x2="60" y2="30"/><line x1="60" y1="90" x2="60" y2="110"/>' +
    '    <line x1="10" y1="60" x2="30" y2="60"/><line x1="90" y1="60" x2="110" y2="60"/>' +
    '    <line x1="25" y1="25" x2="38" y2="38"/><line x1="82" y1="82" x2="95" y2="95"/>' +
    '    <line x1="95" y1="25" x2="82" y2="38"/><line x1="38" y1="82" x2="25" y2="95"/>' +
    '  </g></svg>';

  function renderPage(page, i) {
    var label = 'Trang ' + (i + 1) + ' trên ' + total;
    var cls = 'preview-page' + (page.image ? ' preview-page--image' : page.layout === 'title' ? ' preview-page--title' : '');
    var inner;

    if (page.image) {
      inner = '<img src="' + esc(page.image) + '" alt="' + esc(page.alt || label) + '" loading="lazy" decoding="async">';
    } else if (page.layout === 'title') {
      inner = SUN_SVG +
        '<p class="page-label">' + esc(page.label) + '</p>' +
        '<h3>' + esc(page.heading) + '</h3>' +
        (page.body || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    } else {
      inner =
        '<p class="page-label">' + esc(page.label) + '</p>' +
        '<h3>' + esc(page.heading) + '</h3>' +
        (page.body || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
        (page.quote ? '<blockquote>' + esc(page.quote) + '</blockquote>' : '');
    }

    return '<div class="' + cls + '" role="group" aria-roledescription="trang" aria-label="' + label + '">' +
      '<div class="page-inner">' + inner + '</div>' +
      (page.image ? '' : '<span class="page-number">' + (i + 1) + '</span>') +
      '</div>';
  }

  book.innerHTML = pages.map(renderPage).join('');
  var pageEls = Array.prototype.slice.call(book.querySelectorAll('.preview-page'));

  /* --- Trang đang hiển thị: [start, end] --- */
  var visible = { start: 0, end: 0 };
  var hasFlip = !!(window.St && window.St.PageFlip);
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var flip = null;

  function pageText(start, end) {
    return start === end
      ? 'Trang ' + (start + 1) + ' / ' + total
      : 'Trang ' + (start + 1) + '–' + (end + 1) + ' / ' + total;
  }

  // Trang đang mở của một cuốn sách lật: 1 trang (portrait) hoặc cặp trang (landscape)
  function rangeOf(pf) {
    var idx = pf.getCurrentPageIndex();
    if (pf.getOrientation() === 'portrait') return [idx, idx];
    var start = idx - (idx % 2);
    return [start, Math.min(start + 1, total - 1)];
  }

  function setVisible(start, end) {
    visible.start = start;
    visible.end = end;
    indicator.textContent = pageText(start, end);
    btnPrev.disabled = start <= 0;
    btnNext.disabled = end >= total - 1;
  }

  /* --- Dự phòng: thư viện không tải được → cuộn ngang --- */
  if (!hasFlip) {
    book.classList.add('is-fallback');
    setVisible(0, 0);
    btnPrev.addEventListener('click', function () { book.scrollBy({ left: -book.clientWidth, behavior: 'smooth' }); });
    btnNext.addEventListener('click', function () { book.scrollBy({ left: book.clientWidth, behavior: 'smooth' }); });
    btnPrev.disabled = false;
    btnNext.disabled = false;
  } else {
    flip = new St.PageFlip(book, {
      width: 420,               // kích thước 1 trang chuẩn (tỉ lệ 3:4)
      height: 560,
      size: 'stretch',          // co giãn theo khung chứa
      minWidth: 260,
      maxWidth: 1200,           // đủ lớn cho chế độ toàn màn hình; kích thước thực theo khung chứa
      minHeight: 347,
      maxHeight: 1600,
      showCover: false,         // mở sẵn 2 trang 1–2 trên desktop
      usePortrait: true,        // màn hẹp → 1 trang
      mobileScrollSupport: true,// vẫn cuộn dọc trang web được trên mobile
      drawShadow: true,
      maxShadowOpacity: 0.45,
      flippingTime: reduceMotion ? 1 : 900
    });

    flip.loadFromHTML(pageEls);

    function sync() {
      var r = rangeOf(flip);
      setVisible(r[0], r[1]);
    }

    flip.on('flip', sync);
    flip.on('changeOrientation', sync);
    sync();

    btnPrev.addEventListener('click', function () { flip.flipPrev(); });
    btnNext.addEventListener('click', function () { flip.flipNext(); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); flip.flipPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); flip.flipNext(); }
    });
  }

  /* =========================================================
     Toàn màn hình: phóng to CHÍNH cuốn sách đang có (không tạo bản sao),
     nên hiệu ứng lật, số trang và trang đang đọc luôn giữ nguyên.
     - Dùng Fullscreen API nếu trình duyệt hỗ trợ (ẩn cả thanh địa chỉ)
     - Không hỗ trợ (VD Safari iPhone) → phủ kín cửa sổ bằng CSS
     ========================================================= */
  if (!btnZoom) return;
  var zoomIcon = btnZoom.querySelector('i');
  var isFs = false;

  // Báo thư viện tính lại kích thước sách theo khung mới
  function relayout() {
    requestAnimationFrame(function () {
      window.dispatchEvent(new Event('resize'));
      if (flip) {
        var r = rangeOf(flip);
        setVisible(r[0], r[1]);
      }
    });
  }

  function setFsUI(on) {
    isFs = on;
    root.classList.toggle('is-fullscreen', on);
    document.documentElement.classList.toggle('preview-fs-lock', on);
    zoomIcon.className = on
      ? 'fa-solid fa-down-left-and-up-right-to-center'
      : 'fa-solid fa-up-right-and-down-left-from-center';
    btnZoom.setAttribute('aria-label', on ? 'Thoát toàn màn hình' : 'Xem toàn màn hình');
    btnZoom.title = on ? 'Thu nhỏ' : 'Toàn màn hình';
    relayout();
  }

  function enterFs() {
    setFsUI(true);
    if (root.requestFullscreen) root.requestFullscreen().catch(function () { /* giữ chế độ phủ CSS */ });
    root.focus();
  }

  function exitFs() {
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    setFsUI(false);
    btnZoom.focus();
  }

  btnZoom.addEventListener('click', function () {
    if (isFs) exitFs();
    else enterFs();
  });

  // Người dùng thoát fullscreen bằng Esc của trình duyệt → đồng bộ giao diện
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && isFs) setFsUI(false);
  });

  // Chế độ phủ CSS (không có Fullscreen API): Esc để thoát
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isFs && !document.fullscreenElement) exitFs();
  });
})();

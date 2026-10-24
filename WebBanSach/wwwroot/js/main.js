/* =========================================================
   Khởi tạo chung: đổ dữ liệu giá / nhà sách, năm bản quyền,
   hiệu ứng xuất hiện khi cuộn (reveal).
   File này nạp CUỐI để quan sát cả các phần tử do JS khác render.
   ========================================================= */
(function () {
  'use strict';

  var data = window.NGK.data;
  var esc = window.NGK.escapeHTML;

  /* --- Giá bán --- */
  document.querySelectorAll('[data-price]').forEach(function (el) {
    el.textContent = window.NGK.formatVND(data.product.price);
  });

  /* --- Thông tin nhà sách --- */
  var store = data.store;
  document.querySelectorAll('[data-store]').forEach(function (el) {
    var key = el.getAttribute('data-store');
    if (store[key]) el.textContent = store[key];
  });

  var contact = document.getElementById('footer-contact');
  if (contact) {
    var rows = [
      { icon: 'fa-location-dot', html: esc(store.address) },
      store.phone
        ? { icon: 'fa-phone', html: '<a class="footer-link" href="tel:' + esc(store.phone.replace(/\s/g, '')) + '">' + esc(store.phone) + '</a>' }
        : { icon: 'fa-phone', html: 'Cập nhật số điện thoại' },
      store.email
        ? { icon: 'fa-envelope', html: '<a class="footer-link" href="mailto:' + esc(store.email) + '">' + esc(store.email) + '</a>' }
        : { icon: 'fa-envelope', html: 'Cập nhật email' },
      { icon: 'fa-clock', html: esc(store.hours) }
    ];
    contact.innerHTML = rows.map(function (r) {
      return '<li class="flex min-h-10 items-start gap-3 py-1.5">' +
        '<i class="fa-solid ' + r.icon + ' mt-1 w-4 text-antique-gold" aria-hidden="true"></i>' +
        '<span>' + r.html + '</span></li>';
    }).join('');
  }

  var social = document.getElementById('footer-social');
  if (social) {
    var networks = [
      { key: 'facebook', icon: 'fa-facebook-f', label: 'Facebook' },
      { key: 'youtube', icon: 'fa-youtube', label: 'YouTube' },
      { key: 'tiktok', icon: 'fa-tiktok', label: 'TikTok' }
    ].filter(function (n) { return store.social && store.social[n.key]; });

    social.innerHTML = networks.map(function (n) {
      return '<a class="social-btn" href="' + esc(store.social[n.key]) + '" target="_blank" rel="noopener" aria-label="' + n.label + ' của nhà sách (mở tab mới)">' +
        '<i class="fa-brands ' + n.icon + '" aria-hidden="true"></i></a>';
    }).join('');
  }

  /* --- Năm bản quyền --- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- Hiệu ứng reveal --- */
  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealEls.forEach(function (el) { observer.observe(el); });
})();

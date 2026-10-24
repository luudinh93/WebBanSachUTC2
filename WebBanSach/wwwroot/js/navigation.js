/* =========================================================
   Header: trạng thái khi cuộn, menu mobile (drawer),
   đánh dấu mục menu đang xem.
   ========================================================= */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = document.getElementById('nav-toggle');
  var panel = document.getElementById('mobile-nav');
  if (!header || !toggle || !panel) return;

  var icon = toggle.querySelector('i');

  /* --- Header đổi nền + blur khi cuộn --- */
  var ticking = false;
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  updateHeader();

  /* --- Drawer mobile --- */
  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function openMenu() {
    panel.hidden = false;
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Đóng menu');
    icon.className = 'fa-solid fa-xmark';
    var firstLink = panel.querySelector('a');
    if (firstLink) firstLink.focus();
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick);
  }

  function closeMenu(returnFocus) {
    panel.hidden = true;
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Mở menu');
    icon.className = 'fa-solid fa-bars';
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutsideClick);
    if (returnFocus) toggle.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu(true);
      return;
    }
    // Giữ focus trong vùng menu + nút toggle khi dùng Tab
    if (e.key === 'Tab') {
      var focusables = [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll('a')));
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onOutsideClick(e) {
    if (!header.contains(e.target)) closeMenu(false);
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isOpen()) closeMenu(false);
    else openMenu();
  });

  panel.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu(false);
  });

  // Đóng drawer khi chuyển lên màn hình lớn
  var desktopMQ = window.matchMedia('(min-width: 1024px)');
  function onBreakpoint() { if (desktopMQ.matches && isOpen()) closeMenu(false); }
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onBreakpoint);

  /* --- Đánh dấu mục menu tương ứng section đang xem --- */
  var links = document.querySelectorAll('.nav-link');
  if (!('IntersectionObserver' in window) || !links.length) return;

  var sections = Array.prototype.map.call(links, function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        var active = link.getAttribute('href') === '#' + entry.target.id;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

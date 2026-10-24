/* =========================================================
   Truyền thông & Video
   - Video nổi bật: click-to-load iframe YouTube (không tải sẵn)
   - Media cards render từ NGK.data.media
   ========================================================= */
(function () {
  'use strict';

  var data = window.NGK && window.NGK.data && window.NGK.data.media;
  var esc = window.NGK.escapeHTML;
  if (!data) return;

  var items = data.items || [];
  var featured = data.featured || {};
  var realCount = items.filter(function (i) { return !i.isDemo && i.url; }).length;

  /* --- Tiêu đề: không đủ bài báo thật → dùng tiêu đề thay thế --- */
  var titleEl = document.querySelector('[data-media-title]');
  if (titleEl && realCount < 3) titleEl.textContent = 'Review và góc nhìn về Nhà Giả Kim';

  /* --- Video nổi bật --- */
  var frame = document.getElementById('featured-video');
  var vTitle = document.getElementById('featured-video-title');
  var vSource = document.getElementById('featured-video-source');

  if (frame) {
    var id = featured.youtubeId;
    vTitle.textContent = featured.title || 'Video về Nhà Giả Kim';
    vSource.innerHTML = '<i class="fa-brands fa-youtube mr-1" aria-hidden="true"></i>' + esc(featured.source || '');

    if (id) {
      frame.innerHTML =
        '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg" alt="" loading="lazy" decoding="async" width="480" height="360">' +
        '<button type="button" class="video-play" aria-label="Phát video: ' + esc(featured.title) + '">' +
        '<i class="fa-solid fa-play" aria-hidden="true"></i></button>';

      frame.querySelector('.video-play').addEventListener('click', function () {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
        iframe.title = featured.title || 'Video về Nhà Giả Kim';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        frame.innerHTML = '';
        frame.appendChild(iframe);
        iframe.focus();
      });
    } else {
      frame.innerHTML =
        '<div class="video-placeholder">' +
        '  <svg viewBox="0 0 400 200" class="absolute inset-x-0 bottom-0 w-full opacity-60" aria-hidden="true">' +
        '    <path d="M0 150 C80 120 150 170 230 146 C300 126 350 136 400 124 L400 200 L0 200 Z" fill="#1A0D33"/>' +
        '    <path d="M0 150 C80 120 150 170 230 146 C300 126 350 136 400 124" fill="none" stroke="#D8AD61" stroke-opacity=".5"/>' +
        '  </svg>' +
        '</div>' +
        '<button type="button" class="video-play" disabled aria-label="Video đang được cập nhật">' +
        '<i class="fa-solid fa-play" aria-hidden="true"></i></button>' +
        '<p class="absolute inset-x-0 bottom-4 text-center text-sm text-champagne/85">Video đang được cập nhật</p>';
    }
  }

  /* --- Media cards --- */
  var list = document.getElementById('media-list');
  if (!list) return;

  list.innerHTML = items.map(function (item, i) {
    var thumb = item.image
      ? '<img src="' + esc(item.image) + '" alt="" loading="lazy" decoding="async">'
      : '<i class="fa-solid ' + esc(item.icon || 'fa-newspaper') + '" aria-hidden="true"></i>';

    var link = item.url
      ? '<a href="' + esc(item.url) + '" target="_blank" rel="noopener" class="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-antique-gold hover:text-champagne">' +
        'Xem nguồn gốc <i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>' +
        '<span class="sr-only"> (mở tab mới)</span></a>'
      : '<p class="mt-auto pt-4 text-sm text-ivory/60"><i class="fa-regular fa-clock mr-1" aria-hidden="true"></i>Liên kết sẽ được cập nhật</p>';

    return '' +
      '<li class="reveal" style="--delay:' + (i * 0.08) + 's">' +
      '  <article class="media-card">' +
      '    <div class="media-thumb">' + thumb +
      '      <span class="media-type">' + esc(item.type) + '</span>' +
      '    </div>' +
      '    <div class="flex flex-1 flex-col p-6">' +
      '      <p class="flex items-center gap-2 text-xs font-medium uppercase tracking-[.14em] text-champagne/80">' +
               esc(item.source) + '</p>' +
      '      <h3 class="mt-3 text-lg font-semibold leading-snug text-ivory">' + esc(item.title) + '</h3>' +
      '      <p class="mt-2 text-sm leading-relaxed text-ivory/70">' + esc(item.excerpt) + '</p>' +
             link +
      '    </div>' +
      '  </article>' +
      '</li>';
  }).join('');
})();

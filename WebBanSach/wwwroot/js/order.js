/* =========================================================
   Order Modal & Form – trung tâm chuyển đổi
   - Mọi nút [data-open-order] mở CÙNG một <dialog>
   - Validate phía client, tính tổng tiền
   - POST tới backend; CHỈ báo thành công khi server trả status 200 + message
   - Sticky CTA mobile hiện khi CTA Hero ra khỏi màn hình
   ========================================================= */
(function () {
  'use strict';

  var NGK = window.NGK;
  var data = NGK.data;
  var product = data.product;
  var shipping = data.shipping || {};
  var orderCfg = data.order || {};
  var fmt = NGK.formatVND;
  var esc = NGK.escapeHTML;

  var dialog = document.getElementById('order-dialog');
  var form = document.getElementById('order-form');
  var result = document.getElementById('order-result');
  var statusEl = document.getElementById('order-status');
  var submitBtn = form.querySelector('[data-submit]');
  var submitLabel = form.querySelector('[data-submit-label]');
  var qtyInput = form.elements.quantity;

  var lastTrigger = null;
  var submitting = false;
  var triedSubmit = false;
  var idempotencyKey = newKey();

  /* ---------- Khởi tạo nội dung form ---------- */
  qtyInput.max = product.maxQuantity;
  setText('[data-max-qty]', product.maxQuantity);
  setText('[data-product-edition]', product.edition);
  setText('[data-shipping-policy]', shipping.policy || '');

  function setText(selector, value) {
    dialog.querySelectorAll(selector).forEach(function (el) { el.textContent = value; });
  }

  function newKey() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'k-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  /* ---------- Mở / đóng modal ---------- */
  function openOrderModal(trigger) {
    lastTrigger = trigger || null;
    if (dialog.open) return;

    // Sau một đơn thành công, lần mở tiếp theo là đơn mới
    if (!result.hidden) resetToForm(true);

    dialog.showModal();
    document.body.classList.add('modal-open');
    document.documentElement.style.overflow = 'hidden';
    form.elements.fullName.focus();
  }
  NGK.openOrderModal = openOrderModal;
  // Gọi được từ console để thử dialog kết quả: NGK.showOrderResult(message, data)
  NGK.showOrderResult = function (message, data) { showResult(message, data); };

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open-order]');
    if (!trigger) return;
    e.preventDefault();
    openOrderModal(trigger);
  });

  dialog.querySelectorAll('[data-close-order]').forEach(function (btn) {
    btn.addEventListener('click', function () { dialog.close(); });
  });

  // Click overlay để đóng (dữ liệu đã nhập vẫn được giữ)
  var pressedOnBackdrop = false;
  dialog.addEventListener('mousedown', function (e) { pressedOnBackdrop = e.target === dialog; });
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog && pressedOnBackdrop && !submitting) dialog.close();
    pressedOnBackdrop = false;
  });

  // Không cho đóng bằng Escape khi đang gửi đơn
  dialog.addEventListener('cancel', function (e) { if (submitting) e.preventDefault(); });

  dialog.addEventListener('close', function () {
    document.body.classList.remove('modal-open');
    document.documentElement.style.overflow = '';
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  });

  /* ---------- Số lượng & tổng tiền ---------- */
  function getQty() {
    var q = parseInt(qtyInput.value, 10);
    return isNaN(q) ? 0 : q;
  }

  function shippingFee(subtotal) {
    if (typeof shipping.freeFrom === 'number' && subtotal >= shipping.freeFrom) return 0;
    return typeof shipping.fee === 'number' ? shipping.fee : null;
  }

  function updateSummary() {
    var qty = getQty();
    var validQty = qty >= 1 && qty <= product.maxQuantity;
    var subtotal = validQty && typeof product.price === 'number' ? product.price * qty : null;
    var ship = subtotal === null ? null : shippingFee(subtotal);

    setText('[data-sum="unit"]', fmt(product.price));
    setText('[data-sum="qty"]', validQty ? qty : '—');
    setText('[data-sum="subtotal"]', subtotal === null ? '—' : fmt(subtotal));
    setText('[data-sum="shipping"]',
      ship === 0 ? 'Miễn phí'
        : ship === null ? 'Báo sau khi xác nhận'
        : fmt(ship));
    setText('[data-sum="total"]',
      subtotal === null ? '—' : fmt(subtotal + (ship || 0)) + (ship === null ? ' + phí ship' : ''));

    form.querySelector('[data-qty="-1"]').disabled = qty <= 1;
    form.querySelector('[data-qty="1"]').disabled = qty >= product.maxQuantity;
  }

  form.querySelectorAll('[data-qty]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = getQty() + parseInt(btn.getAttribute('data-qty'), 10);
      qtyInput.value = Math.min(Math.max(next, 1), product.maxQuantity);
      updateSummary();
      if (triedSubmit) validateField('quantity');
    });
  });
  qtyInput.addEventListener('input', updateSummary);

  /* ---------- Validation ---------- */
  function normalizePhone(raw) {
    var p = String(raw || '').replace(/[\s.\-()]/g, '');
    if (p.indexOf('+84') === 0) p = '0' + p.slice(3);
    else if (p.indexOf('84') === 0 && p.length === 11) p = '0' + p.slice(2);
    return p;
  }

  var validators = {
    fullName: function (v) {
      v = v.trim();
      if (!v) return 'Vui lòng nhập họ và tên.';
      if (v.length < 2 || v.length > 100) return 'Họ tên cần từ 2 đến 100 ký tự.';
      return '';
    },
    phone: function (v) {
      if (!v.trim()) return 'Vui lòng nhập số điện thoại.';
      if (!/^0(3|5|7|8|9)\d{8}$/.test(normalizePhone(v))) return 'Số điện thoại chưa đúng định dạng Việt Nam (VD: 0912 345 678).';
      return '';
    },
    email: function (v) {
      v = v.trim();
      if (!v) return ''; // không bắt buộc
      if (v.length > 100) return 'Email tối đa 100 ký tự.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email chưa đúng định dạng (VD: ban@vidu.com).';
      return '';
    },
    addressLine: function (v) {
      v = v.trim();
      if (!v) return 'Vui lòng nhập địa chỉ nhận hàng.';
      if (v.length < 5) return 'Địa chỉ quá ngắn, vui lòng ghi rõ số nhà, tên đường, phường/xã, tỉnh/thành phố.';
      return '';
    },
    quantity: function (v) {
      var q = Number(v);
      if (!Number.isInteger(q) || q < 1) return 'Số lượng tối thiểu là 1.';
      if (q > product.maxQuantity) return 'Số lượng tối đa là ' + product.maxQuantity + ' cuốn/đơn.';
      return '';
    }
  };

  function validateField(name) {
    var field = form.elements[name];
    var msg = validators[name](field.value);
    var err = document.getElementById('e-' + name);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) {
      err.innerHTML = msg ? '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ' + esc(msg) : '';
      err.classList.toggle('is-visible', !!msg);
    }
    return !msg;
  }

  Object.keys(validators).forEach(function (name) {
    var field = form.elements[name];
    field.addEventListener('blur', function () { if (triedSubmit || field.value) validateField(name); });
    field.addEventListener('input', function () { if (triedSubmit) validateField(name); });
    field.addEventListener('change', function () { if (triedSubmit) validateField(name); });
  });

  /* ---------- Trạng thái ---------- */
  function showStatus(type, html) {
    statusEl.className = 'form-status mt-4' + (type ? ' is-' + type : '');
    statusEl.innerHTML = html || '';
    if (html) statusEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function setLoading(on) {
    submitting = on;
    submitBtn.disabled = on;
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    submitBtn.querySelector('i, .spinner').outerHTML = on
      ? '<span class="spinner" aria-hidden="true"></span>'
      : '<i class="fa-solid fa-lock" aria-hidden="true"></i>';
    submitLabel.textContent = on ? 'Đang gửi đơn…' : 'Xác nhận đặt hàng';
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitting) return; // chống bấm nhiều lần
    triedSubmit = true;
    showStatus('', '');

    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) {
      firstInvalid.focus();
      showStatus('error', '<i class="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true"></i><span>Vui lòng kiểm tra lại các thông tin được đánh dấu.</span>');
      return;
    }

    var payload = {
      uidSach: product.id,
      soLuong: getQty(),
      tenKhachHang: form.elements.fullName.value.trim(),
      sdt: normalizePhone(form.elements.phone.value),
      email: form.elements.email.value.trim() || null,
      diaChi: form.elements.addressLine.value.trim(),
      maHinhThucThanhToan: form.elements.paymentMethod.value,
      ghiChu: form.elements.note.value.trim().slice(0, 300)
    };

    submitOrder(payload);
  });

  function submitOrder(payload) {
    if (!orderCfg.apiEndpoint) {
      // Chưa có backend: báo rõ ràng, giữ nguyên dữ liệu, KHÔNG giả vờ thành công.
      var phone = data.store.phone;
      showStatus('error',
        '<i class="fa-solid fa-plug-circle-xmark mt-0.5" aria-hidden="true"></i><span>' +
        '<strong>Đơn hàng chưa được gửi.</strong> Hệ thống đặt hàng trực tuyến đang được kết nối máy chủ. ' +
        (phone
          ? 'Vui lòng gọi <a class="font-semibold underline" href="tel:' + esc(phone) + '">' + esc(phone) + '</a> để đặt sách.'
          : 'Vui lòng thử lại sau hoặc liên hệ nhà sách để đặt hàng.') +
        '</span>');
      return;
    }

    setLoading(true);
    var controller = 'AbortController' in window ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, orderCfg.timeoutMs || 15000) : null;

    fetch(orderCfg.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Idempotency-Key': idempotencyKey, // backend dùng để chống tạo đơn trùng
        'RequestVerificationToken': form.elements.__RequestVerificationToken.value // ValidateAntiForgeryToken
      },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (!res.ok) {
            var err = new Error(body.message || 'HTTP ' + res.status);
            err.userMessage = body.message;
            throw err;
          }
          if (body.status !== 200) throw new Error('Phản hồi không hợp lệ');
          return body;
        });
      })
      .then(function (body) {
        idempotencyKey = newKey();
        showResult(body.message, body.data);
      })
      .catch(function (err) {
        var msg = err.name === 'AbortError'
          ? 'Máy chủ phản hồi quá lâu. Đơn hàng có thể chưa được tạo — vui lòng thử lại.'
          : err.userMessage || 'Không thể gửi đơn hàng do lỗi kết nối hoặc máy chủ. Thông tin của bạn vẫn được giữ, vui lòng thử lại.';
        showStatus('error', '<i class="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true"></i><span>' + esc(msg) + '</span>');
      })
      .then(function () {
        if (timer) clearTimeout(timer);
        setLoading(false);
      });
  }

  /* ---------- Kết quả (chỉ khi server xác nhận): dialog SweetAlert2 ở giữa màn hình ----------
     data = Responses.Data (ThongTinDonHang): maDonHang, soLuong, tongTien, tenHinhThucThanhToan,
     chuyenKhoan (chỉ có khi chọn chuyển khoản): nganHang, soTaiKhoan, tenTaiKhoan, soTien, noiDung, anhQR */
  function infoRow(label, value, strong) {
    return '<div class="ngk-swal-row"><dt>' + esc(label) + '</dt><dd' + (strong ? ' class="is-strong"' : '') + '>' + value + '</dd></div>';
  }

  function showResult(message, data) {
    // Đóng modal đặt hàng (dialog nằm ở top layer sẽ che SweetAlert) và làm mới form cho đơn sau
    resetToForm(true);
    dialog.close();

    data = data || {};
    // Chỉ hiện QR + thông tin tài khoản khi khách chọn chuyển khoản; COD thì bỏ hẳn
    var ck = data.maHinhThucThanhToan === 'CHUYEN_KHOAN' ? data.chuyenKhoan : null;

    // Cột trái: thông tin đơn (+ thông tin tài khoản nếu chuyển khoản)
    var left =
      '<dl class="ngk-swal-card">' +
      infoRow('Mã đơn hàng', esc(data.maDonHang || ''), true) +
      infoRow('Số lượng', esc(String(data.soLuong || '')) + ' cuốn') +
      infoRow('Tổng tiền', esc(fmt(data.tongTien)), true) +
      infoRow('Thanh toán', esc(data.tenHinhThucThanhToan || '')) +
      '</dl>' +
      (ck
        ? '<dl class="ngk-swal-card ngk-swal-card--bank">' +
          infoRow('Ngân hàng', esc(ck.nganHang)) +
          infoRow('Số tài khoản', esc(ck.soTaiKhoan), true) +
          infoRow('Chủ tài khoản', esc(ck.tenTaiKhoan)) +
          infoRow('Số tiền', esc(fmt(ck.soTien)), true) +
          infoRow('Nội dung', esc(ck.noiDung), true) +
          '</dl>'
        : '');

    // Cột phải (chỉ khi chuyển khoản): mã QR
    var right = !ck ? '' :
      '<div class="ngk-swal-qrbox">' +
      '  <p class="ngk-swal-qrtitle"><i class="fa-solid fa-qrcode" aria-hidden="true"></i> Quét mã để chuyển khoản</p>' +
      (ck.anhQR
        ? '<img class="ngk-swal-qr" src="' + esc(ck.anhQR) + '" width="240" height="240" alt="Mã QR chuyển khoản cho đơn ' + esc(ck.maDonHang) + '">'
        : '<p class="ngk-swal-note">Chưa tạo được mã QR, vui lòng chuyển khoản theo thông tin tài khoản.</p>') +
      '</div>';

    var html =
      '<div class="ngk-swal-grid' + (ck ? ' has-qr' : '') + '">' +
      '  <div class="ngk-swal-col">' + left + '</div>' +
      right +
      '</div>' +
      (message ? '<p class="ngk-swal-note">' + esc(message) + '</p>' : '');

    var Swal = window.Swal || window.Sweetalert2;
    if (!Swal) { window.alert('Đặt hàng thành công! Mã đơn: ' + (data.maDonHang || '')); return; }

    Swal.fire({
      icon: 'success',
      title: 'Đặt hàng thành công',
      html: html,
      width: ck ? 860 : 480,        // có QR: rộng để dàn 2 cột trên desktop
      confirmButtonText: 'Hoàn tất',
      buttonsStyling: false,       // dùng class .btn của theme thay cho style mặc định
      customClass: {
        popup: 'ngk-swal',
        title: 'ngk-swal-title',
        htmlContainer: 'ngk-swal-body',
        confirmButton: 'btn btn-royal',
        actions: 'ngk-swal-actions'
      }
    });
  }

  function resetToForm(clear) {
    if (clear) {
      form.reset();
      triedSubmit = false;
      Object.keys(validators).forEach(function (name) {
        form.elements[name].removeAttribute('aria-invalid');
        var err = document.getElementById('e-' + name);
        if (err) { err.innerHTML = ''; err.classList.remove('is-visible'); }
      });
      showStatus('', '');
      updateSummary();
    }
    result.hidden = true;
    result.innerHTML = '';
    form.hidden = false;
  }

  updateSummary();

  /* ---------- Sticky CTA mobile ---------- */
  var sticky = document.getElementById('sticky-cta');
  var heroCta = document.getElementById('hero-cta');
  if (sticky && heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) sticky.removeAttribute('inert');
      else sticky.setAttribute('inert', '');
    }).observe(heroCta);
  }
})();

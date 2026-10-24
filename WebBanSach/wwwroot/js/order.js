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
        showResult(body.message);
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

  /* ---------- Kết quả (chỉ khi server xác nhận): alert Tailwind góc phải trên, tự ẩn sau 5s ---------- */
  var TOAST_MS = 5000;

  function showResult(message) {
    // Đóng modal và làm mới form để đơn sau bắt đầu từ trạng thái trống
    resetToForm(true);
    dialog.close();

    var toast = document.createElement('div');
    toast.setAttribute('role', 'alert');
    toast.className = 'fixed right-4 top-4 z-[9999] flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800 shadow-lg transition-opacity duration-300';
    toast.innerHTML =
      '<i class="fa-solid fa-circle-check mt-0.5 text-green-600" aria-hidden="true"></i>' +
      '<p class="flex-1">' + esc(message || 'Đặt hàng thành công.') + '</p>';
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('opacity-0');
      setTimeout(function () { toast.remove(); }, 300);
    }, TOAST_MS);
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

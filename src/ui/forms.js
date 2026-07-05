// Отправка форм: валидация, honeypot, POST на CONFIG.formEndpoint
// (dev-заглушка при пустом endpoint), цель Метрики.
import { CONFIG, reachGoal, track } from '../data/config.js';

function markInvalid(field, invalid) {
  field.classList.toggle('is-invalid', invalid);
}

export function validateForm(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach((f) => {
    let bad;
    if (f.type === 'checkbox') bad = !f.checked;
    else if (f.type === 'tel') bad = f.value.replace(/\D/g, '').length < 10;
    else bad = !f.value.trim();
    markInvalid(f, bad);
    if (bad) ok = false;
  });
  return ok;
}

async function send(form, extra = {}) {
  const data = new FormData(form);
  // honeypot: боты заполняют скрытое поле — тихо "успех" без отправки
  if (data.get('hp_field')) return true;
  data.delete('hp_field');
  Object.entries(extra).forEach(([k, v]) => data.append(k, v));
  data.append('page', location.href);

  if (!CONFIG.formEndpoint) {
    console.info('[forms] dev stub, заявка:', Object.fromEntries(data));
    return true;
  }
  try {
    const res = await fetch(CONFIG.formEndpoint, { method: 'POST', body: data });
    return res.ok;
  } catch {
    // fallback GET (как на боевых lp/lp2)
    try {
      const qs = new URLSearchParams(data).toString();
      const res = await fetch(`${CONFIG.formEndpoint}?${qs}`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

export function bindForm(form, { successSel, extra } = {}) {
  if (!form) return;
  // маска телефона: мягкая, +7 подставляется
  const phone = form.querySelector('input[type="tel"]');
  phone?.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    let out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length >= 5) out += ') ' + d.slice(4, 7);
    if (d.length >= 8) out += '-' + d.slice(7, 9);
    if (d.length >= 10) out += '-' + d.slice(9, 11);
    phone.value = out;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const ok = await send(form, typeof extra === 'function' ? extra() : extra || {});
    btn.disabled = false;
    const success = form.querySelector(successSel);
    if (ok) {
      reachGoal();
      track('form_submitted', { form: form.id });
      if (success) success.hidden = false;
      form.querySelectorAll('input:not([type="checkbox"]), select').forEach((f) => (f.value = ''));
      form.querySelectorAll('input[type="checkbox"]').forEach((f) => (f.checked = false));
    } else if (success) {
      success.hidden = false;
      success.textContent =
        'Не получилось отправить заявку. Позвоните нам: ' + CONFIG.phone;
    }
  });

  // снятие ошибки при вводе
  form.addEventListener('input', (e) => {
    if (e.target.matches('.is-invalid')) markInvalid(e.target, false);
  });
  form.addEventListener('change', (e) => {
    if (e.target.matches('.is-invalid')) markInvalid(e.target, false);
  });
}

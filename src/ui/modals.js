// Модалка деталей модели + лайтбокс галереи. Focus-trap, Esc, клик по фону.
import { MODELS, WORKS, fmtPrice } from '../data/models.js';
import { asset } from '../data/assets.js';
import { track } from '../data/config.js';

let lenisRef = null;
let lastFocused = null;

function trapFocus(container, e) {
  const focusables = container.querySelectorAll(
    'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function buildModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Детали модели">
      <button type="button" class="modal__close" aria-label="Закрыть">&times;</button>
      <div class="modal__body"></div>
    </div>`;
  document.body.appendChild(backdrop);
  return backdrop;
}

function buildLightbox() {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Закрыть">&times;</button>
    <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Предыдущее фото">‹</button>
    <img alt="" />
    <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Следующее фото">›</button>`;
  document.body.appendChild(lb);
  return lb;
}

export function initModals(lenis) {
  lenisRef = lenis;
  const backdrop = buildModal();
  const modal = backdrop.querySelector('.modal');
  const body = backdrop.querySelector('.modal__body');
  const lb = buildLightbox();
  const lbImg = lb.querySelector('img');
  let lbIndex = 0;

  function open(el) {
    lastFocused = document.activeElement;
    el.classList.add('is-open');
    lenisRef?.stop();
  }
  function close(el) {
    el.classList.remove('is-open');
    lenisRef?.start();
    lastFocused?.focus?.();
  }

  backdrop.querySelector('.modal__close').addEventListener('click', () => close(backdrop));
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close(backdrop);
  });
  lb.querySelector('.lightbox__close').addEventListener('click', () => close(lb));
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close(lb);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (backdrop.classList.contains('is-open')) close(backdrop);
      if (lb.classList.contains('is-open')) close(lb);
    }
    if (e.key === 'Tab' && backdrop.classList.contains('is-open')) trapFocus(modal, e);
    if (lb.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') showWork(lbIndex + 1);
      if (e.key === 'ArrowLeft') showWork(lbIndex - 1);
    }
  });

  function openModel(id) {
    const m = MODELS.find((x) => x.id === id);
    if (!m) return;
    track('model_modal_opened', { model: m.name });
    body.innerHTML = `
      <h3>${m.name}</h3>
      <p class="model-card__tag">${m.tag}</p>
      <ul class="modal__specs">
        <li>Размеры: <strong>${m.sizes}</strong></li>
        <li>Глубина: <strong>${m.depth}</strong></li>
        <li>Объём: <strong>${m.volume}</strong></li>
        <li>Цена по акции: <strong>от ${fmtPrice(m.priceNow)}</strong></li>
      </ul>
      <p class="modal__desc">${m.desc}</p>
      <p class="modal__desc">В цену «под ключ» входят: чаша, земляные работы, обвязка
        и оборудование, утепление ППУ Premium Nord, монтаж и пусконаладка.
        Точная стоимость под ваш участок — после бесплатного выезда инженера.</p>
      <a href="#final-cta" class="btn btn--primary" data-close-modal>Получить расчёт</a>`;
    body.querySelector('[data-close-modal]').addEventListener('click', () => close(backdrop));
    open(backdrop);
    backdrop.querySelector('.modal__close').focus();
  }

  function showWork(i) {
    lbIndex = (i + WORKS.length) % WORKS.length;
    const w = WORKS[lbIndex];
    const url = asset(w.key);
    if (url) {
      lbImg.src = url;
      lbImg.alt = w.caption;
    } else {
      // заглушка: SVG-градиент с подписью
      lbImg.src =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#0b3a6f"/><stop offset="1" stop-color="#18a6c9"/>
            </linearGradient></defs>
            <rect width="1200" height="800" fill="url(#g)"/>
            <text x="600" y="410" text-anchor="middle" fill="rgba(255,255,255,.85)"
              font-family="sans-serif" font-size="34">${w.caption}</text>
          </svg>`
        );
      lbImg.alt = w.caption;
    }
  }

  lb.querySelector('.lightbox__nav--prev').addEventListener('click', () => showWork(lbIndex - 1));
  lb.querySelector('.lightbox__nav--next').addEventListener('click', () => showWork(lbIndex + 1));

  return {
    openModel,
    openWork(i) {
      showWork(i);
      open(lb);
      lb.querySelector('.lightbox__close').focus();
    },
  };
}

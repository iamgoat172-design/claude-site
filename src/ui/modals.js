// Модалка деталей модели + лайтбокс галереи. Focus-trap, Esc, клик по фону.
import { MODELS, WORKS, fmtPrice } from '../data/models.js';
import { asset } from '../data/assets.js';
import { track } from '../data/config.js';
import { bindForm } from './forms.js';
import { QUIZ_TEMPLATE, initQuiz } from './quiz.js';

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

function buildLeadModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal modal--lead" role="dialog" aria-modal="true" aria-label="Заявка на расчёт">
      <button type="button" class="modal__close" aria-label="Закрыть">&times;</button>
      <p class="hero__panel-title">Расчёт под ваш участок</p>
      <p class="hero__panel-sub">Инженер перезвонит в течение 30 минут. Выезд и замер — 5 000 ₽, зачтём в стоимость договора.</p>
      <form id="lead-form" class="hero-form" novalidate>
        <input type="text" name="hp_field" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <label>Имя<input type="text" name="name" required autocomplete="name" /></label>
        <label>Телефон<input type="tel" name="phone" required autocomplete="tel" placeholder="+7 (___) ___-__-__" /></label>
        <label class="checkbox"><input type="checkbox" name="consent" required /><span>Согласен с <a href="/privacy.html" target="_blank" rel="noopener" tabindex="-1">политикой обработки данных</a></span></label>
        <button type="submit" class="btn btn--primary btn--wide">Получить расчёт</button>
        <p class="form-risk">Звонок ни к чему не обязывает. Смета — до подписания договора.</p>
        <p class="lead-form__success" role="status" hidden>Спасибо! Инженер свяжется с вами в течение 30 минут.</p>
      </form>
    </div>`;
  document.body.appendChild(backdrop);
  return backdrop;
}

function buildQuizModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal modal--lead modal--quiz" role="dialog" aria-modal="true" aria-label="Подбор бассейна">
      <button type="button" class="modal__close" aria-label="Закрыть">&times;</button>
      <p class="hero__panel-title">Подберём бассейн за 1 минуту</p>
      <p class="hero__panel-sub">Три вопроса — модель, ориентир по цене и расчёт без обязательств.</p>
      <div class="quiz quiz--popup">${QUIZ_TEMPLATE}</div>
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
  const lead = buildLeadModal();
  const leadModal = lead.querySelector('.modal');
  let leadContext = '';
  const quiz = buildQuizModal();
  const quizModal = quiz.querySelector('.modal');
  let quizInited = false;
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
  lead.querySelector('.modal__close').addEventListener('click', () => close(lead));
  lead.addEventListener('click', (e) => {
    if (e.target === lead) close(lead);
  });
  quiz.querySelector('.modal__close').addEventListener('click', () => close(quiz));
  quiz.addEventListener('click', (e) => {
    if (e.target === quiz) close(quiz);
  });
  lb.querySelector('.lightbox__close').addEventListener('click', () => close(lb));
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close(lb);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (backdrop.classList.contains('is-open')) close(backdrop);
      if (lead.classList.contains('is-open')) close(lead);
      if (quiz.classList.contains('is-open')) close(quiz);
      if (lb.classList.contains('is-open')) close(lb);
    }
    if (e.key === 'Tab' && backdrop.classList.contains('is-open')) trapFocus(modal, e);
    if (e.key === 'Tab' && lead.classList.contains('is-open')) trapFocus(leadModal, e);
    if (e.key === 'Tab' && quiz.classList.contains('is-open')) trapFocus(quizModal, e);
    if (lb.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') showWork(lbIndex + 1);
      if (e.key === 'ArrowLeft') showWork(lbIndex - 1);
    }
  });

  bindForm(lead.querySelector('#lead-form'), {
    successSel: '.lead-form__success',
    extra: () => ({ source: 'popup', context: leadContext }),
  });

  function openModel(id) {
    const m = MODELS.find((x) => x.id === id);
    if (!m) return;
    track('model_modal_opened', { model: m.name });
    const photo = asset(`photo-${m.id}`) || asset(`model-${m.id}`);
    const top = asset(`top-${m.id}`);
    body.innerHTML = `
      ${photo ? `<img class="modal__photo" src="${photo}" alt="Бассейн ${m.name}" />` : ''}
      ${top ? `<img class="modal__topview" src="${top}" alt="Схема чаши ${m.name} — вид сверху" loading="lazy" />` : ''}
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
        Точная стоимость под ваш участок — после выезда инженера (5 000 ₽, зачтём в стоимость договора).</p>
      <a href="#final-cta" class="btn btn--primary" data-lead="model:${m.name}">Получить расчёт</a>`;
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
    openQuiz() {
      if (!quizInited) {
        quizInited = true;
        initQuiz(quiz.querySelector('.quiz--popup'), { source: 'quiz-popup', track });
      }
      track('quiz_popup_opened', {});
      open(quiz);
      quiz.querySelector('.modal__close').focus();
    },
    openLead(context = '') {
      leadContext = context;
      if (backdrop.classList.contains('is-open')) close(backdrop);
      track('lead_popup_opened', { context });
      open(lead);
      lead.querySelector('input[name="name"]').focus();
    },
    openWork(i) {
      showWork(i);
      open(lb);
      lb.querySelector('.lightbox__close').focus();
    },
  };
}

// Bootstrap: Lenis + ScrollTrigger + WebGL-сцена + UI.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initFlyin } from './scroll/flyin.js';
import { initSnap } from './scroll/snap.js';
import { initProcess } from './scroll/process.js';
import { initTheme } from './ui/theme.js';
import { initNav } from './ui/nav.js';
import { initQuiz, QUIZ_TEMPLATE } from './ui/quiz.js';
import { initModals } from './ui/modals.js';
import { bindForm } from './ui/forms.js';
import {
  renderCatalog,
  renderEcoCatalog,
  initCatalogLines,
  renderSwatches,
  renderAddons,
  renderStages,
  renderWorks,
  renderLife,
  fillAssetSlots,
} from './ui/render.js';
import { asset } from './data/assets.js';
import { track } from './data/config.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis ---------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// QA-хук: ?qa=1 → window.__qa
if (new URLSearchParams(location.search).has('qa')) {
  window.__qa = { lenis, ScrollTrigger };
}

/* ---------- статика из данных ---------- */
renderStages();
const modals = initModals(lenis);
renderCatalog((id) => modals.openModel(id));
renderEcoCatalog((ctx) => modals.openLead(ctx));
initCatalogLines();
renderSwatches();
renderAddons();
renderWorks((i) => modals.openWork(i));
renderLife();
fillAssetSlots();

/* ---------- скролл-механика ---------- */
initProcess(reduced);

// переход hero → процесс: фото героя растворяется в стройку
const heroBg = document.getElementById('hero-bg');
const heroBgImg = heroBg?.querySelector('.hero__bg-img');
{
  const url = asset('heroBg');
  if (url && heroBgImg) heroBgImg.style.backgroundImage = `url(${url})`;
  else if (heroBg) heroBg.remove();
}
ScrollTrigger.create({
  trigger: '.section--process',
  start: 'top bottom',
  end: 'top 35%',
  scrub: 0.6,
  onUpdate(self) {
    const t = self.progress;
    if (heroBg && heroBg.isConnected) {
      heroBg.style.opacity = String(1 - t);
      if (heroBgImg && !reduced) heroBgImg.style.transform = `scale(${1.02 + t * 0.06})`;
    }
  },
});

// фикс-CTA «Заказать бассейн» на время скролла стройки
const processCta = document.getElementById('process-cta');
if (processCta) {
  ScrollTrigger.create({
    trigger: '.section--process',
    start: 'top 60%',
    end: 'bottom 85%',
    onToggle(self) {
      processCta.classList.toggle('is-visible', self.isActive);
    },
  });
}

initFlyin(reduced);
initSnap(reduced);
initTheme();

/* ---------- UI ---------- */
initNav(lenis);
const quizRoot = document.getElementById('quiz-root');
if (quizRoot) {
  quizRoot.innerHTML = QUIZ_TEMPLATE;
  initQuiz(quizRoot, { source: 'quiz', track });
}
bindForm(document.getElementById('final-form'), {
  successSel: '.final-form__success',
  extra: { source: 'final' },
});
bindForm(document.getElementById('hero-form'), {
  successSel: '.hero-form__success',
  extra: { source: 'hero' },
});

/* ---------- поп-апы заявки и квиза: кнопки не скроллят ---------- */
document.addEventListener('click', (e) => {
  const leadTrigger = e.target.closest('[data-lead]');
  if (leadTrigger) {
    e.preventDefault();
    modals.openLead(leadTrigger.dataset.lead || '');
    return;
  }
  const quizTrigger = e.target.closest('[data-quiz]');
  if (quizTrigger) {
    e.preventDefault();
    modals.openQuiz();
  }
});

/* ---------- событийный слой (TRACKING.md) ---------- */
document.addEventListener('click', (e) => {
  const tel = e.target.closest('a[href^="tel:"]');
  if (tel) {
    const zone = tel.closest('.pill-nav, .sticky-cta, .nav-drawer, .site-footer');
    track('phone_clicked', { location: zone ? zone.className.split(' ')[0] : 'page' });
    return;
  }
  const cta = e.target.closest('a.btn, .pill-nav__cta, .sticky-cta__btn');
  if (cta) {
    track('cta_clicked', {
      text: cta.textContent.trim().slice(0, 40),
      href: cta.getAttribute('href') || '',
    });
  }
});

/* ---------- стабильность триггеров при resize ---------- */
let resizeT = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => ScrollTrigger.refresh(), 250);
});

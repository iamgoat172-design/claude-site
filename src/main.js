// Bootstrap: Lenis + ScrollTrigger + WebGL-сцена + UI.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { PoolScene } from './scene/PoolScene.js';
import { initFlyin } from './scroll/flyin.js';
import { initSnap } from './scroll/snap.js';
import { initProcess } from './scroll/process.js';
import { initTheme } from './ui/theme.js';
import { initCursor } from './ui/cursor.js';
import { initNav } from './ui/nav.js';
import { initQuiz } from './ui/quiz.js';
import { initModals } from './ui/modals.js';
import { bindForm } from './ui/forms.js';
import {
  renderCatalog,
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

/* ---------- WebGL-сцена (с fallback) ---------- */
let scene = null;
const canvas = document.getElementById('scene-canvas');
const fallback = document.getElementById('scene-fallback');
try {
  const test = document.createElement('canvas');
  const gl = test.getContext('webgl2') || test.getContext('webgl');
  if (!gl) throw new Error('no webgl');
  scene = new PoolScene(canvas, { glbUrl: asset('poolGlb'), reduced });
} catch (err) {
  console.warn('[scene] WebGL недоступен, включён фолбэк:', err);
  canvas.hidden = true;
  if (fallback) {
    const url = asset('heroPoster');
    if (url) {
      fallback.src = url;
      fallback.hidden = false;
    }
  }
}

// QA-хук: ?qa=1 → window.__qa
if (new URLSearchParams(location.search).has('qa')) {
  window.__qa = { lenis, ScrollTrigger, poolScene: scene };
}

/* ---------- статика из данных ---------- */
renderStages();
const modals = initModals(lenis);
renderCatalog((id) => modals.openModel(id));
renderSwatches();
renderAddons();
renderWorks((i) => modals.openWork(i));
renderLife();
fillAssetSlots();

/* ---------- скролл-механика ---------- */
initProcess(scene, reduced);

// красивый переход hero → процесс: beauty-бассейн разбирается к «замеру»
if (scene) {
  ScrollTrigger.create({
    trigger: '.section--process',
    start: 'top bottom',
    end: 'top top',
    scrub: true,
    onUpdate(self) {
      scene.setHeroBlend(1 - self.progress);
    },
  });
}

initFlyin(reduced);
initSnap(reduced);
initTheme(scene);

/* ---------- UI ---------- */
initNav(lenis);
initCursor();
initQuiz();
bindForm(document.getElementById('final-form'), {
  successSel: '.final-form__success',
  extra: { source: 'final' },
});
bindForm(document.getElementById('hero-form'), {
  successSel: '.hero-form__success',
  extra: { source: 'hero' },
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

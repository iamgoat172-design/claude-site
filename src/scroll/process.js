// Хореография секции «Процесс»: фотореальная стройка одного двора.
// Один scrub-триггер ведёт кроссфейд 8 кадров (одна камера, один ракурс),
// деликатный Ken Burns внутри кадра, прогресс-бар и fly-in подписей с 4 сторон.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STAGES } from '../data/models.js';
import { asset } from '../data/assets.js';
import { track } from '../data/config.js';

const N = STAGES.length;
const AMP = 150; // амплитуда заезда текста, px
const DIR = {
  left: { x: -AMP, y: 0 },
  right: { x: AMP, y: 0 },
  up: { x: 0, y: -AMP * 0.85 },
  down: { x: 0, y: AMP * 0.85 },
};
const easeIn = [
  gsap.parseEase('power3.out'),
  gsap.parseEase('power4.out'),
  gsap.parseEase('expo.out'),
  gsap.parseEase('back.out(1.3)'),
];
const FADE = 0.18; // доля окна на растворение кадров

export function initProcess(reduced) {
  const stageEls = [...document.querySelectorAll('.process-stage')];
  const photos = [...document.querySelectorAll('.process__photo')];
  const clips = [...document.querySelectorAll('.process__clip')];
  const bar = document.getElementById('process-progress');
  if (!stageEls.length) return;

  const seenStages = new Set();
  let lastStage = -1;

  // видео-переходы (MERIDIAN-приём: скраб пред-рендеренной секвенции).
  // Оптимизация: (1) seek только после завершения предыдущего (иначе очередь
  // декодера = главный источник тормозов), (2) живут только клипы окна ±1 —
  // не 7 декодеров 1080p разом, (3) только десктоп; мобайл/Save-Data — стиллы.
  const clipReady = new Array(clips.length).fill(false);
  const clipUrls = clips.map((_, i) => asset(`clip-${i + 1}`));
  const wantClips =
    !reduced &&
    !navigator.connection?.saveData &&
    window.matchMedia('(min-width: 1024px)').matches;

  clips.forEach((v, i) => {
    if (!wantClips || !clipUrls[i]) return;
    v.addEventListener('loadeddata', () => {
      clipReady[i] = true;
    });
    // seek-цепочка: пока идёт прошлый seek — новый не ставим
    v.__target = 0;
    v.addEventListener('seeked', () => {
      if (Math.abs(v.currentTime - v.__target) > 0.07) v.currentTime = v.__target;
    });
  });

  let attachedAround = -99;
  function manageClipWindow(k) {
    if (!wantClips || k === attachedAround) return;
    attachedAround = k;
    clips.forEach((v, i) => {
      if (!clipUrls[i]) return;
      const near = Math.abs(i - k) <= 1;
      if (near && !v.src) {
        v.src = clipUrls[i];
        v.preload = 'auto';
        v.load();
      } else if (!near && v.src && Math.abs(i - k) >= 2) {
        clipReady[i] = false;
        v.removeAttribute('src');
        v.load(); // освобождает декодер; при возврате возьмётся из кэша
      }
    });
  }

  if (wantClips) {
    // подготовить первые клипы при подходе к секции
    ScrollTrigger.create({
      trigger: '.section--process',
      start: 'top 160%',
      once: true,
      onEnter() {
        manageClipWindow(0);
      },
    });
  }

  function update(p) {
    if (bar) bar.style.width = `${(p * 100).toFixed(2)}%`;

    const idx = Math.min(N - 1, Math.floor(p * N));
    if (idx !== lastStage) {
      lastStage = idx;
      if (!seenStages.has(idx)) {
        seenStages.add(idx);
        track('process_stage_reached', { stage: STAGES[idx].key });
      }
    }

    // скраб видео-морфа: в окне k играет клип k-1 (кадр k-1 → k),
    // первые 70% окна — скраб, дальше держим финальный кадр
    const activeClip = Math.min(clips.length - 1, Math.max(0, Math.floor(p * N) - 1));
    manageClipWindow(activeClip);
    let clipCovering = false;
    clips.forEach((v, i) => {
      const k = i + 1; // окно, в котором живёт клип
      const active = (p >= k / N && p < (k + 1) / N) || (k === N - 1 && p >= k / N);
      if (!wantClips || !clipReady[i] || !active) {
        v.style.opacity = 0;
        return;
      }
      const win = clamp((p - k / N) * N, 0, 1);
      const t = clamp(win / 0.7, 0, 1);
      v.__target = t * Math.max((v.duration || 5) - 0.05, 0);
      // новый seek — только если декодер свободен и сдвиг заметен
      if (!v.seeking && Math.abs(v.currentTime - v.__target) > 0.07) {
        v.currentTime = v.__target;
      }
      v.style.opacity = 1;
      clipCovering = true;
    });

    // кадры лежат стопкой по порядку: каждый следующий растворяется ПОВЕРХ
    // предыдущего на границе своего окна и дальше просто остаётся
    photos.forEach((ph, i) => {
      const o = i === 0 ? 1 : clamp((p - i / N) / (FADE / N), 0, 1);
      ph.style.opacity = o;
      if (!reduced && o > 0 && !clipCovering) {
        // Ken Burns: едва заметный наезд за время жизни кадра
        const life = clamp((p - i / N) * N, 0, 1);
        ph.style.transform = `scale(${1.055 - life * 0.05})`;
      }
    });

    stageEls.forEach((el, i) => {
      const start = i / N;
      const end = (i + 1) / N;
      const isLast = i === N - 1;
      const t = (p - start) / (end - start);

      if (t <= 0 || (t >= 1 && !isLast)) {
        el.style.opacity = 0;
        return;
      }
      const dir = DIR[STAGES[i].from] || DIR.up;

      if (reduced) {
        el.style.transform = 'none';
        el.style.opacity = t > 0 && (t < 1 || isLast) ? 1 : 0;
        return;
      }

      let x = 0;
      let y = 0;
      let o = 1;
      const IN = isLast ? 0.55 : 0.24;
      const OUT = 0.78;
      if (t < IN) {
        const k = easeIn[i % easeIn.length](t / IN);
        x = dir.x * (1 - k);
        y = dir.y * (1 - k);
        o = Math.min(1, (t / IN) * 1.4);
      } else if (!isLast && t > OUT) {
        const k = gsap.parseEase('power2.in')((t - OUT) / (1 - OUT));
        x = -dir.x * 0.5 * k;
        y = -dir.y * 0.5 * k;
        o = 1 - k;
      }
      const baseCenter = STAGES[i].pos === 'center';
      const isMobile = window.matchMedia('(max-width: 760px)').matches;
      if (isMobile) {
        el.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
      } else if (baseCenter) {
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      } else {
        el.style.transform = `translate(${x}px, ${y}px)`;
      }
      el.style.opacity = o;
    });
  }

  ScrollTrigger.create({
    trigger: '.section--process',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6, // мягкий догон прогресса — движение маслянистее
    onUpdate(self) {
      update(self.progress);
    },
  });

  update(0);
}

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

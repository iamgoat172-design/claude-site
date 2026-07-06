// Хореография секции «Процесс»: фотореальная стройка одного двора.
// Один scrub-триггер ведёт кроссфейд 8 кадров (одна камера, один ракурс),
// деликатный Ken Burns внутри кадра, прогресс-бар и смену плашек на месте.
// Видео-морфы — ПЛАВНАЯ перемотка по скроллу: не сикаем currentTime
// (прыжки между ключевыми кадрами дёргают декодер), а догоняем цель
// через playbackRate — декодер всегда идёт вперёд по кадрам, как при
// обычном проигрывании. Назад — редкий точный seek.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STAGES } from '../data/models.js';
import { asset } from '../data/assets.js';
import { track } from '../data/config.js';

const N = STAGES.length;
const easeIn = [gsap.parseEase('power3.out')];
const FADE = 0.18; // доля окна на растворение кадров

export function initProcess(reduced) {
  const stageEls = [...document.querySelectorAll('.process-stage')];
  const photos = [...document.querySelectorAll('.process__photo')];
  const clips = [...document.querySelectorAll('.process__clip')];
  const bar = document.getElementById('process-progress');
  if (!stageEls.length) return;

  const seenStages = new Set();
  let lastStage = -1;
  const mqMobile = window.matchMedia('(max-width: 760px)');

  // видео-переходы (MERIDIAN-приём): клип k живёт в окне этапа k+1.
  // Живут только клипы окна ±1; только десктоп.
  const clipReady = new Array(clips.length).fill(false);
  const clipTarget = new Array(clips.length).fill(-1); // -1 = вне окна
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
  });

  // перемотка-погоня: каждый тик подгоняем скорость проигрывания под
  // расстояние до цели. Вперёд — плавное проигрывание (0.05–4×), назад
  // или при большом отставании — один точный seek.
  const CATCH = 3.2; // насколько агрессивно догоняем (гэп 1с → 3.2×)
  function chase() {
    clips.forEach((v, i) => {
      const target = clipTarget[i];
      if (target < 0 || !clipReady[i] || v.seeking) return;
      const gap = target - v.currentTime;
      if (gap > 1.4 || gap < -0.3) {
        // слишком далеко (быстрый флик) или скролл назад — точный seek
        if (!v.paused) v.pause();
        v.currentTime = target;
      } else if (gap > 0.03) {
        v.playbackRate = clamp(gap * CATCH, 0.05, 4);
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause(); // догнали — стоим, ждём скролл
      }
    });
  }
  if (wantClips && clips.length) gsap.ticker.add(chase);

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
        clipTarget[i] = -1;
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

    // перемотка по скроллу: в окне k показывается клип k-1 (морф кадра
    // k-1 → k). Первые 78% окна отданы под перемотку (позиция скролла →
    // время видео), дальше держим финальный кадр — пауза перед сменой плашки.
    const activeClip = Math.min(clips.length - 1, Math.max(0, Math.floor(p * N) - 1));
    manageClipWindow(activeClip);
    let clipCovering = false;
    clips.forEach((v, i) => {
      const k = i + 1; // окно, в котором живёт клип
      const active = (p >= k / N && p < (k + 1) / N) || (k === N - 1 && p >= k / N);
      if (!wantClips || !clipReady[i] || !active) {
        v.style.opacity = 0;
        if (clipTarget[i] >= 0) {
          clipTarget[i] = -1;
          v.pause();
        }
        return;
      }
      const win = clamp((p - k / N) * N, 0, 1);
      const t = clamp(win / 0.78, 0, 1);
      clipTarget[i] = t * Math.max((v.duration || 5) - 0.06, 0);
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

    // плашки этапов: все в одной точке, сменяют друг друга на месте
    stageEls.forEach((el, i) => {
      const start = i / N;
      const end = (i + 1) / N;
      const isLast = i === N - 1;
      const t = (p - start) / (end - start);

      if (t <= 0 || (t >= 1 && !isLast)) {
        el.style.opacity = 0;
        return;
      }

      if (reduced) {
        el.style.transform = mqMobile.matches ? 'translateX(-50%)' : 'none';
        el.style.opacity = 1;
        return;
      }

      // смена на месте: короткий подъезд снизу + fade, уход — растворением
      let y = 0;
      let o = 1;
      const IN = 0.16;
      const OUT = 0.86;
      if (t < IN) {
        const k = easeIn[0](t / IN);
        y = 28 * (1 - k);
        o = t / IN;
      } else if (!isLast && t > OUT) {
        o = 1 - (t - OUT) / (1 - OUT);
      }
      // mobile-CSS центрирует плашку через translateX(-50%) — сохраняем
      el.style.transform = mqMobile.matches
        ? `translate(-50%, ${y}px)`
        : `translateY(${y}px)`;
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

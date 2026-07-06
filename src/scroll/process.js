// Хореография секции «Процесс»: фотореальная стройка одного двора как
// ОДИН непрерывный ролик, который скролл перематывает (scroll = перемотка).
//
// Таймлайн из 8 окон (по числу этапов):
//   окно 0        — стартовый кадр (пустой газон, «Замер»), без видео;
//   окна 1..7     — 7 клипов-морфов встык, каждый перематывается 1:1 по
//                   скроллу. Стыки невидимы: конец клипа i = кадр этапа
//                   i+2 = начало клипа i+1 (общий кадр).
// Плашки этапов вылетают по таймкодам этого ролика (окно k → плашка k).
//
// Перемотка без рывков: не сикаем currentTime на каждый тик (прыжки между
// редкими ключевыми кадрами дёргают декодер), а догоняем цель через
// playbackRate — декодер всегда идёт вперёд по кадрам. Назад/дальний
// флик — один точный seek.
//
// ▸ Один физический файл: клипы на CDN недоступны из контейнера (egress),
//   поэтому склеены логически. Чтобы запечь буквально один mp4 — см.
//   scripts/merge-clips.sh (ffmpeg concat), затем задать assets 'clip-merged'
//   и код возьмёт его как единый источник (ветка mergedSrc ниже).
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
      // влетели в середину окна — сразу встать на нужный кадр
      if (clipTarget[i] > 0) v.currentTime = clipTarget[i];
    });
  });

  // 1:1 сопровождение скролла: сколько проскроллено — столько промотано.
  // Скорость видео = скорость движения цели (фид-форвард по EMA) + добор
  // отставания (пропорциональная коррекция). Декодер всегда идёт вперёд —
  // плавно как обычное видео; назад или дальний флик — один точный seek.
  const clipVel = new Array(clips.length).fill(0); // EMA скорости цели, с/с
  const clipPrev = new Array(clips.length).fill(-1);
  let lastTick = 0;
  function chase() {
    const now = performance.now();
    const dt = lastTick ? Math.min((now - lastTick) / 1000, 0.1) : 1 / 60;
    lastTick = now;
    clips.forEach((v, i) => {
      const target = clipTarget[i];
      if (target < 0 || !clipReady[i]) {
        clipPrev[i] = -1;
        clipVel[i] = 0;
        return;
      }
      if (clipPrev[i] >= 0 && dt > 0) {
        const raw = (target - clipPrev[i]) / dt;
        clipVel[i] += (raw - clipVel[i]) * 0.35;
      }
      clipPrev[i] = target;
      if (v.seeking) return;
      const gap = target - v.currentTime;
      if (gap < -0.25 || gap > 1.6) {
        // скролл назад или сильный отрыв (флик) — точный переброс
        v.pause();
        v.currentTime = target;
        clipVel[i] = 0;
        return;
      }
      const rate = clipVel[i] + gap * 5;
      if (rate <= 0.02 && Math.abs(gap) < 0.06) {
        if (!v.paused) v.pause(); // цель стоит, кадр на месте
      } else {
        v.playbackRate = clamp(rate, 0.0625, 8);
        if (v.paused) v.play().catch(() => {});
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
        // __qaClipOverride — подмена источника в тестах (blob-видео)
        v.src = window.__qaClipOverride || clipUrls[i];
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

    // непрерывная перемотка: клип i (0-idx) живёт в окне i+1 и морфит
    // этап (i+1)→(i+2). Окно 0 — стартовый кадр без видео. Внутри окна
    // позиция скролла 1:1 = позиция в клипе (последние HOLD держат
    // финальный кадр = стыковочный кадр следующего клипа → шов невидим).
    const HOLD = 0.03;
    const activeClip = Math.min(clips.length - 1, Math.max(0, Math.floor(p * N) - 1));
    manageClipWindow(activeClip);
    let clipCovering = false;
    clips.forEach((v, i) => {
      const win = i + 1; // окно, в котором живёт клип
      const active = p >= win / N && p < (win + 1) / N;
      if (!wantClips || !clipReady[i] || !active) {
        v.style.opacity = 0;
        if (clipTarget[i] >= 0) {
          clipTarget[i] = -1;
          v.pause();
        }
        return;
      }
      const frac = clamp((p - win / N) * N, 0, 1); // 0..1 по окну
      const scrub = clamp(frac / (1 - HOLD), 0, 1);
      clipTarget[i] = scrub * Math.max((v.duration || 5) - 0.06, 0);
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

  // метрики синхронизации для QA-прогона
  if (window.__qa) window.__qa.process = { clips, clipTarget, clipReady };

  update(0);
}

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

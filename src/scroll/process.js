// Хореография секции «Процесс»: фотореальная стройка одного двора.
// Один scrub-триггер ведёт кроссфейд 8 кадров (одна камера, один ракурс),
// деликатный Ken Burns внутри кадра, прогресс-бар и смену плашек на месте.
// Видео-морфы НЕ скрабятся: при входе в окно этапа клип просто проигрывается
// с нативной скоростью (максимальная плавность), при выходе — пауза и сброс.
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
  // Плавность: не скрабим currentTime (это дёргает декодер), а играем клип
  // целиком при входе в окно. Живут только клипы окна ±1; только десктоп.
  const clipReady = new Array(clips.length).fill(false);
  const playedFor = new Array(clips.length).fill(false);
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
        playedFor[i] = false;
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

    // play-on-enter: в окне k показывается клип k-1 (морф кадра k-1 → k);
    // он проигрывается с нативной скоростью и остаётся на финальном кадре
    const activeClip = Math.min(clips.length - 1, Math.max(0, Math.floor(p * N) - 1));
    manageClipWindow(activeClip);
    let clipCovering = false;
    clips.forEach((v, i) => {
      const k = i + 1; // окно, в котором живёт клип
      const active = (p >= k / N && p < (k + 1) / N) || (k === N - 1 && p >= k / N);
      if (!wantClips || !clipReady[i] || !active) {
        v.style.opacity = 0;
        if (playedFor[i]) {
          playedFor[i] = false;
          v.pause();
        }
        return;
      }
      if (!playedFor[i]) {
        playedFor[i] = true;
        v.currentTime = 0;
        v.play().catch(() => {});
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

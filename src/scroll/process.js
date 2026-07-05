// Хореография секции «Процесс»: один scrub-триггер ведёт сцену,
// прогресс-бар, статус-монитор и fly-in текстов этапов с 4 сторон.
// Тексты анимируются детерминированно от прогресса (без дуэли твинов).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STAGES } from '../data/models.js';
import { track } from '../data/config.js';

const N = STAGES.length;
const AMP = 150; // амплитуда заезда, px
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

export function initProcess(scene, reduced) {
  const stageEls = [...document.querySelectorAll('.process-stage')];
  const bar = document.getElementById('process-progress');
  const status = document.getElementById('stage-status');
  if (!stageEls.length) return;

  let lastStage = -1;
  const seenStages = new Set();

  function update(p) {
    scene?.setProgress(p);
    if (bar) bar.style.width = `${(p * 100).toFixed(2)}%`;

    const idx = Math.min(N - 1, Math.floor(p * N));
    if (idx !== lastStage) {
      lastStage = idx;
      if (status) status.textContent = STAGES[idx].status;
      // глубина вовлечения в сцену: каждая фаза — один раз за сессию
      if (!seenStages.has(idx)) {
        seenStages.add(idx);
        track('process_stage_reached', { stage: STAGES[idx].key });
      }
    }

    stageEls.forEach((el, i) => {
      const start = i / N;
      const end = (i + 1) / N;
      const isLast = i === N - 1;
      const t = (p - start) / (end - start); // локальный прогресс окна

      if (t <= 0 || (t >= 1 && !isLast)) {
        el.style.opacity = 0;
        return;
      }
      const dir = DIR[STAGES[i].from] || DIR.up;

      if (reduced) {
        // упрощённый режим: только fade
        el.style.transform = 'none';
        el.style.opacity = t > 0 && (t < 1 || isLast) ? 1 : 0;
        return;
      }

      let x = 0;
      let y = 0;
      let o = 1;
      const IN = isLast ? 0.55 : 0.24; // READY проявляется дольше (fade-in с p≈0.94… от начала окна)
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
      // transform учитывает базовое центрирование из CSS
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
    scrub: true,
    onUpdate(self) {
      update(self.progress);
    },
  });

  update(0);
}

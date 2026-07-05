// Мягкий snap внутри секции «Процесс»: магнит к серединам этапов.
// Порог близости ~0.06; READY-hold участвует в магните только когда
// скролл уже дошёл до стартовой границы READY (иначе телепорт LED→READY).
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STAGES } from '../data/models.js';

const N = STAGES.length;
const READY_STAGE_START = (N - 1) / N; // p = 0.875
const READY_HOLD = 0.94; // после fade-in подписи
const PROXIMITY = 0.06;

export function initSnap(reduced) {
  if (reduced) return;

  const centers = [];
  for (let i = 0; i < N - 1; i++) centers.push((i + 0.5) / N);

  ScrollTrigger.create({
    trigger: '.section--process',
    start: 'top top',
    end: 'bottom bottom',
    snap: {
      snapTo(value) {
        const candidates = [...centers];
        if (value >= READY_STAGE_START) candidates.push(READY_HOLD);
        let best = null;
        let bestDist = Infinity;
        for (const c of candidates) {
          const d = Math.abs(value - c);
          if (d < bestDist) {
            bestDist = d;
            best = c;
          }
        }
        return bestDist <= PROXIMITY ? best : value;
      },
      duration: { min: 0.15, max: 0.4 },
      ease: 'power1.inOut',
      delay: 0.08,
    },
  });
}

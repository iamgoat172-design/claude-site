// Сигнатурный fly-in: направленный заезд с заметной амплитудой (не fade).
// Hero — каскадом на загрузке; остальные [data-flyin] — по скроллу.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const OFFSETS = {
  left: { x: -140, y: 0 },
  right: { x: 140, y: 0 },
  up: { x: 0, y: -130 },
  down: { x: 0, y: 130 },
};
const EASES = ['power3.out', 'power4.out', 'expo.out', 'back.out(1.4)'];

export function initFlyin(reduced) {
  const els = [...document.querySelectorAll('[data-flyin]')];
  if (reduced) {
    els.forEach((el) => (el.style.opacity = 1));
    return;
  }

  els.forEach((el, i) => {
    const dir = OFFSETS[el.dataset.flyin] || OFFSETS.up;
    const inHero = !!el.closest('.section--hero');
    gsap.set(el, { opacity: 0, x: dir.x, y: dir.y });
    const vars = {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1.05,
      ease: EASES[i % EASES.length],
      immediateRender: false,
    };
    if (inHero) {
      gsap.to(el, { ...vars, delay: 0.25 + i * 0.14 });
    } else {
      gsap.to(el, {
        ...vars,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    }
  });

  // заголовки/сабы секций — лёгкий подъезд снизу
  document.querySelectorAll('.section-title, .section-sub').forEach((el) => {
    if (el.closest('.section--hero') || el.hasAttribute('data-flyin')) return;
    gsap.set(el, { opacity: 0, y: 46 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
}

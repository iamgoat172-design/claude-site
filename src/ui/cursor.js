// Кастомный курсор: aqua-ядро + кольцо + trail (lerp), магнит на CTA.
// На тач-устройствах и при prefers-reduced-motion не включается.
export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const root = document.getElementById('cursor-root');
  if (!root) return;
  document.documentElement.classList.add('has-custom-cursor');

  const dot = root.querySelector('.cursor-dot');
  const ring = root.querySelector('.cursor-ring');
  const trails = [...root.querySelectorAll('.cursor-trail')];

  const target = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };
  const trailPos = trails.map(() => ({ x: -100, y: -100 }));
  let magnetEl = null;
  let raf = null;

  window.addEventListener('pointermove', (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  const HOVERABLE = 'a, button, summary, .model-card, .quiz__option, .work-item, input, select, label.checkbox';
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest(HOVERABLE);
    ring.classList.toggle('is-active', !!el);
    magnetEl = e.target.closest('[data-magnet]');
  });
  document.addEventListener('pointerout', () => {
    ring.classList.remove('is-active');
    magnetEl = null;
  });

  function tick() {
    let tx = target.x;
    let ty = target.y;
    // магнит: лёгкое притяжение ядра к центру CTA
    if (magnetEl) {
      const r = magnetEl.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      tx += (cx - tx) * 0.25;
      ty += (cy - ty) * 0.25;
    }
    dot.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`;

    ringPos.x += (tx - ringPos.x) * 0.18;
    ringPos.y += (ty - ringPos.y) * 0.18;
    const half = ring.offsetWidth / 2;
    ring.style.transform = `translate(${ringPos.x - half}px, ${ringPos.y - half}px)`;

    let px = ringPos.x;
    let py = ringPos.y;
    trailPos.forEach((p, i) => {
      p.x += (px - p.x) * 0.3;
      p.y += (py - p.y) * 0.3;
      trails[i].style.transform = `translate(${p.x - 3}px, ${p.y - 3}px)`;
      px = p.x;
      py = p.y;
    });

    raf = requestAnimationFrame(tick);
  }
}

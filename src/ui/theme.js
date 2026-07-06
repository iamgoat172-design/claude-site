// Тема-переход тёмный→светлый: фон интерполируется по скроллу через CSS-переменные.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DARK = { bg: '#04070a', ink: '#eaf4f9' };
const LIGHT = { bg: '#ffffff', ink: '#0b1b2f' };

export function initTheme(scene) {
  const rootStyle = document.documentElement.style;
  const sections = [...document.querySelectorAll('.section[data-theme]')];

  sections.forEach((section, i) => {
    const prev = sections[i - 1];
    if (!prev || prev.dataset.theme === section.dataset.theme) return;
    const from = prev.dataset.theme === 'dark' ? DARK : LIGHT;
    const to = section.dataset.theme === 'dark' ? DARK : LIGHT;
    const state = { t: 0 };
    gsap.to(state, {
      t: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 25%',
        scrub: true,
        onUpdate(self) {
          const t = self.progress;
          rootStyle.setProperty('--bg-current', gsap.utils.interpolate(from.bg, to.bg)(t));
          rootStyle.setProperty('--ink-current', gsap.utils.interpolate(from.ink, to.ink)(t));
        },
      },
    });
  });

  // WebGL-канвас глушится, когда уходим в светлую коммерческую часть
  const canvas = document.getElementById('scene-canvas');
  const catalog = document.getElementById('catalog');
  if (canvas && catalog) {
    ScrollTrigger.create({
      trigger: catalog,
      start: 'top 70%',
      onEnter: () => {
        canvas.classList.add('is-muted');
        scene?.setPaused(true);
      },
      onLeaveBack: () => {
        canvas.classList.remove('is-muted');
        scene?.setPaused(false);
      },
    });
  }
}

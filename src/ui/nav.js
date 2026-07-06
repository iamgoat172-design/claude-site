// Навбар: тема-aware pill-nav, мобайл-гамбургер + drawer, якорный скролл через Lenis.
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNav(lenis) {
  const nav = document.querySelector('.pill-nav');
  const burger = document.querySelector('.nav-burger');
  const drawer = document.getElementById('nav-drawer');
  const closeBtn = drawer.querySelector('.nav-drawer__close');
  const stickyCta = document.getElementById('sticky-cta');

  function openDrawer() {
    drawer.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    lenis?.stop();
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    lenis?.start();
  }
  burger.addEventListener('click', () =>
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer()
  );
  closeBtn.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  // якоря — плавно через Lenis (учитывая fixed-nav)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (a.hasAttribute('data-lead')) return; // заявка открывается поп-апом
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      closeDrawer();
      if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // sticky-CTA на мобайле: появляется после героя
  const hero = document.getElementById('hero');
  if (stickyCta && hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([entry]) => stickyCta.classList.toggle('is-visible', !entry.isIntersecting),
      { threshold: 0.12 }
    );
    io.observe(hero);
  }

  // тема навбара: on-light когда под ним светлая секция.
  // Через ScrollTrigger (сырые scroll-листенеры запрещены — jank).
  document.querySelectorAll('.section[data-theme]').forEach((s) => {
    ScrollTrigger.create({
      trigger: s,
      start: 'top 80px', // нижняя кромка pill-nav
      end: 'bottom 80px',
      onToggle(self) {
        if (self.isActive) nav.classList.toggle('on-light', s.dataset.theme === 'light');
      },
    });
  });

  // HUD-часы в герое
  const clock = document.getElementById('hud-clock');
  if (clock) {
    const tickClock = () => {
      clock.textContent = new Date().toLocaleTimeString('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour12: false,
      });
    };
    tickClock();
    setInterval(tickClock, 1000);
  }
}

// Рендер повторяющихся блоков из data/: каталог, свотчи, допы, этапы, works, life.
import { MODELS, ECO_MODELS, SWATCHES, ADDONS, STAGES, WORKS, LIFE, fmtPrice } from '../data/models.js';
import { asset } from '../data/assets.js';

// SVG-силуэт чаши для карточки (вид сверху), форма зависит от модели
function poolSvg(id) {
  const shapes = {
    luxor:
      '<rect x="8" y="12" width="184" height="76" rx="14"/><rect x="18" y="22" width="164" height="56" rx="10" class="inner"/><path d="M18 36h24M18 50h24M18 64h24" class="steps"/>',
    minipool:
      '<rect x="34" y="16" width="132" height="68" rx="16"/><rect x="44" y="26" width="112" height="48" rx="12" class="inner"/><path d="M44 40h18M44 52h18" class="steps"/>',
    classic:
      '<rect x="12" y="14" width="176" height="72" rx="10"/><rect x="22" y="24" width="156" height="52" rx="7" class="inner"/><path d="M156 32v36M166 32v36" class="steps"/>',
    rio:
      '<rect x="10" y="12" width="180" height="76" rx="34"/><rect x="20" y="22" width="160" height="56" rx="26" class="inner"/><path d="M36 34c-8 8-8 24 0 32" class="steps"/>',
    quick:
      '<rect x="6" y="26" width="188" height="48" rx="10"/><rect x="14" y="34" width="172" height="32" rx="7" class="inner"/><path d="M170 38v24M179 38v24" class="steps"/>',
    spa:
      '<rect x="46" y="14" width="108" height="72" rx="22"/><rect x="56" y="24" width="88" height="52" rx="16" class="inner"/><path d="M66 38h16M66 50h16M66 62h16" class="steps"/>',
  };
  return `<svg viewBox="0 0 200 100" fill="none" aria-hidden="true">
    <g stroke="rgba(255,255,255,.9)" stroke-width="2.5">${shapes[id] || shapes.classic}</g>
    <style>.inner{stroke:rgba(255,255,255,.45);} .steps{stroke:rgba(255,255,255,.6);stroke-width:2;}</style>
  </svg>`;
}

// img или градиент-заглушка, если ассет ещё не подключён
function imgOrPlaceholder(key, alt, cls = '') {
  const url = asset(key);
  if (url) return `<img src="${url}" alt="${alt}" loading="lazy" ${cls ? `class="${cls}"` : ''}/>`;
  return `<div class="ph ${cls}" role="img" aria-label="${alt}" style="width:100%;height:100%;min-height:180px;background:
    radial-gradient(120% 90% at 30% 20%, rgba(53,200,234,.35), transparent 55%),
    linear-gradient(150deg,#0b3a6f 0%,#0e5d8c 55%,#18a6c9 130%);"></div>`;
}

// заполняет <div data-asset="key" data-alt="..."> картинкой или заглушкой
export function fillAssetSlots() {
  document.querySelectorAll('[data-asset]').forEach((slot) => {
    slot.innerHTML = imgOrPlaceholder(slot.dataset.asset, slot.dataset.alt || '');
    const media = slot.firstElementChild;
    if (media) {
      media.style.width = '100%';
      media.style.height = '300px';
      media.style.objectFit = 'cover';
    }
  });
  // фоновые слои: <div data-bg-asset="key"> (нет ассета — слой просто пуст)
  document.querySelectorAll('[data-bg-asset]').forEach((el) => {
    const url = asset(el.dataset.bgAsset);
    if (url) el.style.backgroundImage = `url(${url})`;
  });
}

export function renderCatalog(onCardClick) {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  grid.innerHTML = MODELS.map(
    (m) => {
      // приоритет: реальное фото модели (lp2) → сгенерированное → SVG-схема
      const photo = asset(`photo-${m.id}`) || asset(`model-${m.id}`);
      return `
    <article class="model-card" data-model="${m.id}" tabindex="0" role="button"
      aria-label="${m.name}: подробнее">
      <span class="model-card__badge">−15%</span>
      <div class="model-card__vis">${
        photo ? `<img src="${photo}" alt="Бассейн ${m.name}" loading="lazy" />` : poolSvg(m.id)
      }</div>
      <h3>${m.name}</h3>
      <p class="model-card__tag">${m.tag}</p>
      <ul class="model-card__specs">
        <li>${m.sizes}</li>
        <li>глубина ${m.depth}</li>
        <li>${m.volume}</li>
      </ul>
      <p class="model-card__price">
        <span class="old">${fmtPrice(m.priceOld)}</span>
        <span class="now">от ${fmtPrice(m.priceNow)}</span>
      </p>
      <span class="model-card__link">Подробнее о модели →</span>
    </article>`;
    }
  ).join('');

  grid.querySelectorAll('.model-card').forEach((card) => {
    const open = () => onCardClick(card.dataset.model);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
}

// ECO LINE: карточки без спеков (цены линейки уточняются по заявке)
export function renderEcoCatalog(onLead) {
  const grid = document.getElementById('catalog-eco');
  if (!grid) return;
  grid.innerHTML = ECO_MODELS.map(
    (m) => `
    <article class="model-card model-card--eco" data-eco="${m.name}" tabindex="0" role="button"
      aria-label="${m.name}: получить расчёт">
      <span class="model-card__badge model-card__badge--eco">ECO LINE</span>
      <div class="model-card__vis">
        <img src="${asset(`eco-${m.id}`)}" alt="Бассейн ${m.name}" loading="lazy" />
      </div>
      <h3>${m.name}</h3>
      <p class="model-card__tag">${m.hint}</p>
      <p class="model-card__price"><span class="now model-card__price--eco">Цена — по расчёту под участок</span></p>
      <span class="model-card__link">Узнать цену →</span>
    </article>`
  ).join('');
  grid.querySelectorAll('.model-card--eco').forEach((card) => {
    const open = () => onLead(`eco:${card.dataset.eco}`);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
}

// переключатель линеек каталога
export function initCatalogLines() {
  const tabs = [...document.querySelectorAll('.catalog__line-tab')];
  const premium = document.getElementById('catalog-grid');
  const eco = document.getElementById('catalog-eco');
  if (!tabs.length || !premium || !eco) return;
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      const isEco = tab.dataset.line === 'eco';
      premium.hidden = isEco;
      eco.hidden = !isEco;
    })
  );
}

export function renderSwatches() {
  const grid = document.getElementById('swatches-grid');
  if (!grid) return;
  grid.innerHTML = SWATCHES.map(
    (s) => `
    <div class="swatch">
      <div class="swatch__chip swatch__chip--photo" title="${s.name}">
        <img src="${asset(s.key)}" alt="Гелькоут ${s.name}" loading="lazy" />
      </div>
      <div class="swatch__name">${s.name}</div>
    </div>`
  ).join('');
}

export function renderAddons() {
  const grid = document.getElementById('addons-grid');
  if (!grid) return;
  grid.innerHTML = ADDONS.map(
    (a) => `
    <div class="addon-card">
      <h4>${a.title}</h4>
      <p>${a.text}</p>
    </div>`
  ).join('');
}

export function renderStages() {
  const wrap = document.getElementById('process-stages');
  if (!wrap) return;
  wrap.innerHTML = STAGES.map(
    (s, i) => `
    <div class="process-stage process-stage--${s.pos}" data-stage="${i}">
      <div class="process-stage__meta">
        <span class="process-stage__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="process-stage__of">/ 08</span>
        <span class="process-stage__track" aria-hidden="true">${STAGES.map(
          (_, k) => `<i class="${k <= i ? 'is-on' : ''}"></i>`
        ).join('')}</span>
      </div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </div>`
  ).join('');
}

export function renderWorks(onItemClick) {
  const grid = document.getElementById('works-grid');
  if (!grid) return;
  grid.innerHTML = WORKS.map(
    (w, i) => `
    <button type="button" class="work-item" data-index="${i}" aria-label="Открыть фото: ${w.caption}">
      ${imgOrPlaceholder(w.key, w.caption)}
      <span>${w.caption}</span>
    </button>`
  ).join('');
  grid.querySelectorAll('.work-item').forEach((el) =>
    el.addEventListener('click', () => onItemClick(Number(el.dataset.index)))
  );
}

export function renderLife() {
  const grid = document.getElementById('life-grid');
  if (!grid) return;
  grid.innerHTML = LIFE.map(
    (l) => `
    <figure class="life__item" style="margin:0">
      ${imgOrPlaceholder(l.key, l.caption)}
      <figcaption>${l.caption}</figcaption>
    </figure>`
  ).join('');
}

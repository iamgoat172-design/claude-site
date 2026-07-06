# RiverPools — иммерсивный 3D-скролл-лендинг

Премиум-лендинг композитных бассейнов (Москва/МО): чёрный иммерсивный фон,
центральная WebGL-сцена постройки бассейна по скроллу (8 фаз), текст налетает
с четырёх сторон, тёмный верх → светлый конверсионный низ.

## Стек

Vite + three.js + GSAP ScrollTrigger + Lenis. Сборка в статику.

```bash
npm install
npm run dev      # dev-сервер
npm run build    # прод-сборка в dist/
npm run preview  # предпросмотр сборки
```

QA-хук: `?qa=1` → `window.__qa = { lenis, ScrollTrigger, poolScene }`.

## Структура

- `index.html` — разметка 11 секций; `privacy.html` / `offer.html` — юр-страницы.
- `src/scene/PoolScene.js` — WebGL-сцена: чаша (GLB или процедурная), шейдерная
  вода, LED-контур, bloom; `setProgress(0..1)` — фазы постройки,
  `setHeroBlend(1..0)` — переход hero → «замер».
- `src/scroll/` — process (хореография фаз + fly-in), snap (магнит к этапам),
  flyin (ревилы).
- `src/ui/` — theme (тёмный→светлый), cursor, nav, quiz, modals, forms, render.
- `src/data/` — models (каталог/цены/этапы), assets (карта ассетов), config
  (интеграции).

## Ассеты (Higgsfield)

Изображения сгенерированы через Higgsfield и подключены по CDN-URL
(`src/data/assets.js`). Чтобы перевести на локальные файлы:
`node scripts/fetch-assets.mjs` (на машине без сетевых ограничений), затем
`LOCAL = true` в `assets.js`.

**3D-чаша (GLB):** three.js-сцена умеет грузить реалистичную GLB-модель
(`assets.js → poolGlb.url`), фолбэк — процедурная чаша. Три согласованных
вида чаши для image-to-3D уже сгенерированы (лежат в библиотеке Higgsfield);
вызов `generate_3d` требует ручного подтверждения MCP-инструмента. После
генерации вставьте URL GLB в `poolGlb.url`.

## Перед прод-запуском (данные заказчика)

- Реквизиты ООО (ИНН/ОГРН) в `privacy.html` / `offer.html` (плейсхолдеры `[…]`).
- `src/data/config.js`: боевой `formEndpoint` (`/send.php`), id Яндекс.Метрики
  (109864768 или 109286676 — уточнить), Roistat.
- Цены каталога, кроме LUXOR, сверить с боевым lp2.

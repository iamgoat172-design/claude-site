# CONTEXT — состояние проекта для продолжения в новом чате

Снимок рабочего состояния сессии по лендингу **River Pools** (композитные
бассейны под ключ, Москва/МО). Прочитай целиком перед продолжением работы.

**Репо:** `iamgoat172-design/claude-site` · **Ветка:** `claude/archive-extraction-review-7nwv52`
· **PR:** #2 (draft) · **Крайний коммит на момент снимка:** `3b84cc9`
**CLAUDE.md** в корне содержит обязательные правила — соблюдать.

---

## 0. Первым делом в новом чате

1. Прочитай `CLAUDE.md` (правила) и этот файл.
2. Подними превью и прогони QA (см. §5), чтобы понять текущее состояние.
3. Работай только в ветке `claude/archive-extraction-review-7nwv52`, коммить
   осмысленно, пушь, поддерживай draft-PR #2.
4. **После каждого рабочего пасса** (правило CLAUDE.md): собери
   одностраничник → smoke-тест через `file://` → отправь пользователю
   (`SendUserFile`, display: render). Команды в §5.

---

## 1. Что уже сделано (состояние сайта)

Главная (`index.html`), сверху вниз:
- **Hero** — конверсионный: оффер+факты слева, форма расчёта справа, фон =
  реальное фото LUXOR (`heroBg` → `/assets/real/lp2/pool-luxor-hero.webp`).
  Цена из hero убрана ранее по просьбе пользователя.
- **Стройка** (`#process`) — 8 этапов как ОДИН непрерывный ролик, скролл =
  перемотка 1:1; плашки этапов вылетают по таймлайну; фикс-CTA «Заказать
  бассейн». Механика в `src/scroll/process.js` (см. §4).
- **Каталог** (`#catalog`) — сначала УТП (допы: тёплая вода/противоток/
  автоматика), затем «Выберите форму бассейна»: табы **Премиум** (6 моделей,
  реальные фото lp2 + цены) и **ECO LINE** (6 моделей lp, цены по запросу),
  свотчи гелькоута (реальные фото).
- **Оффер-бэнд** (`#offer`) — акция июля −15%, фото инженера, короткие пункты.
- **Квиз** (`#quiz`) — ТЁМНАЯ стильная glassy-карточка на фоне вечернего фото,
  поп-ап + секция, 3 вопроса.
- **6 причин** (`#why`) — карточки с фото-подложками (feature-1..6).
- **Сравнение** (`#compare`) — «под ключ vs бригада» + фото объекта.
- **Технологии** (`#tech`) — ECO CLEAN и AQUABIOGRAPHY, ссылки «Подробнее»
  на посадки.
- **Жизнь у воды** (`#life`) — 4 лайфстайл-кадра с людьми.
- **Работы** (`#works`) — 12 реальных объектов, масонри, лайтбокс.
- **Отзывы** (`#reviews`) — подписи с моделью+датой + мост доверия.
- **FAQ** (`#faq`) — аккордеон, первый вопрос «от чего зависит цена», JSON-LD.
- **Финальная форма** (`#final-cta`) + футер.

Две **SEO-посадки** (отдельные страницы, в vite multi-page):
- `eco-clean.html` — «Бассейн без хлора: ионизация медь+серебро».
- `aquabiography.html` — «Подсветка бассейна: контурный LED».
  Структура: hero-фото, оглавление, разделы, сравнит. таблица, FAQ-аккордеон,
  CTA; Article+FAQPage+BreadcrumbList JSON-LD, canonical, OG, keywords.
  Самодостаточны (свой inline-CSS, как privacy.html).

---

## 2. Договорённости и вкус пользователя (ВАЖНО, не нарушать)

- **Люкс, не хайтек.** Шрифты: **Unbounded** (заголовки, `--font-display`) +
  **Manrope** (текст). НЕ возвращать Prata/Tenor Sans/mono-терминальщину.
  Кастомный курсор удалён — не возвращать.
- **Кнопки заявки и квиза — ПОП-АПЫ, не скролл** («это важно»). Триггеры
  `data-lead` / `data-quiz`, обрабатываются в `src/main.js` + `src/ui/modals.js`.
- **Замер платный, честно:** «выезд инженера 5 000 ₽ — становится первым
  платежом по договору». НИГДЕ не писать «бесплатно» про выезд.
- **Стройка = фотореал**, по инструкции meridianrevealbreakdown.md (Route A:
  скролл-ривил секвенции). Видео — только Kling 3.0 pro 1080p (НЕ Seedance).
- **Видео стройки:** скролл = перемотка 1:1 («сколько проскроллено — столько
  промотано»), кадры не должны залипать. Плашки этапов — в одной точке,
  сменяются на месте (глаза не бегают).
- Пользователь ценит вопросы (AskUserQuestion работает) и честность о слабых
  местах. Просил задавать уточнения, а не гадать.

---

## 3. Карта файлов

```
index.html                 главная + JSON-LD (@graph)
eco-clean.html             SEO-посадка ECO CLEAN (самодостаточная)
aquabiography.html         SEO-посадка AQUABIOGRAPHY (самодостаточная)
privacy.html, offer.html   юр. страницы (плейсхолдеры реквизитов)
vite.config.js             multi-page input (5 страниц)
CLAUDE.md                  правила репозитория
src/main.js                bootstrap: Lenis+ScrollTrigger, рендер, поп-апы, аналитика
src/data/
  models.js                MODELS, ECO_MODELS, SWATCHES, ADDONS, STAGES(8), WORKS(12), LIFE
  assets.js                карта ассетов: real{} (локальные) + map{} (CDN)
  config.js                CONFIG (metrikaId, endpoint), track()/reachGoal()
src/scroll/
  process.js               стройка: непрерывный скраб видео + плашки (см. §4)
  flyin.js, snap.js        fly-in анимации, снап
src/ui/
  render.js                каталог (premium+eco), свотчи, допы, этапы, works, life
  modals.js                поп-апы: модель, лид-форма, квиз, лайтбокс (focus-trap)
  quiz.js                  QUIZ_TEMPLATE + initQuiz
  forms.js                 bindForm (валидация, honeypot, маска тел, dev-заглушка)
  nav.js                   навбар (тема по ScrollTrigger), якоря offset -90
  theme.js, cursor.js      (cursor.js больше не подключён)
src/styles/
  tokens.css               --font-display=Unbounded, цвета, --nav-h
  base.css                 базовое + scroll-margin-top 96px
  sections.css             все секции (длинный; правки в конце файла)
scripts/
  build-single.mjs         сборка riverpools.html одним файлом (инлайн /assets/real webp)
  merge-clips.sh           склейка 7 клипов в 1 mp4 (локально, нужен ffmpeg+CDN)
  fetch-assets.mjs         локализация CDN-ассетов (LOCAL=true)
public/assets/real/        реальные фото: lp/ (ECO LINE), lp2/ (премиум) — оптимизированы webp
```

---

## 4. Механика стройки (`src/scroll/process.js`) — как устроена

- 8 окон таймлайна по числу этапов. Окно 0 — стартовый кадр (замер, без
  видео). Окна 1..7 — 7 клипов встык, клип i (0-idx) живёт в окне i+1,
  морфит этап i+1→i+2. Стыки невидимы (конец клипа i = начало клипа i+1).
- **Перемотка 1:1:** позиция скролла в окне → `clipTarget` (время в клипе).
  Догон через `playbackRate` (фид-форвард по EMA скорости цели + добор
  отставания `gap*5`), НЕ прыжки currentTime. Назад/дальний флик — точный
  seek. Функция `chase()` на gsap.ticker.
- Окно декодеров ±1 (`manageClipWindow`): живут только клипы рядом.
- Только десктоп ≥1024px && !saveData && !reduced; иначе фото-подложка.
- **Проверено цифрами:** синхросдвиг |target−currentTime| p50 0.014–0.023с,
  макс <0.07с (счётчик-видео на непрерывном проходе).
- `window.__qaClipOverride` — подмена src в тестах (blob-видео).
- Единый физический mp4 не сделан (CDN недоступен из контейнера) — см. §6.

---

## 5. Окружение и команды (КОПИРОВАТЬ ТОЧНО)

- **Scratchpad** (все временные файлы, НЕ /tmp):
  `/tmp/claude-0/-home-user-claude-site/44a4078d-78d8-566b-9e12-166e47d3f4d3/scratchpad`
- **Превью-сервер** (перед QA, устойчивая команда):
  ```bash
  (curl -s -o /dev/null http://localhost:4173/ || (nohup node node_modules/vite/bin/vite.js preview --port 4173 --strictPort > /dev/null 2>&1 & timeout 4 bash -c 'until curl -s -o /dev/null http://localhost:4173/; do sleep 0.5; done' 2>/dev/null))
  ```
- **Сборка / одностраничник / smoke:**
  ```bash
  npm run build
  node scripts/build-single.mjs /tmp/claude-0/-home-user-claude-site/44a4078d-78d8-566b-9e12-166e47d3f4d3/scratchpad
  node <scratchpad>/smoke.mjs        # открывает riverpools.html через file://
  ```
- **QA-скрипты в scratchpad** (Playwright, executablePath
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `--no-sandbox`):
  - `qa.mjs` — десктоп 1440 + мобайл 390: консоль, h-scroll, этапы, формы, квиз.
  - `fullcheck.mjs` — 12 интеракшн-проверок (поп-апы, квиз, лид, лайтбокс, FAQ).
  - `audit.mjs` — скриншот каждой секции (SHOTS=… node audit.mjs).
  - `timeline-test.mjs`, `scrubtest.mjs` — метрики синхрона видео-скраба.
  Открывать страницу с `?qa=1` → доступен `window.__qa` (lenis, ScrollTrigger,
  process).
- Отправлять одностраничник: `SendUserFile([riverpools.html], display:'render')`.

---

## 6. Подводные камни (на чём уже спотыкались)

- **git:** запускать из корня репо или `git -C /home/user/claude-site …`
  (из scratchpad cwd git падает).
- **sleep в Bash блокируется.** Ожидание:
  `timeout N bash -c 'until false; do sleep 5; done' 2>/dev/null; echo tick`.
- **Egress policy (403) блокирует:** CDN Higgsfield (cloudfront), старые
  сайты lp/lp2.river-pools.ru, archive.org, skills.sh. НЕ обходить (правило
  прокси) — визуал CDN проверяет пользователь. npm registry / pypi доступны.
- **ffmpeg отсутствует** в контейнере + клипы на заблокированном CDN →
  физическую склейку видео делать нельзя тут; `scripts/merge-clips.sh` —
  для запуска у пользователя.
- **build-single инлайнит только `/assets/real/*.webp`.** Пути к ним в
  `assets.js` должны быть ЦЕЛЬНЫМИ строковыми литералами (не `R + '/…'`),
  иначе в бандле путь разрезан и не инлайнится. Инлайнер учитывает и
  относительный префикс `./` (vite base).
- **Правки текста с python:** в index.html много `\xa0` (nbsp) — учитывать
  при поиске/замене, иначе `NOT FOUND`.
- **Массовые regex-замены:** проверять count после — однажды greedy-regex
  снёс 2 из 3 карточек отзывов.
- **Google Fonts блокируются в контейнере** — на скриншотах системный шрифт;
  оценивать размеры/иерархию, не начертание. У пользователя грузятся.
- **QA instant-scroll** (lenis immediate) не триггерит fly-in → элементы
  кажутся невидимыми. Для проверки видимости скроллить плавно (без immediate).

---

## 7. Инструменты: MCP и скиллы

- **Higgsfield (mcp__hig__):** generate_image (nano_banana_pro — фотореал,
  reference-chaining через medias role:image; nano_banana_2 фактически),
  generate_video (kling3_0, mode:'pro', 1080p, duration 5, sound:'off',
  start_image+end_image, `declined_preset_id:'24bae836-2c4a-48e0-89b6-49fcc0b21612'`
  для обхода preset-notice), job_display, show_generations. Забирать URL из
  job_display (…_min.webp / .mp4). Кредиты: ~9/клип.
- **github (mcp__github__):** PR/CI/комменты. gh CLI НЕТ.
- **Скиллы (установлены):** impeccable (UI-аудит), taste-skill/design-taste,
  marketingskills (cro/offers/schema/analytics/copywriting/seo), stitch-skills,
  high-end-visual-design, **council** (совет агентов на разных моделях).
- **Агенты:** для аудитов запускались фоновые Agent'ы (design/marketing).
  Учесть: subagent может упереться в лимит модели (Fable 5) — тогда результат
  частичный, добить самому/перезапустить.

---

## 8. Что осталось до прода (прод-хвосты, данные заказчика)

1. **Формы** — боевой обработчик (`/send.php`/CRM) в config.js + forms.js
   (сейчас dev-заглушка).
2. **Яндекс.Метрика** — id в `src/data/config.js` (109864768 vs 109286676 —
   уточнить).
3. **Реквизиты ООО** — privacy.html/offer.html/футер/compare (плейсхолдеры
   «ООО Ривер Пулс», ИНН/ОГРН).
4. **Домен** — `river-pools.ru` плейсхолдер в JSON-LD/canonical.
5. **Цены каталога** — подтверждён только LUXOR; премиум сверить с lp2;
   **ECO LINE цен/размеров НЕТ** — запросить прайс.
6. **Реальные фото объектов** для «Работ» и «Жизни у воды» (сейчас lp-фото +
   AI); подписи работ сверить с адресами.
7. **Телефон/адрес** (+7 495 128-56-19, Дмитровское ш., 81) — проверить.
8. **Оборудование в статьях** — бренды/характеристики ионизатора и LED
   намеренно не указаны; запросить у заказчика.

---

## 9. Открытые вопросы к пользователю

1. Прайс + размеры ECO LINE.
2. Сверка цен премиум-каталога.
3. Реальные фото объектов.
4. Реквизиты ООО / домен / id Метрики / endpoint форм.
5. Hero-фон: оставить реальное фото LUXOR или один из 3 сген. вариантов с
   людьми (job id в комментарии `heroBg` в assets.js).
6. Характеристики оборудования для посадок.
7. Делать ли физический единый mp4 стройки (merge-clips.sh у пользователя)?

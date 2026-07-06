// Квиз-подбор: 3 шага → рекомендация модели → сбор контакта.
// Работает на любом корне (секция страницы и поп-ап) — все запросы скоупятся.
import { MODELS, fmtPrice } from '../data/models.js';
import { bindForm } from './forms.js';

export const QUIZ_TEMPLATE = `
  <div class="quiz__progress"><span data-step="1" class="active"></span><span data-step="2"></span><span data-step="3"></span></div>

  <div class="quiz__step" data-step="1">
    <h3>Где будет бассейн?</h3>
    <div class="quiz__options" data-group="location">
      <button type="button" class="quiz__option" data-value="outdoor">Уличный, на участке</button>
      <button type="button" class="quiz__option" data-value="indoor">В помещении / у бани</button>
      <button type="button" class="quiz__option" data-value="advice">Нужен совет</button>
    </div>
  </div>

  <div class="quiz__step" data-step="2" hidden>
    <h3>Какой размер подойдёт?</h3>
    <div class="quiz__options" data-group="size">
      <button type="button" class="quiz__option" data-value="s">До 4 м</button>
      <button type="button" class="quiz__option" data-value="m">5–6 м</button>
      <button type="button" class="quiz__option" data-value="l">7 м и больше</button>
    </div>
  </div>

  <div class="quiz__step" data-step="3" hidden>
    <h3>Бюджет проекта</h3>
    <div class="quiz__options" data-group="budget">
      <button type="button" class="quiz__option" data-value="b1">До 1 млн ₽</button>
      <button type="button" class="quiz__option" data-value="b2">1–2 млн ₽</button>
      <button type="button" class="quiz__option" data-value="b3">2 млн ₽ и выше</button>
    </div>
  </div>

  <div class="quiz__result" data-step="result" hidden>
    <h3 class="quiz__result-name">—</h3>
    <p class="quiz__result-text"></p>
    <form class="quiz__form" novalidate>
      <input type="text" name="hp_field" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <label>Имя<input type="text" name="name" required autocomplete="name" /></label>
      <label>Телефон<input type="tel" name="phone" required autocomplete="tel" placeholder="+7 (___) ___-__-__" /></label>
      <label class="checkbox"><input type="checkbox" name="consent" required /><span>Согласен с <a href="/privacy.html" target="_blank" rel="noopener" tabindex="-1">политикой обработки данных</a></span></label>
      <button type="submit" class="btn btn--primary">Получить расчёт</button>
      <p class="form-risk">Пришлём расчёт в WhatsApp или Telegram — позвоним, только если попросите.</p>
      <p class="quiz__success" role="status" hidden>Спасибо! Расчёт по вашей модели придёт в мессенджер в течение часа.</p>
    </form>
  </div>`;

export function initQuiz(root, { source = 'quiz', track } = {}) {
  if (!root) return;

  const answers = {};
  const steps = [...root.querySelectorAll('.quiz__step')];
  const result = root.querySelector('.quiz__result');
  const dots = [...root.querySelectorAll('.quiz__progress span')];
  let current = 0;

  function show(i) {
    steps.forEach((s, idx) => (s.hidden = idx !== i));
    result.hidden = i !== steps.length;
    dots.forEach((d, idx) => d.classList.toggle('active', idx <= Math.min(i, dots.length - 1)));
    current = i;
  }

  function recommend() {
    const { size = 'm', budget = 'b2', location = 'outdoor' } = answers;
    let pick =
      MODELS.find((m) => m.match.size === size && m.match.budget.includes(budget)) ||
      MODELS.find((m) => m.match.size === size) ||
      MODELS.find((m) => m.match.budget.includes(budget)) ||
      MODELS[2];
    if (location === 'indoor' && !['minipool', 'spa', 'quick'].includes(pick.id)) {
      pick = MODELS.find((m) => m.id === 'minipool');
    }
    root.querySelector('.quiz__result-name').textContent =
      `${pick.name} · от ${fmtPrice(pick.priceNow)}`;
    root.querySelector('.quiz__result-text').textContent =
      `${pick.tag}. ${pick.sizes}, глубина ${pick.depth}. ` +
      'Оставьте контакт — пришлём точный расчёт под ваш участок и закрепим цену по акции −15%.';
    return pick;
  }

  let picked = null;
  root.querySelectorAll('.quiz__options').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz__option');
      if (!btn) return;
      answers[group.dataset.group] = btn.dataset.value;
      track?.('quiz_step_completed', { step: group.dataset.group, value: btn.dataset.value, source });
      if (current < steps.length - 1) show(current + 1);
      else {
        picked = recommend();
        track?.('quiz_result_shown', { model: picked.name, source });
        show(steps.length);
      }
    });
  });

  bindForm(root.querySelector('.quiz__form'), {
    successSel: '.quiz__success',
    extra: () => ({
      source,
      model: picked?.name || '',
      ...answers,
    }),
  });

  show(0);
}

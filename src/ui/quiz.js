// Квиз-подбор: 3 шага → рекомендация модели → сбор контакта.
import { MODELS, fmtPrice } from '../data/models.js';
import { bindForm } from './forms.js';
import { track } from '../data/config.js';

export function initQuiz() {
  const root = document.getElementById('quiz-root');
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
    // в помещение / у бани чаще всего встают компактные модели
    if (location === 'indoor' && !['minipool', 'spa', 'quick'].includes(pick.id)) {
      pick = MODELS.find((m) => m.id === 'minipool');
    }
    document.getElementById('quiz-result-name').textContent =
      `${pick.name} · от ${fmtPrice(pick.priceNow)}`;
    document.getElementById('quiz-result-text').textContent =
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
      track('quiz_step_completed', { step: group.dataset.group, value: btn.dataset.value });
      if (current < steps.length - 1) show(current + 1);
      else {
        picked = recommend();
        track('quiz_result_shown', { model: picked.name });
        show(steps.length);
      }
    });
  });

  bindForm(document.getElementById('quiz-form'), {
    successSel: '.quiz__success',
    extra: () => ({
      source: 'quiz',
      model: picked?.name || '',
      ...answers,
    }),
  });

  show(0);
}

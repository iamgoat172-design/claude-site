// ============ Интеграции (заполняется заказчиком перед прод-запуском) ============
export const CONFIG = {
  // Боевой обработчик заявок. Пусто — dev-заглушка (console + локальный успех).
  formEndpoint: '', // прод: '/send.php'

  // Яндекс.Метрика: id счётчика (109864768 или 109286676 — уточнить у заказчика).
  metrikaId: null,
  metrikaGoal: 'formsent',

  phone: '+7 (495) 128-56-19',
  phoneHref: 'tel:+74951285619',
};

// Ключевая цель (заявка) — то, на что настроена конверсия в Метрике/Директе.
export function reachGoal() {
  if (CONFIG.metrikaId && typeof window.ym === 'function') {
    window.ym(CONFIG.metrikaId, 'reachGoal', CONFIG.metrikaGoal);
  }
}

// Событийный слой (см. TRACKING.md). Именование: object_action, snake_case.
// Без Метрики события копятся в window.__events (для отладки и QA).
export function track(event, params = {}) {
  if (CONFIG.metrikaId && typeof window.ym === 'function') {
    window.ym(CONFIG.metrikaId, 'reachGoal', event, params);
  } else {
    (window.__events = window.__events || []).push({ event, ...params, t: Date.now() });
  }
}

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

export function reachGoal() {
  if (CONFIG.metrikaId && typeof window.ym === 'function') {
    window.ym(CONFIG.metrikaId, 'reachGoal', CONFIG.metrikaGoal);
  }
}

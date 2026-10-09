(() => {
  const tabs = document.querySelector('[data-pricing-tabs]');
  const grid = document.querySelector('[data-pricing-extras]');
  if (!tabs || !grid) return;

  const extras = [
    [['UX-аудит','от 8 000 ₽'],['Доп. страница сайта','от 5 000–8 000 ₽'],['Доп. адаптив','от 6 000–12 000 ₽'],['Дизайн-система','от 16 000 ₽'],['Motion-концепция','от 8 000 ₽'],['Design QA / поддержка','от 2 000 ₽/час']],
    [['UX-аудит приложения','от 8 000 ₽'],['Доп. экран приложения','от 2 500–4 000 ₽'],['Интерактивный прототип','от 8 000 ₽'],['Адаптация iOS / Android','от 12 000 ₽'],['Дизайн-система','от 16 000 ₽'],['Design QA / поддержка','от 2 000 ₽/час']],
    [['AI-изображение','от 1 500–2 500 ₽'],['AI-ролик до 2 минут','от 3 000 ₽'],['Сложный AI-ролик','от 15 000 ₽'],['AI-персонаж','от 10 000 ₽'],['Доп. формат ролика','от 2 000 ₽'],['Motion-концепция','от 8 000 ₽']],
    [['Доп. слайд','от 800–1 500 ₽'],['Структура презентации','от 4 000 ₽'],['Инфографика','от 2 500 ₽'],['Редактируемый шаблон','от 6 000 ₽'],['Анимация слайдов','от 4 000 ₽'],['Срочная подготовка','+20% к проекту']],
    [['Креатив для соцсетей','от 1 500 ₽'],['Карусель постов','от 4 000–6 000 ₽'],['Адаптация для Stories','от 800 ₽'],['Адаптация под платформу','от 1 000 ₽'],['AI-изображение','от 1 500–2 500 ₽'],['Контент-система на месяц','от 12 000 ₽']]
  ];

  const render = button => {
    const buttons = [...tabs.querySelectorAll('button')];
    const active = button || tabs.querySelector('[aria-selected="true"],.active') || buttons[0];
    const items = extras[Math.max(0, buttons.indexOf(active))] || extras[0];
    grid.innerHTML = items.map(([name, price]) => `<div class="pricing-extra"><span>${name}</span><strong>${price}</strong></div>`).join('');
  };

  tabs.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) render(button);
  });
  render();
})();

(() => {
  const data = window.PRICING_DATA;
  const tabs = document.querySelector('[data-pricing-tabs]');
  const stage = document.querySelector('[data-pricing-stage]');
  if (!data || !tabs || !stage) return;
  const syncPackageHeights = () => {
    const cards = [...stage.querySelectorAll('.pricing-package')];
    cards.forEach(card => {
      card.style.boxSizing = 'border-box';
      card.style.height = 'auto';
      card.style.minHeight = '0';
    });
    const height = Math.max(0, ...cards.map(card => card.offsetHeight));
    cards.forEach(card => card.style.height = `${height}px`);
  };
  const render = (category, updateHash = true) => {
    tabs.querySelectorAll('button').forEach(button => {
      const active = button.dataset.category === category.id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    stage.classList.remove('is-visible');
    stage.innerHTML = `<div class="pricing-category-heading"><p>${category.index}</p><div><h2>${category.title}</h2><p>${category.description}</p></div></div><div class="pricing-packages">${category.packages.map(pkg => `<article class="pricing-package${pkg.featured ? ' is-featured' : ''}"><div class="pricing-package-top"><p class="pricing-tier">${pkg.id}</p>${pkg.badge ? `<span class="pricing-badge">${pkg.badge}</span>` : ''}</div><h3>${pkg.title}</h3><p class="pricing-package-price">${pkg.price}</p>${pkg.timeline ? `<p class="pricing-timeline">${pkg.timeline}</p>` : ''}${pkg.description ? `<p class="pricing-package-description">${pkg.description}</p>` : ''}<ul>${pkg.features.map(feature => `<li>${feature}</li>`).join('')}</ul><button class="pricing-package-cta" type="button" data-select-package data-category="${category.title}" data-tier="${pkg.id}" data-title="${pkg.title}" data-price="${pkg.price}">${data.cta}${pkg.featured ? ' <svg class="icon-arrow-up" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" style="width:1em;height:1em;flex-shrink:0;vertical-align:middle" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L5.46967 17.4697ZM6.53033 18.5303L18.5303 6.53033L17.4697 5.46967L5.46967 17.4697L6.53033 18.5303Z" fill="currentColor"/><path d="M9 6H18V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</button></article>`).join('')}</div>`;
    requestAnimationFrame(() => {
      syncPackageHeights();
      stage.classList.add('is-visible');
    });
    if (updateHash) history.replaceState(null, '', `#${category.id}`);
  };
  data.categories.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.category = category.id; button.setAttribute('role', 'tab'); button.textContent = category.title;
    button.addEventListener('click', () => render(category)); tabs.append(button);
  });
  const locale = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  const copy = locale === 'ru' ? {
    title:'Вы выбрали',contact:'Ваш контакт',placeholder:'Telegram, email или телефон',
    audience:'Для кого предназначен проект?',audiencePlaceholder:'Кто будет пользоваться продуктом или смотреть материалы?',
    goal:'Какой результат должен дать проект?',goalPlaceholder:'Например: заявки, продажи, подписки или запуск нового продукта',
    notes:'Комментарий (необязательно)',notesPlaceholder:'Дополнительные детали, ссылки или пожелания',
    required:'Ответьте на этот вопрос',send:'Отправить заявку',sending:'Отправляю…',success:'Заявка отправлена',
    successNote:'Спасибо! Я получила вашу задачу и выбранный пакет и скоро свяжусь с вами.',
    error:'Не удалось отправить. Попробуйте ещё раз.',close:'Закрыть'
  } : {
    title:'Your selection',contact:'Your contact',placeholder:'Telegram, email, or phone',
    audience:'Who is this project for?',audiencePlaceholder:'Who will use the product or see the materials?',
    goal:'What outcome should the project achieve?',goalPlaceholder:'For example: leads, sales, subscriptions, or a product launch',
    notes:'Comment (optional)',notesPlaceholder:'Additional details, links, or preferences',
    required:'Please answer this question',send:'Send request',sending:'Sending…',success:'Request sent',
    successNote:'Thank you! I received your project brief and package selection and will contact you soon.',
    error:'Could not send. Please try again.',close:'Close'
  };
  const taskQuestions = locale === 'ru' ? {
    'web-design':['Какой сайт нужно разработать?','Лендинг или многостраничный сайт, его тема и основные разделы'],
    'app-design':['Какое приложение нужно спроектировать?','Что делает приложение, какие экраны и платформы нужны?'],
    'ai-creative':['Какой AI-креатив нужно создать?','Изображения или видео, сюжет, формат и длительность'],
    presentations:['Какую презентацию нужно подготовить?','Тема, формат выступления и примерное количество слайдов'],
    'social-media':['Какие материалы для соцсетей нужны?','Площадки, форматы, количество креативов и тема']
  } : {
    'web-design':['What kind of website do you need?','Landing page or multi-page site, its topic and main sections'],
    'app-design':['What app do you need designed?','What does it do, and which screens and platforms do you need?'],
    'ai-creative':['What AI creative do you need?','Images or video, concept, format, and duration'],
    presentations:['What presentation do you need?','Topic, presentation format, and approximate slide count'],
    'social-media':['What social media materials do you need?','Platforms, formats, number of creatives, and topic']
  };
  const escapeHtml = value => String(value || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const projectOptions = locale === 'ru' ? {
    'web-design':['Лендинг','Многостраничный сайт','Интернет-магазин','Редизайн сайта'],
    'app-design':['iOS','Android','iOS и Android','Веб-приложение'],
    'ai-creative':['Изображения','Рекламное видео','Анимация','Авторская история'],
    presentations:['Продуктовая','Для инвесторов','Для выступления','Коммерческое предложение'],
    'social-media':['Баннеры','Постеры','Посты','Сторис']
  } : {
    'web-design':['Landing page','Multi-page website','Online store','Website redesign'],
    'app-design':['iOS','Android','iOS and Android','Web app'],
    'ai-creative':['Images','Advertising video','Animation','Original story'],
    presentations:['Product presentation','Investor pitch','Talk or event','Sales proposal'],
    'social-media':['Banners','Posters','Posts','Stories']
  };
  const extraOptions = locale === 'ru' ? ['Другое','Пока не знаю'] : ['Other','Not sure yet'];
  const audienceOptions = locale === 'ru'
    ? ['Частные клиенты','Бизнес-клиенты','Команда компании','Широкая аудитория']
    : ['Consumers','Business customers','Company team','General audience'];
  const goalOptions = locale === 'ru'
    ? ['Заявки','Продажи','Подписки','Запуск продукта','Узнаваемость']
    : ['Leads','Sales','Subscriptions','Product launch','Brand awareness'];
  const closeModal = modal => { modal.remove(); document.documentElement.classList.remove('pricing-modal-open'); };
  const openModal = button => {
    const selection = {category:button.dataset.category,tier:button.dataset.tier,title:button.dataset.title,price:button.dataset.price};
    const categoryId = data.categories.find(category => category.title === selection.category)?.id;
    const [taskLabel] = taskQuestions[categoryId] || taskQuestions['web-design'];
    const questions = [
      {name:'project',label:taskLabel,options:projectOptions[categoryId] || projectOptions['web-design']},
      {name:'audience',label:copy.audience,options:audienceOptions},
      {name:'goal',label:copy.goal,options:goalOptions}
    ];
    const questionFields = questions.map(question => `<fieldset class="pricing-question"><legend>${question.label}</legend><div class="pricing-question-options">${[...question.options,...extraOptions].map((option,index) => `<label class="pricing-choice"><input type="radio" name="${question.name}" value="${option}" required><span>${option}</span></label>`).join('')}</div></fieldset>`).join('');
    const modal = document.createElement('div'); modal.className='pricing-selection';
    modal.innerHTML=`<button class="pricing-selection-backdrop" type="button" aria-label="${copy.close}"></button><section class="pricing-selection-dialog" role="dialog" aria-modal="true"><button class="pricing-selection-close" type="button" aria-label="${copy.close}">×</button><p class="pricing-kicker">${copy.title}</p><h2>${selection.category}</h2><div class="pricing-selection-summary"><span>${selection.tier} · ${selection.title}</span><strong>${selection.price}</strong></div><form><label>${copy.contact}<input name="contact" required maxlength="254" autocomplete="email" placeholder="${copy.placeholder}"></label>${questionFields}<label>${copy.notes}<textarea name="notes" rows="3" maxlength="1000" placeholder="${copy.notesPlaceholder}"></textarea></label><button class="pricing-selection-submit" type="submit">${copy.send} <svg class="icon-arrow-up" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" style="width:1em;height:1em;flex-shrink:0;vertical-align:middle" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L5.46967 17.4697ZM6.53033 18.5303L18.5303 6.53033L17.4697 5.46967L5.46967 17.4697L6.53033 18.5303Z" fill="currentColor"/><path d="M9 6H18V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><p class="pricing-selection-status" role="status"></p></form></section>`;
    document.body.append(modal); document.documentElement.classList.add('pricing-modal-open'); modal.querySelector('input').focus();
    modal.querySelectorAll('.pricing-selection-close,.pricing-selection-backdrop').forEach(el=>el.addEventListener('click',()=>closeModal(modal)));
    const form = modal.querySelector('form');
    form.addEventListener('input', event => event.target.setCustomValidity?.(''));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (submit.disabled) return;
      const status = form.querySelector('.pricing-selection-status');
      const answers = questions.map(question => ({
        label: question.label,
        value: form.elements[question.name].value.trim()
      }));
      const contact = form.elements.contact.value.trim();
      form.elements.contact.setCustomValidity(contact ? '' : copy.required);
      if (!form.reportValidity()) return;
      const notes = form.elements.notes.value.trim();
      const submitMarkup = submit.innerHTML;
      status.textContent = '';
      submit.disabled = true;
      submit.textContent = copy.sending;
      const text = [
        locale === 'ru' ? '📩 <b>Выбран пакет на anestiiz.ru</b>' : '📩 <b>Package selected on anestiiz.com</b>',
        '',
        `<b>${locale === 'ru' ? 'Категория' : 'Category'}:</b> ${escapeHtml(selection.category)}`,
        `<b>${locale === 'ru' ? 'Пакет' : 'Package'}:</b> ${escapeHtml(selection.tier)} · ${escapeHtml(selection.title)}`,
        `<b>${locale === 'ru' ? 'Цена' : 'Price'}:</b> ${escapeHtml(selection.price)}`,
        `<b>${locale === 'ru' ? 'Контакт' : 'Contact'}:</b> ${escapeHtml(contact)}`,
        ...answers.map(answer => `<b>${escapeHtml(answer.label)}</b> ${escapeHtml(answer.value)}`),
        ...(notes ? [`<b>${locale === 'ru' ? 'Комментарий' : 'Comment'}:</b> ${escapeHtml(notes)}`] : [])
      ].join('\n');
      const payload = new FormData();
      payload.append('text', text);
      try {
        const response = await fetch('https://anestiiz-telegram-events.palkina-anastasii.workers.dev/brief', {method:'POST',body:payload});
        const json = await response.json();
        if (!response.ok || !json.ok) throw new Error('Delivery failed');
        modal.querySelector('.pricing-selection-dialog').innerHTML = `<div class="pricing-selection-success"><span>✓</span><h2>${copy.success}</h2><p>${copy.successNote}</p><button type="button">${copy.close}</button></div>`;
        modal.querySelector('.pricing-selection-success button').addEventListener('click', () => closeModal(modal));
        if (window.ym) window.ym(window.__ymId,'reachGoal','pricing_package_submitted');
      } catch (error) {
        status.textContent = copy.error;
        submit.disabled = false;
        submit.innerHTML = submitMarkup;
      }
    });
  };
  stage.addEventListener('click',event=>{const button=event.target.closest('[data-select-package]');if(button)openModal(button);});
  let resizeFrame = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(syncPackageHeights);
  });
  document.fonts?.ready.then(syncPackageHeights);
  addEventListener('keydown',event=>{if(event.key==='Escape'){const modal=document.querySelector('.pricing-selection');if(modal)closeModal(modal);}});
  render(data.categories.find(category => `#${category.id}` === location.hash) || data.categories[0], false);
})();

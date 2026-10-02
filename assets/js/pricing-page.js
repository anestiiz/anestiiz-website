(() => {
  const data = window.PRICING_DATA;
  const tabs = document.querySelector('[data-pricing-tabs]');
  const stage = document.querySelector('[data-pricing-stage]');
  if (!data || !tabs || !stage) return;
  const render = (category, updateHash = true) => {
    tabs.querySelectorAll('button').forEach(button => {
      const active = button.dataset.category === category.id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    stage.classList.remove('is-visible');
    stage.innerHTML = `<div class="pricing-category-heading"><p>${category.index}</p><div><h2>${category.title}</h2><p>${category.description}</p></div></div><div class="pricing-packages">${category.packages.map(pkg => `<article class="pricing-package${pkg.featured ? ' is-featured' : ''}"><div class="pricing-package-top"><p class="pricing-tier">${pkg.id}</p>${pkg.badge ? `<span class="pricing-badge">${pkg.badge}</span>` : ''}</div><h3>${pkg.title}</h3><p class="pricing-package-price">${pkg.price}</p>${pkg.timeline ? `<p class="pricing-timeline">${pkg.timeline}</p>` : ''}${pkg.description ? `<p class="pricing-package-description">${pkg.description}</p>` : ''}<ul>${pkg.features.map(feature => `<li>${feature}</li>`).join('')}</ul><button class="pricing-package-cta" type="button" data-select-package data-category="${category.title}" data-tier="${pkg.id}" data-title="${pkg.title}" data-price="${pkg.price}">${data.cta}${pkg.featured ? ' ↗' : ''}</button></article>`).join('')}</div>`;
    requestAnimationFrame(() => stage.classList.add('is-visible'));
    if (updateHash) history.replaceState(null, '', `#${category.id}`);
  };
  data.categories.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.category = category.id; button.setAttribute('role', 'tab'); button.textContent = category.title;
    button.addEventListener('click', () => render(category)); tabs.append(button);
  });
  const locale = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  const copy = locale === 'ru' ? {title:'Вы выбрали',contact:'Ваш контакт',placeholder:'Telegram, email или телефон',notes:'Комментарий',notesPlaceholder:'Коротко опишите задачу',send:'Отправить заявку',sending:'Отправляю…',success:'Заявка отправлена',successNote:'Спасибо! Я получила выбранный пакет и скоро свяжусь с вами.',error:'Не удалось отправить. Попробуйте ещё раз.',close:'Закрыть'} : {title:'Your selection',contact:'Your contact',placeholder:'Telegram, email, or phone',notes:'Project note',notesPlaceholder:'Tell me briefly about your project',send:'Send request',sending:'Sending…',success:'Request sent',successNote:'Thank you! I received your package selection and will contact you soon.',error:'Could not send. Please try again.',close:'Close'};
  const escapeHtml = value => String(value || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const closeModal = modal => { modal.remove(); document.documentElement.classList.remove('pricing-modal-open'); };
  const openModal = button => {
    const selection = {category:button.dataset.category,tier:button.dataset.tier,title:button.dataset.title,price:button.dataset.price};
    const modal = document.createElement('div'); modal.className='pricing-selection';
    modal.innerHTML=`<button class="pricing-selection-backdrop" type="button" aria-label="${copy.close}"></button><section class="pricing-selection-dialog" role="dialog" aria-modal="true"><button class="pricing-selection-close" type="button" aria-label="${copy.close}">×</button><p class="pricing-kicker">${copy.title}</p><h2>${selection.category}</h2><div class="pricing-selection-summary"><span>${selection.tier} · ${selection.title}</span><strong>${selection.price}</strong></div><form><label>${copy.contact}<input name="contact" required autocomplete="email" placeholder="${copy.placeholder}"></label><label>${copy.notes}<textarea name="notes" rows="4" placeholder="${copy.notesPlaceholder}"></textarea></label><button class="pricing-selection-submit" type="submit">${copy.send} ↗</button><p class="pricing-selection-status" role="status"></p></form></section>`;
    document.body.append(modal); document.documentElement.classList.add('pricing-modal-open'); modal.querySelector('input').focus();
    modal.querySelectorAll('.pricing-selection-close,.pricing-selection-backdrop').forEach(el=>el.addEventListener('click',()=>closeModal(modal)));
    modal.querySelector('form').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,submit=form.querySelector('button[type="submit"]'),status=form.querySelector('.pricing-selection-status'),contact=form.elements.contact.value.trim(),notes=form.elements.notes.value.trim();submit.disabled=true;submit.textContent=copy.sending;const text=locale==='ru'?`📩 <b>Выбран пакет на anestiiz.ru</b>\n\n<b>Категория:</b> ${escapeHtml(selection.category)}\n<b>Пакет:</b> ${escapeHtml(selection.tier)} · ${escapeHtml(selection.title)}\n<b>Цена:</b> ${escapeHtml(selection.price)}\n<b>Контакт:</b> ${escapeHtml(contact)}${notes?`\n<b>Комментарий:</b> ${escapeHtml(notes)}`:''}`:`📩 <b>Package selected on anestiiz.com</b>\n\n<b>Category:</b> ${escapeHtml(selection.category)}\n<b>Package:</b> ${escapeHtml(selection.tier)} · ${escapeHtml(selection.title)}\n<b>Price:</b> ${escapeHtml(selection.price)}\n<b>Contact:</b> ${escapeHtml(contact)}${notes?`\n<b>Note:</b> ${escapeHtml(notes)}`:''}`;const payload=new FormData();payload.append('text',text);try{const response=await fetch('https://anestiiz-telegram-events.palkina-anastasii.workers.dev/brief',{method:'POST',body:payload});const json=await response.json();if(!response.ok||!json.ok)throw new Error('Delivery failed');modal.querySelector('.pricing-selection-dialog').innerHTML=`<div class="pricing-selection-success"><span>✓</span><h2>${copy.success}</h2><p>${copy.successNote}</p><button type="button">${copy.close}</button></div>`;modal.querySelector('.pricing-selection-success button').addEventListener('click',()=>closeModal(modal));if(window.ym)window.ym(window.__ymId,'reachGoal','pricing_package_submitted');}catch(error){status.textContent=copy.error;submit.disabled=false;submit.textContent=`${copy.send} ↗`;}});
  };
  stage.addEventListener('click',event=>{const button=event.target.closest('[data-select-package]');if(button)openModal(button);});
  addEventListener('keydown',event=>{if(event.key==='Escape'){const modal=document.querySelector('.pricing-selection');if(modal)closeModal(modal);}});
  render(data.categories.find(category => `#${category.id}` === location.hash) || data.categories[0], false);
})();

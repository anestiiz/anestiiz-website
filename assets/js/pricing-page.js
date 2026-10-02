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
    stage.innerHTML = `<div class="pricing-category-heading"><p>${category.index}</p><div><h2>${category.title}</h2><p>${category.description}</p></div></div><div class="pricing-packages">${category.packages.map(pkg => `<article class="pricing-package${pkg.featured ? ' is-featured' : ''}"><div class="pricing-package-top"><p class="pricing-tier">${pkg.id}</p>${pkg.badge ? `<span class="pricing-badge">${pkg.badge}</span>` : ''}</div><h3>${pkg.title}</h3><p class="pricing-package-price">${pkg.price}</p>${pkg.timeline ? `<p class="pricing-timeline">${pkg.timeline}</p>` : ''}${pkg.description ? `<p class="pricing-package-description">${pkg.description}</p>` : ''}<ul>${pkg.features.map(feature => `<li>${feature}</li>`).join('')}</ul><a class="pricing-package-cta" href="${data.ctaHref}">${data.cta}${pkg.featured ? ' ↗' : ''}</a></article>`).join('')}</div>`;
    requestAnimationFrame(() => stage.classList.add('is-visible'));
    if (updateHash) history.replaceState(null, '', `#${category.id}`);
  };
  data.categories.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.category = category.id; button.setAttribute('role', 'tab'); button.textContent = category.title;
    button.addEventListener('click', () => render(category)); tabs.append(button);
  });
  render(data.categories.find(category => `#${category.id}` === location.hash) || data.categories[0], false);
})();

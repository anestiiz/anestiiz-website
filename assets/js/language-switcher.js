(() => {
  const currentLanguage = 'ru';
  const domains = { en: 'https://anestiiz.com', ru: 'https://anestiiz.ru' };
  const englishRoutes = new Set([
    '/', '/index.html', '/apps.html', '/apps/', '/websites.html', '/websites/', '/branding/',
    '/presentations.html', '/presentations/', '/banners/', '/ai.html', '/ai/',
    '/ai-creative.html', '/ai-creative/', '/brief.html', '/brief/', '/neuro.html',
    '/fluxframe.html', '/fluxframe/', '/lume.html', '/lume/', '/bloat-down.html',
    '/bloat-down/', '/greekly.html', '/greekly/', '/greekly-promo.html',
    '/greekly-promo/', '/sites/lacque/', '/sites/noir-rouge/', '/sites/sera/',
    '/presentations/frame/', '/presentations/sloy/',
    '/pricing/',
    '/presentations/116-trophy-cyprus/', '/presentations/116-trophy-cyprus.html'
  ]);
  const routeOverrides = {
    '/banners/shum/': '/shum/',
    '/banners/feast-no-tomorrow/': '/a-feast-without-tomorrow.html',
    '/banners/': '/banners.html',
    '/branding/': '/branding.html',
    '/pricing/': '/pricing.html'
  };

  const routeFor = (language) => {
    let path = location.pathname;
    if (language === 'en') path = routeOverrides[path] || (englishRoutes.has(path) ? path : '/');
    return `${domains[language]}${path}?language=${language}${location.hash}`;
  };

  const params = new URLSearchParams(location.search);
  const incomingLanguage = params.get('language');
  if (incomingLanguage === currentLanguage) {
    params.delete('language');
    const query = params.toString();
    history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
  }

  const openLanguagePicker = () => {
    if (document.querySelector('.language-picker')) return;

    const modal = document.createElement('div');
    modal.className = 'language-picker';
    modal.innerHTML = `
      <div class="language-picker__backdrop"></div>
      <section class="language-picker__dialog" role="dialog" aria-modal="true" aria-labelledby="language-picker-title">
        <p class="language-picker__eyebrow">ANESTIIZ</p>
        <h2 id="language-picker-title">Выберите язык</h2>
        <p class="language-picker__subtitle">Choose your language</p>
        <div class="language-picker__options">
          <button type="button" data-language="ru"><span>Русский</span><small>RU</small></button>
          <button type="button" data-language="en"><span>English</span><small>EN</small></button>
        </div>
      </section>`;

    const style = document.createElement('style');
    style.textContent = `
      .language-picker{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:20px;font-family:Arial,sans-serif;color:#fff}
      .fluffy-cursor{z-index:2147483647!important}.fluffy-cursor-trail{z-index:2147483646!important}
      .language-picker__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(18px)}
      .language-picker__dialog{position:relative;width:min(520px,100%);padding:38px;background:#0b090c;border:1px solid rgba(255,255,255,.22);border-radius:8px;box-shadow:0 30px 90px rgba(0,0,0,.55);text-align:center}
      .language-picker__eyebrow{margin:0 0 20px;color:#ff1680;font-size:12px;font-weight:700;letter-spacing:2px}
      .language-picker h2{margin:0;font-size:clamp(28px,6vw,46px);line-height:1.05;letter-spacing:0}
      .language-picker__subtitle{margin:10px 0 30px;color:#aaa;font-size:16px}
      .language-picker__options{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .language-picker button{min-height:64px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;color:#fff;background:#171419;border:1px solid rgba(255,255,255,.2);border-radius:6px;font:600 18px/1 Arial,sans-serif;cursor:pointer;transition:.2s ease}
      .language-picker button:hover,.language-picker button:focus-visible{background:#ff0879;border-color:#ff87bc;outline:none;transform:translateY(-2px)}
      .language-picker button small{font-size:12px;opacity:.68}
      @media(max-width:520px){.language-picker__dialog{padding:30px 20px}.language-picker__options{grid-template-columns:1fr}}
      @media(prefers-reduced-motion:reduce){.language-picker button{transition:none}}
    `;
    document.head.append(style);
    document.body.append(modal);

    modal.querySelectorAll('[data-language]').forEach((button) => {
      button.addEventListener('click', () => {
        const language = button.dataset.language;
        if (language === currentLanguage) {
          modal.remove();
          style.remove();
        } else {
          location.href = routeFor(language);
        }
      });
    });
  };

  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  const cameFromThisSite = (() => {
    if (!document.referrer) return false;
    try { return new URL(document.referrer).origin === location.origin; }
    catch { return false; }
  })();
  const shouldOpenPicker = !incomingLanguage && (navigationType === 'reload' || !cameFromThisSite);

  if (shouldOpenPicker) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', openLanguagePicker, { once: true });
    } else {
      openLanguagePicker();
    }
  }
})();

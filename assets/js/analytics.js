const YANDEX_METRIKA_ID = 112751157;

let globalControlsLink = document.querySelector('link[data-global-controls]');
if (!globalControlsLink) {
  const globalControls = document.createElement('link');
  globalControls.rel = 'stylesheet';
  globalControls.href = '/assets/css/global-controls.css?v=3';
  globalControls.dataset.globalControls = '';
  document.head.append(globalControls);
  globalControlsLink = globalControls;
}

(() => {
  const path = location.pathname;
  const isStandaloneExperience = path.startsWith("/sites/") ||
    path.startsWith("/presentations/116-trophy-cyprus/") ||
    path.startsWith("/presentations/frame/");
  if (isStandaloneExperience || !document.body) return;

  document.body.querySelector(":scope > header")?.remove();
  document.body.querySelectorAll(":scope > #mobileDrawer, :scope > .drawer").forEach(element => element.remove());

  const header = document.createElement("header");
  header.className = "portfolio-global-header";
  header.innerHTML = `
    <div class="portfolio-header-inner">
      <a class="portfolio-brand" href="/" aria-label="anestiiz — на главную">
        <span>anestiiz</span><img src="/assets/anestiiz-mark.svg" alt="">
      </a>
      <nav class="portfolio-main-nav" aria-label="Основная навигация">
        <a href="/#experience">Мой опыт</a>
        <a href="/#about">Обо мне</a>
        <a href="/#ai">Я и AI</a>
      </nav>
      <div class="portfolio-header-actions">
        <a class="portfolio-brief-link" href="/brief/">Заполнить бриф <img src="/Icons/Arrow Right Up.svg" alt=""></a>
        <button class="portfolio-menu-button" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="portfolioGlobalDrawer"><span></span><span></span></button>
      </div>
    </div>`;

  const drawer = document.createElement("div");
  drawer.className = "portfolio-global-drawer";
  drawer.id = "portfolioGlobalDrawer";
  drawer.hidden = true;
  drawer.innerHTML = `
    <button class="portfolio-drawer-scrim" type="button" aria-label="Закрыть меню"></button>
    <div class="portfolio-drawer-panel" role="dialog" aria-modal="true" aria-label="Меню">
      <button class="portfolio-drawer-close" type="button" aria-label="Закрыть меню">×</button>
      <span>РАБОТЫ</span>
      <a href="/ai-creative/">AI-креатив</a><a href="/apps/">Приложения</a><a href="/websites/">Сайты</a><a href="/presentations/">Презентации</a><a href="/mts-projects/">Проекты МТС</a>
      <span>ЕЩЁ</span>
      <a href="/#experience">Мой опыт</a><a href="/#about">Обо мне</a><a href="/#ai">Я и AI</a><a class="portfolio-drawer-brief" href="/brief/">Заполнить бриф</a>
    </div>`;

  document.body.prepend(drawer);
  document.body.prepend(header);
  const revealHeader = () => header.classList.add("is-ready");
  if (globalControlsLink.sheet) revealHeader();
  else globalControlsLink.addEventListener("load", revealHeader, { once: true });

  const menuButton = header.querySelector(".portfolio-menu-button");
  const closeDrawer = () => {
    drawer.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("portfolio-menu-open");
  };
  const openDrawer = () => {
    drawer.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("portfolio-menu-open");
    drawer.querySelector(".portfolio-drawer-close").focus();
  };

  menuButton.addEventListener("click", openDrawer);
  drawer.querySelectorAll(".portfolio-drawer-close,.portfolio-drawer-scrim").forEach(button => button.addEventListener("click", closeDrawer));
  drawer.querySelectorAll("a").forEach(link => link.addEventListener("click", closeDrawer));
  addEventListener("keydown", event => {
    if (event.key === "Escape" && !drawer.hidden) closeDrawer();
  });
})();

window.__ymId = YANDEX_METRIKA_ID;

if (YANDEX_METRIKA_ID) {
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) return; }
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym(YANDEX_METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  });

  const siteVersion = location.hostname.endsWith(".com") ? "EN" : "RU";
  const eventContext = () => ({
    site_version: siteVersion,
    domain: location.hostname,
    page: location.pathname
  });

  window.ym(YANDEX_METRIKA_ID, "params", {
    portfolio_site: eventContext()
  });

  window.trackPortfolioGoal = function(goal, details) {
    const params = Object.assign(eventContext(), details || {});
    window.ym(YANDEX_METRIKA_ID, "reachGoal", goal, params);
    window.ym(YANDEX_METRIKA_ID, "params", { portfolio_event: Object.assign({ type: goal }, params) });
  };

  document.addEventListener("click", function(event) {
    const target = event.target.closest("a, button");
    if (!target) return;

    const href = target.tagName === "A" ? (target.getAttribute("href") || "") : "";
    const label = (target.getAttribute("aria-label") || target.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
    let goal = "";

    if (/t\.me\//i.test(href)) goal = "telegram_click";
    else if (/^mailto:/i.test(href)) goal = "email_click";
    else if (/apps\.apple\.com/i.test(href)) goal = "app_store_click";
    else if (/play\.google\.com/i.test(href)) goal = "google_play_click";
    else if (/\/brief(?:\/|\.html)(?:[?#]|$)/i.test(href)) goal = "brief_open";
    else if (target.matches(".project-card, .card-link") || target.closest(".project-card, .card-link")) goal = "project_open";

    if (goal) window.trackPortfolioGoal(goal, { label: label });
  }, { passive: true });

  const reachedDepths = new Set();
  window.addEventListener("scroll", function() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const depth = Math.round((window.scrollY / maxScroll) * 100);
    [50, 90].forEach(function(mark) {
      if (depth >= mark && !reachedDepths.has(mark)) {
        reachedDepths.add(mark);
        window.trackPortfolioGoal("scroll_" + mark, { depth: mark });
      }
    });
  }, { passive: true });
}

(() => {
  if (location.pathname === "/" || document.querySelector(".back-link,.runner-back,.back,.deck-back,[data-site-back]")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "site-back-button";
  button.setAttribute("aria-label", "Назад");
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path opacity=".5" d="M20 12.75a.75.75 0 0 0 0-1.5v1.5Zm0-.75v-.75H4v1.5h16V12Z" fill="white"/><path d="m10 6-6 6 6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Назад';
  button.addEventListener("click", () => {
    if (document.referrer && new URL(document.referrer).origin === location.origin) history.back();
    else location.href = "/";
  });
  document.body.append(button);
})();

(() => {
  const finePointer = matchMedia("(pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) return;

  const cursor = document.createElement("div");
  const trail = document.createElement("div");
  cursor.className = "fluffy-cursor";
  trail.className = "fluffy-cursor-trail";
  cursor.setAttribute("aria-hidden", "true");
  trail.setAttribute("aria-hidden", "true");
  document.body.append(cursor, trail);
  document.documentElement.classList.add("fluffy-cursor-enabled");

  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  let trailX = pointerX;
  let trailY = pointerY;

  const render = () => {
    trailX += (pointerX - trailX) * .16;
    trailY += (pointerY - trailY) * .16;
    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;
    requestAnimationFrame(render);
  };

  addEventListener("pointermove", event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.style.left = `${pointerX}px`;
    cursor.style.top = `${pointerY}px`;
    cursor.classList.add("is-visible");
    trail.classList.add("is-visible");

    const active = !!event.target.closest("a,button,input,textarea,select,summary,[role='button']");
    cursor.classList.toggle("is-active", active);
    trail.classList.toggle("is-active", active);
  }, { passive: true });

  addEventListener("pointerdown", () => cursor.classList.add("is-pressed"), { passive: true });
  addEventListener("pointerup", () => cursor.classList.remove("is-pressed"), { passive: true });
  addEventListener("pointerleave", () => {
    cursor.classList.remove("is-visible");
    trail.classList.remove("is-visible");
  });
  addEventListener("pointerenter", () => {
    cursor.classList.add("is-visible");
    trail.classList.add("is-visible");
  });

  requestAnimationFrame(render);
})();

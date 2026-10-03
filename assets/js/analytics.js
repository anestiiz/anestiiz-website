const YANDEX_METRIKA_ID = 112751157;
const TELEGRAM_ACTIVITY_ENDPOINT = "https://anestiiz-telegram-events.palkina-anastasii.workers.dev/event";
const TELEGRAM_OWNER_MODE_KEY = "anestiiz_owner_device";

const telegramOwnerMode = (() => {
  try {
    const url = new URL(location.href);
    if (url.searchParams.get("owner") === "anestiiz") {
      localStorage.setItem(TELEGRAM_OWNER_MODE_KEY, "1");
      url.searchParams.delete("owner");
      history.replaceState(history.state, "", url.pathname + url.search + url.hash);
    }
    return localStorage.getItem(TELEGRAM_OWNER_MODE_KEY) === "1";
  } catch (error) {
    return false;
  }
})();

let globalControlsLink = document.querySelector('link[data-global-controls]');
if (!globalControlsLink) {
  const globalControls = document.createElement('link');
  globalControls.rel = 'stylesheet';
  globalControls.href = '/assets/css/global-controls.css?v=8';
  globalControls.dataset.globalControls = '';
  document.head.append(globalControls);
  globalControlsLink = globalControls;
}
globalControlsLink.href = '/assets/css/global-controls.css?v=8';

(() => {
  const path = location.pathname;
  const isStandaloneExperience = path.startsWith("/sites/");
  const isPortfolioCase = /^\/(?:bloat-down|fluxframe|greekly|greekly-promo|lume|mts-runner-seasons|mts-summer-advent|mts-valentines)(?:\/|\.html|$)/.test(path) ||
    /^\/banners\/feast-no-tomorrow(?:\/|$)/.test(path) ||
    /^\/presentations\/(?:116-trophy-cyprus|frame|sloy)(?:\/|\.html|$)/.test(path);
  if (isStandaloneExperience || !document.body) return;

  document.body.querySelector(":scope > header")?.remove();
  document.body.querySelectorAll(":scope > #mobileDrawer, :scope > .drawer").forEach(element => element.remove());
  if (isPortfolioCase) {
    document.documentElement.classList.add("portfolio-case-page");
    document.querySelectorAll(".topbar .back,.deck-back").forEach(element => element.remove());
    return;
  }

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
        <a href="/pricing/">Цены</a>
      </nav>
      <div class="portfolio-header-actions">
        <div class="portfolio-social-links" aria-label="Социальные сети">
          <a href="https://t.me/anestiiz" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.7 3.2 18.5 20c-.2 1.2-.9 1.5-1.9.9l-4.8-3.6-2.3 2.3c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.2 13.9l-4.7-1.5c-1-.3-1-1 .2-1.5L20 3.8c.9-.3 1.9.2 1.7-.6Z"/></svg></a>
          <a href="https://www.behance.net/anestiiz" target="_blank" rel="noopener" aria-label="Behance"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5h7.1c3 0 4.8 1 4.8 3.7 0 1.4-.7 2.4-1.9 3 1.7.5 2.6 1.8 2.6 3.6 0 2.9-2.5 4.2-5.1 4.2H3V5.5Zm3.2 5.9h3.4c1.2 0 2.1-.5 2.1-1.8 0-1.5-1.1-1.7-2.4-1.7H6.2v3.5Zm0 6.1h3.6c1.4 0 2.6-.4 2.6-2 0-1.6-1-2.2-2.5-2.2H6.2v4.2ZM17.1 7h5v1.7h-5V7Zm5.9 8.5h-7.5c.1 1.8 1 2.6 2.6 2.6 1.2 0 2.1-.7 2.3-1.4h2.5c-.8 2.5-2.5 3.6-4.9 3.6-3.3 0-5.4-2.3-5.4-5.5 0-3.1 2.2-5.5 5.4-5.5 3.6 0 5.3 3 5.1 6.2Zm-7.5-1.8h4.7c-.3-1.5-.9-2.2-2.3-2.2-1.8 0-2.3 1.4-2.4 2.2Z"/></svg></a>
          <a href="https://www.instagram.com/anestiiz/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.9 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg></a>
        </div>
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
      <a href="/websites/">Веб-дизайн</a><a href="/apps/">Дизайн приложений</a><a href="/branding/">Брендинг</a><a href="/ai-creative/">AI-Креативы</a><a href="/presentations/">Презентации</a><a href="/banners/">Социальные сети</a>
      <span>ЕЩЁ</span>
      <a href="/#experience">Мой опыт</a><a href="/#about">Обо мне</a><a href="/#ai">Я и AI</a><a href="/pricing/">Цены</a><div class="portfolio-drawer-socials"><a href="https://t.me/anestiiz" target="_blank" rel="noopener">Telegram</a><a href="https://www.behance.net/anestiiz" target="_blank" rel="noopener">Behance</a><a href="https://www.instagram.com/anestiiz/" target="_blank" rel="noopener">Instagram</a></div>
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

  const activitySessionId = (() => {
    const key = "anestiiz_activity_session";
    try {
      const saved = sessionStorage.getItem(key);
      if (saved) return saved;
      const created = Math.random().toString(36).slice(2, 8).toUpperCase();
      sessionStorage.setItem(key, created);
      return created;
    } catch (error) {
      return Math.random().toString(36).slice(2, 8).toUpperCase();
    }
  })();

  const notifyTelegramActivity = (goal, params) => {
    if (telegramOwnerMode) return;
    if (!TELEGRAM_ACTIVITY_ENDPOINT || !["page_view", "ui_click", "content_view", "section_view"].includes(goal)) return;
    if (/^(?:localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    fetch(TELEGRAM_ACTIVITY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: goal,
        site: siteVersion,
        page: location.pathname + location.hash,
        label: params.label || "",
        element: params.element || "",
        destination: params.destination || "",
        section: params.section || "",
        title: params.title || document.title,
        session: activitySessionId
      }),
      keepalive: true
    }).catch(() => {});
  };

  window.trackPortfolioGoal = function(goal, details) {
    const params = Object.assign(eventContext(), details || {});
    window.ym(YANDEX_METRIKA_ID, "reachGoal", goal, params);
    window.ym(YANDEX_METRIKA_ID, "params", { portfolio_event: Object.assign({ type: goal }, params) });
    notifyTelegramActivity(goal, params);
  };

  const compactText = value => String(value || "").trim().replace(/\s+/g, " ").slice(0, 100);
  const safeDestination = href => {
    if (!href) return "";
    try {
      const url = new URL(href, location.href);
      return url.origin === location.origin ? url.pathname + url.hash : url.protocol + "//" + url.hostname;
    } catch (error) {
      return compactText(href);
    }
  };
  const elementName = element => {
    if (!element) return "unknown";
    const id = element.id ? "#" + element.id : "";
    const classes = typeof element.className === "string"
      ? element.className.trim().split(/\s+/).filter(Boolean).slice(0, 3).map(name => "." + name).join("")
      : "";
    return (element.tagName.toLowerCase() + id + classes).slice(0, 120);
  };
  const readableLabel = element => compactText(
    element?.getAttribute("aria-label") ||
    element?.getAttribute("title") ||
    element?.dataset?.title ||
    element?.querySelector?.(".meta-title, [data-title], h1, h2, h3")?.textContent ||
    element?.querySelector?.("img[alt]")?.alt ||
    element?.textContent
  );

  window.trackPortfolioGoal("page_view", {
    title: compactText(document.title),
    referrer_domain: document.referrer ? new URL(document.referrer).hostname : ""
  });

  document.addEventListener("click", function(event) {
    const clicked = event.target.closest("a, button, input, select, textarea, summary, [role='button'], [data-analytics-click]") || event.target;
    const target = event.target.closest("a, button");
    const href = clicked.tagName === "A" ? (clicked.getAttribute("href") || "") : "";
    const label = readableLabel(clicked);

    window.trackPortfolioGoal("ui_click", {
      element: elementName(clicked),
      label: label,
      destination: safeDestination(href)
    });

    if (!target) return;

    const targetHref = target.tagName === "A" ? (target.getAttribute("href") || "") : "";
    const targetLabel = compactText(target.getAttribute("aria-label") || target.textContent);
    let goal = "";

    if (/t\.me\//i.test(targetHref)) goal = "telegram_click";
    else if (/instagram\.com\//i.test(targetHref)) goal = "instagram_click";
    else if (/^mailto:/i.test(targetHref)) goal = "email_click";
    else if (/apps\.apple\.com/i.test(targetHref)) goal = "app_store_click";
    else if (/play\.google\.com/i.test(targetHref)) goal = "google_play_click";
    else if (/\/brief(?:\/|\.html)(?:[?#]|$)/i.test(targetHref)) goal = "brief_open";
    else if (target.matches(".project-card, .card-link") || target.closest(".project-card, .card-link")) goal = "project_open";

    if (goal) window.trackPortfolioGoal(goal, { label: targetLabel, destination: safeDestination(targetHref) });
  }, { passive: true });

  window.addEventListener("hashchange", function() {
    window.ym(YANDEX_METRIKA_ID, "hit", location.pathname + location.search + location.hash, {
      title: document.title
    });
    window.trackPortfolioGoal("section_view", { section: location.hash.slice(1) || "top" });
  });

  if ("IntersectionObserver" in window) {
    const viewed = new WeakSet();
    const viewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || viewed.has(entry.target)) return;
        viewed.add(entry.target);
        window.trackPortfolioGoal("content_view", {
          element: elementName(entry.target),
          label: readableLabel(entry.target),
          destination: safeDestination(entry.target.matches("a[href]") ? entry.target.getAttribute("href") : entry.target.querySelector("a[href]")?.getAttribute("href"))
        });
        viewObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("article, .project-card, .orbit-card, [data-analytics-view]").forEach(element => viewObserver.observe(element));
  }

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
  const bars = Array.from(document.querySelectorAll(".tabs-nav"));
  if (!bars.length) return;

  const positionPill = (bar, target = bar.querySelector("a.active"), centerTarget = false) => {
    const pill = bar.querySelector(".tabs-pill");
    if (!pill || !target) return;
    if (centerTarget && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: target.offsetLeft - (bar.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
    }
    const padding = parseFloat(getComputedStyle(bar).paddingLeft) || 0;
    pill.style.width = `${target.offsetWidth}px`;
    pill.style.transform = `translateX(${target.offsetLeft - padding}px)`;
  };

  bars.forEach(bar => {
    const active = () => bar.querySelector("a.active");
    bar.querySelectorAll("a").forEach(link => {
      link.addEventListener("pointerenter", () => positionPill(bar, link));
      link.addEventListener("focus", () => positionPill(bar, link));
      link.addEventListener("pointerdown", () => positionPill(bar, link));
    });
    bar.addEventListener("pointerleave", () => positionPill(bar, active()));
    bar.addEventListener("focusout", event => {
      if (!bar.contains(event.relatedTarget)) positionPill(bar, active());
    });
  });

  const updateTabs = () => bars.forEach(bar => {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const showAfter = Math.min(640, Math.max(120, maxScroll * .45));
    bar.classList.toggle("is-visible", scrollY > showAfter);
    positionPill(bar);
  });

  requestAnimationFrame(() => bars.forEach(bar => positionPill(bar, bar.querySelector("a.active"), true)));
  addEventListener("load", () => bars.forEach(bar => positionPill(bar, bar.querySelector("a.active"), true)), { once: true });
  addEventListener("resize", updateTabs, { passive: true });
  addEventListener("scroll", updateTabs, { passive: true });
  document.fonts?.ready.then(() => bars.forEach(bar => positionPill(bar)));
  updateTabs();
})();

(() => {
  const isPortfolioCase = document.documentElement.classList.contains("portfolio-case-page");
  if (!isPortfolioCase) return;
  const existingBack = document.querySelector(".portfolio-back, .back-link, .deck-back, a.back, .topbar .back");
  if (existingBack) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "site-back-button";
  const backLabel = document.documentElement.lang === "en" ? "Back" : "Назад";
  button.setAttribute("aria-label", backLabel);
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path opacity=".5" d="M20 12.75a.75.75 0 0 0 0-1.5v1.5Zm0-.75v-.75H4v1.5h16V12Z" fill="white"/><path d="m10 6-6 6 6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' + backLabel;
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

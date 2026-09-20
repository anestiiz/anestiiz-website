const YANDEX_METRIKA_ID = 112751157;

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
    else if (/brief\.html/i.test(href)) goal = "brief_open";
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

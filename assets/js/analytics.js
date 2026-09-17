// ==== Yandex.Metrika config ====
// 1) Зайди на https://metrika.yandex.ru и создай счётчик для anestiiz.ru
// 2) Обязательно включи вебвизор, карту скроллов и клик-мап
// 3) Скопируй номер счётчика (например 98765432) и вставь ниже
// 4) Тот же файл подключён на всех страницах — редактируешь один раз
const YANDEX_METRIKA_ID = 112751157;
// ================================

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
}

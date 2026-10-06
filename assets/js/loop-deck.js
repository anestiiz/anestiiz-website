(() => {
  const track = document.querySelector('.loop-track');
  const slides = [...track.querySelectorAll('img')];
  const select = document.querySelector('#deck-select');
  const prev = document.querySelector('#deck-prev');
  const next = document.querySelector('#deck-next');
  const count = document.querySelector('#deck-count');
  const ru = document.documentElement.lang === 'ru';
  let current = 0;
  slides.forEach((slide, index) => {
    select.add(new Option(`${ru ? 'Слайд' : 'Slide'} ${index + 1} / ${slides.length}`, index));
  });
  const go = index => {
    current = Math.max(0, Math.min(slides.length - 1, index));
    // Load the current slide and its neighbours, not the entire deck.
    slides.forEach((slide, i) => {
      if (Math.abs(i - current) <= 1 && slide.dataset.src) {
        slide.src = slide.dataset.src;
        delete slide.dataset.src;
      }
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    track.style.transform = `translateX(-${current * 100}%)`;
    select.value = String(current);
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    history.replaceState(null, '', `#slide-${current + 1}`);
  };
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  select.addEventListener('change', () => go(Number(select.value)));
  addEventListener('keydown', event => {
    if (event.target.matches('select,button,a,input,textarea')) return;
    const target = {ArrowRight: current + 1, PageDown: current + 1, ArrowLeft: current - 1, PageUp: current - 1, Home: 0, End: slides.length - 1}[event.key];
    if (target !== undefined) { event.preventDefault(); go(target); }
  });
  let start;
  track.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    start = [touch.clientX, touch.clientY];
  }, {passive: true});
  track.addEventListener('touchend', event => {
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start[0], dy = touch.clientY - start[1];
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1));
    start = null;
  }, {passive: true});
  go(Math.max(0, Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1) - 1));
})();

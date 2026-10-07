(() => {
  const gallery = document.querySelector('[data-category-banners]');
  if (!gallery) return;
  const tabs = [...gallery.querySelectorAll('[role="tab"]')];
  const panels = [...gallery.querySelectorAll('[role="tabpanel"]')];
  const show = index => {
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    const image = panels[index].querySelector('img[data-src]');
    if (image) { image.src = image.dataset.src; delete image.dataset.src; }
    const strip = tabs[index].parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      const tab = tabs[index].getBoundingClientRect();
      const track = strip.getBoundingClientRect();
      strip.scrollTo({left:strip.scrollLeft + tab.left - track.left - (track.width - tab.width) / 2});
    }
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => show(index));
    tab.addEventListener('keydown',event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault(); show(target); tabs[target].focus();
    });
  });
  show(0);
})();

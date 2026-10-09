(() => {
  const gallery = document.querySelector('[data-category-banners]');
  if (!gallery) return;
  const tabs = [...gallery.querySelectorAll('[role="tab"]')];
  const panels = [...gallery.querySelectorAll('[role="tabpanel"]')];
  const video = gallery.querySelector('[data-category-playlist]');
  const playlist = [
    '/assets/greekly-promo/2.mp4',
    '/assets/greekly-promo/1.mp4',
    '/assets/greekly-promo/3.mp4',
    '/assets/greekly-promo/4.mp4',
    '/assets/feel-the-sound/1.mp4',
    '/assets/bruschetta-recipe/video.mp4',
    '/assets/lost-star/lost-star.mp4'
  ];
  let clipIndex = 0;
  let videoInView = false;
  let failedClips = 0;
  const syncVideo = () => {
    if (!video) return;
    if (video.closest('[role="tabpanel"]').hidden || !videoInView || document.hidden || failedClips >= playlist.length) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) {
      video.src = playlist[clipIndex];
      video.load();
    }
    video.play().catch(() => {});
  };
  const nextVideo = () => {
    clipIndex = (clipIndex + 1) % playlist.length;
    video.src = playlist[clipIndex];
    video.load();
    syncVideo();
  };
  if (video) {
    video.addEventListener('ended', nextVideo);
    video.addEventListener('playing', () => { failedClips = 0; });
    video.addEventListener('error', () => {
      failedClips++;
      if (failedClips < playlist.length) nextVideo();
    });
    new IntersectionObserver(entries => {
      videoInView = entries[0].isIntersecting;
      syncVideo();
    }, {threshold:0.1}).observe(video.parentElement);
    document.addEventListener('visibilitychange', syncVideo);
  }
  const show = index => {
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    panels[index].querySelectorAll('img[data-src]').forEach(image => {
      image.src = image.dataset.src; delete image.dataset.src;
    });
    syncVideo();
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

(function(){
  var videos=Array.prototype.slice.call(document.querySelectorAll('[data-process-video]'));
  if(!videos.length)return;

  var activeIndex=0;
  var isVisible=false;

  function reset(video){
    video.pause();
    try{video.currentTime=0;}catch(error){}
  }

  function hydrate(video){
    if(!video.dataset.src)return;
    video.src=video.dataset.src;
    video.removeAttribute('data-src');
    video.load();
  }

  function play(index){
    activeIndex=index%videos.length;
    videos.forEach(function(video,videoIndex){
      if(videoIndex!==activeIndex)reset(video);
    });
    hydrate(videos[activeIndex]);
    if(isVisible)videos[activeIndex].play().catch(function(){});
  }

  videos.forEach(function(video,index){
    video.muted=true;
    video.addEventListener('ended',function(){
      if(index===activeIndex)play(activeIndex+1);
    });
  });

  var section=videos[0].closest('.process');
  if(!section||!('IntersectionObserver' in window)){
    isVisible=true;
    play(0);
    return;
  }

  new IntersectionObserver(function(entries){
    isVisible=entries[0].isIntersecting;
    if(isVisible)play(0);
    else videos.forEach(reset);
  },{threshold:.2}).observe(section);
})();

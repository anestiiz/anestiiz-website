(function(){
  document.querySelectorAll('[data-orbit-gallery]').forEach(function(gallery){
    var panels=Array.prototype.slice.call(gallery.querySelectorAll('[data-orbit-panel]'));
    var title=gallery.querySelector('[data-orbit-title]');
    var link=gallery.querySelector('[data-orbit-link]');
    var count=gallery.querySelector('.orbit-count');
    var tabs=gallery.querySelector('.orbit-tabs');
    var index=0;
    var startX=0;
    var startY=0;
    var dragging=false;
    var swiped=false;
    var autoplayTimer;
    var autoplayDelay=10000;

    function hydrate(panel){
      panel.querySelectorAll('[data-src]').forEach(function(media){
        media.src=media.dataset.src;
        media.removeAttribute('data-src');
        if(media.tagName==='VIDEO')media.load();
      });
    }

    function syncVideos(activePanel){
      panels.forEach(function(panel){
        panel.querySelectorAll('video').forEach(function(video){
          if(panel===activePanel)video.play().catch(function(){});
          else video.pause();
        });
      });
    }

    function scheduleAutoplay(){
      window.clearTimeout(autoplayTimer);
      if(document.hidden||panels.length<2)return;
      autoplayTimer=window.setTimeout(function(){
        show(index+1);
        scheduleAutoplay();
      },autoplayDelay);
    }

    function showFromUser(next){
      show(next);
      scheduleAutoplay();
    }

    if(tabs) panels.forEach(function(panel,i){
      var button=document.createElement('button');
      button.type='button';
      button.setAttribute('role','tab');
      button.textContent=panel.dataset.title;
      button.addEventListener('click',function(){showFromUser(i);});
      tabs.appendChild(button);
    });

    var tabButtons=tabs?Array.prototype.slice.call(tabs.querySelectorAll('button')):[];
    function show(next){
      index=(next+panels.length)%panels.length;
      panels.forEach(function(panel,i){
        var active=i===index;
        panel.classList.toggle('is-active',active);
        panel.setAttribute('aria-hidden',active?'false':'true');
        var panelLink=panel.querySelector('a.orbit-fan');
        if(panelLink)panelLink.tabIndex=active?0:-1;
        if(tabButtons[i]){
          tabButtons[i].classList.toggle('is-active',active);
          tabButtons[i].setAttribute('aria-selected',active?'true':'false');
        }
      });
      var activePanel=panels[index];
      hydrate(activePanel);
      syncVideos(activePanel);
      title.textContent=activePanel.dataset.title;
      link.href=activePanel.dataset.href;
      count.textContent=String(index+1).padStart(2,'0')+' / '+String(panels.length).padStart(2,'0');
      if(tabButtons[index])tabButtons[index].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    }

    gallery.querySelector('[data-orbit-prev]').addEventListener('click',function(){showFromUser(index-1);});
    gallery.querySelector('[data-orbit-next]').addEventListener('click',function(){showFromUser(index+1);});
    var stage=gallery.querySelector('.orbit-stage');
    stage.addEventListener('pointerdown',function(event){
      if(event.button!==0||event.target.closest('button'))return;
      startX=event.clientX;startY=event.clientY;dragging=true;swiped=false;
    });
    stage.addEventListener('pointerup',function(event){
      if(!dragging)return;
      var distance=event.clientX-startX;
      dragging=false;
      swiped=Math.abs(distance)>45||Math.abs(event.clientY-startY)>45;
      if(Math.abs(distance)>45)showFromUser(index+(distance<0?1:-1));
    });
    stage.addEventListener('pointercancel',function(){dragging=false;swiped=false;});
    stage.addEventListener('click',function(event){
      if(swiped&&event.detail!==0){event.preventDefault();swiped=false;}
    },true);
    stage.addEventListener('dragstart',function(event){event.preventDefault();});
    gallery.addEventListener('keydown',function(event){
      if(event.key==='ArrowLeft')showFromUser(index-1);
      if(event.key==='ArrowRight')showFromUser(index+1);
    });
    document.addEventListener('visibilitychange',scheduleAutoplay);
    var initialIndex=panels.findIndex(function(panel){return panel.dataset.title==='Социальные сети';});
    show(initialIndex>=0?initialIndex:0);
    scheduleAutoplay();
  });
})();

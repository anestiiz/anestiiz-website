(function(){
  document.querySelectorAll('[data-orbit-gallery]').forEach(function(gallery){
    var panels=Array.prototype.slice.call(gallery.querySelectorAll('[data-orbit-panel]'));
    var title=gallery.querySelector('[data-orbit-title]');
    var link=gallery.querySelector('[data-orbit-link]');
    var count=gallery.querySelector('.orbit-count');
    var tabs=gallery.querySelector('.orbit-tabs');
    var index=0;
    var startX=0;
    var dragging=false;
    var autoplayTimer;
    var autoplayDelay=10000;

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
        if(tabButtons[i]){
          tabButtons[i].classList.toggle('is-active',active);
          tabButtons[i].setAttribute('aria-selected',active?'true':'false');
        }
      });
      var activePanel=panels[index];
      title.textContent=activePanel.dataset.title;
      link.href=activePanel.dataset.href;
      count.textContent=String(index+1).padStart(2,'0')+' / '+String(panels.length).padStart(2,'0');
      if(tabButtons[index])tabButtons[index].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    }

    gallery.querySelector('[data-orbit-prev]').addEventListener('click',function(){showFromUser(index-1);});
    gallery.querySelector('[data-orbit-next]').addEventListener('click',function(){showFromUser(index+1);});
    gallery.querySelector('.orbit-stage').addEventListener('pointerdown',function(event){startX=event.clientX;dragging=true;});
    gallery.querySelector('.orbit-stage').addEventListener('pointerup',function(event){
      if(!dragging)return;
      var distance=event.clientX-startX;
      dragging=false;
      if(Math.abs(distance)>45)showFromUser(index+(distance<0?1:-1));
    });
    gallery.addEventListener('keydown',function(event){
      if(event.key==='ArrowLeft')showFromUser(index-1);
      if(event.key==='ArrowRight')showFromUser(index+1);
    });
    document.addEventListener('visibilitychange',scheduleAutoplay);
    show(0);
    scheduleAutoplay();
  });
})();

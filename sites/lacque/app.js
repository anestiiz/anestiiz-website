const $=id=>document.getElementById(id);
const services=[{name:'Маникюр без покрытия',price:'1 800 ₽',duration:'60 минут'},{name:'Маникюр + гель-лак',price:'2 800 ₽',duration:'90 минут'},{name:'Маникюр + френч',price:'3 300 ₽',duration:'120 минут'}];
const booking=$('bookingDialog'),looks=$('lookDialog');let lookIndex=1;
const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');$('dateInput').min=iso(tomorrow);$('dateInput').value=iso(tomorrow);
function update(){const s=services[+$('serviceSelect').value];$('durationText').textContent=s.duration;$('priceText').textContent=s.price}
function openBooking(index=1){$('serviceSelect').value=String(index);$('bookingForm').hidden=false;$('confirmation').hidden=true;update();booking.showModal()}
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking()));
document.querySelectorAll('.service[data-service]').forEach(b=>b.addEventListener('click',()=>openBooking(+b.dataset.service)));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}));
$('serviceSelect').addEventListener('change',update);
$('dateInput').addEventListener('change',()=>document.querySelectorAll('input[name=time]').forEach(r=>r.checked=false));
$('bookingForm').addEventListener('submit',e=>{e.preventDefault();if(!$('bookingForm').reportValidity())return;const s=services[+$('serviceSelect').value];const day=new Date($('dateInput').value+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});const time=new FormData(e.target).get('time');$('confirmService').textContent=s.name+' · '+s.price;$('confirmDate').textContent=day+', '+time+' · '+s.duration;$('confirmQuiet').textContent=$('quiet').checked?'Ваше пожелание: встреча в тишине.':'';$('bookingForm').hidden=true;$('confirmation').hidden=false;$('editBooking').focus()});
$('editBooking').addEventListener('click',()=>{$('confirmation').hidden=true;$('bookingForm').hidden=false;$('serviceSelect').focus()});
document.querySelectorAll('[data-look]').forEach((b,i)=>b.addEventListener('click',()=>{lookIndex=Number(b.dataset.service || 1);$('lookTitle').textContent=b.dataset.look;$('lookImage').src=b.querySelector('img').getAttribute('src');$('lookImage').alt=b.dataset.look;looks.showModal()}));
$('bookLook').addEventListener('click',()=>{looks.close();openBooking(lookIndex)});update();

const worksCarousel=$('worksCarousel'),workSlides=[...worksCarousel.querySelectorAll('.carousel-slide')];
const prevWork=$('prevWork'),nextWork=$('nextWork'),worksCount=$('worksCount');
function visibleWorks(){return window.matchMedia('(max-width:560px)').matches?1:2}
function workStep(){return workSlides.length>1?workSlides[1].offsetLeft-workSlides[0].offsetLeft:worksCarousel.clientWidth}
function workIndex(){return Math.min(workSlides.length-visibleWorks(),Math.max(0,Math.round(worksCarousel.scrollLeft/workStep())))}
function updateWorks(){const i=workIndex(),n=visibleWorks(),pad=x=>String(x).padStart(2,'0');prevWork.disabled=i===0;nextWork.disabled=i>=workSlides.length-n;worksCount.textContent=(n===1?pad(i+1):pad(i+1)+'–'+pad(i+n))+' / '+pad(workSlides.length)}
function moveWorks(direction){const i=Math.max(0,Math.min(workSlides.length-visibleWorks(),workIndex()+direction));worksCarousel.scrollTo({left:i*workStep(),behavior:'smooth'})}
prevWork.addEventListener('click',()=>moveWorks(-1));nextWork.addEventListener('click',()=>moveWorks(1));
worksCarousel.addEventListener('scroll',updateWorks,{passive:true});window.addEventListener('resize',updateWorks);
worksCarousel.addEventListener('keydown',e=>{if(e.target!==worksCarousel)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveWorks(e.key==='ArrowRight'?1:-1)}});
requestAnimationFrame(updateWorks);

(function(){
  var top=document.getElementById('top');
  addEventListener('scroll',function(){top.classList.toggle('is-stuck',scrollY>12)},{passive:true});

  var b=document.querySelector('.burger');
  if(b) b.addEventListener('click',function(){
    var on=document.body.classList.toggle('is-open');
    b.setAttribute('aria-expanded',on);
    document.body.style.overflow=on?'hidden':'';
  });

  var io=new IntersectionObserver(function(es){
    es.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('is-in'); io.unobserve(x.target);} });
  },{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(n){io.observe(n)});

  var gal=document.querySelectorAll('.gal figure');
  if(gal.length){
    var lb=document.createElement('div');
    lb.className='lb';
    lb.innerHTML='<button class="lb__x" aria-label="Закрыть">✕</button>'+
      '<button class="lb__nav lb__nav--p" aria-label="Назад">‹</button>'+
      '<img alt=""><button class="lb__nav lb__nav--n" aria-label="Вперёд">›</button>';
    document.body.appendChild(lb);
    var img=lb.querySelector('img'), i=0;
    var src=[].map.call(gal,function(f){return f.dataset.full||f.querySelector('img').src});
    function show(n){i=(n+src.length)%src.length;img.src=src[i];lb.classList.add('is-on')}
    gal.forEach(function(f,n){f.addEventListener('click',function(){show(n)})});
    lb.addEventListener('click',function(ev){
      if(ev.target.classList.contains('lb__nav--n')) return show(i+1);
      if(ev.target.classList.contains('lb__nav--p')) return show(i-1);
      lb.classList.remove('is-on');
    });
    addEventListener('keydown',function(ev){
      if(!lb.classList.contains('is-on'))return;
      if(ev.key==='Escape')lb.classList.remove('is-on');
      if(ev.key==='ArrowRight')show(i+1);
      if(ev.key==='ArrowLeft')show(i-1);
    });
  }

  document.querySelectorAll('.rev__more').forEach(function(btn){
    btn.addEventListener('click',function(){
      var t=btn.previousElementSibling;
      t.classList.toggle('is-clamp');
      btn.textContent=t.classList.contains('is-clamp')?'Читать целиком':'Свернуть';
    });
  });

  var q=document.getElementById('q');
  if(q){
    var rows=[].slice.call(document.querySelectorAll('.prow'));
    var grps=[].slice.call(document.querySelectorAll('.pricegrp'));
    var none=document.getElementById('noresult');
    q.addEventListener('input',function(){
      var v=q.value.trim().toLowerCase(), found=0;
      rows.forEach(function(r){
        var hit=!v||r.dataset.s.indexOf(v)>-1;
        r.classList.toggle('is-hidden',!hit); if(hit)found++;
      });
      grps.forEach(function(g){
        var vis=g.querySelectorAll('.prow:not(.is-hidden)').length;
        g.style.display=vis?'':'none';
      });
      if(none) none.style.display=found?'none':'block';
    });
  }

  var chips=document.querySelectorAll('.chip[data-cat]');
  chips.forEach(function(c){
    c.addEventListener('click',function(ev){
      ev.preventDefault();
      chips.forEach(function(x){x.classList.remove('is-on')});
      c.classList.add('is-on');
      var cat=c.dataset.cat;
      document.querySelectorAll('[data-group]').forEach(function(g){
        g.style.display=(cat==='*'||g.dataset.group===cat)?'':'none';
      });
    });
  });

  var f=document.getElementById('lead');
  if(f) f.addEventListener('submit',async function(ev){
    ev.preventDefault();
    var btn=f.querySelector('button[type=submit]');
    var body={company:f.company.value,name:f.name.value,contact:f.contact.value,task:f.task.value};
    if(body.name.trim().length<2||body.contact.trim().length<5){f.reportValidity();return}
    btn.disabled=true;btn.textContent='Отправляю…';
    try{
      var r=await fetch('https://lead-form.tripolev04.workers.dev',{method:'POST',
        headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(!r.ok) throw 0;
      f.style.display='none';
      document.getElementById('ok').style.display='block';
    }catch(err){ btn.disabled=false;btn.textContent='Отправить ещё раз' }
  });
})();

(function(){
  'use strict';
  window.__fx=1;
  var root=document.documentElement,doc=document;
  var reduit=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fin=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  function $(s,c){return (c||doc).querySelector(s);}
  function $$(s,c){return Array.prototype.slice.call((c||doc).querySelectorAll(s));}

  requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('pret');});});

  /* apparitions au scroll */
  var cibles=$$('[data-r]');
  if('IntersectionObserver' in window&&!reduit){
    var io=new IntersectionObserver(function(es){
      var n=0;
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        e.target.style.setProperty('--d',(Math.min(n,6)*80)+'ms');n++;
        e.target.classList.add('vu');io.unobserve(e.target);
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    cibles.forEach(function(el){io.observe(el);});
  }else{cibles.forEach(function(el){el.classList.add('vu');});}

  /* chiffres qui comptent */
  var nombres=$$('[data-count]');
  function compte(el){
    var cible=parseFloat(el.getAttribute('data-count')),d=1100,t0=null;
    function pas(t){
      if(t0===null)t0=t;
      var k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);
      el.textContent=Math.round(cible*e);
      if(k<1)requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }
  if('IntersectionObserver' in window&&!reduit){
    var io2=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){compte(e.target);io2.unobserve(e.target);}});
    },{threshold:.6});
    nombres.forEach(function(el){el.textContent='0';io2.observe(el);});
  }

  /* inclinaison 3D : visuel du hero et cartes */
  var hv=$('.hero-visual');
  if(hv&&fin&&!reduit){
    hv.addEventListener('mousemove',function(e){
      var r=hv.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      hv.style.setProperty('--tx',(x*9).toFixed(2)+'deg');
      hv.style.setProperty('--ty',(-y*9).toFixed(2)+'deg');
    });
    hv.addEventListener('mouseleave',function(){hv.style.setProperty('--tx','0deg');hv.style.setProperty('--ty','0deg');});
  }
  /* boutons magnétiques */
  if(fin&&!reduit){
    $$('.btn-primary,.copie').forEach(function(b){
      b.addEventListener('mousemove',function(e){
        var r=b.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*.18,y=(e.clientY-r.top-r.height/2)*.28;
        b.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
      });
      b.addEventListener('mouseleave',function(){b.style.transform='';});
    });
  }

  /* copier l'adresse e-mail */
  $$('.copie').forEach(function(b){
    b.addEventListener('click',function(){
      var m=b.getAttribute('data-mail'),old=b.textContent;
      function ok(){b.textContent='Adresse copiée ✓';setTimeout(function(){b.textContent=old;},1800);}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(m).then(ok,function(){location.href='mailto:'+m;});}
      else location.href='mailto:'+m;
    });
  });

  /* scroll : barre, parallaxe, ligne du processus */
  var entete=$('.site-header'),tl=$('.timeline'),lis=$$('.timeline li');
  var tick=false;
  function maj(){
    tick=false;
    var vh=window.innerHeight,y=window.pageYOffset;
    var h=doc.documentElement.scrollHeight-vh;
    if(entete){
      entete.classList.toggle('scrolled',y>10);
      entete.style.setProperty('--sp',h>0?(y/h).toFixed(4):0);
    }
    if(hv&&y<1400&&!reduit)hv.style.setProperty('--sy',y+'px');
    if(tl){
      var r=tl.getBoundingClientRect();
      var p=(vh*.62-r.top)/r.height;
      p=Math.max(0,Math.min(1,p));
      tl.style.setProperty('--p',p.toFixed(4));
      lis.forEach(function(li){
        var b=li.getBoundingClientRect();
        li.classList.toggle('on',b.top<vh*.62);
      });
    }
  }
  function demande(){if(!tick){tick=true;requestAnimationFrame(maj);}}
  window.addEventListener('scroll',demande,{passive:true});
  window.addEventListener('resize',demande);
  maj();
})();

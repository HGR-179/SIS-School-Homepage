/* ══ SIS MOTION SYSTEM ══ */
(function(){
'use strict';



/* ─── COSMIC SYSTEM ─── */
/* ═══════════════════════════════════════════════
   COSMIC SYSTEM — SIS
═══════════════════════════════════════════════ */
(function(){
'use strict';

/* ── 2. 유성 (Shooting Stars) ── */
(function(){
  var canvas=document.createElement('canvas');
  canvas.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.7;';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
  window.addEventListener('resize',function(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;});

  var meteors=[];
  function spawnMeteor(){
    var x=Math.random()*W*1.5;
    meteors.push({
      x:x, y:-20,
      vx:-2.5-Math.random()*2,
      vy:1.5+Math.random()*1.5,
      len:80+Math.random()*120,
      life:1,
      width:Math.random()*.8+.3
    });
  }
  setInterval(spawnMeteor, 2200+Math.random()*3000);

  (function loop(){
    ctx.clearRect(0,0,W,H);
    for(var i=meteors.length-1;i>=0;i--){
      var m=meteors[i];
      m.x+=m.vx; m.y+=m.vy;
      m.life-=.012;
      if(m.life<=0||m.y>H+50){meteors.splice(i,1);continue;}
      var grad=ctx.createLinearGradient(m.x,m.y,m.x-m.vx*(m.len/2),m.y-m.vy*(m.len/2));
      grad.addColorStop(0,'rgba(212,180,100,'+(m.life*.8)+')');
      grad.addColorStop(.4,'rgba(255,250,235,'+(m.life*.3)+')');
      grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.moveTo(m.x,m.y);
      ctx.lineTo(m.x-m.vx*(m.len/2),m.y-m.vy*(m.len/2));
      ctx.strokeStyle=grad;
      ctx.lineWidth=m.width*m.life;
      ctx.lineCap='round';
      ctx.stroke();
    }
    requestAnimationFrame(loop);
  })();
})();

/* ── 3. 반짝이는 별 (전역 고정) ── */
(function(){
  var canvas=document.createElement('canvas');
  canvas.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
  window.addEventListener('resize',function(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;});

  var stars=[];
  for(var i=0;i<120;i++){
    stars.push({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*.7+.1,
      phase:Math.random()*Math.PI*2,
      speed:Math.random()*.008+.003,
      base:Math.random()*.25+.05
    });
  }

  var t=0;
  (function loop(){
    ctx.clearRect(0,0,W,H);
    t+=.016;
    stars.forEach(function(s){
      var alpha=s.base+Math.sin(t*s.speed*100+s.phase)*.15;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,6.28);
      ctx.fillStyle='rgba(242,237,228,'+Math.max(0,alpha)+')';
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
})();

/* ── 4. 네뷸라 오브 (섹션 경계) ── */
(function(){
  var orbs=[
    {sel:'.mfst',   x:'80%', y:'50%', c1:'rgba(200,160,80,.12)',  c2:'rgba(160,110,50,.06)',  sz:500},
    {sel:'.pillars',x:'15%', y:'40%', c1:'rgba(180,140,70,.1)',   c2:'rgba(120,80,30,.05)',   sz:600},
    {sel:'.statband',x:'50%',y:'60%', c1:'rgba(210,170,90,.08)',  c2:'rgba(160,120,60,.04)',  sz:400},
    {sel:'.cta',    x:'50%', y:'50%', c1:'rgba(200,160,80,.15)',  c2:'rgba(140,100,40,.06)',  sz:700},
    {sel:'.news',   x:'90%', y:'30%', c1:'rgba(190,150,75,.08)',  c2:'rgba(130,90,40,.04)',   sz:450},
  ];

  orbs.forEach(function(o){
    var sec=document.querySelector(o.sel);
    if(!sec) return;
    var el=document.createElement('div');
    el.className='cosmic-orb';
    el.style.cssText=[
      'position:absolute',
      'left:'+o.x, 'top:'+o.y,
      'width:'+o.sz+'px', 'height:'+o.sz+'px',
      'transform:translate(-50%,-50%)',
      'border-radius:50%',
      'background:radial-gradient(circle,'+o.c1+' 0%,'+o.c2+' 40%,transparent 70%)',
      'pointer-events:none',
      'z-index:0',
      'animation:orbPulse '+(6+Math.random()*4)+'s ease-in-out infinite alternate'
    ].join(';');
    sec.style.position='relative';
    sec.insertBefore(el,sec.firstChild);
  });

  // 오브 애니메이션 CSS
  if(!document.getElementById('cosmic-orb-style')){
    var style=document.createElement('style');
    style.id='cosmic-orb-style';
    style.textContent=
      '@keyframes orbPulse{from{opacity:.6;transform:translate(-50%,-50%) scale(1)}'+
      'to{opacity:1;transform:translate(-50%,-50%) scale(1.15)}}'+
      '.cosmic-orb{mix-blend-mode:screen;}'+
      '[data-theme="light"] .cosmic-orb{mix-blend-mode:multiply;opacity:.4!important;}';
    document.head.appendChild(style);
  }
})();

/* ── 5. 섹션 파티클 (강화판) ── */
function createSpaceCanvas(container, opts){
  if(!container) return;
  opts=opts||{};
  var N=opts.count||55, maxD=opts.maxD||90, spd=opts.speed||.18;
  var goldRatio=opts.gold||.7, alphaBase=opts.alpha||.45;
  var twinkle=opts.twinkle!==false;

  var c=document.createElement('canvas');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  container.style.position='relative';
  /* overflow removed */
  container.insertBefore(c,container.firstChild);

  var ctx=c.getContext('2d'), W, H, mouse={x:-999,y:-999}, t=0;
  function resize(){W=c.width=container.offsetWidth||window.innerWidth;H=c.height=container.offsetHeight||300;}
  resize(); window.addEventListener('resize',resize,{passive:true});

  var pts=[];
  for(var i=0;i<N;i++){
    var isGold=Math.random()<goldRatio;
    pts.push({
      x:Math.random()*2000, y:Math.random()*800,
      vx:(Math.random()-.5)*spd, vy:(Math.random()-.5)*spd,
      r:Math.random()*.9+.15,
      baseA:(Math.random()*.3+.08)*alphaBase,
      phase:Math.random()*Math.PI*2,
      twinkleSpd:Math.random()*.015+.005,
      color:isGold?'rgba(200,169,110,':'rgba(242,237,228,'
    });
  }

  container.addEventListener('mousemove',function(e){
    var rect=container.getBoundingClientRect();
    mouse.x=e.clientX-rect.left; mouse.y=e.clientY-rect.top;
  });
  container.addEventListener('mouseleave',function(){mouse.x=-999;mouse.y=-999;});

  var raf;
  function draw(){
    if(!document.body.contains(c)){cancelAnimationFrame(raf);return;}
    ctx.clearRect(0,0,W,H);
    t+=.016;

    pts.forEach(function(p){
      var dx=mouse.x-p.x, dy=mouse.y-p.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){p.vx-=dx/d*.018;p.vy-=dy/d*.018;}
      p.vx*=.995; p.vy*=.995;
      p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H;

      // 반짝임
      var a=twinkle ? p.baseA+Math.sin(t*p.twinkleSpd*100+p.phase)*.12 : p.baseA;
      var r=p.r+(twinkle?Math.sin(t*p.twinkleSpd*80+p.phase)*.2:.0);

      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(.1,r),0,6.28);
      ctx.fillStyle=p.color+Math.max(0,a)+')';
      ctx.fill();

      // 가끔 글로우
      if(a>.3&&r>.5){
        ctx.beginPath();
        ctx.arc(p.x,p.y,r*2.5,0,6.28);
        ctx.fillStyle=p.color+(a*.15)+')';
        ctx.fill();
      }
    });

    // 연결선
    for(var i=0;i<pts.length;i++){
      for(var j=i+1;j<pts.length;j++){
        var dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<maxD){
          var lineA=.04*(1-d/maxD)*alphaBase*1.5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle='rgba(200,169,110,'+lineA+')';
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      }
    }
    raf=requestAnimationFrame(draw);
  }

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting)draw();else cancelAnimationFrame(raf);});
  },{threshold:.05});
  io.observe(container);
}

window.addEventListener('load',function(){
  // 페이지 헤더
  document.querySelectorAll('.ph').forEach(function(el){
    createSpaceCanvas(el,{count:55,maxD:95,speed:.15,gold:.65,alpha:.55,twinkle:true});
  });
  // 주요 섹션들
  var cfg=[
    ['.mfst',       {count:45,maxD:90,speed:.14,gold:.7,alpha:.4}],
    ['.statband',   {count:30,maxD:70,speed:.12,gold:.85,alpha:.45}],
    ['.cta',        {count:60,maxD:100,speed:.16,gold:.75,alpha:.5}],
    ['.pillars',    {count:50,maxD:90,speed:.13,gold:.7,alpha:.38}],
    ['.news',       {count:35,maxD:80,speed:.12,gold:.65,alpha:.35}],
    ['.wellness',   {count:35,maxD:75,speed:.12,gold:.7,alpha:.35}],
    ['.trad',       {count:30,maxD:70,speed:.11,gold:.7,alpha:.3}],
    ['.life',       {count:40,maxD:80,speed:.13,gold:.65,alpha:.38}],
    ['.summer',     {count:30,maxD:70,speed:.11,gold:.7,alpha:.32}],
    ['.visit',      {count:35,maxD:80,speed:.13,gold:.7,alpha:.4}],
    ['.fc',         {count:55,maxD:95,speed:.15,gold:.75,alpha:.48}],
    ['.about',      {count:40,maxD:85,speed:.14,gold:.68,alpha:.38}],
    ['.ap-body',    {count:40,maxD:80,speed:.13,gold:.7,alpha:.4}],
    ['.pg-sec',     {count:35,maxD:75,speed:.12,gold:.65,alpha:.35}],
  ];
  cfg.forEach(function(pair){
    var sec=document.querySelector(pair[0]);
    if(sec) createSpaceCanvas(sec,pair[1]);
  });
});

})();


/* ─── CANVAS PARTICLES ─── */
(function(){
  var hero=document.querySelector('section.hero');
  if(!hero||typeof THREE!=='undefined')return;
  var c=document.createElement('canvas');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  hero.insertBefore(c,hero.firstChild);
  var ctx=c.getContext('2d'),W,H,pts=[];
  function resize(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  for(var i=0;i<70;i++)pts.push({x:Math.random()*1920,y:Math.random()*900,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*.9+.2,a:Math.random()*.35+.08});
  (function loop(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(function(p){p.x=(p.x+p.vx+W)%W;p.y=(p.y+p.vy+H)%H;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fillStyle='rgba(200,169,110,'+p.a+')';ctx.fill();});
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<85){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(200,169,110,'+(.04*(1-d/85))+')';ctx.lineWidth=.5;ctx.stroke();}
    }
    requestAnimationFrame(loop);
  })();
})();

/* ─── THREE.JS PARTICLES ─── */
(function(){
  var hero=document.querySelector('section.hero');
  if(!hero||typeof THREE==='undefined')return;
  var W=window.innerWidth,H=window.innerHeight;
  var renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.domElement.style.cssText='position:absolute;inset:0;z-index:0;pointer-events:none;';
  hero.insertBefore(renderer.domElement,hero.firstChild);
  var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,W/H,.1,100);
  cam.position.z=5;
  var count=2000,geo=new THREE.BufferGeometry(),pos=new Float32Array(count*3),sz=new Float32Array(count);
  for(var i=0;i<count;i++){var r=2+Math.random()*3,theta=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);pos[i*3]=r*Math.sin(phi)*Math.cos(theta);pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta);pos[i*3+2]=r*Math.cos(phi);sz[i]=Math.random()*.8+.2;}
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('size',new THREE.BufferAttribute(sz,1));
  var mat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uMouse:{value:new THREE.Vector2(0,0)}},vertexShader:'attribute float size;uniform float uTime;uniform vec2 uMouse;void main(){vec3 p=position;float d=length(p.xy-uMouse*4.0);p.z+=sin(uTime*.4+length(p.xy)*.5)*.3;p.xy+=uMouse*(.5/max(d,.5));gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);gl_PointSize=size*2.5*(3.0/gl_Position.w);}',fragmentShader:'void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=1.-smoothstep(.35,.5,d);vec3 c=mix(vec3(.788,.663,.431),vec3(.91,.8,.54),a);gl_FragColor=vec4(c,a*.55);}',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
  var pts2=new THREE.Points(geo,mat);scene.add(pts2);
  var rings=[];[2.2,3.5,5].forEach(function(r,i){var rg=new THREE.TorusGeometry(r,.008,2,120),rm=new THREE.MeshBasicMaterial({color:0xc9a96e,transparent:true,opacity:.07-i*.02});var ring=new THREE.Mesh(rg,rm);ring.rotation.x=Math.PI/2+i*.3;scene.add(ring);rings.push(ring);});
  var mouse=new THREE.Vector2(0,0),tMouse=new THREE.Vector2(0,0);
  document.addEventListener('mousemove',function(e){tMouse.x=(e.clientX/W-.5)*2;tMouse.y=-(e.clientY/H-.5)*2;});
  window.addEventListener('resize',function(){W=window.innerWidth;H=window.innerHeight;renderer.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix();});
  var clock=new THREE.Clock();
  (function animate(){requestAnimationFrame(animate);var t=clock.getElapsedTime();mouse.x+=(tMouse.x-mouse.x)*.04;mouse.y+=(tMouse.y-mouse.y)*.04;mat.uniforms.uTime.value=t;mat.uniforms.uMouse.value.copy(mouse);pts2.rotation.y=t*.05+mouse.x*.15;pts2.rotation.x=mouse.y*.1;rings.forEach(function(r,i){r.rotation.z=t*.02*(i+1);});cam.position.x=mouse.x*.4;cam.position.y=mouse.y*.3;cam.lookAt(scene.position);renderer.render(scene,cam);})();
})();

/* ─── SCROLL PROGRESS ─── */
(function(){
  var sp=document.getElementById('sp');if(!sp)return;
  window.addEventListener('scroll',function(){sp.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%';},{passive:true});
})();

/* ─── PAGE TRANSITION ─── */
(function(){
  /* 커튼 제거됨 */

  function cleanupAndNavigate(dest){
    /* ScrollTrigger 전부 kill */
    if(typeof ScrollTrigger!=='undefined'){
      ScrollTrigger.getAll().forEach(function(t){t.kill();});
      ScrollTrigger.clearScrollMemory();
    }
    /* GSAP 전부 kill */
    if(typeof gsap!=='undefined') gsap.globalTimeline.clear();
    /* canvas 정리 */
    document.querySelectorAll('canvas').forEach(function(c){c.remove();});
    /* body overflow 리셋 */
    document.body.style.overflow='';
    document.documentElement.style.overflow='';
    window.location.href=dest;
  }

  var navigating=false;
  document.querySelectorAll('a[href]').forEach(function(a){
    var h=a.getAttribute('href');
    if(!h||h[0]==='#'||h.indexOf('mailto')===0||h.indexOf('http')===0)return;
    a.addEventListener('click',function(e){
      if(navigating)return;
      navigating=true;
      e.preventDefault();
      var d=h;
      /* curt removed */
      cleanupAndNavigate(d);
    });
  });

  window.addEventListener('load',function(){
    /* curt removed */
    /* body overflow 리셋 (이전 페이지 pin 잔재 제거) */
    document.body.style.overflow='';
    document.documentElement.style.overflow='';
  });
})();

/* ─── GSAP ANIMATIONS ─── */
window.addEventListener('load',function(){
  if(typeof gsap==='undefined'){
    /* GSAP 없을 때 폴백 — 모든 요소 즉시 표시 */
    document.querySelectorAll('.dh,.h2,.ctah,.fc-h,.tag,.body,.bod,.dc,.wi,.tc,.vc,.sc,.ni,.sbi,.chi').forEach(function(el){el.style.opacity='1';el.style.transform='none';});
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var E='power4.out',ES='power2.out',EB='back.out(1.4)';

  /* ── onEnter 방식: 진입 순간에만 from 상태 설정 ── */
  function revealOnEnter(selector, fromVars, toVars, triggerStart){
    document.querySelectorAll(selector).forEach(function(el){
      if(el.closest('.hero')||el.dataset.gi)return;
      el.dataset.gi='1';
      ScrollTrigger.create({
        trigger:el,
        start:triggerStart||'top 90%',
        once:true,
        onEnter:function(){
          gsap.fromTo(el,fromVars,Object.assign({},toVars,{duration:toVars.duration||.9,ease:toVars.ease||ES}));
        }
      });
    });
  }

  /* ── 히어로 텍스트 ── */
  var lines=document.querySelectorAll('.hh .l span');
  if(lines.length){
    document.querySelectorAll('.hh .l').forEach(function(l){l.style.overflow='hidden';l.style.display='block';});
    var tl=gsap.timeline({delay:.55});
    lines.forEach(function(l,i){tl.fromTo(l,{y:'115%',opacity:0},{y:'0%',opacity:1,duration:1.3,ease:E,transformOrigin:'top center'},i*.14);});
    var hs=document.querySelector('.hs');if(hs)tl.fromTo(hs,{y:28,opacity:0},{y:0,opacity:1,duration:1,ease:ES},.85);
    var hb=document.querySelectorAll('.hbtns>*');if(hb.length)tl.fromTo(hb,{y:22,opacity:0},{y:0,opacity:1,duration:.9,ease:EB,stagger:.14},1.05);
    var ht=document.querySelector('.htag');if(ht)tl.fromTo(ht,{y:14,opacity:0},{y:0,opacity:1,duration:.9,ease:ES},0);
  }

  /* ── 히어로 패럴랙스 ── */
  var hero=document.querySelector('section.hero');
  if(hero){
    var hc=document.querySelector('.hc');
    if(hc)gsap.to(hc,{y:-80,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.8}});
    gsap.to(hero,{opacity:0,ease:'none',scrollTrigger:{trigger:hero,start:'55% top',end:'bottom top',scrub:1.2}});
  }

  /* ── 헤딩 reveal (onEnter 방식) ── */
  revealOnEnter('.dh,.h2,.ctah,.fc-h,.sec-h,.cta-h',
    {y:35},{y:0,duration:.9,ease:E},'top 92%');

  revealOnEnter('.tag',{x:-16},{x:0,duration:.7,ease:ES},'top 94%');
  revealOnEnter('.body,.bod,.ph-sub',{y:18},{y:0,duration:.8,ease:ES},'top 94%');

  /* ── 카드 스태거 ── */
  var parents=new Set();
  document.querySelectorAll('.dc').forEach(function(d){parents.add(d.parentElement);});
  parents.forEach(function(p){
    var c=p.querySelectorAll('.dc');if(!c.length)return;
    ScrollTrigger.create({trigger:p,start:'top 85%',once:true,
      onEnter:function(){gsap.fromTo(c,{y:50,scale:.96},{y:0,scale:1,duration:1,ease:EB,stagger:.08});}
    });
  });

  /* ── 개별 카드들 ── */
  ['.wi','.tc','.vc','.sc','.ni','.sbi','.chi'].forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){
      if(el.dataset.gi)return;el.dataset.gi='1';
      ScrollTrigger.create({trigger:el,start:'top 88%',once:true,
        onEnter:function(){gsap.fromTo(el,{y:40},{y:0,duration:.9,ease:EB});}
      });
    });
  });

  /* ── 카운터 ── */
  document.querySelectorAll('[data-count]').forEach(function(el){
    var t=parseInt(el.getAttribute('data-count'))||0,s=el.getAttribute('data-sfx')||'';
    ScrollTrigger.create({trigger:el,start:'top 85%',once:true,
      onEnter:function(){gsap.fromTo(el,{textContent:0},{textContent:t,duration:2.2,ease:'power2.out',snap:{textContent:1},onUpdate:function(){el.textContent=Math.round(parseFloat(el.textContent))+s;}});}
    });
  });

  /* ── 스탯 ── */
  var sb=document.querySelector('.statband');
  if(sb){
    var items=sb.querySelectorAll('.sbi,.chi');
    if(items.length)ScrollTrigger.create({trigger:sb,start:'top 85%',once:true,
      onEnter:function(){gsap.fromTo(items,{y:35},{y:0,duration:.9,ease:EB,stagger:.08});}
    });
  }

  /* ── CTA ── */
  var cta=document.querySelector('.cta')||document.querySelector('.fc');
  if(cta){
    ScrollTrigger.create({trigger:cta,start:'top 80%',once:true,
      onEnter:function(){
        var ch=cta.querySelectorAll('.ctah,.fc-h');
        var cs=cta.querySelectorAll('.ctas,.fc-s');
        var cb=cta.querySelectorAll('.cb1,.cb2,.ctabtns');
        var tl2=gsap.timeline();
        if(ch.length)tl2.fromTo(ch,{y:35},{y:0,duration:1,ease:E});
        if(cs.length)tl2.fromTo(cs,{y:20},{y:0,duration:.8,ease:ES},.3);
        if(cb.length)tl2.fromTo(cb,{y:18},{y:0,duration:.7,ease:EB,stagger:.1},.5);
      }
    });
  }

  /* ── 수평 스크롤 (lcs) ── */
  var lcs=document.querySelector('section.lcs'),lct=document.querySelector('.lct');
  if(lcs&&lct&&window.innerWidth>768){
    var totalW=lct.scrollWidth-window.innerWidth;
    if(totalW>0){
      var hscroll=gsap.timeline({scrollTrigger:{trigger:lcs,pin:true,start:'top top',end:function(){return'+='+(totalW+window.innerHeight*.5);},scrub:1.2,anticipatePin:1}});
      hscroll.to(lct,{x:-totalW,ease:'none'});
    }
  }

  /* ── 필러 카드 ── */
  var pillars=document.querySelector('section.pillars'),prCards=document.querySelectorAll('.pr');
  if(pillars&&prCards.length&&window.innerWidth>768){
    var bigNum=document.getElementById('pillar-bg-num');
    if(!bigNum){
      bigNum=document.createElement('div');bigNum.id='pillar-bg-num';
      bigNum.style.cssText='position:absolute;right:4%;top:50%;transform:translateY(-50%);font-family:"Cormorant Garamond",serif;font-size:28vw;font-weight:800;color:rgba(201,169,110,.15);line-height:1;pointer-events:none;z-index:0;';
      bigNum.textContent='01';pillars.appendChild(bigNum);
    }
    ScrollTrigger.create({trigger:pillars,start:'top 78%',once:true,
      onEnter:function(){gsap.fromTo(prCards,{y:55,scale:.96},{y:0,scale:1,duration:1.1,ease:EB,stagger:.1});}
    });
    gsap.timeline({scrollTrigger:{trigger:pillars,start:'top 30%',end:'bottom 70%',scrub:1}})
      .to(bigNum,{onUpdate:function(){bigNum.textContent='0'+Math.max(1,Math.min(3,Math.round(this.progress()*2+1)));},duration:1,ease:'none'});
  }

  /* ── 자기장 버튼 ── */
  if(window.innerWidth>768){
    document.querySelectorAll('.hb1,.cb1,.ap-btn,.na').forEach(function(btn){
      btn.addEventListener('mousemove',function(e){var r=btn.getBoundingClientRect();gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.3,duration:.4,ease:ES});});
      btn.addEventListener('mouseleave',function(){gsap.to(btn,{x:0,y:0,duration:.8,ease:'elastic.out(1,.4)'});});
    });
    /* 3D 틸트 */
    document.querySelectorAll('.dc,.pr,.ni').forEach(function(card){
      card.style.transformStyle='preserve-3d';
      card.addEventListener('mousemove',function(e){var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(card,{rotationY:x*14,rotationX:-y*14,z:24,duration:.5,ease:ES,transformPerspective:700});});
      card.addEventListener('mouseleave',function(){gsap.to(card,{rotationY:0,rotationX:0,z:0,duration:.9,ease:'elastic.out(1,.3)'});});
    });
  }

  /* ── 섹션 라인 ── */
  document.querySelectorAll('.ph').forEach(function(ph){
    if(ph.querySelector('.ph-al'))return;
    var l=document.createElement('div');l.className='ph-al';
    l.style.cssText='position:absolute;bottom:0;left:0;height:1px;width:0;background:linear-gradient(90deg,transparent,rgba(201,169,110,.4),transparent);pointer-events:none;';
    ph.style.position='relative';ph.appendChild(l);
    ScrollTrigger.create({trigger:ph,start:'top 80%',once:true,
      onEnter:function(){gsap.to(l,{width:'100%',duration:1.8,ease:ES});}
    });
  });

  /* ── 페이지 진입 (히어로 없는 페이지) ── */
  if(!document.querySelector('section.hero')){
    /* ph 요소는 overflow:visible이므로 애니메이션 없이 즉시 표시 */
    var phEls=document.querySelectorAll('.ph .tag,.ph .dh,.ph h1,.ph h2,.ph .ph-sub');
    if(phEls.length){
      gsap.from(phEls,{y:24,duration:.7,ease:ES,stagger:.1,delay:.15});
    }
  }

  ScrollTrigger.refresh();
});

})();

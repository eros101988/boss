
// Independent clean-room motion study. No Anubi artwork or source code included.
// Reference observed 2026-09-15: ~148x92px tiles, 0.54–1.44 scale,
// oblique elliptical positions, depth sorting, small independent X/Y rotations.
// CSS transforms explicitly encode perspective cues; no hover dependency or mobile static fallback.
const assets=JSON.parse(document.querySelector('#assets').textContent);
const scene=document.querySelector('#scene'), status=document.querySelector('#status'),play=document.querySelector('#play');
const TAU=Math.PI*2, tilts=[-5,3,-2,4,-3,2,-4,3,-2,5,-3,2];
let phase=.45,last=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches, w=0,h=0,frame=0,raf=0;
const cards=Array.from({length:12},(_,i)=>{const asset=assets[i%assets.length],el=document.createElement('figure');el.className='card';el.setAttribute('role','img');el.setAttribute('aria-label',asset.name);const cv=document.createElement('canvas');cv.width=600;cv.height=375;el.append(cv);const cap=document.createElement('figcaption');cap.textContent=asset.name;el.append(cap);scene.append(el);return{el,cv,asset,i};});
function paint({cv,asset}){return new Promise(resolve=>{const im=new Image();im.onload=()=>{const c=cv.getContext('2d'),[x,y,sw,sh]=asset.crop;const k=Math.min(550/sw,325/sh);c.fillStyle='#fff';c.fillRect(0,0,600,375);c.drawImage(im,x,y,sw,sh,(600-sw*k)/2,(375-sh*k)/2,sw*k,sh*k);resolve(true)};im.onerror=()=>{cv.parentElement.setAttribute('aria-label',asset.name+' 圖片載入失敗');resolve(false)};im.src=asset.src;});}
function render(){
 const mobile=w<600,n=mobile?10:12;
 // The ellipse is tilted in screen space; depth faces the lower-right foreground.
 // Same equations on every device; only layout dimensions and visible count change.
 const rx=w*(mobile?.29:.385), ry=h*(mobile?.32:.335), tilt=-.30;
 const base=mobile?Math.min(84,w*.205):Math.min(148,w*.11);
 cards.forEach(({el,i})=>{if(i>=n){el.hidden=true;return}el.hidden=false;
 const theta=phase+i*TAU/n;
 const x0=rx*Math.cos(theta),y0=ry*Math.sin(theta);
 const x=w*.5+x0*Math.cos(tilt)-y0*Math.sin(tilt), y=h*.49+x0*Math.sin(tilt)+y0*Math.cos(tilt);
 const depth=(Math.sin(theta+.62)+1)/2,scale=.54+.90*Math.pow(depth,1.5);
 const roll=tilts[i]+1.8*Math.sin(theta),pitch=-3*Math.sin(theta),yaw=6*Math.cos(theta);
 el.style.width=base+'px';el.style.height=base*.625+'px';el.style.zIndex=String(10+Math.round(depth*10));
 el.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale}) rotate(${roll}deg) perspective(1100px) rotateX(${pitch}deg) rotateY(${yaw}deg)`;
 el.dataset.depth=depth.toFixed(4);el.dataset.scale=scale.toFixed(4);
 });
 scene.dataset.phase=phase.toFixed(5);scene.dataset.frames=String(frame);
 status.textContent=`${Math.round(w)} × ${Math.round(h)} · ${n} 張 · ${paused?'已暫停':'自動環繞'} · 遠 0.54× / 近 1.44×`;
 play.textContent=paused?'播放動畫':'暫停動畫';play.setAttribute('aria-pressed',String(!paused));
}
function tick(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused){phase=(phase+dt*TAU/42)%TAU;frame++;render()}raf=requestAnimationFrame(tick)}
new ResizeObserver(()=>{w=scene.clientWidth;h=scene.clientHeight;render()}).observe(scene);
play.onclick=()=>{paused=!paused;last=0;render()};
document.querySelector('#step').onclick=()=>{paused=true;phase=(phase+Math.PI/4)%TAU;render()};
document.querySelector('#labels').onclick=e=>{const on=scene.classList.toggle('labels');e.currentTarget.setAttribute('aria-pressed',String(on))};
document.querySelector('#size').onchange=e=>{const val=Number(e.target.value);scene.style.maxWidth=val?val+'px':'';scene.style.height=val?'600px':'';};
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);last=0;if(!document.hidden)raf=requestAnimationFrame(tick)});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{paused=e.matches;render()});
Promise.all(cards.map(paint)).then(ok=>{scene.dataset.images=String(ok.filter(Boolean).length);render();raf=requestAnimationFrame(tick)});

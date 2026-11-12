/* CoreSkillAI - Click Speed Test (CPS) / finger tapping speed.
 *
 * METHOD
 *  - The classic Finger Tapping Test (Halstead 1947; Reitan & Wolfson 1985)
 *    counts how many times the index finger can tap in 10 seconds. Hubel et al.
 *    (2013, Perceptual and Motor Skills 116:929-952) ran it on a computer mouse
 *    button with 1,519 adults aged 18-65: dominant hand 56.3 taps (SD 9.6) in
 *    the first 10 s, 54.9 (SD 9.2) per 10 s averaged over 30 s. Those are the
 *    reference values used for the percentile (10 s and 30 s runs only).
 *  - The clock starts at the first click, as in the clinical test.
 *  - Reported: clicks per second, steady rate from the median interval (the
 *    study's own speed index, robust to a missed tap), best single second,
 *    variation between clicks (coefficient of variation of the intervals) and
 *    the change from the first to the second half of the run.
 *  - Untrusted (scripted) events are ignored. Intervals that are almost
 *    perfectly even at high speed are flagged as an auto-clicker, unscored.
 * Nothing is sent anywhere.
 */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
const $=id=>document.getElementById(id);
const NORM={10:{m:5.63,sd:0.96},30:{m:5.49,sd:0.92}};   // clicks per second, Hubel et al. 2013
let dur=10, input='mouse', st=null, last=null, lock=false, timer=null;

function shell(){
  $('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('cps_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('cps_how1','Choose 5, 10 or 30 seconds, and the mouse (or touch screen) or the spacebar.')}</li>
      <li>${_t('cps_how2','The clock starts with your first click. Click as fast as you can until the time is up.')}</li>
      <li>${_t('cps_how3','For a fair comparison, use one finger of the hand you normally click with and rest your palm, as in the clinical tapping test.')}</li>
      <li>${_t('cps_how4','You get your clicks per second, your steadiest rate, your best single second and how even your rhythm was.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header"><span class="test-ui-title">${_t('cps_title','CPS Test')}</span><span id="cps-left" class="q-counter"></span></div>
    <div class="test-ui-body" id="cps-body"></div>
  </div>
  <div class="results-panel" id="cps-results"></div>`;
  setup();
}
function opt(name,val,cur,label){ return `<button class="btn ${val===cur?'btn-primary':'btn-secondary'}" style="min-width:84px" onclick="CpsTest.${name}(${typeof val==='string'?`'${val}'`:val})">${label}</button>`; }
function setup(){
  try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur();}catch(e){}
  st=null; clearInterval(timer); $('cps-left').textContent='';
  $('cps-body').innerHTML=`
    <p style="color:var(--text-2)">${_t('cps_start_desc','Measures how many times you can click in a set time, using the same idea as the finger tapping test used in neuropsychology.')}</p>
    <p style="font-weight:600;margin:14px 0 6px">${_t('cps_dur','Duration')}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${[5,10,30].map(d=>opt('dur',d,dur,d+' '+_t('cps_sec','s'))).join('')}</div>
    <p style="font-weight:600;margin:14px 0 6px">${_t('cps_input','Click with')}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${opt('inp','mouse',input,_t('cps_in_mouse','Mouse or touch'))}${opt('inp','space',input,_t('cps_in_space','Spacebar'))}</div>
    <div id="cps-area" role="button" tabindex="0" aria-live="polite"
      style="margin-top:18px;min-height:240px;border:2px dashed var(--primary);border-radius:var(--radius-l);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;user-select:none;-webkit-user-select:none;touch-action:manipulation;cursor:pointer;background:var(--bg-alt);text-align:center;padding:16px">
      <div id="cps-big" style="font-size:2.6rem;font-weight:800;line-height:1">0</div>
      <div id="cps-msg" style="color:var(--text-2)">${input==='space'?_t('cps_go_space','Press the spacebar to start'):_t('cps_go','Click here to start')}</div>
      <div id="cps-live" style="font-size:.9rem;color:var(--text-2)"></div>
    </div>`;
  const a=$('cps-area');
  a.addEventListener('pointerdown',e=>{ if(input!=='mouse'||!e.isTrusted) return; if(e.pointerType==='mouse'&&e.button!==0) return; e.preventDefault(); hit(e.timeStamp); });
  a.addEventListener('contextmenu',e=>e.preventDefault());
}
function hit(ts){
  if(lock) return;
  const now=performance.now();
  if(!st){ st={t0:now, taps:[0], done:false}; timer=setInterval(tick,50); $('cps-msg').textContent=_t('cps_keep','Keep clicking!'); render(); return; }
  if(st.done) return;
  const t=now-st.t0; if(t>dur*1000) return finish();
  st.taps.push(t); render();
}
function render(){
  const t=(performance.now()-st.t0)/1000, n=st.taps.length;
  $('cps-big').textContent=n;
  $('cps-live').textContent=_t('cps_now','Clicks per second')+': '+(t>0.3?(n/t).toFixed(1):'–');
}
function tick(){
  if(!st) return;
  const t=(performance.now()-st.t0)/1000;
  $('cps-left').textContent=_t('cps_left','Time left')+' '+Math.max(0,dur-t).toFixed(1)+' '+_t('cps_sec','s');
  if(t>=dur) finish(); else render();
}
function median(a){ const s=a.slice().sort((x,y)=>x-y), m=s.length>>1; return s.length%2?s[m]:(s[m-1]+s[m])/2; }
function normalCDF(z){ const a=[0.319381530,-0.356563782,1.781477937,-1.821255978,1.330274429];
  const k=1/(1+0.2316419*Math.abs(z)); let p=0,tp=k; a.forEach(c=>{p+=c*tp;tp*=k;}); const d=0.3989423*Math.exp(-z*z/2)*p; return z>=0?1-d:d; }
function label(p){
  if(p>=95) return {text:_t('rt_r_exceptional','Exceptional'),color:'#6366f1'};
  if(p>=80) return {text:_t('rt_r_superior','Superior'),color:'#8b5cf6'};
  if(p>=60) return {text:_t('rt_r_above','Above Average'),color:'#10b981'};
  if(p>=40) return {text:_t('rt_r_average','Average'),color:'#06b6d4'};
  if(p>=20) return {text:_t('rt_r_below','Below Average'),color:'#f59e0b'};
  return {text:_t('rt_r_practice','Keep Practicing'),color:'#ef4444'};
}
function analyse(taps,d){
  const n=taps.length, cps=n/d;
  const iti=[]; for(let i=1;i<n;i++) iti.push(taps[i]-taps[i-1]);
  const r={n, cps, d};
  if(n<5){ r.few=true; return r; }
  const med=median(iti); r.steady=1000/med;
  const mean=iti.reduce((a,b)=>a+b,0)/iti.length, sd=Math.sqrt(iti.reduce((a,b)=>a+(b-mean)**2,0)/iti.length);
  r.cv=sd/mean*100;
  let best=0; for(let i=0,j=0;i<n;i++){ while(taps[i]-taps[j]>=1000) j++; best=Math.max(best,i-j+1); } r.best=best;
  const h=d*500, a=taps.filter(t=>t<h).length, b=n-a; r.fade=a?((b-a)/a*100):0;
  r.auto = r.cv<3 && cps>8;
  r.tech = cps>9;
  if(NORM[d] && !r.auto){ const z=(cps-NORM[d].m)/NORM[d].sd; r.p=Math.max(1,Math.min(99,Math.round(normalCDF(z)*100))); }
  return r;
}
function finish(){
  if(!st||st.done) return;
  st.done=true; clearInterval(timer); lock=true; setTimeout(()=>{lock=false;},1200);
  const taps=st.taps.filter(t=>t<=dur*1000);
  last=analyse(taps,dur); last.input=input;
  $('cps-left').textContent='';
  $('cps-msg').textContent=_t('cps_done','Time is up. Your results are below.');
  $('cps-big').textContent=taps.length;
  $('cps-live').textContent='';
  results(last);
}
function sign(x){ return (x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(0)+'%'; }
function results(r){
  const row=(name,val)=>`<div class="trait-bar-item"><div class="trait-bar-top"><span class="trait-name">${name}</span><span class="trait-pct">${val}</span></div></div>`;
  let notes=[];
  if(r.few) notes.push(_t('cps_note_few','Too few clicks to score. Click as fast as you can for the whole time.'));
  if(r.auto) notes.push(_t('cps_note_auto','Your intervals were almost perfectly even, which a human hand does not produce. If an auto-clicker was used, this is not a measurement.'));
  else if(r.tech) notes.push(_t('cps_note_tech','That is faster than one-finger tapping reached in the reference study, so you probably used another technique, such as jitter or butterfly clicking. The percentile assumes one finger.'));
  if(!r.few && !NORM[r.d]) notes.push(_t('cps_note_5s','A 5-second run is too short to compare with the reference study. Choose 10 or 30 seconds for a percentile.'));
  if(!r.few && r.input==='space') notes.push(_t('cps_note_space','The reference study used a mouse button, so a spacebar comparison is only approximate.'));
  const lb = r.p!==undefined ? label(r.p) : null;
  $('cps-results').innerHTML=`
    <h3>${_t('cps_res','Your click speed')}</h3>
    <div style="text-align:center;margin:10px 0 4px"><span style="font-size:3rem;font-weight:800">${r.cps.toFixed(1)}</span> <span style="font-weight:700;color:var(--text-2)">CPS</span></div>
    ${lb?`<p style="text-align:center;font-weight:700;color:${lb.color};margin:0">${lb.text}</p>
    <p style="text-align:center;color:var(--text-2);font-size:.9rem;margin-top:4px">${_t('cps_pct','Faster than about {p}% of adults in the reference study.').replace('{p}',r.p)}</p>`:''}
    <div class="trait-bars">
      ${row(_t('cps_r_total','Total clicks'), r.n+' / '+r.d+' '+_t('cps_sec','s'))}
      ${r.few?'':row(_t('cps_r_steady','Steady rate'), r.steady.toFixed(1)+' CPS')}
      ${r.few?'':row(_t('cps_r_best','Best single second'), r.best)}
      ${r.few?'':row(_t('cps_r_cv','Variation between clicks'), '±'+r.cv.toFixed(0)+'%')}
      ${r.few?'':row(_t('cps_r_fade','Second half vs first half'), sign(r.fade))}
    </div>
    ${notes.map(n=>`<p style="margin-top:14px;padding:10px 14px;border-left:3px solid var(--primary);background:var(--bg-alt);border-radius:8px;font-size:.9rem">${n}</p>`).join('')}
    <p style="font-size:.8rem;color:var(--text-2);margin-top:14px">${_t('cps_disclaimer','Click speed depends on your mouse or screen, your technique and practice. It measures motor speed, not intelligence or health.')}</p>
    <div class="share-row" style="margin-top:8px"><button class="share-btn" onclick="CpsTest.copy()">📋 ${_t('share_copy','Copy Result')}</button></div>
    <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="CpsTest.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  $('cps-results').classList.add('show');
  setTimeout(()=>$('cps-results').scrollIntoView({behavior:'smooth',block:'start'}),60);
}

window.CpsTest={
  dur(d){ if(st&&!st.done) return; dur=d; setup(); },
  inp(i){ if(st&&!st.done) return; input=i; setup(); },
  reset(){ $('cps-results').classList.remove('show'); $('cps-results').innerHTML=''; setup(); },
  copy(){ if(!last) return; navigator.clipboard?.writeText(_t('cps_res','Your click speed')+': '+last.cps.toFixed(1)+' CPS ('+last.d+' '+_t('cps_sec','s')+') | coreskillai.com/tests/cps/'); },
  _analyse:analyse
};
document.addEventListener('keydown',e=>{
  if(input!=='space'||e.code!=='Space'||!$('cps-area')) return;
  e.preventDefault(); if(e.repeat||!e.isTrusted) return; hit(e.timeStamp);
});
document.addEventListener('DOMContentLoaded',shell);
})();

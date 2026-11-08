/* CoreSkillAI - Visual Acuity Test (distance, one eye at a time).
 *
 * METHOD
 *  - Screen calibration: the visitor resizes an on-screen rectangle until it
 *    matches a bank card held against the screen. ID-1 cards (ISO/IEC 7810) are
 *    85.60 x 53.98 mm, so this gives CSS pixels per millimetre for this screen.
 *  - Optotype: tumbling E on a 5 x 5 grid (stroke = 1/5 of the letter), the
 *    optotype used by the validated Peek Acuity test (Bastawrous et al. 2015,
 *    JAMA Ophthalmol 133:930-937). At logMAR 0 the letter subtends 5 arcmin.
 *  - Layout: rows of 5 letters, letter spacing equal to one letter width, sizes
 *    in 0.1 log steps (Bailey & Lovie 1976; ETDRS, Ferris et al. 1982).
 *  - Scoring: letter by letter, 0.02 logMAR per letter. Lines larger than the
 *    first line read with 4 or 5 correct are credited as read. Testing stops
 *    after a line with 3 or more errors.
 *      logMAR = top line + 0.1 - 0.02 x letters correct
 *  - Lines that the screen cannot draw faithfully (stroke under 1.5 device
 *    pixels) or that do not fit the screen width are not shown, and the result
 *    says so instead of guessing.
 *
 * Black letters on white regardless of the site theme. Nothing is sent anywhere;
 * the calibration is remembered in this browser only.
 */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
const $=id=>document.getElementById(id);
const CARD_W=85.60, CARD_H=53.98;
const LINES=[]; for(let i=10;i>=-3;i--) LINES.push(Math.round(i)/10);   // 1.0 ... -0.3
const DIRS=['R','D','L','U'], ROT={R:0,D:90,L:180,U:270};
const START=0.3;

let pxmm=null, dist=3, eye='R', st=null, res={R:null,L:null}, wpx=323, busy=false;
try{ const v=parseFloat(localStorage.getItem('cs_pxmm')); if(v>1&&v<30) pxmm=v; }catch(e){}

function hmm(l){ return 5*dist*1000*Math.tan(Math.pow(10,l)/60*Math.PI/180); }
function hpx(l){ return hmm(l)*pxmm; }
function avail(){ const w=Math.min(($('vis-body')?.clientWidth||600)-8, 900); const dpr=window.devicePixelRatio||1;
  return LINES.filter(l=>{ const h=hpx(l); return h/5*dpr>=1.5 && h*9<=w && h<=window.innerHeight*0.5; }); }
function eyeName(e){return e==='R'?_t('vis_right','Right eye'):_t('vis_left','Left eye');}
function fmt(l){ return (l<0?'−':'')+Math.abs(l).toFixed(2); }
function snellen(l){ const m=6*Math.pow(10,l), f=20*Math.pow(10,l); return {m:'6/'+(m<10?m.toFixed(1).replace('.0',''):Math.round(m)), f:'20/'+Math.round(f), d:(1/Math.pow(10,l)).toFixed(2)}; }

function E(dir,size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 5 5" style="display:block;transform:rotate(${ROT[dir]}deg)" aria-hidden="true"><path d="M0 0H5V1H1V2H5V3H1V4H5V5H0Z" fill="#000"/></svg>`;
}

function shell(){
  $('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('vis_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('vis_how1','You need a bank card or any card of the same size, a tape measure, and a laptop or desktop screen.')}</li>
      <li>${_t('vis_how2','First you match a rectangle on screen to your card, so the letters are drawn at their true size.')}</li>
      <li>${_t('vis_how3','Then you stand 3 metres from the screen, cover one eye and say which way each letter E points. A helper or a wireless keyboard makes this easy.')}</li>
      <li>${_t('vis_how4','If you wear glasses for distance, keep them on. Takes about 5 minutes. This is a screening for curiosity, not an eye examination.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header"><span class="test-ui-title">${_t('vis_title','Vision Test')}</span><span id="vis-step" class="q-counter"></span></div>
    <div class="test-ui-body" id="vis-body">
      <p style="color:var(--text-2)">${_t('vis_start_desc','Measures how small a letter each eye can read from a known distance, with the same chart principles eye clinics use.')}</p>
      <button class="btn btn-primary" onclick="VisTest.calib()">${_t('btn_start_test','Start Test')}</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)"><div class="q-progress-bar"><div class="q-progress-fill" id="vis-prog" style="width:0%"></div></div></div>
  </div>
  <div class="results-panel" id="vis-results"></div>`;
}
function step(n){ $('vis-step').textContent=_t('vis_step','Step')+' '+n+' / 3'; }
function prog(p){ $('vis-prog').style.width=Math.round(p*100)+'%'; }

/* 1. calibration */
function calib(){
  step(1); prog(0.03);
  wpx = pxmm ? Math.round(pxmm*CARD_W) : 323;
  $('vis-body').innerHTML=`
    <p class="question-text">${_t('vis_cal_q','Match the card')}</p>
    <p>${_t('vis_cal1','Hold a bank card flat against the screen, at the top-left corner of the grey rectangle. Change the size until the rectangle is exactly as wide as the card.')}</p>
    <div id="vis-card" style="background:#9ca3af;border-radius:3.2mm;margin:14px 0;height:auto"></div>
    <div class="share-row" style="justify-content:flex-start;flex-wrap:wrap;align-items:center">
      <button class="share-btn" onclick="VisTest.size(-10)">−−</button>
      <button class="share-btn" onclick="VisTest.size(-1)">−</button>
      <input type="range" id="vis-range" min="120" max="900" value="${wpx}" style="flex:1;min-width:140px" oninput="VisTest.size(0,this.value)" aria-label="${_t('vis_cal_q','Match the card')}">
      <button class="share-btn" onclick="VisTest.size(1)">+</button>
      <button class="share-btn" onclick="VisTest.size(10)">++</button>
    </div>
    <p style="font-size:.85rem;color:var(--text-2)">${_t('vis_cal2','Any card of this size works: a debit or credit card, a driving licence or an ID card. Do not use a business card.')}</p>
    <button class="btn btn-primary" onclick="VisTest.calDone()">${_t('vis_cal_ok','The rectangle matches my card')}</button>`;
  draw();
}
function draw(){ const c=$('vis-card'); if(!c) return; c.style.width=wpx+'px'; c.style.height=(wpx*CARD_H/CARD_W)+'px'; const r=$('vis-range'); if(r) r.value=wpx; }

/* 2. distance */
function distance(){
  step(2); prog(0.1);
  $('vis-body').innerHTML=`
    <p class="question-text">${_t('vis_dist_q','How far will you stand?')}</p>
    <p>${_t('vis_dist1','Measure the distance from the screen to your eyes with a tape measure. 3 metres is best. Stand, or sit, with your eyes level with the screen.')}</p>
    <div class="share-row" style="justify-content:flex-start;flex-wrap:wrap">
      ${[2,3,4].map(d=>`<button class="btn ${d===3?'btn-primary':'btn-secondary'}" onclick="VisTest.dist(${d})">${d} m</button>`).join(' ')}
    </div>
    <p style="font-size:.85rem;color:var(--text-2)">${_t('vis_dist2','At 3 metres the letters a person with normal vision can just read are about 4 mm tall. Turn the screen brightness up and avoid glare on the screen.')}</p>`;
}
function setDist(d){
  dist=d; const a=avail();
  if(!a.length || Math.max(...a)<START){
    $('vis-body').innerHTML=`<p>${_t('vis_nofit','This screen is too small to draw the chart at this distance. Use a laptop or desktop screen, or choose a shorter distance.')}</p>
      <button class="btn btn-primary" onclick="VisTest.distance()">${_t('vis_back','Back')}</button>`; return; }
  cover('R');
}

/* 3. per-eye chart */
function cover(e){
  eye=e; step(3);
  $('vis-body').innerHTML=`
    <p class="question-text">${e==='R'?_t('vis_cover_r','Cover your left eye'):_t('vis_cover_l','Cover your right eye')}</p>
    <p>${_t('vis_cover1','Cover the other eye with the palm of your hand without pressing on it. Keep both eyes open behind your hand.')}</p>
    <p>${_t('vis_keys','For each letter E, say or press which way its open side points: right, down, left or up. If you cannot tell, guess.')}</p>
    <button class="btn btn-primary" onclick="VisTest.go()">${_t('vis_ready','Ready')} – ${eyeName(e)}</button>`;
}
function begin(){
  const a=avail();
  const top=Math.max(...a), bot=Math.min(...a);
  st={a, top, bot, line:Math.min(START,top), letters:[], i:0, rows:{}, dir:'down', creditFrom:null};
  newRow();
}
function newRow(){
  st.letters=[]; for(let k=0;k<5;k++){ let d; do{ d=DIRS[Math.floor(Math.random()*4)]; }while(k&&d===st.letters[k-1]); st.letters.push(d); }
  st.i=0; st.hits=0; render();
}
function render(){
  const h=hpx(st.line), gap=h;
  const row=st.letters.map((d,k)=>`<div style="display:flex;flex-direction:column;align-items:center;gap:${h*0.6}px">${E(d,h)}<div style="width:${h}px;height:${Math.max(h/5,2)}px;background:${k===st.i?'#ef4444':'transparent'}"></div></div>`).join(`<div style="width:${gap}px"></div>`);
  $('vis-body').innerHTML=`
    <div style="background:#fff;border-radius:12px;padding:28px 8px;display:flex;justify-content:center;align-items:flex-start;min-height:${h*2+40}px">${row}</div>
    <p class="q-counter" style="text-align:center;margin-top:10px">${eyeName(eye)} · ${_t('vis_line','Line')} ${fmt(st.line)} · ${st.i+1} / 5</p>
    <div style="display:grid;grid-template-columns:repeat(3,64px);gap:8px;justify-content:center;margin-top:8px">
      <span></span><button class="btn btn-secondary" aria-label="${_t('vis_up','Up')}" onclick="VisTest.ans('U')">↑</button><span></span>
      <button class="btn btn-secondary" aria-label="${_t('vis_lft','Left')}" onclick="VisTest.ans('L')">←</button>
      <button class="btn btn-secondary" aria-label="${_t('vis_dn','Down')}" onclick="VisTest.ans('D')">↓</button>
      <button class="btn btn-secondary" aria-label="${_t('vis_rgt','Right')}" onclick="VisTest.ans('R')">→</button>
    </div>
    <p style="text-align:center;font-size:.8rem;color:var(--text-2);margin-top:8px">${_t('vis_keyhint','Arrow keys work too. The red bar marks the current letter.')}</p>`;
}
function answer(d){
  if(!st||busy) return;
  if(d===st.letters[st.i]) st.hits++;
  st.i++;
  if(st.i<5) return render();
  const L=st.line, idx=st.a.indexOf(L); st.rows[L]=st.hits;
  if(st.creditFrom===null){
    if(st.hits<4 && idx>0){ st.line=st.a[idx-1]; return newRow(); }      // go up a line
    st.creditFrom=L;                                                      // first line read (or chart top)
    const low=Math.min(...Object.keys(st.rows).map(Number)), li=st.a.indexOf(low);
    if(st.rows[low]<=2 || li===st.a.length-1) return finish();
    st.line=st.a[li+1]; return newRow();
  }
  if(st.hits<=2 || idx===st.a.length-1) return finish();
  st.line=st.a[idx+1]; newRow();
}
function finish(){
  // every line larger than the first line read with 4-5 correct counts as read, back to 1.0
  let N=0; const cf=st.creditFrom;
  for(const l of LINES){ if(l>cf+1e-9) N+=5; else if(st.rows[l]!==undefined) N+=st.rows[l]; }
  const lm=Math.round((1.1-0.02*N)*100)/100;
  const worse = cf===st.top && st.rows[st.top]<=2;
  const floor = st.rows[st.bot]!==undefined && st.rows[st.bot]>=3;
  res[eye]={lm, worse, floor, top:st.top, bot:st.bot};
  st=null;
  prog(eye==='R'?0.55:1);
  if(eye==='R') return cover('L');
  results();
}
function verdict(r){
  if(r.worse) return _t('vis_v_worse','Could not read the largest line this screen can show. Have your eyes examined.');
  const l=r.lm;
  if(l<=0) return _t('vis_v_good','Normal or better than normal for distance (6/6 or 20/20, or better).');
  if(l<=0.3) return _t('vis_v_mild','Below 6/6 but within the range not counted as vision impairment (6/12 or better).');
  if(l<=0.46) return _t('vis_v_imp1','In the range the WHO classification calls mild vision impairment.');
  return _t('vis_v_imp2','In the range the WHO classification calls moderate vision impairment or worse.');
}
function results(){
  $('vis-step').textContent=''; prog(1);
  $('vis-body').innerHTML=`<p>${_t('vis_done','Done. Your results are below.')}</p>`;
  const row=e=>{ const r=res[e], s=snellen(r.lm);
    return `<div class="trait-bar-item"><div class="trait-bar-top"><span class="trait-name">${eyeName(e)}</span><span class="trait-pct">${r.worse?'&gt; '+fmt(r.top):(r.floor?'≤ ':'')+fmt(r.lm)} logMAR</span></div>
      <p style="font-size:.9rem;margin:4px 0">${r.worse?'':`${s.m} · ${s.f} · ${_t('vis_decimal','decimal')} ${s.d}`}</p>
      <p style="font-size:.82rem;color:var(--text-2)">${verdict(r)}${r.floor?' '+_t('vis_floor','You read the smallest line this screen can draw, so your vision may be even better.'):''}</p></div>`; };
  const diff=Math.abs(res.R.lm-res.L.lm);
  $('vis-results').innerHTML=`
    <h3>${_t('vis_res','Distance visual acuity')}</h3>
    <div class="trait-bars">${row('R')}${row('L')}</div>
    ${diff>=0.2&&!res.R.worse&&!res.L.worse?`<div class="instruction-card" style="margin-top:14px"><p>${_t('vis_diff','Your two eyes differ by two lines or more. That is worth checking with an optometrist or ophthalmologist, especially if it is new.')}</p></div>`:''}
    <p style="font-size:.85rem;color:var(--text-2);margin-top:14px">${_t('vis_how_read','logMAR 0.0 equals 6/6 (20/20). Each 0.1 is one line on a clinical chart; lower numbers mean sharper vision.')}</p>
    <p style="font-size:.8rem;color:var(--text-2)">${_t('vis_disclaimer','A home screen test can differ from a clinic chart by a line or more, and it does not check eye health, near vision, colour vision or the visual field. It cannot be used for a driving licence. Sudden loss or blurring of vision is an emergency: see a doctor the same day.')}</p>
    <div class="share-row" style="margin-top:8px"><button class="share-btn" onclick="VisTest.copy()">📋 ${_t('share_copy','Copy Result')}</button></div>
    <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="VisTest.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  $('vis-results').classList.add('show');
  setTimeout(()=>$('vis-results').scrollIntoView({behavior:'smooth',block:'start'}),60);
}

window.VisTest={
  calib(){ res={R:null,L:null}; $('vis-results').classList.remove('show'); $('vis-results').innerHTML=''; calib(); },
  size(dx,v){ wpx = v!==undefined ? +v : Math.max(120,Math.min(900,wpx+dx)); draw(); },
  calDone(){ pxmm=wpx/CARD_W; try{localStorage.setItem('cs_pxmm',String(pxmm));}catch(e){} distance(); },
  distance(){ distance(); },
  dist(d){ setDist(d); },
  go(){ begin(); },
  ans(d){ answer(d); },
  reset(){ res={R:null,L:null}; st=null; shell(); },
  copy(){ if(!res.R||!res.L) return; navigator.clipboard?.writeText(_t('vis_res','Distance visual acuity')+': '+eyeName('R')+' '+fmt(res.R.lm)+', '+eyeName('L')+' '+fmt(res.L.lm)+' logMAR | coreskillai.com/tests/vision/'); },
  _state(){ return st; }
};
document.addEventListener('keydown',e=>{ if(!st) return; const m={ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R'}[e.key]; if(m){ e.preventDefault(); answer(m); } });
document.addEventListener('DOMContentLoaded',shell);
})();

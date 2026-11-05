/* CoreSkillAI - Hearing Test (frequency range + relative sensitivity, per ear).
 *
 * WHAT IT MEASURES
 *  1. Frequency range: the highest pure tone each ear still hears, ascending
 *     from 8 kHz to 20 kHz at one fixed level. The upper limit of hearing falls
 *     with age, starting at the highest frequencies (Rodriguez Valiente et al.
 *     2014, Int J Audiol 53:531-545; ISO 7029:2017).
 *  2. Sensitivity: the quietest tone heard at 500, 1000, 2000, 4000 and 8000 Hz,
 *     found with a simplified Hughson-Westlake staircase (down 10 dB after a
 *     "heard", up 5 dB after a "not heard"; threshold = the lowest level heard
 *     on two ascending presentations).
 *
 * WHAT IT CANNOT DO
 *  Consumer headphones are not calibrated, so levels are reported in dB relative
 *  to the listener's own volume setting, never in dB HL. What stays meaningful
 *  is the SHAPE across frequencies and the DIFFERENCE between the two ears,
 *  because both ears are measured through the same headphones at one volume.
 *  The asymmetry flag follows the screening criteria summarised by Durakovic,
 *  Valente, Goebel & Wick (2019, Laryngoscope 129:1023-1024): 20 dB or more at
 *  two neighbouring frequencies, or 15 dB or more at two frequencies from 2 to
 *  8 kHz.
 *
 * Silent catch trials are mixed in. Answering "heard" to silence marks the
 * result as unreliable instead of silently scoring it.
 *
 * Tones: sine, 1.2 s, 30 ms raised ramps (no clicks - a click is broadband and
 * would be audible even when the tone is not). Peak level is capped at
 * -10 dBFS. Nothing is recorded or sent anywhere.
 */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}

const REF=0.1;               // 0 dB relative = -20 dBFS
const MAXDB=10, MINDB=-80;   // relative range
const RANGE_F=[8000,10000,12000,14000,15000,16000,17000,18000,19000,20000];
const SENS_F=[500,1000,2000,4000,8000];
const EARS=['R','L'];
const TONE=1.2;

let ctx=null, stage='shell', ear='R', q=[], cur=null, res=null, busy=false;

function audio(){
  if(!ctx){const A=window.AudioContext||window.webkitAudioContext; if(!A) return null; ctx=new A();}
  if(ctx.state==='suspended') ctx.resume();
  return ctx;
}
function play(freq,db,side,dur){
  const c=audio(); if(!c) return;
  const amp=db===null?0:REF*Math.pow(10,Math.min(db,MAXDB)/20);
  const o=c.createOscillator(), g=c.createGain(), m=c.createChannelMerger(2);
  o.type='sine'; o.frequency.value=freq||1000;
  const t=c.currentTime+0.05, d=dur||TONE, r=0.03;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(amp,t+r);
  g.gain.setValueAtTime(amp,t+d-r); g.gain.linearRampToValueAtTime(0,t+d);
  o.connect(g);
  if(side==='B'){g.connect(m,0,0); g.connect(m,0,1);} else g.connect(m,0,side==='L'?0:1);
  m.connect(c.destination); o.start(t); o.stop(t+d+0.05);
}
function earName(e){return e==='R'?_t('hea_right','Right ear'):_t('hea_left','Left ear');}
function fmtHz(f){return f>=1000?(f/1000)+' kHz':f+' Hz';}
const $=id=>document.getElementById(id);
function body(html){$('hea-body').innerHTML=html;}
function prog(p){$('hea-prog').style.width=Math.round(p*100)+'%';}

function renderShell(){
  stage='shell';
  $('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('hea_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('hea_how1','Use wired or Bluetooth headphones, not the speakers. Sit somewhere quiet.')}</li>
      <li>${_t('hea_how2','First you set the volume once. Do not change it again until the end.')}</li>
      <li>${_t('hea_how3','You will hear short beeps in one ear at a time. After each one, say whether you heard it. Some beeps are silent on purpose.')}</li>
      <li>${_t('hea_how4','Takes about 6 minutes. This is a screening for curiosity, not a medical hearing test.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">${_t('hea_title','Hearing Test')}</span>
      <span id="hea-step" class="q-counter"></span>
    </div>
    <div class="test-ui-body" id="hea-body">
      <p style="color:var(--text-2)">${_t('hea_start_desc','Finds the highest pitch each ear can hear and compares how quiet a sound each ear picks up at five pitches.')}</p>
      <button class="btn btn-primary" onclick="HeaTest.start()">${_t('btn_start_test','Start Test')}</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="hea-prog" style="width:0%"></div></div>
    </div>
  </div>
  <div class="results-panel" id="hea-results"></div>`;
}

function stepLabel(n){$('hea-step').textContent=_t('hea_step','Step')+' '+n+' / 4';}

/* step 1: left / right check */
function sideCheck(){
  stage='side'; stepLabel(1); prog(0.02);
  const s=Math.random()<0.5?'L':'R'; cur={side:s};
  body(`<p class="question-text">${_t('hea_side_q','Where did you hear the beep?')}</p>
    <p style="color:var(--text-2)">${_t('hea_side_note','Put your headphones on the right way round: R on the right ear.')}</p>
    <p><button class="btn btn-secondary" onclick="HeaTest.replay()">▶ ${_t('hea_play','Play again')}</button></p>
    <div class="share-row" style="justify-content:flex-start;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="HeaTest.side('L')">${_t('hea_left','Left ear')}</button>
      <button class="btn btn-primary" onclick="HeaTest.side('R')">${_t('hea_right','Right ear')}</button>
      <button class="btn btn-secondary" onclick="HeaTest.side('B')">${_t('hea_both','Both ears')}</button>
    </div>`);
  play(1000,0,s,0.8);
}

/* step 2: volume */
function volume(){
  stage='vol'; stepLabel(2); prog(0.06);
  body(`<p class="question-text">${_t('hea_vol_q','Set your volume')}</p>
    <p>${_t('hea_vol1','Play the tone and adjust your device volume until you hear it clearly but it is not loud. Think of a quiet conversation.')}</p>
    <p style="color:var(--text-2)">${_t('hea_vol2','Do not touch the volume again until the test ends. Stop at once if any tone is uncomfortable.')}</p>
    <p><button class="btn btn-secondary" onclick="HeaTest.volTone()">▶ ${_t('hea_play','Play again')}</button></p>
    <button class="btn btn-primary" onclick="HeaTest.volDone()">${_t('hea_vol_ok','The volume is set')}</button>`);
  play(1000,0,'B',1.5);
}

/* trial engine shared by steps 3 and 4 */
function ask(){
  busy=true;
  const silent=cur.catchNext; cur.silentNow=silent; cur.catchNext=false;
  body(`<p class="q-counter">${earName(ear)} · ${stage==='range'?_t('hea_range_label','Highest pitch'):_t('hea_sens_label','Quietest sound')}</p>
    <p class="question-text">${_t('hea_listen','Listen…')}</p>
    <div class="share-row" style="justify-content:flex-start;flex-wrap:wrap;opacity:.4" id="hea-btns">
      <button class="btn btn-primary" disabled>${_t('hea_yes','I heard it')}</button>
      <button class="btn btn-secondary" disabled>${_t('hea_no','I did not hear it')}</button>
    </div>`);
  if(!silent) play(cur.freq,cur.db,ear);
  setTimeout(()=>{
    busy=false;
    body(`<p class="q-counter">${earName(ear)} · ${stage==='range'?_t('hea_range_label','Highest pitch'):_t('hea_sens_label','Quietest sound')}</p>
      <p class="question-text">${_t('hea_heard_q','Did you hear a beep?')}</p>
      <div class="share-row" style="justify-content:flex-start;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="HeaTest.ans(true)">${_t('hea_yes','I heard it')}</button>
        <button class="btn btn-secondary" onclick="HeaTest.ans(false)">${_t('hea_no','I did not hear it')}</button>
      </div>`);
  },(TONE+0.25)*1000);
}
function maybeCatch(){ if(Math.random()<0.12) cur.catchNext=true; }

/* step 3: range */
function rangeStart(e){
  stage='range'; ear=e; stepLabel(3);
  cur={i:0,freq:RANGE_F[0],db:0,miss:0,best:null};
  ask();
}
function rangeAns(heard){
  if(cur.silentNow){ if(heard) res.falsePos++; res.catches++; return ask(); }
  if(heard){ cur.best=cur.freq; cur.miss=0; } else cur.miss++;
  if(cur.miss>=2 || cur.i===RANGE_F.length-1){
    res.range[ear]=cur.best;
    if(ear==='R') return rangeStart('L');
    return sensStart('R',0);
  }
  cur.i++; cur.freq=RANGE_F[cur.i];
  prog(0.08+0.22*((ear==='L'?RANGE_F.length:0)+cur.i)/(2*RANGE_F.length));
  maybeCatch(); ask();
}

/* step 4: sensitivity, simplified Hughson-Westlake */
function sensStart(e,fi){
  stage='sens'; ear=e; stepLabel(4);
  cur={fi,freq:SENS_F[fi],db:0,asc:false,hits:{},n:0};
  ask();
}
function sensAns(heard){
  if(cur.silentNow){ if(heard) res.falsePos++; res.catches++; return ask(); }
  cur.n++;
  let done=null;
  if(heard){
    if(cur.asc){ cur.hits[cur.db]=(cur.hits[cur.db]||0)+1; if(cur.hits[cur.db]>=2) done=cur.db; }
    if(done===null){ if(cur.db<=MINDB) done=MINDB; else { cur.db=Math.max(MINDB,cur.db-10); cur.asc=false; } }
  } else {
    if(cur.db>=MAXDB){ done=null; res.sens[ear][cur.freq]=null; return nextSens(); }
    cur.db+=5; cur.asc=true;
  }
  if(done===null && cur.n>=24) done=Math.min(...Object.keys(cur.hits).map(Number).concat([cur.db]));
  if(done!==null){ res.sens[ear][cur.freq]=done; return nextSens(); }
  maybeCatch(); ask();
}
function nextSens(){
  const k=(ear==='L'?SENS_F.length:0)+cur.fi+1;
  prog(0.3+0.7*k/(2*SENS_F.length));
  if(cur.fi<SENS_F.length-1) return sensStart(ear,cur.fi+1);
  if(ear==='R') return sensStart('L',0);
  showResults();
}

/* results */
function asym(){
  const R=res.sens.R, L=res.sens.L, d={};
  SENS_F.forEach(f=>{ if(R[f]!=null&&L[f]!=null) d[f]=R[f]-L[f]; });
  let flag=null;
  for(let i=0;i<SENS_F.length-1;i++){
    const a=d[SENS_F[i]], b=d[SENS_F[i+1]];
    if(a!=null&&b!=null&&Math.abs(a)>=20&&Math.abs(b)>=20&&Math.sign(a)===Math.sign(b)) flag=a>0?'R':'L';
  }
  const hf=[2000,4000,8000].filter(f=>d[f]!=null&&Math.abs(d[f])>=15);
  if(!flag&&hf.length>=2){const s=hf.map(f=>Math.sign(d[f])); if(s.every(x=>x===s[0])) flag=s[0]>0?'R':'L';}
  // a higher (less negative) relative threshold = needed a louder tone = weaker ear
  return {d,flag};
}
function chart(){
  const W=520,H=260,pl=48,pr=16,pt=16,pb=36;
  const x=i=>pl+i*(W-pl-pr)/(SENS_F.length-1);
  const y=db=>pt+(MAXDB-db)/(MAXDB-MINDB)*(H-pt-pb);
  let g='';
  for(let db=MAXDB;db>=MINDB;db-=10) g+=`<line x1="${pl}" x2="${W-pr}" y1="${y(db)}" y2="${y(db)}" stroke="var(--border)"/><text x="${pl-6}" y="${y(db)+4}" text-anchor="end" font-size="10" fill="var(--text-2)">${db}</text>`;
  SENS_F.forEach((f,i)=>g+=`<text x="${x(i)}" y="${H-12}" text-anchor="middle" font-size="11" fill="var(--text-2)">${fmtHz(f)}</text>`);
  const line=(e,col)=>{const pts=SENS_F.map((f,i)=>res.sens[e][f]!=null?[x(i),y(res.sens[e][f])]:null).filter(Boolean);
    let s=pts.length>1?`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="2"/>`:'';
    pts.forEach(p=>s+=e==='R'?`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="none" stroke="${col}" stroke-width="2"/>`
      :`<path d="M${p[0]-5},${p[1]-5}L${p[0]+5},${p[1]+5}M${p[0]+5},${p[1]-5}L${p[0]-5},${p[1]+5}" stroke="${col}" stroke-width="2"/>`);
    return s;};
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;height:auto" role="img" aria-label="${_t('hea_chart','Quietest tone heard, in dB relative to your volume setting')}">${g}${line('R','#ef4444')}${line('L','#3b82f6')}</svg>
  <p style="font-size:.8rem;color:var(--text-2)"><span style="color:#ef4444">○ ${_t('hea_right','Right ear')}</span> · <span style="color:#3b82f6">✕ ${_t('hea_left','Left ear')}</span> — ${_t('hea_chart','Quietest tone heard, in dB relative to your volume setting')}. ${_t('hea_chart_note','Lower on the chart means a quieter tone was heard.')}</p>`;
}
function showResults(){
  stage='done'; prog(1); $('hea-step').textContent='';
  body(`<p>${_t('hea_done','Done. Your results are below.')}</p>`);
  const {flag}=asym();
  const unreliable=res.falsePos>=2;
  const rr=e=>res.range[e]?fmtHz(res.range[e]):_t('hea_none','below 8 kHz');
  const top=Math.max(res.range.R||0,res.range.L||0);
  $('hea-results').innerHTML=`
  ${unreliable?`<div class="instruction-card" style="border-color:#f59e0b"><p><strong>${_t('hea_unrel','You answered "I heard it" to silent trials.')}</strong> ${_t('hea_unrel2','The results below are not reliable. Find a quieter place and try again, answering only when you are sure.')}</p></div>`:''}
  <h3>${_t('hea_res_range','Highest pitch heard')}</h3>
  <div class="trait-bars">
    ${EARS.map(e=>`<div class="trait-bar-item"><div class="trait-bar-top"><span class="trait-name">${earName(e)}</span><span class="trait-pct">${rr(e)}</span></div>
      <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${(res.range[e]||0)/200}%;background:${e==='R'?'#ef4444':'#3b82f6'}"></div></div></div>`).join('')}
  </div>
  <p style="font-size:.85rem;color:var(--text-2)">${_t('hea_range_note','The upper limit of hearing drops with age, starting with the highest pitches. Many headphones and almost all phone speakers also stop reproducing sound somewhere above 15 to 18 kHz, so a tone you did not hear may simply not have been played.')}</p>
  ${top&&top<=12000?`<p style="font-size:.85rem">${_t('hea_range_low','You heard no tone above 12 kHz with either ear. If that surprises you, check that the volume was not too low, then repeat with other headphones.')}</p>`:''}
  <h3 style="margin-top:24px">${_t('hea_res_sens','Quietest sound heard')}</h3>
  ${chart()}
  <div class="instruction-card" style="margin-top:12px">
    <p>${flag?(flag==='R'?_t('hea_asym_r','Your right ear needed a clearly louder tone than your left ear at two or more pitches. That pattern is worth a proper hearing test with an audiologist, especially if it is new or comes with ringing or a blocked feeling.'):_t('hea_asym_l','Your left ear needed a clearly louder tone than your right ear at two or more pitches. That pattern is worth a proper hearing test with an audiologist, especially if it is new or comes with ringing or a blocked feeling.'))
      :_t('hea_sym','Your two ears needed similar levels at every pitch tested. This compares your ears with each other; it cannot say how your hearing compares with other people.')}</p>
  </div>
  <p style="font-size:.8rem;color:var(--text-2)">${_t('hea_disclaimer','This test runs through uncalibrated headphones, so it reports levels relative to your volume, not in dB HL. It cannot diagnose hearing loss. Sudden hearing loss in one ear is a medical emergency: see a doctor the same day.')}</p>
  <div class="share-row" style="margin-top:8px">
    <button class="share-btn" onclick="HeaTest.copy()">📋 ${_t('share_copy','Copy Result')}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="HeaTest.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  $('hea-results').classList.add('show');
  setTimeout(()=>$('hea-results').scrollIntoView({behavior:'smooth',block:'start'}),60);
}

window.HeaTest={
  start(){ if(!audio()){ body(`<p>${_t('hea_noaudio','Your browser cannot play test tones. Try a current version of Chrome, Firefox, Safari or Edge.')}</p>`); return; }
    res={range:{R:null,L:null},sens:{R:{},L:{}},falsePos:0,catches:0};
    $('hea-results').classList.remove('show'); $('hea-results').innerHTML=''; sideCheck(); },
  replay(){ if(stage==='side') play(1000,0,cur.side,0.8); },
  side(a){ if(a===cur.side) return volume();
    body(`<p class="question-text">${a==='B'?_t('hea_side_both','The beep was in one ear only.'):_t('hea_side_wrong','The beep was in the other ear.')}</p>
      <p>${_t('hea_side_fix','Check that the headphones are not reversed and that mono audio is off in your accessibility settings, then try again.')}</p>
      <button class="btn btn-primary" onclick="HeaTest.sideAgain()">${_t('hea_again','Try again')}</button>`); },
  sideAgain(){ sideCheck(); },
  volTone(){ play(1000,0,'B',1.5); },
  volDone(){ rangeStart('R'); },
  ans(h){ if(busy) return; if(stage==='range') rangeAns(h); else if(stage==='sens') sensAns(h); },
  reset(){ res=null; renderShell(); },
  copy(){ if(!res) return; const t=EARS.map(e=>earName(e)+': '+(res.range[e]?fmtHz(res.range[e]):'<8 kHz')).join(', ');
    navigator.clipboard?.writeText(_t('hea_res_range','Highest pitch heard')+' - '+t+' | coreskillai.com/tests/hearing/'); }
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

/* CoreSkillAI — Mental Rotation Test
 *
 * 20 procedurally generated items, 6 options each, 6 minutes.
 * Items come from js/tests/rotationgen.js. Exactly one option is the target
 * figure rotated; the rest are mirror images. See that file for why every
 * figure is checked for chirality first.
 *
 * Scored the same honest way as the IQ test: corrected for guessing, reported
 * with a confidence interval, and refused entirely at chance level rather than
 * printing a number that means nothing.
 */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}

const N_ITEMS   = 20;
const N_OPTIONS = 6;
const TIME_LIMIT = 6*60;

let ITEMS=[], current=0, answers={}, times={}, shownAt=0, phase='idle', timer=null, elapsed=0;

function correctForGuessing(raw){
  const chance = N_ITEMS / N_OPTIONS;
  return Math.max(0, (raw - chance) / (1 - 1/N_OPTIONS));
}
function isBelowFloor(raw){ return raw <= N_ITEMS/N_OPTIONS + 1; }

// Percentile on a stated assumption, not a norm table - we have no
// standardisation sample for this test either, and saying so is the point.
function pctOf(raw){
  const p = correctForGuessing(raw)/N_ITEMS;
  const eps=0.02, q=Math.min(1-eps,Math.max(eps,p));
  const z = Math.log(q/(1-q))/1.7 - 0.05;
  const a=[0.319381530,-0.356563782,1.781477937,-1.821255978,1.330274429];
  const t=1/(1+0.2316419*Math.abs(z)); let poly=0,tp=t; a.forEach(c=>{poly+=c*tp;tp*=t;});
  const d=0.3989423*Math.exp(-z*z/2)*poly;
  return Math.max(1,Math.min(99,Math.round((z>=0?1-d:d)*100)));
}
function label(p){
  if(p>=90) return{text:_t('rt_r_exceptional','Exceptional'),color:'#6366f1'};
  if(p>=75) return{text:_t('rt_r_superior','Superior'),color:'#8b5cf6'};
  if(p>=55) return{text:_t('rt_r_above','Above Average'),color:'#10b981'};
  if(p>=40) return{text:_t('rt_r_average','Average'),color:'#06b6d4'};
  if(p>=20) return{text:_t('rt_r_below','Below Average'),color:'#f59e0b'};
  return{text:_t('rt_r_practice','Keep Practicing'),color:'#ef4444'};
}

function renderShell(){
  const root=document.getElementById('test-root');
  if(!root) return;
  root.innerHTML=`
  <div class="instruction-card">
    <h3>${_t('rot_how_title','How This Test Works')}</h3>
    <ul>
      <li>${_t('rot_how1','A figure is shown at the top. Below it are six candidates.')}</li>
      <li>${_t('rot_how2','Exactly one is the same figure turned to a new angle. The others are mirror images — the same shape flipped over.')}</li>
      <li>${_t('rot_how3','Turn the figure in your head to compare. The wider the turn, the harder it gets.')}</li>
      <li>${_t('rot_how4','Nothing to read, and fresh figures every attempt.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🔄 ${_t('rot_title','Mental Rotation Test')}</span>
      <span class="badge badge-red">⏱ 6 <span data-i18n="card_min">min</span></span>
    </div>
    <div class="test-ui-body" id="rot-body">
      <p style="color:var(--text-2);text-align:center;max-width:380px">${_t('rot_desc','20 spatial puzzles measuring how well you rotate shapes in your mind. No words, no numbers.')}</p>
      <button class="btn btn-primary btn-lg" onclick="RotTest.start()">${_t('rot_start','Start Test →')}</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="rot-prog" style="width:0%"></div></div>
    </div>
  </div>
  <div class="results-panel" id="rot-results"></div>`;
}

function renderQ(){
  const it=ITEMS[current];
  shownAt=Date.now();
  const prog=document.getElementById('rot-prog');
  if(prog) prog.style.width=`${(current/ITEMS.length)*100}%`;
  const secs=Math.max(0,TIME_LIMIT-elapsed);
  const mm=String(Math.floor(secs/60)).padStart(2,'0');
  const ss=String(secs%60).padStart(2,'0');
  const G=window.RotationGen;
  const target=`<div class="rot-target">${G.figureSvg(it.target.cells,it.target.angle,110)}</div>`;
  const opts=it.options.map((o,i)=>
    `<div class="pattern-choice" onclick="RotTest.pick(${i})" data-i="${i}">${G.figureSvg(o.cells,o.angle,62)}</div>`).join('');
  document.getElementById('rot-body').innerHTML=`
    <div style="display:flex;justify-content:space-between;width:100%;max-width:440px;font-size:.82rem;color:var(--text-3)">
      <span>🔄 ${_t('rot_target','Target figure')}</span>
      <span>${current+1}/${ITEMS.length}</span>
      <span class="rot-timer" style="font-weight:700;color:${secs<60?'var(--danger)':'var(--text-2)'}">⏱ ${mm}:${ss}</span>
    </div>
    ${target}
    <p style="font-size:.85rem;color:var(--text-2);margin:4px 0 0;text-align:center">${_t('rot_q','Which one is the same figure, rotated?')}</p>
    <div class="pattern-choices six">${opts}</div>`;
}

function startTimer(){
  timer=setInterval(()=>{
    elapsed++;
    if(elapsed>=TIME_LIMIT){ clearInterval(timer); finish(); return; }
    const secs=TIME_LIMIT-elapsed;
    const el=document.querySelector('#rot-body .rot-timer');
    if(el) el.textContent=`⏱ ${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;
  },1000);
}

function finish(){
  clearInterval(timer);
  phase='done';
  const raw=ITEMS.filter((it,i)=>answers[i]===it.ans).length;
  const floored=isBelowFloor(raw);
  const p=pctOf(raw);
  const {text,color}=label(p);
  const answered=Object.keys(answers).length;

  // Accuracy split by how far the figure had to be turned. This is the signature
  // finding in mental rotation - performance falls as the angle grows - so
  // showing it tells the visitor something real about their own result.
  const near=ITEMS.filter((it,i)=>it.disparity<=90);
  const far =ITEMS.filter((it,i)=>it.disparity>90);
  const hit=list=>list.filter(it=>answers[ITEMS.indexOf(it)]===it.ans).length;

  document.getElementById('rot-results').innerHTML=`
  <div style="text-align:center;padding:8px 0 20px">
    <div style="font-size:.8rem;font-weight:600;color:var(--text-3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">${_t('rot_result_label','Spatial Reasoning')}</div>
    <div style="font-size:4rem;font-weight:900;color:${color};letter-spacing:-.03em;line-height:1">${floored?'—':raw+'/'+N_ITEMS}</div>
    ${floored
      ? `<p style="font-size:.85rem;color:var(--text-2);margin:12px auto 0;max-width:420px;line-height:1.6">${_t('rot_floor','Your score is at the level chance alone produces, so this test cannot place you. With six options, guessing earns about {n} correct on its own.').replace('{n}',Math.round(N_ITEMS/N_OPTIONS))}</p>`
      : `<div style="font-size:1rem;font-weight:700;color:var(--text);margin-top:8px">${text}</div>
    <div class="result-percentile" style="background:${color}22;color:${color};margin:10px auto;display:inline-block">${_t('percentile_prefix','Better than')} ${p}% ${_t('percentile_suffix','of people')}</div>`}
  </div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">${_t('lbl_correct','Correct')}</div><div class="b-val" style="color:var(--success)">${raw}</div><div class="b-sub">${_t('rt_of','of')} ${N_ITEMS}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('rot_small_turn','Small turns')}</div><div class="b-val">${hit(near)}/${near.length}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('rot_big_turn','Large turns')}</div><div class="b-val">${hit(far)}/${far.length}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${floored?'—':p}</div></div>
  </div>
  <p style="font-size:.75rem;color:var(--text-3);margin-top:16px;text-align:center;line-height:1.6">
    ${_t('rot_note','Scores are corrected for guessing. This is a short screening task, not a standardised spatial ability battery, and it has not been normed on a representative sample.')}
    ${answered<N_ITEMS?' '+_t('rot_unanswered','You left {n} unanswered; these count as incorrect.').replace('{n}',N_ITEMS-answered):''}
  </p>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="RotTest.copy()">📋 ${_t('share_copy','Copy Result')}</button>
    <button class="share-btn" onclick="RotTest.tweet()">𝕏 ${_t('share_tweet','Share on X')}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="RotTest.reset()">${_t('btn_try_again','↺ Try Again')}</button></div>`;
  document.getElementById('rot-results').classList.add('show');
  window._rotResult={raw,p,text,floored};
  sendCalibration(raw);
}

// Same anonymous item-level capture as the IQ test - see functions/api/response.js
function sendCalibration(raw){
  try{
    if(!ITEMS.length) return;
    const items=ITEMS.map((it,i)=>({
      p:i+1,
      sig:'rot:d'+it.disparity+'|cells'+it.cells,
      d:it.difficulty,
      ok:answers[i]===it.ans?1:0,
      ms:times[i]||0
    }));
    fetch('/api/response',{method:'POST',keepalive:true,
      headers:{'content-type':'application/json'},
      body:JSON.stringify({v:1,test:'rotation',lang:(window.I18n&&window.I18n.lang)||'en',
                           n:ITEMS.length,raw:raw,secs:elapsed,items})}).catch(()=>{});
  }catch(e){}
}

window.RotTest={
  start(){
    if(!window.RotationGen){ console.error('RotationGen missing'); return; }
    const seed=(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0;
    let t=window.RotationGen.generateTest(seed,N_ITEMS);
    for(let i=0;!t&&i<20;i++) t=window.RotationGen.generateTest((seed+i+1)>>>0,N_ITEMS);
    if(!t){ console.error('could not generate a test'); return; }
    ITEMS=t; current=0; answers={}; times={}; elapsed=0; phase='running';
    document.getElementById('rot-results')?.classList.remove('show');
    renderQ();
    startTimer();
  },
  pick(idx){
    if(phase!=='running') return;
    // already answered - ignore double clicks
    if(answers[current]!==undefined) return;
    const it=ITEMS[current];
    answers[current]=idx;
    times[current]=Math.max(0,Date.now()-shownAt);
    document.querySelectorAll('.pattern-choice').forEach((el,i)=>{
      if(i===it.ans) el.style.cssText+=';border-color:var(--success);background:rgba(16,185,129,.15)';
      else if(i===idx) el.style.cssText+=';border-color:var(--danger);background:rgba(239,68,68,.1)';
    });
    setTimeout(()=>{
      current++;
      if(current>=ITEMS.length) finish();
      else renderQ();
    },360);
  },
  reset(){clearInterval(timer);phase='idle';renderShell();},
  copy(){
    const r=window._rotResult;if(!r)return;
    const t=window.shareText('rot_result_label', r.raw+'/'+N_ITEMS, r.text, r.p);
    navigator.clipboard?.writeText(t).then(()=>{
      const b=document.getElementById('share-copy');
      if(b){b.textContent='✓ '+_t('lbl_copied','Copied!');setTimeout(()=>b.textContent='📋 '+_t('share_copy','Copy Result'),2000);}
    });
  },
  tweet(){
    const r=window._rotResult;if(!r)return;
    const t=window.shareText('rot_result_label', r.raw+'/'+N_ITEMS, r.text, r.p);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');
  },
  _debug(){ return {ITEMS,answers}; }
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

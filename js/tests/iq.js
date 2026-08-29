/* CoreSkillAI — IQ Test
 *
 * 36 procedurally generated matrix-reasoning items, 6 options each, 30 minutes.
 * Items come from js/tests/matrixgen.js; see that file for why the previous
 * hand-typed version had to be replaced (skewed answer key + arithmetic items
 * masquerading as fluid reasoning).
 *
 * Scoring is deliberately less flattering than it used to be. The old table
 * awarded IQ 145 for a perfect score and IQ 81 for random guessing, off a norm
 * table that was invented. This version corrects for guessing, states a
 * confidence interval, and caps the reportable range at what a 36-item screener
 * can actually resolve.
 */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}

const N_ITEMS   = 36;
const N_OPTIONS = 6;
const TIME_LIMIT = 30*60;

let ITEMS=[], current=0, answers={}, phase='idle', timer=null, elapsed=0, seed=0;
let shownAt=0, times={};

// ── Scoring ───────────────────────────────────────────────────────────────
// Correction for guessing is the standard formula: with k options, a taker who
// knows nothing still gets roughly n/k right, so subtract that expectation
// before treating the score as evidence of ability.
//   adjusted = (raw - n/k) / (1 - 1/k)
function correctForGuessing(raw){
  const chance = N_ITEMS / N_OPTIONS;
  return Math.max(0, (raw - chance) / (1 - 1/N_OPTIONS));
}

// Ability -> IQ. The honest position: we have no standardisation sample, so this
// maps the guessing-corrected proportion onto a normal scale under a stated
// assumption rather than pretending to be a norm table. It is deliberately
// conservative at both ends - a 36-item screener cannot resolve giftedness, and
// claiming otherwise is how online tests lose their credibility.
function scoreToIQ(raw){
  const adj = correctForGuessing(raw);
  const p   = adj / N_ITEMS;                       // 0..1 proportion of items mastered
  // Map proportion to z with a logistic link centred so that mastering ~55% of
  // a difficulty-ordered set sits at the population mean.
  const eps = 0.012;
  const q   = Math.min(1-eps, Math.max(eps, p));
  const z   = Math.log(q/(1-q)) / 1.75 - 0.05;
  // Capped at 135 on purpose. A 36-item screener cannot resolve giftedness -
  // above about +2 SD you need many more items at the top of the difficulty
  // range to separate people at all. Every site handing out 145s off a short
  // free test is selling flattery, and it is why nobody trusts online IQ scores.
  return Math.max(60, Math.min(135, Math.round(100 + 15*z)));
}

// At or near chance the test has measured nothing, and printing "IQ 66" for
// someone who guessed or ran out of time would be a fabrication rather than a
// low score. Say so instead.
function isBelowFloor(raw){ return raw <= N_ITEMS/N_OPTIONS + 1; }

// Standard error of measurement: SEM = SD * sqrt(1 - reliability).
// Matrix tests of this length typically land near alpha = .85, which gives
// SEM ≈ 15 * sqrt(.15) ≈ 5.8, so a 95% interval is roughly ±11 points. Showing
// that band is the single biggest honesty difference between this test and the
// competition, all of whom report a bare number they cannot justify.
const SEM = 5.8;
function confInterval(iq){
  const half = Math.round(1.96*SEM);
  return [Math.max(55, iq-half), Math.min(145, iq+half)];
}

function iqPct(iq){
  const z=(iq-100)/15;
  const a=[0.319381530,-0.356563782,1.781477937,-1.821255978,1.330274429];
  const t2=1/(1+0.2316419*Math.abs(z));let poly=0,tp=t2;a.forEach(c=>{poly+=c*tp;tp*=t2;});
  const d=0.3989423*Math.exp(-z*z/2)*poly;
  const p=(z>=0?1-d:d)*100;
  return Math.max(1,Math.min(99,Math.round(p)));
}
function iqLabel(iq){
  if(iq>=130) return{text:_t('iq_gifted','Highly Gifted'),color:'#6366f1',category:_t('iq_gifted','Highly Gifted')};
  if(iq>=120) return{text:_t('iq_superior','Superior Intelligence'),color:'#8b5cf6',category:_t('iq_superior','Superior Intelligence')};
  if(iq>=110) return{text:_t('iq_high_avg','High Average'),color:'#10b981',category:_t('iq_high_avg','High Average')};
  if(iq>=90)  return{text:_t('iq_average','Average Intelligence'),color:'#06b6d4',category:_t('iq_average','Average Intelligence')};
  if(iq>=80)  return{text:_t('iq_low_avg','Low Average'),color:'#f59e0b',category:_t('iq_low_avg','Low Average')};
  return{text:_t('iq_below_avg','Below Average'),color:'#ef4444',category:_t('iq_below_avg','Below Average')};
}

// ── Rendering ─────────────────────────────────────────────────────────────
function renderShell(){
  const root=document.getElementById('test-root');
  if(!root) return;
  root.innerHTML=`
  <div class="instruction-card">
    <h3>${_t('iq_how_title','How This IQ Test Works')}</h3>
    <ul>
      <li>${_t('iq_how1','36 visual matrix puzzles. Each one shows a 3×3 grid with the last cell missing — work out the rule and pick the piece that completes it.')}</li>
      <li>${_t('iq_how2','30 minute time limit. Items get harder as you go.')}</li>
      <li>${_t('iq_how3','No words, no arithmetic, no cultural knowledge. The same test works in every language.')}</li>
      <li>${_t('iq_how4','Every attempt generates fresh puzzles, so the answers cannot be looked up.')}</li>
    </ul>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
    <div class="science-card" style="text-align:center;padding:16px">
      <div style="font-size:1.6rem">🔷</div>
      <div style="font-size:.8rem;font-weight:700;margin-top:6px">${_t('iq_f_items','Items')}</div>
      <div style="font-size:.75rem;color:var(--text-3)">${_t('iq_qcount',"{n} questions").replace('{n}',N_ITEMS)}</div>
    </div>
    <div class="science-card" style="text-align:center;padding:16px">
      <div style="font-size:1.6rem">🌍</div>
      <div style="font-size:.8rem;font-weight:700;margin-top:6px">${_t('iq_f_fair','Culture-fair')}</div>
      <div style="font-size:.75rem;color:var(--text-3)">${_t('iq_f_fair_sub','Non-verbal')}</div>
    </div>
    <div class="science-card" style="text-align:center;padding:16px">
      <div style="font-size:1.6rem">📐</div>
      <div style="font-size:.8rem;font-weight:700;margin-top:6px">${_t('iq_f_method','Method')}</div>
      <div style="font-size:.75rem;color:var(--text-3)">${_t('iq_f_method_sub','Matrix reasoning')}</div>
    </div>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🧠 ${_t('iq_title','IQ Test')}</span>
      <span class="badge badge-red">⏱ 30 <span data-i18n="card_min">min</span></span>
    </div>
    <div class="test-ui-body" id="iq-body">
      <p style="color:var(--text-2);text-align:center;max-width:380px">${_t('iq_desc','36 non-verbal matrix puzzles measuring fluid reasoning. Results in under 30 minutes.')}</p>
      <button class="btn btn-primary btn-lg" onclick="IQTest.start()">${_t('iq_start','Start IQ Test →')}</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="iq-prog" style="width:0%"></div></div>
    </div>
  </div>
  <div class="results-panel" id="iq-results"></div>`;
}

function renderQ(){
  const it=ITEMS[current];
  shownAt=Date.now();
  const prog=document.getElementById('iq-prog');
  if(prog) prog.style.width=`${(current/ITEMS.length)*100}%`;
  const secs=Math.max(0,TIME_LIMIT-elapsed);
  const mm=String(Math.floor(secs/60)).padStart(2,'0');
  const ss=String(secs%60).padStart(2,'0');

  const cells=[];
  for(let i=0;i<9;i++){
    cells.push(i===8
      ? `<div class="pattern-cell missing" style="font-size:1.5rem;color:var(--primary);font-weight:800">?</div>`
      : `<div class="pattern-cell">${window.MatrixGen.cellSvg(it.cells[i],62)}</div>`);
  }
  const choices=it.choices.map((c,i)=>
    `<div class="pattern-choice" onclick="IQTest.pick(${i})" data-i="${i}">${window.MatrixGen.cellSvg(c,54)}</div>`).join('');

  document.getElementById('iq-body').innerHTML=`
    <div style="display:flex;justify-content:space-between;width:100%;max-width:440px;font-size:.82rem;color:var(--text-3)">
      <span>🔷 ${_t('iq_q_matrix','Visual Pattern')}</span>
      <span>${current+1}/${ITEMS.length}</span>
      <span class="iq-timer" style="font-weight:700;color:${secs<180?'var(--danger)':'var(--text-2)'}">⏱ ${mm}:${ss}</span>
    </div>
    <div class="pattern-grid" style="width:230px;height:230px">${cells.join('')}</div>
    <div class="pattern-choices" style="max-width:380px">${choices}</div>`;
}

function startTimer(){
  timer=setInterval(()=>{
    elapsed++;
    if(elapsed>=TIME_LIMIT){ clearInterval(timer); finishTest(); return; }
    const secs=TIME_LIMIT-elapsed;
    const mm=String(Math.floor(secs/60)).padStart(2,'0');
    const ss=String(secs%60).padStart(2,'0');
    const el=document.querySelector('#iq-body .iq-timer');
    if(el) el.textContent=`⏱ ${mm}:${ss}`;
  },1000);
}

function finishTest(){
  clearInterval(timer);
  phase='done';

  const raw=ITEMS.filter((it,i)=>answers[i]===it.ans).length;
  const floored=isBelowFloor(raw);
  const iq=scoreToIQ(raw);
  const [lo,hi]=confInterval(iq);
  const p=iqPct(iq);
  const {text,color,category}=iqLabel(iq);
  const headline = floored ? '—' : String(iq);

  // Difficulty tertiles let the taker see WHERE they ran out of road, which is
  // more informative than a single number and is not something the competition
  // offers on a free test.
  const third=Math.ceil(ITEMS.length/3);
  const band=k=>{
    const slice=ITEMS.slice(k*third,(k+1)*third);
    const right=slice.filter((it,i)=>answers[k*third+i]===it.ans).length;
    return [right,slice.length];
  };
  const bands=[
    [_t('iq_band_easy','Easier items'),   band(0)],
    [_t('iq_band_mid','Moderate items'),  band(1)],
    [_t('iq_band_hard','Hardest items'),  band(2)],
  ];
  const answered=Object.keys(answers).length;

  document.getElementById('iq-results').innerHTML=`
  <div style="text-align:center;padding:8px 0 20px">
    <div style="font-size:.8rem;font-weight:600;color:var(--text-3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">${_t('iq_result_label','Your IQ Score')}</div>
    <div style="font-size:4rem;font-weight:900;color:${color};letter-spacing:-.03em;line-height:1">${headline}</div>
    ${floored
      ? `<p style="font-size:.85rem;color:var(--text-2);margin:12px auto 0;max-width:420px;line-height:1.6">${_t('iq_floor','Your score is at the level chance alone produces, so this test cannot estimate a figure for you. That normally means the time ran out or the items were answered at random rather than that your reasoning is low.')}</p>`
      : `<div style="font-size:.85rem;color:var(--text-2);margin-top:8px">${_t('iq_ci','95% confidence interval')}: <strong>${lo} – ${hi}</strong></div>
    <div style="font-size:1rem;font-weight:700;color:var(--text);margin-top:6px">${text}</div>
    <div class="result-percentile" style="background:${color}22;color:${color};margin:10px auto;display:inline-block">${_t('percentile_prefix','Higher than')} ${p}% ${_t('percentile_suffix','of the population')}</div>`}
  </div>
  <div class="bell-curve-wrap" style="margin:0 0 24px">
    <canvas id="iq-bell" style="width:100%;display:block"></canvas>
  </div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">${_t('iq_title','IQ')}</div><div class="b-val" style="color:${color}">${headline}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('iq_category','Category')}</div><div class="b-val" style="font-size:.85rem">${floored?"—":category}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${floored?"—":p}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('lbl_score',"Score")}</div><div class="b-val">${raw}/${N_ITEMS}</div></div>
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-top:20px">
    <div style="font-size:.82rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">${_t('iq_breakdown','Score Breakdown')}</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${bands.map(([lbl,[right,total]])=>`
      <div>
        <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:4px"><span>${lbl}</span><span style="font-weight:700">${right}/${total}</span></div>
        <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${total?(right/total)*100:0}%;background:var(--primary)"></div></div>
      </div>`).join('')}
    </div>
    <p style="font-size:.75rem;color:var(--text-3);margin-top:14px;line-height:1.6">${_t('iq_guess_note','Your raw score is adjusted for guessing before it becomes an IQ estimate — with six options, chance alone earns about {n} correct.').replace('{n}',Math.round(N_ITEMS/N_OPTIONS))}</p>
    ${answered<N_ITEMS?`<p style="font-size:.75rem;color:var(--text-3);margin-top:8px;line-height:1.6">${_t('iq_unanswered','You left {n} items unanswered. Unanswered items count as incorrect, so your estimate is conservative.').replace('{n}',N_ITEMS-answered)}</p>`:''}
  </div>
  <p style="font-size:.75rem;color:var(--text-3);margin-top:16px;text-align:center;line-height:1.6">
    <strong>⚠️</strong> ${_t('iq_disclaimer','This is a brief online screening test, not a clinical IQ assessment, and it has not been standardised on a representative sample. A supervised test such as the WAIS is the only way to obtain a diagnostic score. Treat the interval above, not the single number, as the result.')}
  </p>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="IQTest.copy()">📋 ${_t('share_copy','Copy Result')}</button>
    <button class="share-btn" onclick="IQTest.tweet()">𝕏 ${_t('share_tweet','Share on X')}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="IQTest.reset()">${_t('iq_retake','↺ Retake Test')}</button></div>`;

  document.getElementById('iq-results').classList.add('show');
  window._iqResult={iq,p,text,score:raw,lo,hi,floored};

  if(!floored) requestAnimationFrame(()=>drawIQBell(iq,color,lo,hi));
  sendCalibration(raw);
  setTimeout(()=>{
    document.querySelectorAll('.trait-bar-fill').forEach(b=>{
      const w=b.style.width; b.style.width='0';
      setTimeout(()=>{b.style.transition='width 1s cubic-bezier(.4,0,.2,1)';b.style.width=w;},50);
    });
  },100);
}

// ── Calibration data ──────────────────────────────────────────────────────
// Sent once, after the result is already rendered, so it can never delay or
// break what the visitor sees. This is what turns the test from "well built"
// into "measured": item difficulty and discrimination cannot be derived from
// theory, only from responses. Nothing identifying is included - see
// functions/api/response.js for exactly what is and is not sent.
function sendCalibration(raw){
  try{
    if(!ITEMS.length) return;
    const items=ITEMS.map((it,i)=>({
      p:i+1,
      sig:['shape','count','fill','rot'].map(a=>a+':'+it.rules[a]).join('|'),
      d:it.difficulty,
      ok:answers[i]===it.ans?1:0,
      ms:times[i]||0
    }));
    const payload={v:1,test:'iq',lang:(window.I18n&&window.I18n.lang)||'en',
                   n:ITEMS.length,raw:raw,secs:elapsed,items:items};
    fetch('/api/response',{method:'POST',keepalive:true,
      headers:{'content-type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  }catch(e){/* never let telemetry affect the result screen */}
}

function drawIQBell(iq,color,lo,hi){
  const canvas=document.getElementById('iq-bell');
  if(!canvas||!canvas.getContext) return;
  const dpr=window.devicePixelRatio||1;
  canvas.width=canvas.offsetWidth*dpr;
  canvas.height=(canvas.offsetWidth*0.42)*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  const W=canvas.width/dpr, H=canvas.height/dpr;
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const gridC=isDark?'rgba(255,255,255,.07)':'rgba(0,0,0,.06)';
  const textC=isDark?'rgba(255,255,255,.45)':'rgba(0,0,0,.4)';
  ctx.clearRect(0,0,W,H);
  const margin=28, bh=H*0.72, iqMin=55, iqMax=145;
  const toX=v=>margin+(v-iqMin)/(iqMax-iqMin)*(W-2*margin);
  const gauss=x=>{const z=(x-100)/15;return Math.exp(-z*z/2)/(15*Math.sqrt(2*Math.PI));};
  const maxG=gauss(100);
  const toY=v=>H-14-(v/maxG)*bh;

  // Shade the confidence interval, not a single point. The band IS the result.
  ctx.fillStyle=color+'2e';
  ctx.beginPath(); ctx.moveTo(toX(lo),H-14);
  for(let x=lo;x<=hi;x+=.5) ctx.lineTo(toX(x),toY(gauss(x)));
  ctx.lineTo(toX(hi),H-14); ctx.closePath(); ctx.fill();

  ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=2.5;
  for(let x=iqMin;x<=iqMax;x+=.5){const y=toY(gauss(x)); x===iqMin?ctx.moveTo(toX(x),y):ctx.lineTo(toX(x),y);}
  ctx.stroke();
  ctx.beginPath(); ctx.strokeStyle=gridC; ctx.lineWidth=1;
  ctx.moveTo(margin,H-14); ctx.lineTo(W-margin,H-14); ctx.stroke();

  if(iq>=iqMin&&iq<=iqMax){
    const mx=toX(iq);
    ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=2; ctx.setLineDash([4,3]);
    ctx.moveTo(mx,toY(gauss(iq))); ctx.lineTo(mx,H-14); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.fillStyle=color; ctx.arc(mx,H-14,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=color; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(`${lo}–${hi}`,mx,toY(gauss(iq))-10);
  }
  ctx.fillStyle=textC; ctx.font='10px Inter,sans-serif'; ctx.textAlign='center';
  [70,85,100,115,130,145].forEach(v=>{
    ctx.beginPath(); ctx.strokeStyle=gridC; ctx.lineWidth=1;
    ctx.moveTo(toX(v),H-14); ctx.lineTo(toX(v),H-22); ctx.stroke();
    ctx.fillText(v===145?'145+':String(v), toX(v), H-3);
  });
}

window.IQTest={
  start(){
    if(!window.MatrixGen){ console.error('MatrixGen missing'); return; }
    // A fresh seed per attempt: the item set differs every time, so no answer
    // key can be published and a retake is a genuine retest.
    seed=(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0;
    let t=window.MatrixGen.generateTest(seed,N_ITEMS);
    for(let i=0;!t&&i<20;i++) t=window.MatrixGen.generateTest((seed+i+1)>>>0,N_ITEMS);
    if(!t){ console.error('could not generate a test'); return; }
    ITEMS=t; current=0; answers={}; times={}; elapsed=0; phase='running';
    document.getElementById('iq-results')?.classList.remove('show');
    renderQ();
    startTimer();
  },
  pick(idx){
    if(phase!=='running') return;
    // already answered - ignore double clicks. pick() used to be re-entrant, so a
    // fast second click skipped a question AND scored it, inflating the result.
    // PUSH-coreskillai.cmd greps for this exact phrase to refuse pushing a build
    // without the guard, so do not reword it.
    if(answers[current]!==undefined) return;
    const it=ITEMS[current];
    answers[current]=idx;
    times[current]=Math.max(0, Date.now()-shownAt);
    document.querySelectorAll('.pattern-choice').forEach((el,i)=>{
      if(i===it.ans) el.style.cssText+=';border-color:var(--success);background:rgba(16,185,129,.15)';
      else if(i===idx) el.style.cssText+=';border-color:var(--danger);background:rgba(239,68,68,.1)';
    });
    setTimeout(()=>{
      current++;
      if(current>=ITEMS.length) finishTest();
      else renderQ();
    },380);
  },
  reset(){clearInterval(timer);phase='idle';renderShell();},
  copy(){
    const r=window._iqResult;if(!r)return;
    const t=window.shareText('iq_result_label', r.iq, r.text, r.p);
    navigator.clipboard?.writeText(t).then(()=>{
      const b=document.getElementById('share-copy');
      if(b){b.textContent='✓ '+_t('lbl_copied','Copied!');setTimeout(()=>b.textContent='📋 '+_t('share_copy','Copy Result'),2000);}
    });
  },
  tweet(){
    const r=window._iqResult;if(!r)return;
    const t=window.shareText('iq_result_label', r.iq, r.text, r.p);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');
  },
  _debug(){ return {ITEMS,answers,scoreToIQ,confInterval,correctForGuessing}; }
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

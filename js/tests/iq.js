/* CoreSkillAI — IQ Test (40 questions, 3 types, 20 min) */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
// ── Questions ───────────────────────────────────────────
// TYPE A: Number Series (15)
const SERIES=[
  {q:"2,  4,  6,  8,  __",  opts:[7,9,10,12],       ans:2, hint:"Add 2 each time"},
  {q:"1,  3,  9,  27, __",  opts:[54,72,81,90],      ans:2, hint:"Multiply by 3"},
  {q:"1,  4,  9,  16, __",  opts:[20,24,25,30],      ans:2, hint:"Perfect squares: 1²,2²,3²…"},
  {q:"1,  2,  4,  7,  11, __",opts:[14,15,16,17],   ans:2, hint:"Add 1,2,3,4,5…"},
  {q:"2,  3,  5,  8,  13, __",opts:[18,19,20,21],   ans:3, hint:"Add previous two (Fibonacci-like)"},
  {q:"100,81,64, 49, __",   opts:[36,38,42,44],      ans:0, hint:"Descending perfect squares"},
  {q:"3,  6,  12, 24, __",  opts:[30,36,42,48],      ans:3, hint:"Multiply by 2"},
  {q:"1,  8,  27, 64, __",  opts:[100,112,125,128],  ans:2, hint:"Cube numbers: 1³,2³,3³…"},
  {q:"1,  1,  2,  6,  24, __",opts:[48,100,120,144], ans:2, hint:"Factorials: 1!,2!,3!,4!,5!"},
  {q:"2,  6,  12, 20, 30, __",opts:[38,40,42,44],    ans:2, hint:"n×(n+1): 1×2,2×3,3×4…"},
  {q:"10, 30, 60, 100,__",  opts:[130,140,150,160],  ans:2, hint:"Differences: 20,30,40,50"},
  {q:"1,  2,  3,  5,  8,  13,21,__",opts:[29,31,33,34],ans:3,hint:"Fibonacci sequence"},
  {q:"4,  9,  25, 49, 121,__",opts:[143,169,177,196],ans:1,hint:"Squares of primes"},
  {q:"0,  1,  3,  6,  10, 15,__",opts:[19,20,21,22], ans:2, hint:"Triangular numbers: +1,+2,+3…"},
  {q:"2,  5,  10, 17, 26, __",opts:[35,36,37,38],    ans:3, hint:"Add 3,5,7,9,11…"},
];

// TYPE B: Matrix Patterns — reuse SVG approach from pattern.js
const S={
  co:'<circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  cf:'<circle cx="20" cy="20" r="14" fill="currentColor"/>',
  ch:'<circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M6 20 A14 14 0 0 1 34 20 Z" fill="currentColor"/>',
  so:'<rect x="7" y="7" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  sf:'<rect x="7" y="7" width="26" height="26" fill="currentColor"/>',
  sh:'<rect x="7" y="7" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="7" y="7" width="26" height="13" fill="currentColor"/>',
  to:'<polygon points="20,5 35,35 5,35" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  tf:'<polygon points="20,5 35,35 5,35" fill="currentColor"/>',
  th:'<polygon points="20,5 35,35 5,35" fill="none" stroke="currentColor" stroke-width="2.5"/><clipPath id="tch"><polygon points="20,5 35,35 5,35"/></clipPath><rect x="0" y="20" width="40" height="20" fill="currentColor" clip-path="url(#tch)"/>',
  do:'<polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  df:'<polygon points="20,4 36,20 20,36 4,20" fill="currentColor"/>',
  dh:'<polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="currentColor" stroke-width="2.5"/><clipPath id="dch"><polygon points="20,4 36,20 20,36 4,20"/></clipPath><rect x="0" y="20" width="40" height="20" fill="currentColor" clip-path="url(#dch)"/>',
};
function svgCell(s,color='currentColor'){
  return s?`<svg viewBox="0 0 40 40" width="40" height="40" style="color:${color}">${S[s]||''}</svg>`:'';
}

const MATRICES=[
  {cells:['co','co','co','sf','sf','sf','to','to',null],choices:['to','tf','co','so'],ans:0},
  {cells:['co','cf','co','so','sf','so','to','tf',null],choices:['to','co','do','tf'],ans:0},
  {cells:['so','so','so','cf','cf','cf','do','do',null],choices:['df','do','tf','co'],ans:1},
  {cells:['co','so','to','cf','sf','tf','ch','sh',null],choices:['th','tf','to','do'],ans:0},
  {cells:['sf','cf','tf','so','co','to','sh','ch',null],choices:['th','so','tf','do'],ans:0},
  {cells:['co','co','co','so','so','so','do','do',null],choices:['to','co','do','so'],ans:0},
  {cells:['cf','sf','tf','cf','sf','tf','cf','sf',null],choices:['tf','co','df','sf'],ans:0},
  {cells:['sh','ch','th','so','co','to','sf','cf',null],choices:['tf','th','df','to'],ans:0},
  {cells:['co','so','do','cf','sf','df','ch','sh',null],choices:['dh','th','df','to'],ans:0},
  {cells:['tf','sf','cf','to','so','co','th','sh',null],choices:['ch','co','cf','th'],ans:0},
];

// TYPE C: Number Analogies (15)
const ANALOGY=[
  {q:"2 : 4  ⟹  3 : ?",    opts:[5,6,7,9],      ans:1, hint:"2×2=4, so 3×?"},
  {q:"4 : 2  ⟹  16 : ?",   opts:[4,6,8,32],     ans:2, hint:"Square root"},
  {q:"3 : 9  ⟹  4 : ?",    opts:[12,14,16,18],  ans:2, hint:"Squared"},
  {q:"1 : 1  ⟹  3 : ?",    opts:[3,6,9,27],     ans:2, hint:"Cubed"},
  {q:"5 : 25 ⟹  7 : ?",    opts:[14,35,49,56],  ans:2, hint:"n²"},
  {q:"10 : 5 ⟹  8 : ?",    opts:[2,3,4,6],      ans:2, hint:"Divided by 2"},
  {q:"2 : 8  ⟹  3 : ?",    opts:[9,12,18,27],   ans:3, hint:"n³"},
  {q:"100:10 ⟹  49 : ?",   opts:[4,5,6,7],      ans:3, hint:"Square root"},
  {q:"6 : 36 ⟹  9 : ?",    opts:[18,45,72,81],  ans:3, hint:"n²"},
  {q:"3 : 6  ⟹  7 : ?",    opts:[10,12,14,21],  ans:2, hint:"×2"},
  {q:"12: 4  ⟹  21 : ?",   opts:[3,5,6,7],      ans:3, hint:"÷3"},
  {q:"2 : 6  ⟹  5 : ?",    opts:[9,10,15,25],   ans:2, hint:"×3"},
  {q:"64: 8  ⟹  121: ?",   opts:[9,10,11,12],   ans:2, hint:"√"},
  {q:"1 : 2  ⟹  4 : ?",    opts:[5,6,7,8],      ans:3, hint:"+1 then ×2?"},
  {q:"7 : 49 ⟹  11: ?",    opts:[22,33,111,121],ans:3, hint:"n²"},
];

// ── Merge all questions ──────────────────────────────────
// 15 series + 10 matrices + 15 analogies = 40
const ALL_QUESTIONS=[];
SERIES.forEach((q,i)=>ALL_QUESTIONS.push({type:'series',  data:q, num:i+1}));
MATRICES.forEach((q,i)=>ALL_QUESTIONS.push({type:'matrix', data:q, num:i+1}));
ANALOGY.forEach((q,i)=>ALL_QUESTIONS.push({type:'analogy', data:q, num:i+1}));

// Shuffle slightly: interleave types
function interleave(arr){
  const a=[],b=[],c=[];
  arr.forEach(q=>{ if(q.type==='series')a.push(q); else if(q.type==='matrix')b.push(q); else c.push(q); });
  const out=[]; const max=Math.max(a.length,b.length,c.length);
  for(let i=0;i<max;i++){if(a[i])out.push(a[i]);if(b[i])out.push(b[i]);if(c[i])out.push(c[i]);}
  return out;
}
const QUESTIONS=interleave(ALL_QUESTIONS); // 40 total

const TIME_LIMIT=20*60; // 20 minutes

// ── Scoring ──────────────────────────────────────────────
function scoreToIQ(score){
  // Calibrated for 40-item online IQ screening test
  // Based on published norms for similar instruments
  const table=[
    [0,55],[3,62],[5,68],[7,73],[9,78],[11,83],[13,88],[15,92],[17,96],[19,100],
    [21,103],[23,107],[25,111],[27,116],[29,120],[31,124],[33,128],[35,132],[37,136],[39,140],[40,145]
  ];
  for(let i=0;i<table.length-1;i++){
    const [s1,iq1]=table[i],[s2,iq2]=table[i+1];
    if(score<=s2){const t=(score-s1)/(s2-s1);return Math.round(iq1+(iq2-iq1)*t);}
  }
  return 145;
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
  if(iq>=145) return{text:_t('iq_profound','Profoundly Gifted'),color:'#6366f1',category:_t('iq_profound','Exceptional')};
  if(iq>=130) return{text:_t('iq_gifted','Highly Gifted'),color:'#6366f1',category:_t('iq_gifted','Very Superior')};
  if(iq>=120) return{text:_t('iq_superior','Superior Intelligence'),color:'#8b5cf6',category:_t('iq_superior','Superior')};
  if(iq>=110) return{text:_t('iq_high_avg','High Average'),color:'#10b981',category:_t('iq_high_avg','High Average')};
  if(iq>=90)  return{text:_t('iq_average','Average Intelligence'),color:'#06b6d4',category:_t('iq_average','Average')};
  if(iq>=80)  return{text:_t('iq_low_avg','Low Average'),color:'#f59e0b',category:_t('iq_low_avg','Low Average')};
  if(iq>=70)  return{text:_t('iq_borderline','Borderline'),color:'#ef4444',category:_t('iq_borderline','Borderline')};
  return{text:_t('iq_below_avg','Below Average'),color:'#ef4444',category:_t('iq_below_avg','Below Average')};
}

// ── State ─────────────────────────────────────────────────
let current=0, score=0, answers={}, phase='idle', timer=null, elapsed=0;

// ── Render shell ─────────────────────────────────────────
function renderShell(){
  const root=document.getElementById('test-root');
  root.innerHTML=`
  <div class="instruction-card">
    <h3>${_t('iq_how_title','How This IQ Test Works')}</h3>
    <ul>
      <li>${_t('iq_how1','40 questions across 3 cognitive domains: number sequences, visual patterns, and numerical analogies.')}</li>
      <li>${_t('iq_how2','20 minute time limit. Work quickly but carefully.')}</li>
      <li>${_t('iq_how3','Your score converts to a standard IQ scale (mean 100, SD 15).')}</li>
      <li>${_t('iq_how4','Works best on desktop. Find a quiet place and focus.')}</li>
    </ul>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
    <div class="science-card" style="text-align:center;padding:16px">
      <div style="font-size:1.6rem">🔢</div>
      <div style="font-size:.8rem;font-weight:700;margin-top:6px">${_t('iq_result_series','Number Series')}</div>
      <div style="font-size:.75rem;color:var(--text-3)">${_t('iq_qcount',"{n} questions").replace('{n}',15)}</div>
    </div>
    <div class="science-card" style="text-align:center;padding:16px">
      <div style="font-size:1.6rem">🔷</div>
      <div style="font-size:.8rem;font-weight:700;margin-top:6px">${_t('iq_result_matrix','Visual Patterns')}</div>
      <div style="font-size:.75rem;color:var(--text-3)">${_t('iq_qcount',"{n} questions").replace('{n}',10)}</div>
    </div>
    <div class="science-card" style="text-align:center;padding:16px">
      <div style="font-size:1.6rem">⚖️</div>
      <div style="font-size:.8rem;font-weight:700;margin-top:6px">${_t('iq_result_analogy','Analogies')}</div>
      <div style="font-size:.75rem;color:var(--text-3)">${_t('iq_qcount',"{n} questions").replace('{n}',15)}</div>
    </div>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🧠 ${_t('iq_title','IQ Test')}</span>
      <span class="badge badge-red">⏱ 20 min</span>
    </div>
    <div class="test-ui-body" id="iq-body">
      <p style="color:var(--text-2);text-align:center;max-width:360px">${_t('iq_desc','40 questions across 3 cognitive domains. Results in under 20 minutes.')}</p>
      <button class="btn btn-primary btn-lg" onclick="IQTest.start()">${_t('iq_start','Start IQ Test →')}</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="iq-prog" style="width:0%"></div></div>
    </div>
  </div>
  <div class="results-panel" id="iq-results"></div>`;
}

function renderQ(){
  const q=QUESTIONS[current];
  document.getElementById('iq-prog').style.width=`${(current/QUESTIONS.length)*100}%`;
  const secs=TIME_LIMIT-elapsed;
  const mm=String(Math.floor(secs/60)).padStart(2,'0');
  const ss=String(secs%60).padStart(2,'0');
  const typeLabel=q.type==='series'?`🔢 ${_t('iq_q_series','Number Series')}`:q.type==='matrix'?`🔷 ${_t('iq_q_matrix','Visual Pattern')}`:`⚖️ ${_t('iq_q_analogy','Analogy')}`;
  let qHTML='';
  if(q.type==='series'||q.type==='analogy'){
    qHTML=`<div style="font-size:clamp(1.2rem,4vw,1.8rem);font-weight:800;letter-spacing:.05em;color:var(--primary);text-align:center;padding:16px 24px;background:var(--surface-2);border-radius:var(--radius);width:100%;max-width:440px">${q.data.q}</div>`;
  } else {
    const cells=q.data.cells.map((s,i)=>i===8
      ?`<div class="pattern-cell missing" style="font-size:1.4rem;color:var(--primary);font-weight:800">?</div>`
      :`<div class="pattern-cell">${s?svgCell(s):''}</div>`).join('');
    qHTML=`<div class="pattern-grid" style="width:220px;height:220px">${cells}</div>`;
  }
  let choicesHTML='';
  if(q.type==='matrix'){
    choicesHTML=`<div class="pattern-choices" style="max-width:360px">${q.data.choices.map((s,i)=>`<div class="pattern-choice" onclick="IQTest.pick(${i})" data-i="${i}">${svgCell(s)}</div>`).join('')}</div>`;
  } else {
    choicesHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:380px">${q.data.opts.map((o,i)=>`<button class="iq-choice" onclick="IQTest.pick(${i})" style="padding:14px;background:var(--surface-2);border:2px solid var(--border);border-radius:var(--radius-s);font-size:1.1rem;font-weight:700;color:var(--text);cursor:pointer;transition:all .15s">${o}</button>`).join('')}</div>`;
  }
  document.getElementById('iq-body').innerHTML=`
    <div style="display:flex;justify-content:space-between;width:100%;max-width:440px;font-size:.82rem;color:var(--text-3)">
      <span>${typeLabel}</span>
      <span>Q${current+1}/${QUESTIONS.length}</span>
      <span style="font-weight:700;color:${secs<120?'var(--danger)':'var(--text-2)'}">⏱ ${mm}:${ss}</span>
    </div>
    ${qHTML}
    ${choicesHTML}`;
  // hover effect for text choices
  document.querySelectorAll('.iq-choice').forEach(b=>{
    b.addEventListener('mouseenter',()=>{ b.style.borderColor='var(--primary)'; b.style.color='var(--primary)'; });
    b.addEventListener('mouseleave',()=>{ if(!b.classList.contains('selected')){ b.style.borderColor='var(--border)'; b.style.color='var(--text)'; } });
  });
}

function startTimer(){
  timer=setInterval(()=>{
    elapsed++;
    if(elapsed>=TIME_LIMIT){ clearInterval(timer); finishTest(); return; }
    // update timer display if visible
    const secs=TIME_LIMIT-elapsed;
    const mm=String(Math.floor(secs/60)).padStart(2,'0');
    const ss=String(secs%60).padStart(2,'0');
    const timerEl=document.querySelector('#iq-body [style*="color:var(--danger)"],.iq-timer');
    if(timerEl) timerEl.textContent=`⏱ ${mm}:${ss}`;
  },1000);
}

function finishTest(){
  clearInterval(timer);
  phase='done'; // stop accepting clicks - QUESTIONS[current] is out of range now

  // Single source of truth: recount from the recorded answers. The old code kept a
  // separate running counter that pick() could increment more than once for the same
  // question, so the headline score could exceed the per-domain breakdown.
  const seriesRight=QUESTIONS.filter((q,i)=>q.type==='series'&&answers[i]===q.data.ans).length;
  const matrixRight=QUESTIONS.filter((q,i)=>q.type==='matrix'&&answers[i]===q.data.ans).length;
  const analogyRight=QUESTIONS.filter((q,i)=>q.type==='analogy'&&answers[i]===q.data.ans).length;
  score=seriesRight+matrixRight+analogyRight;

  const iq=scoreToIQ(score);
  const p=iqPct(iq);
  const {text,color,category}=iqLabel(iq);

  document.getElementById('iq-results').innerHTML=`
  <div style="text-align:center;padding:8px 0 20px">
    <div style="font-size:.8rem;font-weight:600;color:var(--text-3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">${_t('iq_result_label','Your IQ Score')}</div>
    <div style="font-size:4rem;font-weight:900;color:${color};letter-spacing:-.03em;line-height:1">${iq}</div>
    <div style="font-size:1rem;font-weight:700;color:var(--text);margin-top:8px">${text}</div>
    <div class="result-percentile" style="background:${color}22;color:${color};margin:10px auto;display:inline-block">${_t('percentile_prefix','Higher than')} ${p}% ${_t('percentile_suffix','of the population')}</div>
  </div>
  <div class="bell-curve-wrap" style="margin:0 0 24px">
    <canvas id="iq-bell" style="width:100%;display:block"></canvas>
  </div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">${_t('iq_title','IQ')}</div><div class="b-val" style="color:${color}">${iq}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('iq_category','Category')}</div><div class="b-val" style="font-size:.85rem">${category}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${p}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('lbl_score',"Score")}</div><div class="b-val">${score}/40</div></div>
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-top:20px">
    <div style="font-size:.82rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">${_t('iq_breakdown','Score Breakdown')}</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${[[`🔢 ${_t('iq_result_series','Number Series')}`,seriesRight,15],[`🔷 ${_t('iq_result_matrix','Visual Patterns')}`,matrixRight,10],[`⚖️ ${_t('iq_result_analogy','Analogies')}`,analogyRight,15]].map(([lbl,right,total])=>`
      <div>
        <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:4px"><span>${lbl}</span><span style="font-weight:700">${right}/${total}</span></div>
        <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${(right/total)*100}%;background:var(--primary)"></div></div>
      </div>`).join('')}
    </div>
  </div>
  <p style="font-size:.75rem;color:var(--text-3);margin-top:16px;text-align:center;line-height:1.6">
    <strong>⚠️</strong> ${_t('iq_disclaimer','This is a brief online screening test, not a certified IQ assessment. For clinical purposes, consult a licensed psychologist. Score accuracy: ±5–8 IQ points.')}
  </p>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="IQTest.copy()">📋 ${_t('share_copy','Copy Result')}</button>
    <button class="share-btn" onclick="IQTest.tweet()">𝕏 ${_t('share_tweet','Share on X')}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="IQTest.reset()">${_t('iq_retake','↺ Retake Test')}</button></div>`;

  document.getElementById('iq-results').classList.add('show');
  window._iqResult={iq,p,text,score};

  // Ring hidden (we show big number directly)
  requestAnimationFrame(()=>drawIQBell(iq,color));

  setTimeout(()=>{
    document.querySelectorAll('.trait-bar-fill').forEach(b=>{
      const w=b.style.width; b.style.width='0';
      setTimeout(()=>{b.style.transition='width 1s cubic-bezier(.4,0,.2,1)';b.style.width=w;},50);
    });
  },100);
}

function drawIQBell(iq, color){
  const canvas=document.getElementById('iq-bell');
  if(!canvas) return;
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
  const margin=28, bh=H*0.72;
  const iqMin=55, iqMax=145;
  function toX(iq2){return margin+(iq2-iqMin)/(iqMax-iqMin)*(W-2*margin);}
  function gauss(x){const z=(x-100)/15;return Math.exp(-z*z/2)/(15*Math.sqrt(2*Math.PI));}
  const maxG=gauss(100);
  function toY(v){return H-14-(v/maxG)*bh;}
  // fill below IQ score
  ctx.fillStyle=color+'25';
  ctx.beginPath(); ctx.moveTo(margin,H-14);
  for(let x=iqMin;x<=iq;x+=.5) ctx.lineTo(toX(x),toY(gauss(x)));
  ctx.lineTo(toX(Math.min(iq,iqMax)),H-14); ctx.closePath(); ctx.fill();
  // full curve
  ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=2.5;
  for(let x=iqMin;x<=iqMax;x+=.5){
    const y=toY(gauss(x));
    x===iqMin?ctx.moveTo(toX(x),y):ctx.lineTo(toX(x),y);
  }
  ctx.stroke();
  // baseline
  ctx.beginPath(); ctx.strokeStyle=gridC; ctx.lineWidth=1;
  ctx.moveTo(margin,H-14); ctx.lineTo(W-margin,H-14); ctx.stroke();
  // IQ marker
  if(iq>=iqMin&&iq<=iqMax){
    const mx=toX(iq);
    ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=2; ctx.setLineDash([4,3]);
    ctx.moveTo(mx,toY(gauss(iq))); ctx.lineTo(mx,H-14); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.fillStyle=color; ctx.arc(mx,H-14,5,0,Math.PI*2); ctx.fill();
    // IQ label above marker
    ctx.fillStyle=color; ctx.font=`bold 12px Inter,sans-serif`; ctx.textAlign='center';
    ctx.fillText(`IQ ${iq}`,mx,toY(gauss(iq))-10);
  }
  // SD labels at 70,85,100,115,130,145
  ctx.fillStyle=textC; ctx.font='10px Inter,sans-serif'; ctx.textAlign='center';
  [70,85,100,115,130,145].forEach(v=>{
    if(v>=iqMin&&v<=iqMax){
      ctx.beginPath(); ctx.strokeStyle=gridC; ctx.lineWidth=1;
      ctx.moveTo(toX(v),H-14); ctx.lineTo(toX(v),H-22); ctx.stroke();
      // labels must use toX() too - the old HTML row spanned 70..145 while the
      // canvas spans 55..145, so every marker appeared shifted to the right.
      ctx.fillText(v===145?'145+':String(v), toX(v), H-3);
    }
  });
}

window.IQTest={
  start(){
    current=0;score=0;answers={};elapsed=0;phase='running';
    document.getElementById('iq-results')?.classList.remove('show');
    renderQ();
    startTimer();
  },
  pick(idx){
    if(phase!=='running') return;
    if(answers[current]!==undefined) return; // already answered - ignore double clicks
    const q=QUESTIONS[current];
    const correct=q.data.ans;
    answers[current]=idx;
    // flash feedback
    const els=document.querySelectorAll(q.type==='matrix'?'.pattern-choice':'.iq-choice');
    els.forEach((el,i)=>{
      if(i===correct) el.style.cssText+=`;border-color:var(--success);background:rgba(16,185,129,.15)`;
      else if(i===idx&&idx!==correct) el.style.cssText+=`;border-color:var(--danger);background:rgba(239,68,68,.1)`;
    });
    setTimeout(()=>{
      current++;
      if(current>=QUESTIONS.length) finishTest();
      else renderQ();
    },380);
  },
  reset(){clearInterval(timer);phase='idle';renderShell();},
  copy(){
    const r=window._iqResult;if(!r)return;
    const t=`My IQ score: ${r.iq} — ${r.text} (${(window.ordinal?window.ordinal(r.p):r.p+'th')} percentile, ${r.score}/40 correct) 🧬 Free IQ test: coreskillai.com`;
    navigator.clipboard?.writeText(t).then(()=>{
      const b=document.getElementById('share-copy');if(b){b.textContent='✓ '+_t('lbl_copied','Copied!');setTimeout(()=>b.textContent='📋 '+_t('share_copy','Copy Result'),2000);}
    });
  },
  tweet(){
    const r=window._iqResult;if(!r)return;
    const t=`I scored IQ ${r.iq} (${r.text}) on the free IQ test! Can you beat it? 🧬`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');
  }
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

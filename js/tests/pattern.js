/* CoreSkillAI — Pattern Recognition Test (Matrix Reasoning) */
(function(){
// Each question: 8 cells shown (shapes as SVG strings) + 4 choices
// Shapes encoded: circle, square, triangle, diamond | sizes: s/m/l | fill: empty/half/full
const S={
  co:'<circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2"/>',
  cf:'<circle cx="20" cy="20" r="14" fill="currentColor"/>',
  ch:'<circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 20 A14 14 0 0 1 34 20 Z" fill="currentColor"/>',
  so:'<rect x="6" y="6" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"/>',
  sf:'<rect x="6" y="6" width="28" height="28" fill="currentColor"/>',
  sh:'<rect x="6" y="6" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="6" width="28" height="14" fill="currentColor"/>',
  to:'<polygon points="20,5 35,35 5,35" fill="none" stroke="currentColor" stroke-width="2"/>',
  tf:'<polygon points="20,5 35,35 5,35" fill="currentColor"/>',
  th:'<polygon points="20,5 35,35 5,35" fill="none" stroke="currentColor" stroke-width="2"/><clipPath id="tc"><polygon points="20,5 35,35 5,35"/></clipPath><rect x="0" y="20" width="40" height="20" fill="currentColor" clip-path="url(#tc)"/>',
  do:'<polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="currentColor" stroke-width="2"/>',
  df:'<polygon points="20,4 36,20 20,36 4,20" fill="currentColor"/>',
};
function cell(shape,color='var(--text)'){
  return `<svg viewBox="0 0 40 40" width="44" height="44" style="color:${color}">${S[shape]||S.co}</svg>`;
}

// 12 questions — grid cells + correct answer index
const QUESTIONS=[
  {cells:['co','co','co','sf','sf','sf','to','to',null],choices:['to','tf','co','so'],ans:0},
  {cells:['co','cf','co','so','sf','so','to','tf',null],choices:['to','co','do','tf'],ans:0},
  {cells:['so','so','so','cf','cf','cf','do','do',null],choices:['df','do','tf','co'],ans:1},
  {cells:['co','so','to','cf','sf','tf','ch','sh',null],choices:['th','tf','to','do'],ans:0},
  {cells:['co','co','cf','so','so','sf','to','to',null],choices:['th','tf','to','do'],ans:1},
  {cells:['sf','cf','tf','so','co','to','sh','ch',null],choices:['th','so','tf','do'],ans:0},
  {cells:['co','so','do','co','so','do','co','so',null],choices:['do','co','to','so'],ans:0},
  {cells:['tf','sf','cf','to','so','co','th','sh',null],choices:['ch','co','cf','th'],ans:0},
  {cells:['co','co','co','so','so','so','do','do',null],choices:['to','co','do','so'],ans:2},
  {cells:['cf','sf','tf','cf','sf','tf','cf','sf',null],choices:['tf','co','df','sf'],ans:0},
  {cells:['sh','ch','th','so','co','to','sf','cf',null],choices:['tf','th','df','to'],ans:0},
  {cells:['co','so','do','sf','cf','df','to','co',null],choices:['so','do','df','cf'],ans:1},
];

let current=0, score=0, answered=false;

function pct(s){
  // score out of 12 → estimated IQ percentile band
  const map=[2,4,8,14,22,35,50,65,78,88,93,97,99];
  return map[Math.min(12,Math.max(0,s))];
}
function iqEst(s){
  const map=[60,70,78,86,92,97,100,104,108,113,119,125,130];
  return map[Math.min(12,Math.max(0,s))];
}
function label(s){
  const p=pct(s);
  if(p>=95) return{text:'Exceptional 🔷',color:'#6366f1'};
  if(p>=80) return{text:'Superior',color:'#8b5cf6'};
  if(p>=60) return{text:'Above Average',color:'#10b981'};
  if(p>=40) return{text:'Average',color:'#06b6d4'};
  if(p>=20) return{text:'Below Average',color:'#f59e0b'};
  return{text:'Low',color:'#ef4444'};
}

function renderQ(){
  const q=QUESTIONS[current];
  answered=false;
  const cells=q.cells.map((s,i)=>
    i===8
      ? `<div class="pattern-cell missing" style="font-size:1.5rem;color:var(--primary)">?</div>`
      : `<div class="pattern-cell">${s?cell(s):''}</div>`
  ).join('');
  const choices=q.choices.map((s,i)=>
    `<div class="pattern-choice" onclick="PatTest.pick(${i})" data-i="${i}">${cell(s)}</div>`
  ).join('');

  document.getElementById('test-root').querySelector('#pat-body').innerHTML=`
  <p class="pattern-question" style="margin-bottom:16px">Which piece completes the pattern?</p>
  <div class="pattern-grid">${cells}</div>
  <p style="font-size:.8rem;color:var(--text-3);margin:12px 0 8px">Choose the missing piece:</p>
  <div class="pattern-choices">${choices}</div>`;

  document.getElementById('pat-q-num').textContent=`Q${current+1} / ${QUESTIONS.length}`;
  document.getElementById('pat-score-now').textContent=`Score: ${score}`;
  const fill=document.getElementById('pat-prog-fill');
  if(fill) fill.style.width=`${(current/QUESTIONS.length)*100}%`;
  // dots
  for(let i=0;i<QUESTIONS.length;i++){
    const d=document.getElementById(`pat-dot-${i}`);
    if(d) d.className='progress-dot'+(i<current?' done':i===current?' active':'');
  }
}

function renderShell(){
  const dots=QUESTIONS.map((_,i)=>`<div class="progress-dot" id="pat-dot-${i}"></div>`).join('');
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>How It Works</h3>
    <ul>
      <li>Each puzzle shows a 3×3 grid with the last piece missing.</li>
      <li>Find the logical rule and pick the correct answer from 4 options.</li>
      <li>${QUESTIONS.length} questions, increasing difficulty.</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🔷 Pattern Recognition</span>
      <div style="display:flex;gap:12px;align-items:center">
        <span id="pat-score-now" style="font-size:.8rem;color:var(--text-3)">Score: 0</span>
        <span id="pat-q-num" style="font-size:.8rem;color:var(--text-3)">Q1 / ${QUESTIONS.length}</span>
      </div>
    </div>
    <div class="test-ui-body" id="pat-body" style="flex-direction:column;gap:16px">
      <p style="color:var(--text-2)">Test your fluid intelligence with abstract visual patterns.</p>
      <button class="btn btn-primary" onclick="PatTest.start()">Start Test</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="pat-prog-fill" style="width:0%"></div></div>
      <div style="display:flex;gap:4px;margin-top:8px">${dots}</div>
    </div>
  </div>
  <div class="results-panel" id="pat-results"></div>`;
}

function showResults(){
  const p=pct(score);
  const iq=iqEst(score);
  const {text,color}=label(score);
  const circ=2*Math.PI*55;
  document.getElementById('pat-results').innerHTML=`
  <div class="result-score-wrap">
    <div class="score-ring-wrap" style="position:relative">
      <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
        <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
        <circle class="score-ring-fill" id="pat-ring" cx="65" cy="65" r="55"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="score-ring-num">${score}/${QUESTIONS.length}</div>
        <div class="score-ring-unit">correct</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">You got ${score} out of ${QUESTIONS.length} correct. Based on published norms, this corresponds to an estimated IQ range of <strong>~${iq}</strong>. Pattern recognition is a core component of fluid intelligence.</p>
      <div class="result-percentile" style="background:${color}22;color:${color}">Top ${100-p}% in fluid reasoning</div>
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="pat-bell" style="width:100%;display:block"></canvas></div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">Score</div><div class="b-val" style="color:var(--primary)">${score}/${QUESTIONS.length}</div></div>
    <div class="breakdown-item"><div class="b-label">Est. IQ</div><div class="b-val">~${iq}</div><div class="b-sub">range estimate</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${p}</div></div>
    <div class="breakdown-item"><div class="b-label">Average</div><div class="b-val">7/12</div><div class="b-sub">global mean</div></div>
  </div>
  <p style="font-size:.75rem;color:var(--text-3);margin-top:8px;text-align:center">Note: This is a brief screening measure, not a certified IQ test. For clinical IQ assessment, consult a psychologist.</p>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="PatTest.copy()">📋 Copy Result</button>
    <button class="share-btn" onclick="PatTest.tweet()">𝕏 Share on X</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="PatTest.reset()">↺ Try Again</button></div>`;
  document.getElementById('pat-results').classList.add('show');
  window._patResult={score,pct:p,iq,text};
  const ring=document.getElementById('pat-ring');
  ring.style.stroke=color;ring.setAttribute('stroke-dasharray',circ);ring.setAttribute('stroke-dashoffset',circ);
  setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
  requestAnimationFrame(()=>window.drawBellCurve?.('pat-bell',p,color));
}

window.PatTest={
  start(){current=0;score=0;renderQ();},
  pick(idx){
    if(answered) return;
    answered=true;
    const q=QUESTIONS[current];
    const choices=document.querySelectorAll('.pattern-choice');
    choices.forEach((c,i)=>{
      if(i===q.ans) c.classList.add('correct');
      else if(i===idx&&idx!==q.ans) c.classList.add('wrong');
    });
    if(idx===q.ans) score++;
    setTimeout(()=>{
      current++;
      if(current>=QUESTIONS.length) showResults();
      else renderQ();
    },900);
  },
  reset(){renderShell();},
  copy(){const r=window._patResult;if(!r)return;const t=`Pattern recognition: ${r.score}/12 correct, est. IQ ~${r.iq} (${(window.ordinal?window.ordinal(r.pct):r.pct+'th')} percentile) 🔷 Test yours: coreskillai.com`;navigator.clipboard?.writeText(t);},
  tweet(){const r=window._patResult;if(!r)return;const t=`Pattern recognition: ${r.score}/12 correct — ${r.text} 🔷 IQ estimate: ~${r.iq}`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

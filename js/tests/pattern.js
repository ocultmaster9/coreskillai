/* CoreSkillAI — Pattern Recognition Test (Matrix Reasoning) */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
// Items come from js/tests/matrixgen.js rather than a hardcoded bank.
//
// The old bank was 12 hand-typed items with the correct answer in slot 1 EIGHT
// times out of twelve, rendered in fixed order. Always clicking the first option
// scored 8/12 and the page then reported "estimated IQ ~108". Worse, the items
// were the same ones the IQ test used, so the two tests were largely the same
// twelve puzzles under two names.
const N_ITEMS = 16;
const N_OPTIONS = 6;
let QUESTIONS = [];

function newItems(){
  if(!window.MatrixGen) return [];
  const seed=(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0;
  let t=window.MatrixGen.generateTest(seed,N_ITEMS);
  for(let i=0;!t&&i<20;i++) t=window.MatrixGen.generateTest((seed+i+1)>>>0,N_ITEMS);
  return t||[];
}
const cellSvg=(c,size)=>window.MatrixGen?window.MatrixGen.cellSvg(c,size||44):'';

// Guessing-corrected accuracy -> estimated percentile, using the same method as
// the IQ test so the two are consistent. The old version mapped 12 raw points
// onto an "estimated IQ" of 60-130 and told the visitor it was "based on
// published norms". There are no norms. That claim is gone.
function corrected(s){
  const chance=QUESTIONS.length/N_OPTIONS;
  return Math.max(0,(s-chance)/(1-1/N_OPTIONS));
}
function pct(s){
  const n=QUESTIONS.length||N_ITEMS;
  const p=corrected(s)/n, eps=0.012;
  const q=Math.min(1-eps,Math.max(eps,p));
  const z=Math.log(q/(1-q))/1.75-0.05;
  const a=[0.319381530,-0.356563782,1.781477937,-1.821255978,1.330274429];
  const t=1/(1+0.2316419*Math.abs(z));let poly=0,tp=t;a.forEach(c=>{poly+=c*tp;tp*=t;});
  const d=0.3989423*Math.exp(-z*z/2)*poly;
  return Math.max(1,Math.min(99,Math.round((z>=0?1-d:d)*100)));
}
function accuracy(s){ return Math.round(100*s/(QUESTIONS.length||N_ITEMS)); }

function label(s){
  const p=pct(s);
  if(p>=95) return{text:_t('rt_r_exceptional','Exceptional')+' 🔷',color:'#6366f1'};
  if(p>=80) return{text:_t('rt_r_superior','Superior'),color:'#8b5cf6'};
  if(p>=60) return{text:_t('rt_r_above','Above Average'),color:'#10b981'};
  if(p>=40) return{text:_t('rt_r_average','Average'),color:'#06b6d4'};
  if(p>=20) return{text:_t('rt_r_below','Below Average'),color:'#f59e0b'};
  return{text:_t('rt_r_practice','Keep Practicing'),color:'#ef4444'};
}

function renderQ(){
  const q=QUESTIONS[current];
  answered=false;
  const cells=[0,1,2,3,4,5,6,7,8].map(i=>
    i===8
      ? `<div class="pattern-cell missing" style="font-size:1.5rem;color:var(--primary)">?</div>`
      : `<div class="pattern-cell">${cellSvg(q.cells[i],52)}</div>`
  ).join('');
  const choices=q.choices.map((c,i)=>
    `<div class="pattern-choice" onclick="PatTest.pick(${i})" data-i="${i}">${cellSvg(c,46)}</div>`
  ).join('');

  document.getElementById('test-root').querySelector('#pat-body').innerHTML=`
  <p class="pattern-question" style="margin-bottom:16px">${_t('pat_question',"Which piece completes the pattern?")}</p>
  <div class="pattern-grid">${cells}</div>
  <p style="font-size:.8rem;color:var(--text-3);margin:12px 0 8px">${_t('pat_choose',"Choose the missing piece:")}</p>
  <div class="pattern-choices">${choices}</div>`;

  document.getElementById('pat-q-num').textContent=`Q${current+1} / ${QUESTIONS.length}`;
  document.getElementById('pat-score-now').textContent=`${_t('pat_result_label','Pattern Score')}: ${score}`;
  const fill=document.getElementById('pat-prog-fill');
  if(fill) fill.style.width=`${(current/QUESTIONS.length)*100}%`;
  // dots
  for(let i=0;i<QUESTIONS.length;i++){
    const d=document.getElementById(`pat-dot-${i}`);
    if(d) d.className='progress-dot'+(i<current?' done':i===current?' active':'');
  }
}

function renderShell(){
  const dots=Array.from({length:QUESTIONS.length||N_ITEMS},(_,i)=>`<div class="progress-dot" id="pat-dot-${i}"></div>`).join('');
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('pat_how_title',"How It Works")}</h3>
    <ul>
      <li>${_t('pat_how1',"Each puzzle shows a 3×3 grid with the last piece missing.")}</li>
      <li>${_t('pat_how2',"Work out the rule and choose the missing piece from 6 options. Fresh puzzles every attempt.")}</li>
      <li>${_t('iq_qcount',"{n} questions").replace('{n}',N_ITEMS)}, ${_t('pat_difficulty',"increasing difficulty")}.</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🔷 ${_t('pat_title',"Pattern Recognition Test")}</span>
      <div style="display:flex;gap:12px;align-items:center">
        <span id="pat-score-now" style="font-size:.8rem;color:var(--text-3)">${_t('pat_result_label','Pattern Score')}: 0</span>
        <span id="pat-q-num" style="font-size:.8rem;color:var(--text-3)">Q1 / ${N_ITEMS}</span>
      </div>
    </div>
    <div class="test-ui-body" id="pat-body" style="flex-direction:column;gap:16px">
      <p style="color:var(--text-2)">${_t('pat_desc',"Test your fluid intelligence with abstract visual patterns.")}</p>
      <button class="btn btn-primary" onclick="PatTest.start()">${_t('btn_start_test',"Start Test")}</button>
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
  const acc=accuracy(score);
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
        <div class="score-ring-unit">${_t('lbl_correct',"Correct")}</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">${_t('pat_res_desc',"You solved {n} of {t}. This is a short screener, so treat the percentile as a rough placement rather than a measurement — the full IQ test uses more items and reports a confidence interval.").replace('{n}',score).replace('{t}',QUESTIONS.length)}</p>
      <div class="result-percentile" style="background:${color}22;color:${color}">${_t('pat_top',"Top {p}% in fluid reasoning").replace('{p}',100-p)}</div>
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="pat-bell" style="width:100%;display:block"></canvas></div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">${_t('pat_result_label','Pattern Score')}</div><div class="b-val" style="color:var(--primary)">${score}/${QUESTIONS.length}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('pat_accuracy',"Accuracy")}</div><div class="b-val">${acc}%</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${p}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('pat_chance',"Chance level")}</div><div class="b-val">${Math.round(QUESTIONS.length/N_OPTIONS)}/${QUESTIONS.length}</div></div>
  </div>
  <p style="font-size:.75rem;color:var(--text-3);margin-top:8px;text-align:center">${_t('pat_note',"A short screener, not a certified IQ test, and not standardised on a representative sample. For a clinical assessment, consult a psychologist.")}</p>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="PatTest.copy()">📋 ${_t('share_copy',"Copy Result")}</button>
    <button class="share-btn" onclick="PatTest.tweet()">𝕏 ${_t('share_tweet',"Share on X")}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="PatTest.reset()">↺ ${_t('btn_try_again',"Try Again")}</button></div>`;
  document.getElementById('pat-results').classList.add('show');
  window._patResult={score,pct:p,acc,text};
  const ring=document.getElementById('pat-ring');
  ring.style.stroke=color;ring.setAttribute('stroke-dasharray',circ);ring.setAttribute('stroke-dashoffset',circ);
  setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
  requestAnimationFrame(()=>window.drawBellCurve?.('pat-bell',p,color));
}

window.PatTest={
  start(){QUESTIONS=newItems();if(!QUESTIONS.length){console.error('MatrixGen missing');return;}current=0;score=0;renderShell();renderQ();},
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
  copy(){const r=window._patResult;if(!r)return;const t=window.shareText('pat_result_label', r.score+'/'+QUESTIONS.length, r.text, r.pct);navigator.clipboard?.writeText(t);},
  tweet(){const r=window._patResult;if(!r)return;const t=window.shareText('pat_result_label', r.score+'/'+QUESTIONS.length, r.text, r.pct);window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

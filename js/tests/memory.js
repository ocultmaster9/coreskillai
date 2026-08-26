/* CoreSkillAI — Working Memory Test (Digit Span) */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
let level=3, correct=0, wrong=0, seq=[], phase='idle';

// Norms: Miller's Law. Digit span percentiles from WAIS-IV normative data.
function pct(span){
  const norms={3:5,4:15,5:30,6:50,7:68,8:82,9:93,10:98,11:99};
  return norms[Math.min(11,Math.max(3,span))]||50;
}
function label(span){
  if(span>=10) return{text:'Exceptional Memory 🧠',color:'#6366f1'};
  if(span>=9)  return{text:'Superior',color:'#8b5cf6'};
  if(span>=8)  return{text:'Above Average',color:'#10b981'};
  if(span>=7)  return{text:'Average (Normal)',color:'#06b6d4'};
  if(span>=6)  return{text:'Low Average',color:'#f59e0b'};
  return{text:'Below Average',color:'#ef4444'};
}
function randSeq(len){return Array.from({length:len},()=>Math.floor(Math.random()*9)+1);}

function render(){
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('mem_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('mem_how1','A sequence of digits will flash on screen.')}</li>
      <li>${_t('mem_how2','When it disappears, type the sequence exactly as shown.')}</li>
      <li>${_t('mem_how3','Each correct answer adds one more digit. The test ends when you make a mistake.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">💭 ${_t('mem_title','Working Memory')}</span>
      <span id="mem-level-badge" class="badge badge-primary">${_t('mem_level',"Level {l} — {n} digits").replace('{l}',1).replace('{n}',3)}</span>
    </div>
    <div class="test-ui-body" id="mem-body">
      <p style="color:var(--text-2);text-align:center">${_t('mem_start_desc','How many digits can you hold in working memory?')}</p>
      <button class="btn btn-primary" id="mem-start" onclick="MemTest.start()">${_t('btn_start_test','Start Test')}</button>
    </div>
  </div>
  <div class="results-panel" id="mem-results"></div>`;
}

function showSequence(){
  const body=document.getElementById('mem-body');
  body.innerHTML=`<p style="font-size:.85rem;color:var(--text-2);margin-bottom:12px">${_t('mem_ready','Memorize this sequence:')}</p>
  <div class="memory-display" id="mem-display">${seq.join(' ')}</div>
  <p style="font-size:.78rem;color:var(--text-3);margin-top:8px">${_t('mem_disappears','Disappears in 3 seconds…')}</p>`;
  setTimeout(()=>showInput(),3000);
}

function showInput(){
  const body=document.getElementById('mem-body');
  body.innerHTML=`<p style="font-size:.85rem;color:var(--text-2);margin-bottom:12px">${_t('mem_type','Type the sequence:')}</p>
  <input class="memory-input" id="mem-input" type="text" inputmode="numeric" maxlength="${seq.length+2}" placeholder="${'_'.repeat(seq.length)}" autofocus>
  <button class="btn btn-primary" style="margin-top:16px" onclick="MemTest.submit()">${_t('mem_confirm','Confirm')}</button>`;
  setTimeout(()=>document.getElementById('mem-input')?.focus(),50);
  document.getElementById('mem-input')?.addEventListener('keydown',e=>{
    if(e.key==='Enter') MemTest.submit();
  });
}

function showResults(maxSpan){
  const p=pct(maxSpan);
  const {text,color}=label(maxSpan);
  const desc = (maxSpan>=8
    ? _t('mem_res_high',"A span of {n} digits is impressive. Most adults peak around 7, so you are outperforming the majority.")
    : maxSpan>=6
    ? _t('mem_res_mid',"A span of {n} digits falls in the normal range. Working memory is trainable — daily practice can push it higher.")
    : _t('mem_res_low',"A span of {n} is below the typical range. Working memory varies with fatigue, stress and age. Try again when rested.")
  ).replace('{n}', maxSpan);

  const R=55,circ=2*Math.PI*R;
  document.getElementById('mem-results').innerHTML=`
  <div class="result-score-wrap">
    <div class="score-ring-wrap" style="position:relative">
      <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
        <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
        <circle class="score-ring-fill" id="mem-ring" cx="65" cy="65" r="55"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="score-ring-num">${maxSpan}</div>
        <div class="score-ring-unit">digits</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">${desc}</p>
      <div class="result-percentile" style="background:${color}22;color:${color}">${_t('percentile_prefix','Better than')} ${p}% ${_t('percentile_suffix','of people')}</div>
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="mem-bell" style="width:100%;display:block"></canvas></div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">Max Span</div><div class="b-val" style="color:var(--primary)">${maxSpan}</div><div class="b-sub">digits</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('mem_normal',"Normal Range")}</div><div class="b-val">5–9</div><div class="b-sub">Miller's Law</div></div>
    <div class="breakdown-item"><div class="b-label">Global Avg</div><div class="b-val">7</div><div class="b-sub">digits</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${p}</div><div class="b-sub"></div></div>
  </div>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="MemTest.copy()">📋 Copy Result</button>
    <button class="share-btn" onclick="MemTest.tweet()">𝕏 Share on X</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="MemTest.reset()">↺ Try Again</button></div>`;
  document.getElementById('mem-results').classList.add('show');
  window._memResult={span:maxSpan,pct:p,text};

  const ring=document.getElementById('mem-ring');
  ring.style.stroke=color;
  ring.setAttribute('stroke-dasharray',circ);
  ring.setAttribute('stroke-dashoffset',circ);
  setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
  requestAnimationFrame(()=>window.drawBellCurve?.('mem-bell',p,color));
}

window.MemTest={
  start(){
    level=3;correct=0;wrong=0;phase='show';
    document.getElementById('mem-results')?.classList.remove('show');
    seq=randSeq(level);
    document.getElementById('mem-level-badge').textContent=_t('mem_level',"Level {l} — {n} digits").replace('{l}',correct+1).replace('{n}',level);
    showSequence();
  },
  submit(){
    const val=(document.getElementById('mem-input')?.value||'').replace(/\s/g,'');
    const ans=seq.join('');
    if(val===ans){
      correct++;level++;
      const badge=document.getElementById('mem-level-badge');
      const body=document.getElementById('mem-body');
      body.innerHTML=`<div class="memory-display" style="color:var(--success);font-size:1.5rem">${_t('mem_correct_msg','✓ Correct!')}</div>`;
      badge.textContent=_t('mem_level',"Level {l} — {n} digits").replace('{l}',correct+1).replace('{n}',level);
      setTimeout(()=>{seq=randSeq(level);showSequence();},900);
    } else {
      const maxSpan=level-1;
      document.getElementById('mem-body').innerHTML=`
      <div class="memory-display" style="color:var(--danger);font-size:1.2rem">✗ ${_t('mem_wrong_msg','That was:')} ${ans}</div>`;
      setTimeout(()=>showResults(Math.max(2,maxSpan)),900);
    }
  },
  reset(){level=3;correct=0;render();},
  copy(){const r=window._memResult;if(!r)return;const t=`My working memory span: ${r.span} digits — ${r.text} (${(window.ordinal?window.ordinal(r.pct):r.pct+'th')} percentile) 🧠 Test yours: coreskillai.com`;navigator.clipboard?.writeText(t).then(()=>{const b=document.getElementById('share-copy');b.textContent='✓ Copied!';setTimeout(()=>b.textContent='📋 Copy Result',2000);});},
  tweet(){const r=window._memResult;if(!r)return;const t=`My working memory span: ${r.span} digits — ${r.text} (${(window.ordinal?window.ordinal(r.pct):r.pct+'th')} percentile)`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};

document.addEventListener('DOMContentLoaded',render);
})();

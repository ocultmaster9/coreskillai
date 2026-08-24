/* CoreSkillAI — Color Vision Test (Hue Arrangement) */
(function(){
// Farnsworth-Munsell style hue arrangement test
// 4 rows, each row has 2 fixed anchors + 8 moveable chips to sort

const ROWS=[
  {label:'Red → Yellow',  anchors:['#d32f2f','#f9a825'], hues:['#e53935','#ef6c00','#fb8c00','#ffa726','#ffcc02','#f7dc6f','#f4ca64','#f5a623']},
  {label:'Yellow → Green',anchors:['#f9a825','#2e7d32'], hues:['#f0b429','#d4c700','#c5d600','#aed136','#8dc63f','#6abf69','#4caf50','#388e3c']},
  {label:'Green → Blue',  anchors:['#2e7d32','#1565c0'], hues:['#43a047','#26a69a','#00acc1','#039be5','#1e88e5','#3949ab','#283593','#1a237e']},
  {label:'Blue → Red',    anchors:['#1565c0','#d32f2f'], hues:['#1976d2','#5c6bc0','#7b1fa2','#ad1457','#c62828','#b71c1c','#8e0000','#bf360c']},
];

let rowOrder=[]; // user's current arrangement per row (copy of hues)
let dragSrc=null, dragRow=null, touchStartX=0, touchStartY=0;
let scores=[]; // error score per row

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

function rowErrorScore(arr, correct){
  // Total error = sum of |position difference| for each hue
  let err=0;
  arr.forEach((h,i)=>{
    const ci=correct.indexOf(h);
    err+=Math.abs(i-ci);
  });
  return err;
}

function totalErrorPct(totalErr){
  // 0 error = perfect (100th percentile), max ~112 (all rows wrong)
  // Map error to percentile: 0=100, 8=90, 16=75, 24=60, 32=50, 48=30, 64=15, 80=5, 96+=1
  const pts=[[0,100],[4,96],[8,90],[12,82],[18,72],[24,60],[32,50],[40,38],[50,28],[64,15],[80,5],[96,1]];
  for(let i=0;i<pts.length-1;i++){
    const [e1,p1]=pts[i],[e2,p2]=pts[i+1];
    if(totalErr<=e2){
      const t=(totalErr-e1)/(e2-e1);
      return Math.round(p1+(p2-p1)*t);
    }
  }
  return 1;
}

function label(err){
  if(err===0)  return{text:'Perfect Color Vision 🌈',color:'#6366f1'};
  if(err<=8)   return{text:'Excellent',color:'#8b5cf6'};
  if(err<=18)  return{text:'Good',color:'#10b981'};
  if(err<=32)  return{text:'Average',color:'#06b6d4'};
  if(err<=50)  return{text:'Mild Deficiency',color:'#f59e0b'};
  return{text:'Significant Deficiency',color:'#ef4444'};
}

function buildRow(ri){
  const row=ROWS[ri];
  const chips=rowOrder[ri].map((h,ci)=>`
    <div class="hue-chip" draggable="true"
      data-row="${ri}" data-i="${ci}" data-color="${h}"
      style="background:${h}"
      title="${h}"></div>`).join('');
  return `
  <div style="margin-bottom:20px">
    <p style="font-size:.78rem;color:var(--text-3);margin-bottom:8px">${row.label}</p>
    <div class="hue-row">
      <div class="hue-anchor" style="background:${row.anchors[0]}" title="Anchor"></div>
      <div class="hue-chips" id="chips-${ri}">${chips}</div>
      <div class="hue-anchor" style="background:${row.anchors[1]}" title="Anchor"></div>
    </div>
  </div>`;
}

function renderShell(){
  ROWS.forEach((_,ri)=>{ rowOrder[ri]=shuffle(ROWS[ri].hues); });
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>How It Works</h3>
    <ul>
      <li>Each row shows colors between two fixed anchors.</li>
      <li><strong>Drag the colored chips</strong> to arrange them in smooth hue order from left to right.</li>
      <li>4 rows total. Perfect arrangement = perfect color vision.</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🌈 Color Vision</span>
      <span class="badge badge-primary">Drag to sort</span>
    </div>
    <div class="test-ui-body" style="flex-direction:column;align-items:flex-start;gap:8px" id="cv-body">
      <div id="cv-rows">${ROWS.map((_,ri)=>buildRow(ri)).join('')}</div>
      <button class="btn btn-primary" style="margin-top:16px;align-self:center" onclick="CVTest.submit()">Check My Results</button>
    </div>
  </div>
  <div class="results-panel" id="cv-results"></div>`;
  initDrag();
}

function initDrag(){
  document.querySelectorAll('.hue-chip').forEach(chip=>{
    chip.addEventListener('dragstart',e=>{
      dragSrc=chip;
      dragRow=parseInt(chip.dataset.row);
      e.dataTransfer.effectAllowed='move';
      setTimeout(()=>chip.classList.add('dragging'),0);
    });
    chip.addEventListener('dragend',()=>chip.classList.remove('dragging'));
    chip.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';});
    chip.addEventListener('drop',e=>{
      e.preventDefault();
      if(!dragSrc||dragSrc===chip) return;
      const ri=parseInt(chip.dataset.row);
      if(ri!==dragRow) return;
      const si=parseInt(dragSrc.dataset.i), di=parseInt(chip.dataset.i);
      const arr=rowOrder[ri];
      [arr[si],arr[di]]=[arr[di],arr[si]];
      const row=document.getElementById(`chips-${ri}`);
      row.innerHTML=rowOrder[ri].map((h,ci)=>`
        <div class="hue-chip" draggable="true" data-row="${ri}" data-i="${ci}" data-color="${h}"
          style="background:${h}" title="${h}"></div>`).join('');
      initDrag();
    });
    // touch
    chip.addEventListener('touchstart',e=>{dragSrc=chip;dragRow=parseInt(chip.dataset.row);touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;},{passive:true});
    chip.addEventListener('touchend',e=>{
      const x=e.changedTouches[0].clientX,y=e.changedTouches[0].clientY;
      const target=document.elementFromPoint(x,y);
      const tc=target?.closest('.hue-chip');
      if(tc&&tc!==dragSrc&&parseInt(tc.dataset.row)===dragRow){
        const ri=dragRow,si=parseInt(dragSrc.dataset.i),di=parseInt(tc.dataset.i);
        const arr=rowOrder[ri];[arr[si],arr[di]]=[arr[di],arr[si]];
        const row=document.getElementById(`chips-${ri}`);
        row.innerHTML=rowOrder[ri].map((h,ci)=>`<div class="hue-chip" draggable="true" data-row="${ri}" data-i="${ci}" data-color="${h}" style="background:${h}"></div>`).join('');
        initDrag();
      }
    },{passive:true});
  });
}

function showResults(){
  const totalErr=scores.reduce((a,b)=>a+b,0);
  const p=totalErrorPct(totalErr);
  const {text,color}=label(totalErr);
  const circ=2*Math.PI*55;
  const breakdown=scores.map((s,i)=>`<div class="breakdown-item"><div class="b-label">${ROWS[i].label.split('→')[0].trim()}</div><div class="b-val" style="color:${s===0?'var(--success)':s<=8?'var(--primary)':'var(--warning)'}">${s===0?'Perfect':s<=4?'Excellent':s<=12?'Good':'Poor'}</div><div class="b-sub">err: ${s}</div></div>`).join('');
  document.getElementById('cv-results').innerHTML=`
  <div class="result-score-wrap">
    <div class="score-ring-wrap" style="position:relative">
      <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
        <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
        <circle class="score-ring-fill" id="cv-ring" cx="65" cy="65" r="55"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="score-ring-num">${p}</div><div class="score-ring-unit">percentile</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">${totalErr===0?'Perfect score! Your color discrimination is exceptional — you placed all 32 chips in exact order.':totalErr<=18?'Your color vision is well above average. Small errors are common even in people with clinically normal vision.':'Some difficulty with hue discrimination was detected. About 8% of males and 0.5% of females have some form of color vision deficiency.'}</p>
      <div class="result-percentile" style="background:${color}22;color:${color}">Better than ${p}% of people</div>
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="cv-bell" style="width:100%;display:block"></canvas></div>
  <div class="result-breakdown">${breakdown}</div>
  <p style="font-size:.75rem;color:var(--text-3);margin-top:8px;text-align:center">Note: This test is for informational purposes only. For clinical color vision assessment, consult an optometrist.</p>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="CVTest.copy()">📋 Copy Result</button>
    <button class="share-btn" onclick="CVTest.tweet()">𝕏 Share on X</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="CVTest.reset()">↺ Try Again</button></div>`;
  document.getElementById('cv-results').classList.add('show');
  window._cvResult={totalErr,pct:p,text};
  const ring=document.getElementById('cv-ring');
  ring.style.stroke=color;ring.setAttribute('stroke-dasharray',circ);ring.setAttribute('stroke-dashoffset',circ);
  setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
  requestAnimationFrame(()=>window.drawBellCurve?.('cv-bell',p,color));
}

window.CVTest={
  submit(){
    scores=ROWS.map((row,ri)=>rowErrorScore(rowOrder[ri],row.hues));
    showResults();
  },
  reset(){dragSrc=null;dragRow=null;scores=[];renderShell();},
  copy(){const r=window._cvResult;if(!r)return;const t=`Color vision: ${r.text} (${(window.ordinal?window.ordinal(r.pct):r.pct+'th')} percentile) 🌈 Test yours: coreskillai.com`;navigator.clipboard?.writeText(t);},
  tweet(){const r=window._cvResult;if(!r)return;const t=`Color vision test: ${r.text} — ${(window.ordinal?window.ordinal(r.pct):r.pct+'th')} percentile 🌈`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

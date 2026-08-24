/* CoreSkillAI — Emotional Intelligence Test (4-Branch Model) */
(function(){
// 28 questions across 4 branches of Mayer-Salovey-Caruso EI model
const ITEMS=[
  // Branch 1: Perceiving Emotions (7 items)
  ["I can tell how someone is feeling just by looking at their face.","P",false],
  ["I notice when friends are upset even when they don't say so.","P",false],
  ["I find it hard to read the emotional tone in a room.","P",true],
  ["I can usually tell what kind of mood someone is in from their voice.","P",false],
  ["I often miss subtle emotional cues in conversations.","P",true],
  ["I'm good at understanding what people are feeling through their body language.","P",false],
  ["I can accurately identify emotions in art, music, or stories.","P",false],
  // Branch 2: Using Emotions (7 items)
  ["When I'm in a good mood, I tend to come up with more creative ideas.","U",false],
  ["I use my feelings to help me decide what to focus on.","U",false],
  ["I find it hard to use my emotions to motivate myself.","U",true],
  ["My emotions help me think more clearly about complex problems.","U",false],
  ["I struggle to let positive emotions energize my work.","U",true],
  ["I match my emotional state to the task I need to do (e.g., calm for precision work).","U",false],
  ["I can channel excitement or enthusiasm to boost my performance.","U",false],
  // Branch 3: Understanding Emotions (7 items)
  ["I understand how emotions tend to progress over time (e.g., annoyance → anger).","N",false],
  ["I can explain why a complex emotion like jealousy arises.","N",false],
  ["I find it hard to explain what causes mixed emotions in people.","N",true],
  ["I understand how emotions like pride and shame relate to self-image.","N",false],
  ["I often don't understand why people feel the way they do.","N",true],
  ["I can accurately label subtle distinctions between emotions (e.g., uneasy vs. anxious).","N",false],
  ["I understand how background emotions (like mild worry) affect thinking over time.","N",false],
  // Branch 4: Managing Emotions (7 items)
  ["When I'm upset, I can calm myself down relatively quickly.","M",false],
  ["I know how to lift someone else's mood when they're sad.","M",false],
  ["I tend to ruminate and stay stuck in bad moods.","M",true],
  ["I can stay composed and think clearly even under pressure.","M",false],
  ["I have trouble helping others manage their negative emotions.","M",true],
  ["I can resolve conflicts in a way that satisfies all parties.","M",false],
  ["I feel overwhelmed by strong negative emotions and can't manage them well.","M",true],
];
const BRANCHES={
  P:{name:'Perceiving Emotions', color:'#f97316', desc:'Your ability to accurately read emotions in faces, voices, and surroundings.'},
  U:{name:'Using Emotions',      color:'#f59e0b', desc:'How well you leverage emotional states to enhance thinking and creativity.'},
  N:{name:'Understanding Emotions', color:'#6366f1', desc:'Your knowledge of emotional dynamics — how they blend, evolve, and influence behavior.'},
  M:{name:'Managing Emotions',   color:'#10b981', desc:'Your capacity to regulate your own emotions and positively influence others.'},
};
const ORDER=['P','U','N','M'];

let current=0, answers={};

function scoreToEQ(raw){
  // Each branch 7 items, 1-5 scale → min 7, max 35
  // Map 7-35 → EQ component score 60-140
  const t=(raw-7)/28; return Math.round(60+t*80);
}
function eqPct(eqScore){
  // EQ 100 = 50th percentile; SD~15
  const z=(eqScore-100)/15;
  return Math.max(1,Math.min(99,Math.round(normalCDF(z)*100)));
}
function normalCDF(z){
  const a=[0.319381530,-0.356563782,1.781477937,-1.821255978,1.330274429];
  const t2=1/(1+0.2316419*Math.abs(z));
  let poly=0,tp=t2; a.forEach(c=>{poly+=c*tp;tp*=t2;});
  const d=0.3989423*Math.exp(-z*z/2)*poly;
  return z>=0?1-d:d;
}
function label(total){
  if(total>=130) return{text:'Exceptional EQ ❤️',color:'#6366f1'};
  if(total>=115) return{text:'Very High EQ',color:'#8b5cf6'};
  if(total>=105) return{text:'Above Average EQ',color:'#10b981'};
  if(total>=95)  return{text:'Average EQ',color:'#06b6d4'};
  if(total>=85)  return{text:'Developing',color:'#f59e0b'};
  return{text:'Low EQ',color:'#ef4444'};
}

function renderShell(){
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>How It Works</h3>
    <ul>
      <li>${ITEMS.length} statements across 4 dimensions of emotional intelligence.</li>
      <li>Rate how accurately each describes you. There are no right or wrong answers.</li>
      <li>Based on the Mayer-Salovey-Caruso model — the leading scientific EI framework.</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">❤️ Emotional Intelligence</span>
      <span id="eq-counter" class="q-counter">Question 1 of ${ITEMS.length}</span>
    </div>
    <div class="test-ui-body" id="eq-body">
      <p style="color:var(--text-2)">Discover your EQ across all 4 dimensions of emotional intelligence.</p>
      <button class="btn btn-primary" onclick="EQTest.start()">Start Test</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="eq-prog" style="width:0%"></div></div>
    </div>
  </div>
  <div class="results-panel" id="eq-results"></div>`;
}

function renderQ(){
  const [text,,rev]=ITEMS[current];
  document.getElementById('eq-counter').textContent=`Question ${current+1} of ${ITEMS.length}`;
  document.getElementById('eq-prog').style.width=`${(current/ITEMS.length)*100}%`;
  const labels=[['1','Strongly\nDisagree'],['2','Disagree'],['3','Neutral'],['4','Agree'],['5','Strongly\nAgree']];
  const btns=labels.map(([n,l],i)=>`<button class="likert-btn" onclick="EQTest.answer(${i+1})"><span class="likert-num">${n}</span><span class="likert-label">${l.replace('\n','<br>')}</span></button>`).join('');
  document.getElementById('eq-body').innerHTML=`
    <p class="q-counter">Q${current+1} / ${ITEMS.length}</p>
    <p class="question-text">"${text}"</p>
    <div class="likert">${btns}</div>`;
}

function showResults(){
  const raw={P:0,U:0,N:0,M:0};
  ITEMS.forEach(([,branch,rev],i)=>{
    const a=answers[i]||3; raw[branch]+= rev?(6-a):a;
  });
  const eqScores={};
  ORDER.forEach(b=>{ eqScores[b]=scoreToEQ(raw[b]); });
  const totalEQ=Math.round(ORDER.reduce((s,b)=>s+eqScores[b],0)/ORDER.length);
  const p=eqPct(totalEQ);
  const {text,color}=label(totalEQ);
  const circ=2*Math.PI*55;

  const bars=ORDER.map(b=>{
    const info=BRANCHES[b]; const eq=eqScores[b]; const bp=eqPct(eq);
    return `<div class="trait-bar-item">
      <div class="trait-bar-top"><span class="trait-name" style="color:${info.color}">${info.name}</span><span class="trait-pct">EQ ${eq}</span></div>
      <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${bp}%;background:${info.color}"></div></div>
      <p style="font-size:.78rem;color:var(--text-2);margin-top:5px">${info.desc}</p>
    </div>`;
  }).join('');

  document.getElementById('eq-results').innerHTML=`
  <div class="result-score-wrap">
    <div class="score-ring-wrap" style="position:relative">
      <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
        <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
        <circle class="score-ring-fill" id="eq-ring" cx="65" cy="65" r="55"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="score-ring-num">${totalEQ}</div><div class="score-ring-unit">EQ score</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">${totalEQ>=115?'Your emotional intelligence is genuinely high. You process, understand, and manage emotions with exceptional skill — a strong predictor of life success and relationship quality.':totalEQ>=95?'Your EQ is solid and functional. You navigate emotions well in most situations, with some room to deepen specific dimensions.':'Your EQ has room to grow. Emotional intelligence is one of the most trainable cognitive skills — mindfulness, therapy, and deliberate practice all show measurable gains.'}</p>
      <div class="result-percentile" style="background:${color}22;color:${color}">Higher than ${p}% of people</div>
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="eq-bell" style="width:100%;display:block"></canvas></div>
  <div class="trait-bars" style="margin-top:20px">${bars}</div>
  <div class="result-breakdown" style="margin-top:20px">
    ${ORDER.map(b=>`<div class="breakdown-item"><div class="b-label">${BRANCHES[b].name.split(' ')[0]}</div><div class="b-val" style="color:${BRANCHES[b].color}">${eqScores[b]}</div></div>`).join('')}
    <div class="breakdown-item"><div class="b-label">Overall EQ</div><div class="b-val" style="color:${color}">${totalEQ}</div><div class="b-sub">avg: 100</div></div>
  </div>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="EQTest.copy()">📋 Copy Result</button>
    <button class="share-btn" onclick="EQTest.tweet()">𝕏 Share on X</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="EQTest.reset()">↺ Retake</button></div>`;
  document.getElementById('eq-results').classList.add('show');
  window._eqResult={totalEQ,p,text};
  const ring=document.getElementById('eq-ring');
  ring.style.stroke=color;ring.setAttribute('stroke-dasharray',circ);ring.setAttribute('stroke-dashoffset',circ);
  setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
  setTimeout(()=>document.querySelectorAll('.trait-bar-fill').forEach(b=>{const w=b.style.width;b.style.width='0';setTimeout(()=>{b.style.transition='width 1s cubic-bezier(.4,0,.2,1)';b.style.width=w;},50);}),100);
  requestAnimationFrame(()=>window.drawBellCurve?.('eq-bell',p,color));
}

window.EQTest={
  start(){current=0;answers={};renderQ();},
  answer(val){
    answers[current]=val;
    document.querySelectorAll('.likert-btn').forEach((b,i)=>{ if(i===val-1) b.classList.add('selected'); });
    setTimeout(()=>{ current++; if(current>=ITEMS.length) showResults(); else renderQ(); },280);
  },
  reset(){answers={};current=0;renderShell();},
  copy(){const r=window._eqResult;if(!r)return;const t=`My EQ score: ${r.totalEQ} — ${r.text} (${(window.ordinal?window.ordinal(r.p):r.p+'th')} percentile) ❤️ Test yours: coreskillai.com`;navigator.clipboard?.writeText(t);},
  tweet(){const r=window._eqResult;if(!r)return;const t=`My EQ score: ${r.totalEQ} — ${r.text} ❤️`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

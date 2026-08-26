/* CoreSkillAI — Focus & Attention Test (Stroop Effect) */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}

const COLORS=[
  {name:'Red',   hex:'#ef4444'},
  {name:'Blue',  hex:'#3b82f6'},
  {name:'Green', hex:'#10b981'},
  {name:'Yellow',hex:'#f59e0b'},
  {name:'Purple',hex:'#8b5cf6'},
];

// Stroop words in each language — uppercase for interference effect
const WORDS={
  Red:   {en:'RED',   es:'ROJO',     pt:'VERMELHO', fr:'ROUGE', de:'ROT', it:'ROSSO', nl:'ROOD', pl:'CZERWONY', ru:'КРАСНЫЙ', tr:'KIRMIZI', ro:'ROȘU', sv:'RÖD', da:'RØD', no:'RØD', fi:'PUNAINEN', id:'MERAH'},
  Blue:  {en:'BLUE',  es:'AZUL',     pt:'AZUL',     fr:'BLEU',  de:'BLAU', it:'BLU', nl:'BLAUW', pl:'NIEBIESKI', ru:'СИНИЙ', tr:'MAVİ', ro:'ALBASTRU', sv:'BLÅ', da:'BLÅ', no:'BLÅ', fi:'SININEN', id:'BIRU'},
  Green: {en:'GREEN', es:'VERDE',    pt:'VERDE',     fr:'VERT',  de:'GRÜN', it:'VERDE', nl:'GROEN', pl:'ZIELONY', ru:'ЗЕЛЁНЫЙ', tr:'YEŞİL', ro:'VERDE', sv:'GRÖN', da:'GRØN', no:'GRØNN', fi:'VIHREÄ', id:'HIJAU'},
  Yellow:{en:'YELLOW',es:'AMARILLO', pt:'AMARELO',   fr:'JAUNE', de:'GELB', it:'GIALLO', nl:'GEEL', pl:'ŻÓŁTY', ru:'ЖЁЛТЫЙ', tr:'SARI', ro:'GALBEN', sv:'GUL', da:'GUL', no:'GUL', fi:'KELTAINEN', id:'KUNING'},
  Purple:{en:'PURPLE',es:'PÚRPURA',  pt:'ROXO',      fr:'VIOLET',de:'LILA', it:'VIOLA', nl:'PAARS', pl:'FIOLETOWY', ru:'ФИОЛЕТОВЫЙ', tr:'MOR', ro:'MOV', sv:'LILA', da:'LILLA', no:'LILLA', fi:'VIOLETTI', id:'UNGU'},
};
function colorWord(name){
  const lang=window.I18n?.lang||window.PAGE_LANG||'en';
  return (WORDS[name]||{})[lang]||(WORDS[name]||{}).en||name.toUpperCase();
}

const TOTAL=30;
let current=0, correct=0, startTime=0, times=[], phase='idle';

function genItem(){
  const word  = COLORS[Math.floor(Math.random()*COLORS.length)];
  let ink;
  do { ink=COLORS[Math.floor(Math.random()*COLORS.length)]; } while(ink===word && Math.random()>.3);
  const congruent= word===ink;
  return {word:word.name, ink, congruent};
}

let items=[];
function buildItems(){ items=Array.from({length:TOTAL},genItem); }

function pct(avgMs, acc){
  const composite = (acc*100) - (avgMs/12);
  const min=30, max=80;
  return Math.max(1,Math.min(99,Math.round((composite-min)/(max-min)*96+2)));
}
function label(p){
  if(p>=90) return{text:'Exceptional Focus 🎯',color:'#6366f1'};
  if(p>=75) return{text:'Superior',color:'#8b5cf6'};
  if(p>=55) return{text:'Above Average',color:'#10b981'};
  if(p>=40) return{text:'Average',color:'#06b6d4'};
  if(p>=25) return{text:'Below Average',color:'#f59e0b'};
  return{text:'Developing',color:'#ef4444'};
}

function renderShell(){
  const colorBtns=COLORS.map(c=>`
    <button class="color-btn" style="background:${c.hex}20;border-color:${c.hex};color:${c.hex}" onclick="FocusTest.pick('${c.name}')">${_t('color_'+c.name.toLowerCase(),c.name)}</button>`
  ).join('');
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('foc_stroop_title','The Stroop Effect')}</h3>
    <ul>
      <li>${_t('foc_stroop1','A colored word will appear. Press the button matching the <strong>ink color</strong>.')}</li>
      <li>${_t('foc_stroop2','Ignore what the word says — respond to the <strong>color you see</strong>.')}</li>
      <li>${_t('foc_stroop3',TOTAL+' items. Speed and accuracy both count.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🎯 ${_t('foc_title','Focus & Attention')}</span>
      <div id="foc-meta" style="font-size:.8rem;color:var(--text-3)">0 / ${TOTAL}</div>
    </div>
    <div class="test-ui-body" id="foc-body" style="flex-direction:column;gap:24px">
      <div id="foc-stroop-area" style="display:none;flex-direction:column;align-items:center;gap:24px">
        <div class="stroop-word" id="foc-word">WORD</div>
        <div class="color-buttons">${colorBtns}</div>
      </div>
      <div id="foc-start-area">
        <p style="color:var(--text-2);text-align:center">${_t('foc_start_desc','Press the color of the <strong>ink</strong>, not the meaning of the word!')}</p>
        <button class="btn btn-primary" onclick="FocusTest.start()">${_t('foc_start_btn','Start Test')}</button>
      </div>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="foc-prog" style="width:0%"></div></div>
    </div>
  </div>
  <div class="results-panel" id="foc-results"></div>`;
}

function showItem(){
  const item=items[current];
  const w=document.getElementById('foc-word');
  if(w){ w.textContent=colorWord(item.word); w.style.color=item.ink.hex; }
  document.getElementById('foc-meta').textContent=`${current+1} / ${TOTAL}`;
  document.getElementById('foc-prog').style.width=`${(current/TOTAL)*100}%`;
  startTime=performance.now();
}

function showFeedback(ok){
  const w=document.getElementById('foc-word');
  if(w){w.style.opacity='0.3';}
  setTimeout(()=>{if(w)w.style.opacity='1';},180);
}

function showResults(){
  const avgMs= times.length?Math.round(times.reduce((a,b)=>a+b,0)/times.length):1200;
  const acc=correct/TOTAL;
  const p=pct(avgMs,acc);
  const {text,color}=label(p);
  const circ=2*Math.PI*55;

  document.getElementById('foc-results').innerHTML=`
  <div class="result-score-wrap">
    <div class="score-ring-wrap" style="position:relative">
      <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
        <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
        <circle class="score-ring-fill" id="foc-ring" cx="65" cy="65" r="55"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="score-ring-num">${Math.round(acc*100)}%</div><div class="score-ring-unit">accuracy</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">${(p>=75?_t('foc_res_high',"Excellent cognitive control. You suppressed the Stroop interference quickly and accurately, which reflects strong executive function."):p>=50?_t('foc_res_mid',"Solid focus. {a}% accuracy at {ms}ms per response is above the typical range — the Stroop effect is notoriously hard to fight."):_t('foc_res_low',"The Stroop effect got you, and that is perfectly normal: it shows your brain reads words automatically. Practice improves this measurably.")).replace('{a}',Math.round(acc*100)).replace('{ms}',avgMs)}</p>
      <div class="result-percentile" style="background:${color}22;color:${color}">${_t('percentile_prefix','Better than')} ${p}% ${_t('percentile_suffix','of people')}</div>
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="foc-bell" style="width:100%;display:block"></canvas></div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">${_t('typ_accuracy','Accuracy')}</div><div class="b-val" style="color:var(--primary)">${Math.round(acc*100)}%</div></div>
    <div class="breakdown-item"><div class="b-label">Avg Speed</div><div class="b-val">${avgMs}ms</div></div>
    <div class="breakdown-item"><div class="b-label">Correct</div><div class="b-val" style="color:var(--success)">${correct}</div><div class="b-sub">of ${TOTAL}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${p}</div></div>
  </div>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="FocusTest.copy()">📋 ${_t('share_copy','Copy Result')}</button>
    <button class="share-btn" onclick="FocusTest.tweet()">𝕏 ${_t('share_tweet','Share on X')}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="FocusTest.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  document.getElementById('foc-results').classList.add('show');
  window._focResult={avgMs,acc:Math.round(acc*100),p,text};
  const ring=document.getElementById('foc-ring');
  ring.style.stroke=color;ring.setAttribute('stroke-dasharray',circ);ring.setAttribute('stroke-dashoffset',circ);
  setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
  requestAnimationFrame(()=>window.drawBellCurve?.('foc-bell',p,color));
}

window.FocusTest={
  start(){
    current=0;correct=0;times=[];phase='running';
    buildItems();
    document.getElementById('foc-start-area').style.display='none';
    document.getElementById('foc-stroop-area').style.display='flex';
    showItem();
  },
  pick(colorName){
    if(phase!=='running') return;
    const rt=performance.now()-startTime;
    times.push(rt);
    const item=items[current];
    if(item.ink.name===colorName) correct++;
    showFeedback(item.ink.name===colorName);
    current++;
    if(current>=TOTAL){ phase='done'; setTimeout(showResults,300); }
    else showItem();
  },
  reset(){phase='idle';current=0;correct=0;times=[];renderShell();},
  copy(){const r=window._focResult;if(!r)return;const t=`Focus test: ${r.acc}% accuracy at ${r.avgMs}ms — ${r.text} (${(window.ordinal?window.ordinal(r.p):r.p+'th')} percentile) 🎯 coreskillai.com`;navigator.clipboard?.writeText(t).then(()=>{const b=document.getElementById('share-copy');if(b){b.textContent='✓ Copied!';setTimeout(()=>b.textContent=`📋 ${_t('share_copy','Copy Result')}`,2000);}});},
  tweet(){const r=window._focResult;if(!r)return;const t=`Stroop test: ${r.acc}% accuracy, ${r.avgMs}ms avg — ${r.text} 🎯`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

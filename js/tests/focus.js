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
  Red:   {en:'RED',   es:'ROJO',     pt:'VERMELHO', fr:'ROUGE', de:'ROT', it:'ROSSO', nl:'ROOD', pl:'CZERWONY', ru:'КРАСНЫЙ', tr:'KIRMIZI', ro:'ROȘU', sv:'RÖD', da:'RØD', no:'RØD', fi:'PUNAINEN', id:'MERAH', uk:'ЧЕРВОНИЙ', bg:'ЧЕРВЕНО', sr:'ЦРВЕНА', mk:'ЦРВЕНА', el:'ΚΟΚΚΙΝΟ', cs:'ČERVENÁ', hr:'CRVENA', sk:'ČERVENÁ', sl:'RDEČA', hu:'PIROS', lt:'RAUDONA', lv:'SARKANS', et:'PUNANE', ar:'أحمر', he:'אדום', fa:'قرمز', hi:'लाल', ja:'あか', vi:'Đỏ', ms:'Merah', tl:'Pula', af:'Rooi', sq:'E kuqe', sw:'Nyekundu', th:'แดง', ko:'빨강', zh:'红色'},
  Blue:  {en:'BLUE',  es:'AZUL',     pt:'AZUL',     fr:'BLEU',  de:'BLAU', it:'BLU', nl:'BLAUW', pl:'NIEBIESKI', ru:'СИНИЙ', tr:'MAVİ', ro:'ALBASTRU', sv:'BLÅ', da:'BLÅ', no:'BLÅ', fi:'SININEN', id:'BIRU', uk:'СИНІЙ', bg:'СИНЬО', sr:'ПЛАВА', mk:'СИНА', el:'ΜΠΛΕ', cs:'MODRÁ', hr:'PLAVA', sk:'MODRÁ', sl:'MODRA', hu:'KÉK', lt:'MĖLYNA', lv:'ZILS', et:'SININE', ar:'أزرق', he:'כחול', fa:'آبی', hi:'नीला', ja:'あお', vi:'Xanh dương', ms:'Biru', tl:'Asul', af:'Blou', sq:'Blu', sw:'Buluu', th:'น้ำเงิน', ko:'파랑', zh:'蓝色'},
  Green: {en:'GREEN', es:'VERDE',    pt:'VERDE',     fr:'VERT',  de:'GRÜN', it:'VERDE', nl:'GROEN', pl:'ZIELONY', ru:'ЗЕЛЁНЫЙ', tr:'YEŞİL', ro:'VERDE', sv:'GRÖN', da:'GRØN', no:'GRØNN', fi:'VIHREÄ', id:'HIJAU', uk:'ЗЕЛЕНИЙ', bg:'ЗЕЛЕНО', sr:'ЗЕЛЕНА', mk:'ЗЕЛЕНА', el:'ΠΡΑΣΙΝΟ', cs:'ZELENÁ', hr:'ZELENA', sk:'ZELENÁ', sl:'ZELENA', hu:'ZÖLD', lt:'ŽALIA', lv:'ZAĻŠ', et:'ROHELINE', ar:'أخضر', he:'ירוק', fa:'سبز', hi:'हरा', ja:'みどり', vi:'Xanh lá', ms:'Hijau', tl:'Berde', af:'Groen', sq:'Jeshile', sw:'Kijani', th:'เขียว', ko:'초록', zh:'绿色'},
  Yellow:{en:'YELLOW',es:'AMARILLO', pt:'AMARELO',   fr:'JAUNE', de:'GELB', it:'GIALLO', nl:'GEEL', pl:'ŻÓŁTY', ru:'ЖЁЛТЫЙ', tr:'SARI', ro:'GALBEN', sv:'GUL', da:'GUL', no:'GUL', fi:'KELTAINEN', id:'KUNING', uk:'ЖОВТИЙ', bg:'ЖЪЛТО', sr:'ЖУТА', mk:'ЖОЛТА', el:'ΚΙΤΡΙΝΟ', cs:'ŽLUTÁ', hr:'ŽUTA', sk:'ŽLTÁ', sl:'RUMENA', hu:'SÁRGA', lt:'GELTONA', lv:'DZELTENS', et:'KOLLANE', ar:'أصفر', he:'צהוב', fa:'زرد', hi:'पीला', ja:'きいろ', vi:'Vàng', ms:'Kuning', tl:'Dilaw', af:'Geel', sq:'E verdhë', sw:'Njano', th:'เหลือง', ko:'노랑', zh:'黄色'},
  Purple:{en:'PURPLE',es:'PÚRPURA',  pt:'ROXO',      fr:'VIOLET',de:'LILA', it:'VIOLA', nl:'PAARS', pl:'FIOLETOWY', ru:'ФИОЛЕТОВЫЙ', tr:'MOR', ro:'MOV', sv:'LILA', da:'LILLA', no:'LILLA', fi:'VIOLETTI', id:'UNGU', uk:'ФІОЛЕТОВИЙ', bg:'ЛИЛАВО', sr:'ЉУБИЧАСТА', mk:'ВИОЛЕТОВА', el:'ΜΟΒ', cs:'FIALOVÁ', hr:'LJUBIČASTA', sk:'FIALOVÁ', sl:'VIJOLIČNA', hu:'LILA', lt:'VIOLETINĖ', lv:'VIOLETS', et:'LILLA', ar:'بنفسجي', he:'סגול', fa:'بنفش', hi:'बैंगनी', ja:'むらさき', vi:'Tím', ms:'Ungu', tl:'Lila', af:'Pers', sq:'Vjollcë', sw:'Zambarau', th:'ม่วง', ko:'보라', zh:'紫色'},
};
function colorWord(name){
  const lang=window.I18n?.lang||window.PAGE_LANG||'en';
  return (WORDS[name]||{})[lang]||(WORDS[name]||{}).en||name.toUpperCase();
}

const TOTAL=32;                    // 16 congruent + 16 incongruent
let current=0, correct=0, startTime=0, trials=[], phase='idle';

// THE STROOP EFFECT IS A DIFFERENCE, NOT A SPEED.
// The previous version drew congruency at random with a lopsided rule
// (`while(ink===word && Math.random()>.3)`), never recorded which trials were
// congruent, and scored `accuracy*100 - avgMs/12` - an invented formula. That
// measures general quickness, which is the one thing a Stroop task is NOT for.
// The actual measure is the interference effect: how much SLOWER you are when
// the word fights the ink. That requires a balanced, controlled design.
function buildItems(){
  const out=[];
  for(let i=0;i<TOTAL/2;i++){
    const c=COLORS[i%COLORS.length];
    out.push({word:c.name, ink:c, congruent:true});          // word matches ink
  }
  for(let i=0;i<TOTAL/2;i++){
    const w=COLORS[i%COLORS.length];
    let ink; do { ink=COLORS[Math.floor(Math.random()*COLORS.length)]; } while(ink===w);
    out.push({word:w.name, ink, congruent:false});           // word fights ink
  }
  for(let i=out.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; }
  items=out;
}
let items=[];

const median=a=>{ if(!a.length) return 0; const s=a.slice().sort((x,y)=>x-y); const m=s.length>>1;
  return s.length%2 ? s[m] : (s[m-1]+s[m])/2; };

// Only CORRECT trials count toward the interference effect - a wrong answer is
// not a measurement of how long the conflict took to resolve. Anticipations and
// lapses are discarded the same way a lab task would discard them.
function analyse(){
  const ok = trials.filter(t=>t.ok && t.ms>=200 && t.ms<=3000);
  const con = ok.filter(t=>t.congruent).map(t=>t.ms);
  const inc = ok.filter(t=>!t.congruent).map(t=>t.ms);
  const mCon = median(con), mInc = median(inc);
  return {
    acc: correct/TOTAL,
    conMs: Math.round(mCon),
    incMs: Math.round(mInc),
    interference: (con.length>=3 && inc.length>=3) ? Math.round(mInc-mCon) : null,
    usable: ok.length,
  };
}

// Lower interference = better cognitive control. A typical Stroop effect is
// roughly 50-150 ms; near zero is exceptional, above ~250 ms is a large effect.
// Accuracy gates it: fast responding with poor accuracy is not control.
function pct(a){
  if(a.interference===null || a.acc<0.6) return null;   // not enough clean data
  const eff=a.interference;
  const z=(120-eff)/70;                                  // centred on a 120 ms effect
  const t=1/(1+0.2316419*Math.abs(z));
  const k=[0.319381530,-0.356563782,1.781477937,-1.821255978,1.330274429];
  let poly=0,tp=t; k.forEach(c=>{poly+=c*tp;tp*=t;});
  const d=0.3989423*Math.exp(-z*z/2)*poly;
  let p=(z>=0?1-d:d)*100;
  p*= (0.7 + 0.3*a.acc);                                 // accuracy penalty
  return Math.max(1,Math.min(99,Math.round(p)));
}
function label(p){
  if(p>=90) return{text:_t('rt_r_exceptional','Exceptional')+' 🎯',color:'#6366f1'};
  if(p>=75) return{text:_t('rt_r_superior','Superior'),color:'#8b5cf6'};
  if(p>=55) return{text:_t('rt_r_above','Above Average'),color:'#10b981'};
  if(p>=40) return{text:_t('rt_r_average','Average'),color:'#06b6d4'};
  if(p>=25) return{text:_t('rt_r_below','Below Average'),color:'#f59e0b'};
  return{text:_t('rt_r_practice','Keep Practicing'),color:'#ef4444'};
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
        <div class="stroop-word" id="foc-word"></div>
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
  const a=analyse();
  const acc=a.acc;
  const p=pct(a);
  const measured = p!==null;
  const {text,color}= measured ? label(p) : {text:_t('foc_unscored','Not enough clean responses'),color:'#f59e0b'};
  const circ=2*Math.PI*55;

  document.getElementById('foc-results').innerHTML=`
  <div class="result-score-wrap">
    <div class="score-ring-wrap" style="position:relative">
      <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
        <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
        <circle class="score-ring-fill" id="foc-ring" cx="65" cy="65" r="55"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="score-ring-num">${measured? a.interference+'ms' : '—'}</div><div class="score-ring-unit">${_t('foc_interference',"Stroop effect")}</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">${measured
        ? _t('foc_res_new',"You answered {c}ms on matching words and {i}ms when the word fought the ink. That {d}ms gap is the Stroop effect — the cost of overriding automatic reading. Almost everyone shows one; a smaller gap means stronger cognitive control.")
            .replace('{c}',a.conMs).replace('{i}',a.incMs).replace('{d}',a.interference)
        : _t('foc_res_unscored',"Too few clean responses to measure the Stroop effect. It needs enough correct answers of each type, with response times that are neither guesses nor long pauses. Try again without interruptions.")}</p>
      ${measured?`<div class="result-percentile" style="background:${color}22;color:${color}">${_t('percentile_prefix','Better than')} ${p}% ${_t('percentile_suffix','of people')}</div>`:''}
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="foc-bell" style="width:100%;display:block"></canvas></div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">${_t('foc_congruent','Matching')}</div><div class="b-val" style="color:var(--success)">${a.conMs}ms</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('foc_incongruent','Conflicting')}</div><div class="b-val" style="color:var(--danger)">${a.incMs}ms</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('typ_accuracy','Accuracy')}</div><div class="b-val">${Math.round(acc*100)}%</div><div class="b-sub">${correct} ${_t('rt_of',"of")} ${TOTAL}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${measured?p:'—'}</div></div>
  </div>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="FocusTest.copy()">📋 ${_t('share_copy','Copy Result')}</button>
    <button class="share-btn" onclick="FocusTest.tweet()">𝕏 ${_t('share_tweet','Share on X')}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="FocusTest.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  document.getElementById('foc-results').classList.add('show');
  window._focResult={interference:a.interference,acc:Math.round(acc*100),p,text};
  const ring=document.getElementById('foc-ring');
  ring.style.stroke=color;ring.setAttribute('stroke-dasharray',circ);ring.setAttribute('stroke-dashoffset',circ);
  if(measured){
    setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
    requestAnimationFrame(()=>window.drawBellCurve?.('foc-bell',p,color));
  }
}

window.FocusTest={
  start(){
    current=0;correct=0;trials=[];phase='running';
    buildItems();
    document.getElementById('foc-start-area').style.display='none';
    document.getElementById('foc-stroop-area').style.display='flex';
    showItem();
  },
  pick(colorName){
    if(phase!=='running') return;
    const rt=performance.now()-startTime;
    const item=items[current];
    const ok=item.ink.name===colorName;
    trials.push({ms:rt, ok, congruent:item.congruent});
    if(ok) correct++;
    showFeedback(ok);
    current++;
    if(current>=TOTAL){ phase='done'; setTimeout(showResults,300); }
    else showItem();
  },
  reset(){phase='idle';current=0;correct=0;trials=[];renderShell();},
  copy(){const r=window._focResult;if(!r)return;const t=window.shareText('foc_result_label', r.interference+'ms', r.text, r.p);navigator.clipboard?.writeText(t).then(()=>{const b=document.getElementById('share-copy');if(b){b.textContent='✓ '+_t('lbl_copied','Copied!');setTimeout(()=>b.textContent=`📋 ${_t('share_copy','Copy Result')}`,2000);}});},
  tweet(){const r=window._focResult;if(!r)return;const t=window.shareText('foc_result_label', r.interference+'ms', r.text, r.p);window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

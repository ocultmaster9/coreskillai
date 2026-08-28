/* CoreSkillAI — Reaction Time Test */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
const MAX_TRIALS = 5;
let trials = [], state = 'idle', timer = null, t0 = 0;

// Percentile from reaction time in ms (normal distribution, mean=261ms, sd=51ms)
// Source: Jain et al. 2015, replicated across 50k+ participants
function pct(ms) {
  const z = (ms - 261) / 51;
  // faster = higher percentile: 1 - CDF
  const p = 1 - normalCDF(z);
  return Math.max(1, Math.min(99, Math.round(p * 100)));
}
function normalCDF(z) {
  const a=[0.319381530,-0.356563782,1.781477937,-1.821255978,1.330274429];
  const t2=1/(1+0.2316419*Math.abs(z));
  let poly=0; let tp=t2;
  a.forEach(c=>{poly+=c*tp;tp*=t2;});
  const d=0.3989423*Math.exp(-z*z/2)*poly;
  return z>=0?1-d:d;
}

function label(p) {
  if(p>=95) return {text:_t('rt_r_exceptional','Exceptional')+' ⚡',color:'#6366f1'};
  if(p>=80) return {text:_t('rt_r_superior','Superior'),color:'#8b5cf6'};
  if(p>=60) return {text:_t('rt_r_above','Above Average'),color:'#10b981'};
  if(p>=40) return {text:_t('rt_r_average','Average'),color:'#06b6d4'};
  if(p>=20) return {text:_t('rt_r_below','Below Average'),color:'#f59e0b'};
  return {text:_t('rt_r_practice','Keep Practicing'),color:'#ef4444'};
}

function render() {
  const root = document.getElementById('test-root');
  root.innerHTML = `
  <div class="instruction-card">
    <h3>${_t('rt_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('rt_how1','A box will appear. When it turns green, click it as fast as possible.')}</li>
      <li>${_t('rt_how2',"You'll complete "+MAX_TRIALS+" rounds. Your fastest average wins.")}</li>
      <li>${_t('rt_how3',"Don't click early — wait for green!")}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">⚡ ${_t('rt_title',"Reaction Time Test")}</span>
      <div class="test-progress">
        <span id="rt-trial-label" style="font-size:.8rem;color:var(--text-3)">${_t('rt_round',"Round")} 1 ${_t('rt_of',"of")} ${MAX_TRIALS}</span>
        <div class="progress-dots" id="rt-dots">
          ${Array.from({length:MAX_TRIALS},(_,i)=>`<div class="progress-dot" id="rt-dot-${i}"></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="test-ui-body">
      <div class="rt-box rt-idle" id="rt-box" role="button" tabindex="0" aria-label="Reaction target">
        ${_t('rt_click_start','Click Start to begin')}
      </div>
      <div class="rt-trials" id="rt-trials"></div>
      <button class="btn btn-primary" id="rt-start-btn" onclick="RTTest.start()">${_t('btn_start_test',"Start Test")}</button>
    </div>
  </div>
  <div class="results-panel" id="rt-results">
    <div class="result-score-wrap">
      <div>
        <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
          <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
          <circle class="score-ring-fill" id="rt-ring" cx="65" cy="65" r="55"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none" id="rt-ring-text-wrap">
          <div class="score-ring-num" id="rt-avg-ms">--</div>
          <div class="score-ring-unit">ms ${_t('rt_average',"Average")}</div>
        </div>
      </div>
      <div class="score-ring-wrap" style="position:relative"><!-- placeholder --></div>
      <div class="result-info">
        <h2 id="rt-result-label">${_t('rt_result_label',"Your Reaction Time")}</h2>
        <p class="result-desc" id="rt-result-desc"></p>
        <div class="result-percentile" id="rt-pct-badge"></div>
      </div>
    </div>
    <div class="bell-curve-wrap">
      <canvas id="rt-bell" style="width:100%;height:auto;display:block;border-radius:8px"></canvas>
    </div>
    <div class="result-breakdown" id="rt-breakdown"></div>
    <div class="share-row">
      <button class="share-btn" id="share-copy" onclick="RTTest.copyResult()">📋 ${_t('share_copy',"Copy Result")}</button>
      <button class="share-btn" onclick="RTTest.tweetResult()">𝕏 ${_t('share_tweet',"Share on X")}</button>
    </div>
    <div style="text-align:center;margin-top:20px">
      <button class="btn btn-secondary" onclick="RTTest.reset()">↺ ${_t('btn_try_again',"Try Again")}</button>
    </div>
  </div>`;

  // keyboard support
  document.getElementById('rt-box').addEventListener('keydown', e => {
    if(e.key===' '||e.key==='Enter') RTTest.click();
  });
}

function updateDots(current) {
  for(let i=0;i<MAX_TRIALS;i++){
    const d=document.getElementById(`rt-dot-${i}`);
    if(d){ d.className='progress-dot'+(i<current?' done':i===current?' active':''); }
  }
  const lbl=document.getElementById('rt-trial-label');
  if(lbl) lbl.textContent=`${_t('rt_round','Round')} ${Math.min(current+1,MAX_TRIALS)} ${_t('rt_of','of')} ${MAX_TRIALS}`;
}

function showResults() {
  const avg  = trials.reduce((a,b)=>a+b,0)/trials.length;
  const best = Math.min(...trials);
  const p    = pct(avg);
  const {text,color} = label(p);

  document.getElementById('rt-avg-ms').textContent = Math.round(avg);
  document.getElementById('rt-result-label').textContent = text;
  document.getElementById('rt-pct-badge').textContent = `${_t('percentile_prefix','Faster than')} ${p}% ${_t('percentile_suffix','of people')}`;
  document.getElementById('rt-pct-badge').style.background = color+'22';
  document.getElementById('rt-pct-badge').style.color = color;

  const desc = (p>=80
    ? _t('rt_res_high',"Outstanding reflexes. A {ms}ms average puts you in the top {top}% globally — athletes and gamers often score in this range.")
    : p>=50
    ? _t('rt_res_mid',"Solid reaction time. A {ms}ms average is above the global mean of 261ms. Regular practice can push this further.")
    : _t('rt_res_low',"A {ms}ms average is around or below the global mean. Fatigue, age and screen distance all affect this — try again when fresh.")
  ).replace('{ms}', Math.round(avg)).replace('{top}', 100-p);
  document.getElementById('rt-result-desc').textContent = desc;

  // ring animation
  const ring = document.getElementById('rt-ring');
  const R=55, circ=2*Math.PI*R;
  ring.style.stroke = color;
  ring.setAttribute('stroke-dasharray', circ);
  ring.setAttribute('stroke-dashoffset', circ);
  setTimeout(()=>{
    ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';
    ring.setAttribute('stroke-dashoffset', circ*(1-p/100));
  },100);

  // fix ring text position (absolute inside relative)
  const wrap=document.querySelector('.score-ring-wrap');
  if(wrap){
    wrap.style.position='relative';
    const tw=document.getElementById('rt-ring-text-wrap');
    if(tw) tw.style.position='absolute';
  }

  // breakdown
  document.getElementById('rt-breakdown').innerHTML = trials.map((ms,i)=>`
    <div class="breakdown-item">
      <div class="b-label">Round ${i+1}</div>
      <div class="b-val" style="color:${ms===best?'var(--success)':'var(--text)'}">${Math.round(ms)}ms</div>
      <div class="b-sub">${ms===best?'★ Best':''}</div>
    </div>`).join('')+`
    <div class="breakdown-item">
      <div class="b-label">Average</div>
      <div class="b-val" style="color:var(--primary)">${Math.round(avg)}ms</div>
      <div class="b-sub">All rounds</div>
    </div>`;

  // bell curve
  document.getElementById('rt-results').classList.add('show');
  requestAnimationFrame(()=>{
    if(window.drawBellCurve) drawBellCurve('rt-bell', p, color);
  });

  // store result for sharing
  window._rtResult = {avg: Math.round(avg), pct: p, text};
}

window.RTTest = {
  start() {
    trials = []; state='waiting';
    document.getElementById('rt-start-btn').style.display='none';
    document.getElementById('rt-results').classList.remove('show');
    updateDots(0);
    this._waitForGreen();
  },
  _waitForGreen() {
    const box = document.getElementById('rt-box');
    box.className='rt-box rt-waiting';
    box.textContent=_t('rt_wait','Wait for green…');
    const delay = 1600 + Math.random()*2800;
    timer = setTimeout(()=>{
      if(state!=='waiting') return;
      state='go'; t0=performance.now();
      box.className='rt-box rt-go';
      box.textContent=_t('rt_go','CLICK NOW!');
    }, delay);
  },
  click() {
    if(state==='idle') return;
    if(state==='waiting') {
      clearTimeout(timer);
      const box=document.getElementById('rt-box');
      box.className='rt-box rt-tooearly';
      box.textContent=_t('rt_too_early','Too early! Wait for green.');
      state='waiting';
      setTimeout(()=>this._waitForGreen(), 1600);
      return;
    }
    if(state==='go') {
      const rt = performance.now()-t0;
      trials.push(rt);
      state='waiting';
      const box=document.getElementById('rt-box');
      box.className='rt-box rt-done';
      box.textContent=`${Math.round(rt)} ms`;

      // update chips
      const chips=document.getElementById('rt-trials');
      const best=Math.min(...trials);
      chips.innerHTML=trials.map((ms,i)=>`<span class="rt-trial-chip${ms===best?' best':''}">${Math.round(ms)}ms</span>`).join('');

      updateDots(trials.length);

      if(trials.length>=MAX_TRIALS){
        state='done';
        setTimeout(()=>showResults(),800);
      } else {
        setTimeout(()=>{ state='waiting'; this._waitForGreen(); },900);
      }
    }
  },
  reset() {
    trials=[]; state='idle'; clearTimeout(timer);
    document.getElementById('rt-results').classList.remove('show');
    document.getElementById('rt-start-btn').style.display='';
    document.getElementById('rt-box').className='rt-box rt-idle';
    document.getElementById('rt-box').textContent=_t('rt_click_start','Click Start to begin');
    document.getElementById('rt-trials').innerHTML='';
    updateDots(-1);
  },
  copyResult() {
    const r=window._rtResult;
    if(!r) return;
    const txt=`My reaction time: ${r.avg}ms — faster than ${r.pct}% of people! (${r.text}) Test yours at coreskillai.com ⚡`;
    navigator.clipboard?.writeText(txt).then(()=>{
      const btn=document.getElementById('share-copy');
      btn.textContent='✓ Copied!'; btn.classList.add('copied');
      setTimeout(()=>{btn.textContent='📋 '+_t('share_copy','Copy Result');btn.classList.remove('copied');},2000);
    });
  },
  tweetResult() {
    const r=window._rtResult;
    if(!r) return;
    const txt=`My reaction time: ${r.avg}ms — faster than ${r.pct}% of people! (${r.text}) 🧠 Test yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(location.href)}`, '_blank','noopener');
  }
};

// bind click/touch on box
document.addEventListener('DOMContentLoaded', ()=>{
  render();
  document.addEventListener('click', e=>{
    const box=document.getElementById('rt-box');
    if(box&&box.contains(e.target)) RTTest.click();
  });
  document.addEventListener('keydown', e=>{
    if(e.code==='Space'&&state!=='idle'){ e.preventDefault(); RTTest.click(); }
  });
});
})();

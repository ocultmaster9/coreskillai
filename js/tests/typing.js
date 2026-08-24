/* CoreSkillAI — Typing Speed Test */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}

const PASSAGES={
  en:[
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
    "Science is the systematic study of the natural world through observation and experiment. It builds knowledge and tests ideas against reality.",
    "The greatest wealth is to live content with little. Wisdom begins in wonder. To know what you know and what you do not know — that is knowledge.",
    "In the beginning was the word. Language shapes thought, and thought shapes the world. Every great idea started as a sentence in someone's mind.",
    "The universe is under no obligation to make sense to you. But every question you ask brings you one step closer to understanding its vast mystery.",
    "Technology is best when it brings people together. The internet gave a voice to every person on the planet, for better and for worse.",
    "Reading is to the mind what exercise is to the body. Every book you finish is a conversation with a brilliant mind across time and space.",
    "Creativity is intelligence having fun. The secret to doing good research is always to be a little underemployed — give your mind room to wander.",
  ],
  es:[
    "El veloz zorro marrón salta sobre el perro perezoso. La ciencia es el estudio sistemático del mundo natural a través de la observación y la experimentación.",
    "La mayor riqueza es vivir contento con poco. La sabiduría comienza en el asombro. Saber lo que sabes y lo que no sabes — eso es el verdadero conocimiento.",
    "La tecnología es mejor cuando une a las personas. Internet dio voz a cada persona del planeta, para bien y para mal.",
    "Leer es al espíritu lo que el ejercicio es al cuerpo. Cada libro que terminas es una conversación con una mente brillante a través del tiempo.",
    "La creatividad es la inteligencia divirtiéndose. El universo no tiene ninguna obligación de tener sentido para ti, pero cada pregunta que haces te acerca más.",
    "En el principio era la palabra. El lenguaje da forma al pensamiento y el pensamiento da forma al mundo. Toda gran idea comenzó como una oración.",
    "La ciencia construye conocimiento y pone a prueba las ideas contra la realidad observable a través de experimentos y datos cuidadosamente recopilados.",
    "Las galaxias se extienden más allá de lo que podemos ver, y cada estrella podría tener mundos que orbitan a su alrededor esperando ser descubiertos.",
  ],
  pt:[
    "A rápida raposa marrom pula sobre o cão preguiçoso. A ciência é o estudo sistemático do mundo natural por meio da observação e do experimento.",
    "A maior riqueza é viver contente com pouco. A sabedoria começa no espanto. Saber o que você sabe e o que não sabe — isso é o verdadeiro conhecimento.",
    "A tecnologia é melhor quando une as pessoas. A internet deu voz a cada pessoa no planeta, para o bem e para o mal.",
    "Ler é para a mente o que o exercício é para o corpo. Cada livro que você termina é uma conversa com uma mente brilhante através do tempo e do espaço.",
    "A criatividade é a inteligência se divertindo. O universo não tem obrigação de fazer sentido para você, mas cada pergunta te aproxima de entender seu mistério.",
    "No princípio era a palavra. A linguagem molda o pensamento, e o pensamento molda o mundo. Toda grande ideia começou como uma frase na mente de alguém.",
    "A ciência constrói conhecimento e testa ideias contra a realidade observável com experimentos e dados cuidadosamente coletados ao longo do tempo.",
    "As galáxias se estendem além do que podemos ver, e cada estrela pode ter mundos orbitando ao seu redor esperando para serem descobertos por nós.",
  ],
  fr:[
    "Le rapide renard brun saute par-dessus le chien paresseux. La science est l'étude systématique du monde naturel par l'observation et l'expérimentation.",
    "La plus grande richesse est de vivre content avec peu. La sagesse commence dans l'émerveillement. Savoir ce que vous savez et ce que vous ne savez pas.",
    "La technologie est meilleure quand elle unit les gens. Internet a donné une voix à chaque personne sur la planète, pour le meilleur et pour le pire.",
    "Lire est à l'esprit ce que l'exercice est au corps. Chaque livre que vous terminez est une conversation avec un esprit brillant à travers le temps.",
    "La créativité est l'intelligence qui s'amuse. L'univers n'a aucune obligation de vous sembler sensé, mais chaque question vous rapproche de son mystère.",
    "Au commencement était le mot. Le langage façonne la pensée, et la pensée façonne le monde. Toute grande idée a commencé comme une phrase dans l'esprit.",
    "La science construit des connaissances et teste des idées contre la réalité observable avec des expériences et des données soigneusement collectées.",
    "Les galaxies s'étendent au-delà de ce que nous pouvons voir, et chaque étoile pourrait avoir des mondes qui l'orbitent attendant d'être découverts.",
  ],
  de:[
    "Der schnelle braune Fuchs springt über den faulen Hund. Die Wissenschaft ist die systematische Erforschung der natürlichen Welt durch Beobachtung.",
    "Der größte Reichtum ist es, mit wenig zufrieden zu leben. Weisheit beginnt mit Staunen. Zu wissen, was man weiß und was man nicht weiß — das ist Wissen.",
    "Technologie ist am besten, wenn sie Menschen zusammenbringt. Das Internet gab jedem Menschen auf dem Planeten eine Stimme, zum Guten und zum Schlechten.",
    "Lesen ist für den Geist, was Sport für den Körper ist. Jedes Buch, das du beendest, ist ein Gespräch mit einem brillanten Geist durch Zeit und Raum.",
    "Kreativität ist Intelligenz beim Spaßhaben. Das Universum ist nicht verpflichtet, dir Sinn zu ergeben, aber jede Frage bringt dich dem Verständnis näher.",
    "Im Anfang war das Wort. Sprache formt Gedanken, und Gedanken formen die Welt. Jede großartige Idee begann als ein Satz im Geist von jemandem.",
    "Wissenschaft baut Wissen auf und testet Ideen gegen die beobachtbare Realität mit Experimenten und sorgfältig gesammelten Daten über einen langen Zeitraum.",
    "Galaxien erstrecken sich über das hinaus, was wir sehen können, und jeder Stern könnte Welten haben, die ihn umkreisen und darauf warten, entdeckt zu werden.",
  ],
};

function getPassage(){
  const lang=window.I18n?.lang||window.PAGE_LANG||'en';
  const pool=PASSAGES[lang]||PASSAGES.en;
  return pool[Math.floor(Math.random()*pool.length)];
}

let passage='', typed='', startTime=0, endTime=0, phase='idle', timerInterval=null, timeLimit=60;

function wpm(chars, seconds){ return Math.round((chars/5)/(seconds/60)); }
function accuracy(original, input){
  let correct=0;
  const len=Math.min(original.length,input.length);
  for(let i=0;i<len;i++) if(original[i]===input[i]) correct++;
  return input.length>0?Math.round((correct/input.length)*100):100;
}
function pct(w){
  const map=[[0,1],[20,5],[30,15],[40,35],[55,50],[70,65],[85,78],[100,88],[120,95],[140,98],[160,99]];
  for(let i=0;i<map.length-1;i++){
    const [w1,p1]=map[i],[w2,p2]=map[i+1];
    if(w<=w2){const t=(w-w1)/(w2-w1);return Math.round(p1+(p2-p1)*t);}
  }
  return 99;
}
function label(w){
  if(w>=120) return{text:'Exceptional Typist ⌨️',color:'#6366f1'};
  if(w>=90)  return{text:'Professional Speed',color:'#8b5cf6'};
  if(w>=70)  return{text:'Above Average',color:'#10b981'};
  if(w>=45)  return{text:'Average',color:'#06b6d4'};
  if(w>=30)  return{text:'Below Average',color:'#f59e0b'};
  return{text:'Beginner',color:'#ef4444'};
}

function renderShell(){
  passage=getPassage();
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('typ_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('typ_how1','Type the passage below as fast and accurately as you can.')}</li>
      <li>${_t('typ_how2','You have <strong>60 seconds</strong>. The timer starts on your first keystroke.')}</li>
      <li>${_t('typ_how3','Errors count against your accuracy score.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">⌨️ ${_t('typ_title','Typing Speed')}</span>
      <div style="display:flex;gap:16px;font-size:.82rem;color:var(--text-3)">
        <span>⏱ <span id="typ-timer">60</span>s</span>
        <span><span id="typ-wpm-live">0</span> ${_t('typ_wpm','WPM')}</span>
      </div>
    </div>
    <div class="test-ui-body" style="flex-direction:column;gap:16px;align-items:stretch">
      <div class="typing-text" id="typ-display"></div>
      <textarea class="typing-input" id="typ-input" rows="3" placeholder="${_t('typ_start_placeholder','Start typing here…')}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
      <div class="typing-stats" id="typ-live-stats" style="justify-content:flex-start;gap:20px">
        <div class="typing-stat-item"><div class="typing-stat-num" id="typ-acc-live">100%</div><div class="typing-stat-label">${_t('typ_accuracy','Accuracy')}</div></div>
        <div class="typing-stat-item"><div class="typing-stat-num" id="typ-chars-live">0</div><div class="typing-stat-label">Characters</div></div>
      </div>
    </div>
  </div>
  <div class="results-panel" id="typ-results"></div>`;
  renderPassage('');
  initInput();
}

function renderPassage(inp){
  const el=document.getElementById('typ-display');
  if(!el) return;
  let html='';
  for(let i=0;i<passage.length;i++){
    const ch=passage[i]==' '?'&nbsp;':passage[i];
    if(i<inp.length){
      html+=`<span style="color:${inp[i]===passage[i]?'var(--primary)':'var(--danger)'};${inp[i]!==passage[i]?'text-decoration:underline':''}">${ch}</span>`;
    } else if(i===inp.length){
      html+=`<span class="cursor"></span><span style="color:var(--text-2)">${ch}</span>`;
    } else {
      html+=`<span style="color:var(--text-2)">${ch}</span>`;
    }
  }
  el.innerHTML=html;
}

function initInput(){
  const inp=document.getElementById('typ-input');
  if(!inp) return;
  inp.addEventListener('input',()=>{
    typed=inp.value;
    if(phase==='idle'&&typed.length>0){
      phase='running'; startTime=Date.now();
      timerInterval=setInterval(()=>{
        const elapsed=(Date.now()-startTime)/1000;
        const left=Math.max(0,timeLimit-Math.round(elapsed));
        const t=document.getElementById('typ-timer'); if(t) t.textContent=left;
        const w=wpm(typed.length,Math.max(1,elapsed));
        const wEl=document.getElementById('typ-wpm-live'); if(wEl) wEl.textContent=w;
        if(left<=0){ clearInterval(timerInterval); endTest(); }
      },500);
    }
    if(phase==='running'){
      renderPassage(typed);
      const acc=accuracy(passage,typed);
      const el=document.getElementById('typ-acc-live'); if(el) el.textContent=acc+'%';
      const ch=document.getElementById('typ-chars-live'); if(ch) ch.textContent=typed.length;
      if(typed.length>=passage.length){ clearInterval(timerInterval); endTime=Date.now(); endTest(); }
    }
  });
  inp.addEventListener('keydown',e=>{
    if(e.key==='Tab'){e.preventDefault();}
  });
}

function endTest(){
  if(phase==='done') return;
  phase='done';
  if(!endTime) endTime=Date.now();
  const secs=(endTime-startTime)/1000;
  const w=wpm(typed.length,secs);
  const acc=accuracy(passage,typed);
  const p=pct(w);
  const {text,color}=label(w);
  const circ=2*Math.PI*55;
  const wpmLabel=_t('typ_wpm','WPM');

  document.getElementById('typ-input').disabled=true;

  document.getElementById('typ-results').innerHTML=`
  <div class="result-score-wrap">
    <div class="score-ring-wrap" style="position:relative">
      <svg class="score-ring-svg" viewBox="0 0 130 130" style="width:130px;height:130px;transform:rotate(-90deg)">
        <circle class="score-ring-bg" cx="65" cy="65" r="55"/>
        <circle class="score-ring-fill" id="typ-ring" cx="65" cy="65" r="55"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div class="score-ring-num">${w}</div><div class="score-ring-unit">${wpmLabel}</div>
      </div>
    </div>
    <div class="result-info">
      <h2>${text}</h2>
      <p class="result-desc">${w>=90?`Impressive speed! ${w} ${wpmLabel} puts you well above the professional threshold. Accuracy: ${acc}%.`:w>=55?`Solid typing speed at ${w} ${wpmLabel}. Above the global average of ~40 WPM. With practice, 80+ WPM is very achievable.`:`Your ${w} ${wpmLabel} is below average, but everyone starts somewhere. Daily 10-minute practice can double your speed within weeks.`}</p>
      <div class="result-percentile" style="background:${color}22;color:${color}">${_t('percentile_prefix','Faster than')} ${p}% ${_t('percentile_suffix','of typists')}</div>
    </div>
  </div>
  <div class="bell-curve-wrap"><canvas id="typ-bell" style="width:100%;display:block"></canvas></div>
  <div class="result-breakdown">
    <div class="breakdown-item"><div class="b-label">${wpmLabel}</div><div class="b-val" style="color:var(--primary)">${w}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('typ_accuracy','Accuracy')}</div><div class="b-val">${acc}%</div></div>
    <div class="breakdown-item"><div class="b-label">Characters</div><div class="b-val">${typed.length}</div></div>
    <div class="breakdown-item"><div class="b-label">${_t('label_percentile','Percentile')}</div><div class="b-val" style="color:${color}">${p}</div></div>
  </div>
  <div class="share-row">
    <button class="share-btn" id="share-copy" onclick="TypTest.copy()">📋 ${_t('share_copy','Copy Result')}</button>
    <button class="share-btn" onclick="TypTest.tweet()">𝕏 ${_t('share_tweet','Share on X')}</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="TypTest.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  document.getElementById('typ-results').classList.add('show');
  window._typResult={wpm:w,acc,p,text};
  const ring=document.getElementById('typ-ring');
  ring.style.stroke=color;ring.setAttribute('stroke-dasharray',circ);ring.setAttribute('stroke-dashoffset',circ);
  setTimeout(()=>{ring.style.transition='stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';ring.setAttribute('stroke-dashoffset',circ*(1-p/100));},100);
  requestAnimationFrame(()=>window.drawBellCurve?.('typ-bell',p,color));
}

window.TypTest={
  reset(){phase='idle';typed='';startTime=0;endTime=0;clearInterval(timerInterval);renderShell();},
  copy(){const r=window._typResult;if(!r)return;const t=`Typing speed: ${r.wpm} ${_t('typ_wpm','WPM')}, ${r.acc}% accuracy — ${r.text} (${(window.ordinal?window.ordinal(r.p):r.p+'th')} percentile) ⌨️ coreskillai.com`;navigator.clipboard?.writeText(t).then(()=>{const b=document.getElementById('share-copy');if(b){b.textContent='✓ Copied!';setTimeout(()=>b.textContent=`📋 ${_t('share_copy','Copy Result')}`,2000);}});},
  tweet(){const r=window._typResult;if(!r)return;const t=`My typing speed: ${r.wpm} ${_t('typ_wpm','WPM')} at ${r.acc}% accuracy — ${r.text} ⌨️`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

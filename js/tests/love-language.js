/* CoreSkillAI - Love Language Test.
 *
 * METHOD
 *  - 25 original statements, five for each of the five ways of giving and
 *    receiving love described by Chapman (1992): words of affirmation, quality
 *    time, gifts, acts of service and physical touch. Rated on a 5-point
 *    agreement scale (not forced choice), so every language gets its own score
 *    and people who value several of them can show it - the main criticism of
 *    forced-choice love-language quizzes (Impett, Park & Muise 2024).
 *  - Score per language = mean answer (1-5) -> 0-100 %. Languages are ranked;
 *    scores within 5 points of the top are reported as shared, and a profile
 *    where all five are within 15 points is reported as balanced.
 *  - Not affiliated with The 5 Love Languages(R), a registered trademark of
 *    The Moody Bible Institute of Chicago.
 */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
const $=id=>document.getElementById(id);
// [key, language, English]
const ITEMS=[
 ['lov_q1','W','I feel loved when my partner tells me they appreciate me.'],
 ['lov_q2','T','I feel loved when my partner gives me their full attention.'],
 ['lov_q3','G','A thoughtful gift, even a small one, makes me feel loved.'],
 ['lov_q4','S','I feel loved when my partner helps with chores without being asked.'],
 ['lov_q5','P','I feel loved when my partner holds my hand or hugs me.'],
 ['lov_q6','T','I treasure time alone together without phones or other distractions.'],
 ['lov_q7','W','Hearing a sincere compliment from my partner means a lot to me.'],
 ['lov_q8','P','A touch on my arm or back makes me feel connected to my partner.'],
 ['lov_q9','G','I keep small presents and souvenirs my partner has given me.'],
 ['lov_q10','S','When my partner takes a task off my plate, I feel cared for.'],
 ['lov_q11','W','A kind note or message from my partner can make my day.'],
 ['lov_q12','G','I feel loved when my partner brings me something that shows they were thinking of me.'],
 ['lov_q13','T','Long, unhurried conversations make me feel close to my partner.'],
 ['lov_q14','P','Sitting close together matters to me.'],
 ['lov_q15','S','Practical help when I am busy or tired means more to me than words.'],
 ['lov_q16','G','A forgotten birthday or anniversary would hurt me.'],
 ['lov_q17','P','I feel distant when we go a long time without physical affection.'],
 ['lov_q18','W','Being praised for my efforts makes me feel valued.'],
 ['lov_q19','S','I feel let down when my partner promises to help and does not follow through.'],
 ['lov_q20','T','Doing things together matters more to me than what we actually do.'],
 ['lov_q21','S','I feel loved when my partner fixes or handles something for me.'],
 ['lov_q22','T','I feel hurt when my partner is distracted while we are spending time together.'],
 ['lov_q23','P','A hug is the best comfort when I am upset.'],
 ['lov_q24','W','Harsh or critical words from my partner hurt me deeply.'],
 ['lov_q25','G','The thought behind a gift means a lot to me.'],
];
const LANGS=['W','T','G','S','P'];
const COL={W:'#6366f1',T:'#14b8a6',G:'#f59e0b',S:'#22c55e',P:'#ec4899'};
const NAME={W:'Words of affirmation',T:'Quality time',G:'Receiving gifts',S:'Acts of service',P:'Physical touch'};
const DESC={
 W:'Spoken and written appreciation, encouragement and "I love you" make you feel valued.',
 T:'Undivided attention and time spent together make you feel close.',
 G:'Thoughtful presents, big or small, show you that you were on someone\'s mind.',
 S:'Practical help and having things taken care of make you feel supported.',
 P:'Hugs, holding hands and closeness make you feel connected and safe.'
};
const TIP={
 W:'For a partner: say what you appreciate, out loud or in a message, and be specific.',
 T:'For a partner: put the phone away and plan regular time that is just for the two of you.',
 G:'For a partner: small, personal surprises count more than price. Remember the dates that matter.',
 S:'For a partner: notice what is weighing on them and take one task off their list without being asked.',
 P:'For a partner: offer everyday touch - a hug hello, holding hands, sitting close.'
};

let cur=0, ans=[], last=null;
const LK=['','Strongly\nDisagree','Disagree','Neutral','Agree','Strongly\nAgree'];
const lk=n=>_t('likert_'+n,LK[n]);
function shell(){
  $('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('lov_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('lov_how1','25 short statements about feeling loved by a partner. Rate how true each one is for you.')}</li>
      <li>${_t('lov_how2','If you are single, think of a past partner or how you would like to be treated. There are no right or wrong answers.')}</li>
      <li>${_t('lov_how3','You get a score for all five love languages, your strongest ones and tips to share with a partner. Takes about 3 minutes.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header"><span class="test-ui-title">${_t('lov_title','Love Language Test')}</span><span id="lov-counter" class="q-counter"></span></div>
    <div class="test-ui-body" id="lov-body">
      <p style="color:var(--text-2)">${_t('lov_start_desc','Find out which ways of being loved matter most to you, with a score for each of the five love languages.')}</p>
      <button class="btn btn-primary" onclick="LoveTest.start()">${_t('btn_start_test','Start Test')}</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)"><div class="q-progress-bar"><div class="q-progress-fill" id="lov-prog" style="width:0%"></div></div></div>
  </div>
  <div class="results-panel" id="lov-results"></div>`;
}
function renderQ(){
  const it=ITEMS[cur];
  $('lov-counter').textContent=`${cur+1} / ${ITEMS.length}`;
  $('lov-prog').style.width=`${cur/ITEMS.length*100}%`;
  const btns=[1,2,3,4,5].map(n=>`<button class="likert-btn${ans[cur]===n?' selected':''}" onclick="LoveTest.answer(${n})"><span class="likert-num">${n}</span><span class="likert-label">${lk(n).replace('\n','<br>')}</span></button>`).join('');
  $('lov-body').innerHTML=`
    <p class="question-text">${_t(it[0],it[2])}</p>
    <div class="likert">${btns}</div>
    <p class="likert-scale-note">1 = ${lk(1).replace('\n',' ')} · 5 = ${lk(5).replace('\n',' ')}</p>
    ${cur>0?`<div style="text-align:center;margin-top:10px"><button class="btn btn-secondary" style="padding:6px 14px;font-size:.85rem" onclick="LoveTest.back()">← ${_t('lov_back','Back')}</button></div>`:''}`;
}
function score(a){
  const sum={}, n={}; LANGS.forEach(l=>{sum[l]=0;n[l]=0;});
  ITEMS.forEach((it,i)=>{ sum[it[1]]+= a[i]||3; n[it[1]]++; });
  const pct={}; LANGS.forEach(l=>pct[l]=Math.round((sum[l]/n[l]-1)/4*100));
  const order=LANGS.slice().sort((x,y)=>pct[y]-pct[x]||LANGS.indexOf(x)-LANGS.indexOf(y));
  const top=order.filter(l=>pct[order[0]]-pct[l]<=5);
  const balanced=pct[order[0]]-pct[order[4]]<=15;
  return {pct, order, top, balanced};
}
const nm=l=>_t('lov_n'+l,NAME[l]);
function results(){
  const r=score(ans); last=r;
  $('lov-counter').textContent=''; $('lov-prog').style.width='100%';
  $('lov-body').innerHTML=`<p>${_t('lov_done','Done. Your results are below.')}</p>`;
  const bar=l=>`<div class="trait-bar-item"><div class="trait-bar-top"><span class="trait-name">${nm(l)}</span><span class="trait-pct">${r.pct[l]}%</span></div>
      <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${r.pct[l]}%;background:${COL[l]}"></div></div>
      <p style="font-size:.85rem;color:var(--text-2);margin-top:6px">${_t('lov_d'+l,DESC[l])}</p>
      ${r.top.includes(l)?`<p style="font-size:.85rem;margin-top:4px">💡 ${_t('lov_tip'+l,TIP[l])}</p>`:''}</div>`;
  const note= r.balanced?_t('lov_balanced','Your five scores are close together. You value several ways of being loved about equally, which research suggests is common - most people appreciate all five.')
            : r.top.length>1?_t('lov_shared','Your top languages are within a few points of each other, so treat them as joint favourites rather than a single winner.'):'';
  $('lov-results').innerHTML=`
    <div style="text-align:center">
      <p style="color:var(--text-2);margin:0">${_t('lov_your_top','Your strongest love language')}</p>
      <div style="font-size:${r.top.length>2?'1.25rem':'1.9rem'};font-weight:800;line-height:1.35">${r.top.map(nm).join(r.top.length>2?' · ':' + ')}</div>
    </div>
    <div class="trait-bars" style="margin-top:14px">${r.order.map(bar).join('')}</div>
    ${note?`<p style="margin-top:14px;padding:10px 14px;border-left:3px solid var(--primary);background:var(--bg-alt);border-radius:8px;font-size:.9rem">${note}</p>`:''}
    <p style="font-size:.8rem;color:var(--text-2);margin-top:14px">${_t('lov_disclaimer','Love languages are a popular idea, not a clinical measure, and research on them is still limited. This test is not affiliated with The 5 Love Languages®, a registered trademark of The Moody Bible Institute of Chicago.')}</p>
    <div class="share-row" style="margin-top:8px"><button class="share-btn" onclick="LoveTest.copy()">📋 ${_t('share_copy','Copy Result')}</button></div>
    <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="LoveTest.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  $('lov-results').classList.add('show');
  setTimeout(()=>$('lov-results').scrollIntoView({behavior:'smooth',block:'start'}),60);
}
window.LoveTest={
  start(){ cur=0; ans=[]; $('lov-results').classList.remove('show'); $('lov-results').innerHTML=''; renderQ(); },
  answer(v){ ans[cur]=v; cur++; if(cur>=ITEMS.length) return results(); renderQ(); },
  back(){ if(cur>0){ cur--; renderQ(); } },
  reset(){ last=null; shell(); },
  copy(){ if(!last) return; navigator.clipboard?.writeText(_t('lov_your_top','Your strongest love language')+': '+last.top.map(nm).join(' + ')+' | '+last.order.map(l=>nm(l)+' '+last.pct[l]+'%').join(', ')+' | coreskillai.com/tests/love-language/'); },
  _score:score, _items:ITEMS
};
document.addEventListener('keydown',e=>{ const b=$('lov-body'); if(!b||!b.querySelector('.likert')) return; const n=+e.key; if(n>=1&&n<=5){ e.preventDefault(); LoveTest.answer(n); } });
document.addEventListener('DOMContentLoaded',shell);
})();

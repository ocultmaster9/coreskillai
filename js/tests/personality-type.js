/* CoreSkillAI - 16 Personality Types Test (Jungian four letters, Big Five items).
 *
 * METHOD
 *  - 48 public-domain IPIP items from the Big Five Aspect Scales (DeYoung,
 *    Quilty & Peterson 2007; ipip.ori.org), 5-point agreement scale.
 *  - McCrae & Costa (1989) showed that the four Myers-Briggs indices are the
 *    Big Five in another form: E-I ~ Extraversion, S-N ~ Openness/Intellect,
 *    T-F ~ Agreeableness, J-P ~ Conscientiousness, while Neuroticism is not
 *    covered. So each letter here is scored from the matching Big Five items:
 *      E/I  10 items Enthusiasm + Assertiveness
 *      N/S  10 items Openness + Intellect
 *      F/T  10 items Compassion + Politeness
 *      J/P  10 items Orderliness + Industriousness
 *      plus 8 Volatility/Withdrawal items shown as "emotional reactivity"
 *      (no letter - the MBTI has no such scale).
 *  - Score per axis = mean keyed answer (1-5) -> 0-100 % toward the first
 *    pole; the letter is the pole above 50 %. The traits are continuous, so the
 *    result shows the percentage and says when a letter is close to the middle.
 *  - Not affiliated with the MBTI, a trademark of The Myers-Briggs Company.
 */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
const $=id=>document.getElementById(id);
// [key, axis, reversed, English]
const ITEMS=[
 ['p16_q1','EI',0,'Make friends easily.'],
 ['p16_q2','SN',0,'Love to reflect on things.'],
 ['p16_q3','TF',0,"Feel others' emotions."],
 ['p16_q4','JP',0,'Like order.'],
 ['p16_q5','R',0,'Worry about things.'],
 ['p16_q6','EI',1,'Am hard to get to know.'],
 ['p16_q7','SN',1,'Seldom daydream.'],
 ['p16_q8','TF',1,"Am not interested in other people's problems."],
 ['p16_q9','JP',1,'Leave my belongings around.'],
 ['p16_q10','R',1,'Rarely get irritated.'],
 ['p16_q11','EI',0,'Take charge.'],
 ['p16_q12','SN',0,'See beauty in things that others might not notice.'],
 ['p16_q13','TF',0,"Sympathize with others' feelings."],
 ['p16_q14','JP',0,'Keep things tidy.'],
 ['p16_q15','R',0,'Get upset easily.'],
 ['p16_q16','EI',1,'Keep others at a distance.'],
 ['p16_q17','SN',1,'Seldom get lost in thought.'],
 ['p16_q18','TF',1,'Am indifferent to the feelings of others.'],
 ['p16_q19','JP',1,'Am not bothered by disorder.'],
 ['p16_q20','R',1,'Keep my emotions under control.'],
 ['p16_q21','EI',0,'Warm up quickly to others.'],
 ['p16_q22','SN',0,'Need a creative outlet.'],
 ['p16_q23','TF',0,"Inquire about others' well-being."],
 ['p16_q24','JP',0,'Follow a schedule.'],
 ['p16_q25','R',0,'Am filled with doubts about things.'],
 ['p16_q26','EI',1,'Wait for others to lead the way.'],
 ['p16_q27','SN',1,'Do not like poetry.'],
 ['p16_q28','TF',1,"Don't have a soft side."],
 ['p16_q29','JP',1,'Dislike routine.'],
 ['p16_q30','R',1,'Feel comfortable with myself.'],
 ['p16_q31','EI',0,'Know how to captivate people.'],
 ['p16_q32','SN',0,'Like to solve complex problems.'],
 ['p16_q33','TF',0,'Like to do things for others.'],
 ['p16_q34','JP',0,'Want every detail taken care of.'],
 ['p16_q35','R',0,'Become overwhelmed by events.'],
 ['p16_q36','EI',1,'Hold back my opinions.'],
 ['p16_q37','SN',1,'Avoid philosophical discussions.'],
 ['p16_q38','TF',1,'Love a good fight.'],
 ['p16_q39','JP',1,'Postpone decisions.'],
 ['p16_q40','R',1,'Am not embarrassed easily.'],
 ['p16_q41','EI',0,'Have a lot of fun.'],
 ['p16_q42','SN',0,'Believe in the importance of art.'],
 ['p16_q43','TF',0,'Hate to seem pushy.'],
 ['p16_q44','JP',0,'Carry out my plans.'],
 ['p16_q45','EI',0,'Am the first to act.'],
 ['p16_q46','SN',1,'Have difficulty understanding abstract ideas.'],
 ['p16_q47','TF',1,'Take no time for others.'],
 ['p16_q48','JP',1,'Am easily distracted.'],
];
// axis -> [first pole (high score), second pole]
const AX={EI:['E','I'],SN:['N','S'],TF:['F','T'],JP:['J','P']};
const POLE={E:'Extraversion',I:'Introversion',N:'Intuition',S:'Sensing',F:'Feeling',T:'Thinking',J:'Judging',P:'Perceiving'};
const DESC={
 E:'You draw energy from people and activity, speak up readily and tend to act first.',
 I:'You recharge on your own or with a few people, take time to open up and prefer to think before you speak.',
 N:'You are drawn to ideas, patterns and possibilities, and enjoy reflection, art and abstract problems.',
 S:'You trust what is concrete and proven, and prefer practical facts to theory and daydreaming.',
 F:'You weigh decisions by their effect on people and notice how others feel.',
 T:'You weigh decisions by logic and fairness, and can stay detached when others get emotional.',
 J:'You like order, plans and finished tasks, and decide early.',
 P:'You keep options open, adapt as you go and are comfortable with some mess.'
};
const NAMES={INTJ:'Independent Strategist',INTP:'Logical Thinker',ENTJ:'Decisive Leader',ENTP:'Inventive Challenger',
 INFJ:'Insightful Counselor',INFP:'Values-Driven Dreamer',ENFJ:'Inspiring Guide',ENFP:'Enthusiastic Explorer',
 ISTJ:'Dependable Organizer',ISFJ:'Caring Guardian',ESTJ:'Practical Manager',ESFJ:'Warm Host',
 ISTP:'Hands-On Problem-Solver',ISFP:'Gentle Creator',ESTP:'Bold Doer',ESFP:'Lively Performer'};

let cur=0, ans=[], last=null;
const LK=['','Strongly\nDisagree','Disagree','Neutral','Agree','Strongly\nAgree'];
const lk=n=>_t('likert_'+n,LK[n]);
function shell(){
  $('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('p16_how_title','How It Works')}</h3>
    <ul>
      <li>${_t('p16_how1','48 short statements. Rate how well each one describes you, from strongly disagree to strongly agree.').replace('48',ITEMS.length)}</li>
      <li>${_t('p16_how2','Answer as you usually are, not as you would like to be. There are no right or wrong answers.')}</li>
      <li>${_t('p16_how3','You get a four-letter type, a percentage for each letter and a short description. Takes about 6 minutes.')}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header"><span class="test-ui-title">${_t('p16_title','16 Personality Types Test')}</span><span id="p16-counter" class="q-counter"></span></div>
    <div class="test-ui-body" id="p16-body">
      <p style="color:var(--text-2)">${_t('p16_start_desc','Find your four-letter personality type, scored from public-domain Big Five items that research links to each letter.')}</p>
      <button class="btn btn-primary" onclick="P16Test.start()">${_t('btn_start_test','Start Test')}</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)"><div class="q-progress-bar"><div class="q-progress-fill" id="p16-prog" style="width:0%"></div></div></div>
  </div>
  <div class="results-panel" id="p16-results"></div>`;
}
function renderQ(){
  const it=ITEMS[cur];
  $('p16-counter').textContent=`${cur+1} / ${ITEMS.length}`;
  $('p16-prog').style.width=`${cur/ITEMS.length*100}%`;
  const btns=[1,2,3,4,5].map(n=>`<button class="likert-btn${ans[cur]===n?' selected':''}" onclick="P16Test.answer(${n})"><span class="likert-num">${n}</span><span class="likert-label">${lk(n).replace('\n','<br>')}</span></button>`).join('');
  $('p16-body').innerHTML=`
    <p class="question-text">${_t(it[0],it[3])}</p>
    <div class="likert">${btns}</div>
    <p class="likert-scale-note">1 = ${lk(1).replace('\n',' ')} · 5 = ${lk(5).replace('\n',' ')}</p>
    ${cur>0?`<div style="text-align:center;margin-top:10px"><button class="btn btn-secondary" style="padding:6px 14px;font-size:.85rem" onclick="P16Test.back()">← ${_t('p16_back','Back')}</button></div>`:''}`;
}
function score(a){
  const sum={EI:0,SN:0,TF:0,JP:0,R:0}, n={EI:0,SN:0,TF:0,JP:0,R:0};
  ITEMS.forEach((it,i)=>{ const v=a[i]||3; sum[it[1]]+= it[2]?6-v:v; n[it[1]]++; });
  const pct={}; for(const k in sum) pct[k]=Math.round((sum[k]/n[k]-1)/4*100);
  let code=''; for(const k of ['EI','SN','TF','JP']) code+= pct[k]>=50?AX[k][0]:AX[k][1];
  return {pct, code};
}
function strength(p){ const d=Math.abs(p-50); return d<10?_t('p16_slight','slight'):d<25?_t('p16_moderate','moderate'):_t('p16_clear','clear'); }
function results(){
  const r=score(ans); last=r;
  $('p16-counter').textContent=''; $('p16-prog').style.width='100%';
  $('p16-body').innerHTML=`<p>${_t('p16_done','Done. Your results are below.')}</p>`;
  const bar=k=>{ const [a,b]=AX[k], p=r.pct[k], win=p>=50?a:b, wp=p>=50?p:100-p;
    return `<div class="trait-bar-item"><div class="trait-bar-top"><span class="trait-name">${_t('p16_p'+a,POLE[a])} – ${_t('p16_p'+b,POLE[b])}</span><span class="trait-pct">${win} ${wp}% · ${strength(p)}</span></div>
      <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${p}%;background:var(--primary)"></div></div>
      <p style="font-size:.85rem;color:var(--text-2);margin-top:6px">${_t('p16_d'+win,DESC[win])}</p></div>`; };
  const near=['EI','SN','TF','JP'].some(k=>Math.abs(r.pct[k]-50)<10);
  const rp=r.pct.R;
  const rtxt= rp>=60?_t('p16_r_high','You react strongly to stress and setbacks and tend to worry more than most people.')
            : rp<=40?_t('p16_r_low','You stay calm under pressure and recover quickly from upsets.')
            : _t('p16_r_mid','You react to stress about as much as most people do.');
  $('p16-results').innerHTML=`
    <div style="text-align:center">
      <p style="color:var(--text-2);margin:0">${_t('p16_your_type','Your type')}</p>
      <div style="font-size:3rem;font-weight:800;letter-spacing:.08em">${r.code}</div>
      <p style="font-size:1.15rem;font-weight:700;margin:0">${_t('p16_t_'+r.code,NAMES[r.code])}</p>
    </div>
    <div class="trait-bars">${['EI','SN','TF','JP'].map(bar).join('')}</div>
    <div class="trait-bar-item" style="margin-top:14px"><div class="trait-bar-top"><span class="trait-name">${_t('p16_react','Emotional reactivity')}</span><span class="trait-pct">${rp}%</span></div>
      <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${rp}%;background:#f59e0b"></div></div>
      <p style="font-size:.85rem;color:var(--text-2);margin-top:6px">${rtxt}</p></div>
    ${near?`<p style="margin-top:14px;padding:10px 14px;border-left:3px solid var(--primary);background:var(--bg-alt);border-radius:8px;font-size:.9rem">${_t('p16_near','At least one of your letters is close to 50%. That part of your personality sits in the middle, and the other letter could describe you almost as well.')}</p>`:''}
    <p style="font-size:.8rem;color:var(--text-2);margin-top:14px">${_t('p16_disclaimer','Personality traits are continuous, so a four-letter type is a simplification. This test is not affiliated with the Myers-Briggs Type Indicator (MBTI), a trademark of The Myers-Briggs Company, and should not be used for hiring decisions.')}</p>
    <div class="share-row" style="margin-top:8px"><button class="share-btn" onclick="P16Test.copy()">📋 ${_t('share_copy','Copy Result')}</button></div>
    <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="P16Test.reset()">↺ ${_t('btn_try_again','Try Again')}</button></div>`;
  $('p16-results').classList.add('show');
  setTimeout(()=>$('p16-results').scrollIntoView({behavior:'smooth',block:'start'}),60);
}
window.P16Test={
  start(){ cur=0; ans=[]; $('p16-results').classList.remove('show'); $('p16-results').innerHTML=''; renderQ(); },
  answer(v){ ans[cur]=v; cur++; if(cur>=ITEMS.length) return results(); renderQ(); },
  back(){ if(cur>0){ cur--; renderQ(); } },
  reset(){ last=null; shell(); },
  copy(){ if(!last) return; navigator.clipboard?.writeText(_t('p16_your_type','Your type')+': '+last.code+' – '+_t('p16_t_'+last.code,NAMES[last.code])+' | coreskillai.com/tests/personality-type/'); },
  _score:score, _items:ITEMS
};
document.addEventListener('keydown',e=>{ const b=$('p16-body'); if(!b||!b.querySelector('.likert')) return; const n=+e.key; if(n>=1&&n<=5){ e.preventDefault(); P16Test.answer(n); } });
document.addEventListener('DOMContentLoaded',shell);
})();

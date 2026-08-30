/* Prove the Stroop test actually measures the Stroop effect.
 *
 * It previously did not. Congruency was drawn at random with a lopsided rule,
 * each trial's congruency was never recorded, and the score was
 * `accuracy*100 - avgMs/12` - an invented formula measuring general quickness,
 * which is the one thing a Stroop task is NOT for.
 *
 * This drives the real page with a CONTROLLED CLOCK: every congruent trial takes
 * exactly 600 ms and every incongruent one 760 ms. The test must then recover a
 * 160 ms interference effect and a balanced 16/16 design. Rewire the scoring and
 * this fails immediately.
 *
 * Usage: NODE_PATH=<jsdom> node _build/verify_stroop.js <site-root>
 */
const fs=require('fs'),path=require('path'),{JSDOM,VirtualConsole}=require('jsdom');
const ROOT=process.argv[2];
const SKIP=/adsbygoogle|googletagmanager|googlesyndication|fundingchoices/i;
const file=path.join(ROOT,'tests','focus','index.html');
let html=fs.readFileSync(file,'utf8').replace(/<script[^>]*src="[^"]*"[^>]*>\s*<\/script>/g,t=>SKIP.test(t)?'':t);
const vc=new VirtualConsole(); const errors=[]; vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{url:'https://coreskillai.com/tests/focus/',runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true});
const w=dom.window, doc=w.document;
if(!w.matchMedia) w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false;}});
if(!w.Element.prototype.animate) w.Element.prototype.animate=()=>({finished:Promise.resolve(),cancel(){},play(){}});
if(!w.ResizeObserver) w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
if(!w.IntersectionObserver) w.IntersectionObserver=class{constructor(cb){this.cb=cb;}observe(el){this.cb([{target:el,isIntersecting:true,intersectionRatio:1}],this);}unobserve(){}disconnect(){}takeRecords(){return[];}};
if(!w.scrollTo) w.scrollTo=()=>{};
w.setTimeout=fn=>{try{fn();}catch(e){}return 0;}; w.setInterval=()=>0;
w.requestAnimationFrame=fn=>{try{fn(0);}catch(e){}return 0;};
let clock=1000; w.performance.now=()=>clock;              // controlled clock
for(const sc of [...doc.querySelectorAll('script[src]')]){
  const src=sc.getAttribute('src'); if(SKIP.test(src))continue;
  const p=path.join(ROOT,src.replace(/^\//,'').split('?')[0]);
  try{w.eval(fs.readFileSync(p,'utf8'));}catch(e){errors.push(src+': '+e.message);}
}
doc.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));
if(errors.length){console.log('load errors:',errors[0]);process.exit(1);}

const MAP={'rgb(239, 68, 68)':'Red','rgb(59, 130, 246)':'Blue','rgb(16, 185, 129)':'Green','rgb(245, 158, 11)':'Yellow','rgb(139, 92, 246)':'Purple'};
const WORDS={Red:'RED',Blue:'BLUE',Green:'GREEN',Yellow:'YELLOW',Purple:'PURPLE'};
w.FocusTest.start();
let con=0,inc=0,guard=0;
const TRUE_CON=600, TRUE_INC=760;      // simulate a real 160ms Stroop effect
while(guard++<80){
  const res=doc.getElementById('foc-results');
  if(res && res.textContent.trim().length>60) break;
  const el=doc.getElementById('foc-word'); if(!el||!el.textContent) break;
  const ink=MAP[el.style.color];
  const congruent = el.textContent.trim().toUpperCase()===WORDS[ink];
  clock += congruent?TRUE_CON:TRUE_INC;   // advance the clock by the intended RT
  if(congruent) con++; else inc++;
  w.FocusTest.pick(ink);                  // always correct
}
const r=w._focResult;
console.log('congruent trials presented : '+con);
console.log('incongruent trials presented: '+inc);
console.log('simulated true effect       : '+(TRUE_INC-TRUE_CON)+'ms');
console.log('measured interference       : '+(r?r.interference:'null')+'ms');
console.log('accuracy                    : '+(r?r.acc:'?')+'%');
const txt=doc.getElementById('foc-results').textContent.replace(/\s+/g,' ');
console.log('panel                       : '+txt.slice(0,150));
let fail=0;
const chk=(n,c)=>{console.log((c?'ok   ':'FAIL ')+n); if(!c)fail++;};
chk('design is balanced 16/16', con===16 && inc===16);
chk('measured effect matches the simulated 160ms', r && Math.abs(r.interference-160)<=5);
chk('accuracy 100%', r && r.acc===100);
process.exit(fail?1:0);

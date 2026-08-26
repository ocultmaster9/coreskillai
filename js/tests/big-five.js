/* CoreSkillAI — Big Five Personality Test (IPIP-50) */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
// 50 items from the public-domain IPIP Big-Five Factor Markers (Goldberg, 1992)
// Format: [text, trait, reverse(bool)]
// Traits: E=Extraversion, A=Agreeableness, C=Conscientiousness, N=Neuroticism, O=Openness
// English master list. Translations live in ITEMS_I18N below; a market with
// no entry falls back to English. Note this is a FALLBACK, not a feature:
// a personality item a reader cannot understand produces a meaningless answer.
const ITEMS_EN=[
  ["Am the life of the party","E",false],
  ["Feel little concern for others","A",true],
  ["Am always prepared","C",false],
  ["Get stressed out easily","N",false],
  ["Have a rich vocabulary","O",false],
  ["Don't talk a lot","E",true],
  ["Am interested in people","A",false],
  ["Leave my belongings around","C",true],
  ["Am relaxed most of the time","N",true],
  ["Have difficulty understanding abstract ideas","O",true],
  ["Feel comfortable around people","E",false],
  ["Insult people","A",true],
  ["Pay attention to details","C",false],
  ["Worry about things","N",false],
  ["Have a vivid imagination","O",false],
  ["Keep in the background","E",true],
  ["Sympathize with others' feelings","A",false],
  ["Make a mess of things","C",true],
  ["Seldom feel blue","N",true],
  ["Am not interested in abstract ideas","O",true],
  ["Start conversations","E",false],
  ["Am not really interested in others","A",true],
  ["Get chores done right away","C",false],
  ["Get upset easily","N",false],
  ["Have excellent ideas","O",false],
  ["Have little to say","E",true],
  ["Have a soft heart","A",false],
  ["Often forget to put things back in their proper place","C",true],
  ["Am not easily bothered by things","N",true],
  ["Do not have a good imagination","O",true],
  ["Talk to a lot of different people at parties","E",false],
  ["Am not really interested in others","A",true],
  ["Like order","C",false],
  ["Change my mood a lot","N",false],
  ["Am quick to understand things","O",false],
  ["Don't like to draw attention to myself","E",true],
  ["Take time out for others","A",false],
  ["Shirk my duties","C",true],
  ["Have frequent mood swings","N",false],
  ["Use difficult words","O",false],
  ["Don't mind being the center of attention","E",false],
  ["Feel others' emotions","A",false],
  ["Follow a schedule","C",false],
  ["Get irritated easily","N",false],
  ["Spend time reflecting on things","O",false],
  ["Am quiet around strangers","E",true],
  ["Make people feel at ease","A",false],
  ["Am exacting in my work","C",false],
  ["Often feel blue","N",false],
  ["Am full of ideas","O",false],
];

const ITEMS_I18N = {};

function itemsFor(lang){
  const t = ITEMS_I18N[lang];
  if (!t) return ITEMS_EN;
  // keep the trait/branch coding from the English master, swap only the text
  return ITEMS_EN.map((it, i) => [t[i] != null ? t[i] : it[0], it[1], it[2]]);
}
let ITEMS = itemsFor(window.I18n?.lang || window.PAGE_LANG || 'en');
document.addEventListener('DOMContentLoaded', () => {
  ITEMS = itemsFor(window.I18n?.lang || window.PAGE_LANG || 'en');
});

const TRAIT_INFO={
  E:{name:'Extraversion',       color:'#f59e0b',low:'Reserved & reflective — you gain energy from solitude and deep one-on-one connections.',     high:'Outgoing & energized by social interaction. You thrive in groups and love being the center of attention.'},
  A:{name:'Agreeableness',      color:'#10b981',low:'Analytical and objective — you prioritize facts over feelings and can be bluntly honest.',   high:'Warm, cooperative, and empathetic — you value harmony and the wellbeing of others.'},
  C:{name:'Conscientiousness',  color:'#6366f1',low:'Flexible and spontaneous — you adapt on the fly rather than following strict plans.',         high:'Organized, reliable, and goal-driven. You take your commitments seriously.'},
  N:{name:'Neuroticism',        color:'#ef4444',low:'Emotionally stable and resilient — you stay calm under pressure and recover quickly from stress.', high:'More emotionally reactive — you experience stress, anxiety, and mood shifts more intensely.'},
  O:{name:'Openness',           color:'#8b5cf6',low:'Practical and conventional — you prefer established methods and concrete, familiar ideas.',    high:'Curious, imaginative, and open to new experiences. You love exploring ideas and aesthetics.'},
  de: [
    "Bin der Mittelpunkt jeder Feier",
    "Kümmere mich wenig um andere",
    "Bin immer vorbereitet",
    "Gerate leicht unter Stress",
    "Habe einen großen Wortschatz",
    "Rede nicht viel",
    "Interessiere mich für Menschen",
    "Lasse meine Sachen herumliegen",
    "Bin meistens entspannt",
    "Habe Mühe, abstrakte Ideen zu verstehen",
    "Fühle mich in Gesellschaft wohl",
    "Beleidige andere",
    "Achte auf Details",
    "Mache mir viele Sorgen",
    "Habe eine lebhafte Fantasie",
    "Halte mich im Hintergrund",
    "Fühle mit anderen mit",
    "Bringe Dinge durcheinander",
    "Bin selten niedergeschlagen",
    "Interessiere mich nicht für abstrakte Ideen",
    "Beginne Gespräche",
    "Interessiere mich nicht wirklich für andere",
    "Erledige Aufgaben sofort",
    "Bin schnell aufgebracht",
    "Habe ausgezeichnete Ideen",
    "Habe wenig zu sagen",
    "Habe ein weiches Herz",
    "Vergesse oft, Dinge an ihren Platz zurückzulegen",
    "Lasse mich nicht leicht aus der Ruhe bringen",
    "Habe keine gute Vorstellungskraft",
    "Rede auf Feiern mit vielen verschiedenen Leuten",
    "Andere Menschen lassen mich eher kalt",
    "Mag Ordnung",
    "Meine Stimmung wechselt oft",
    "Verstehe Dinge schnell",
    "Ziehe ungern Aufmerksamkeit auf mich",
    "Nehme mir Zeit für andere",
    "Drücke mich vor meinen Pflichten",
    "Habe häufige Stimmungsschwankungen",
    "Verwende anspruchsvolle Wörter",
    "Stehe gern im Mittelpunkt",
    "Spüre die Gefühle anderer",
    "Halte mich an einen Zeitplan",
    "Bin schnell gereizt",
    "Denke viel über Dinge nach",
    "Bin unter Fremden still",
    "Gebe anderen ein gutes Gefühl",
    "Arbeite sehr genau",
    "Bin oft niedergeschlagen",
    "Stecke voller Ideen",
  ],
  es: [
    "Soy el alma de la fiesta",
    "Me preocupo poco por los demás",
    "Estoy siempre preparado",
    "Me estreso con facilidad",
    "Tengo un vocabulario rico",
    "No hablo mucho",
    "Me intereso por la gente",
    "Dejo mis cosas tiradas",
    "Estoy relajado la mayor parte del tiempo",
    "Me cuesta entender ideas abstractas",
    "Me siento cómodo entre la gente",
    "Insulto a los demás",
    "Presto atención a los detalles",
    "Me preocupo por las cosas",
    "Tengo una imaginación vívida",
    "Me mantengo en segundo plano",
    "Comprendo los sentimientos de los demás",
    "Lo desordeno todo",
    "Rara vez me siento decaído",
    "No me interesan las ideas abstractas",
    "Inicio conversaciones",
    "No me interesan realmente los demás",
    "Hago las tareas de inmediato",
    "Me altero con facilidad",
    "Tengo ideas excelentes",
    "Tengo poco que decir",
    "Tengo buen corazón",
    "Olvido a menudo devolver las cosas a su sitio",
    "No me molestan fácilmente las cosas",
    "No tengo buena imaginación",
    "Hablo con mucha gente distinta en las fiestas",
    "Los demás me resultan bastante indiferentes",
    "Me gusta el orden",
    "Mi estado de ánimo cambia mucho",
    "Entiendo las cosas rápido",
    "No me gusta llamar la atención",
    "Saco tiempo para los demás",
    "Eludo mis obligaciones",
    "Tengo cambios de humor frecuentes",
    "Uso palabras complicadas",
    "No me importa ser el centro de atención",
    "Percibo las emociones de los demás",
    "Sigo un horario",
    "Me irrito con facilidad",
    "Dedico tiempo a reflexionar",
    "Estoy callado con desconocidos",
    "Hago que la gente se sienta a gusto",
    "Soy muy meticuloso en mi trabajo",
    "Me siento decaído a menudo",
    "Estoy lleno de ideas",
  ],
  fr: [
    "Suis l'animateur de la soirée",
    "Me soucie peu des autres",
    "Suis toujours préparé",
    "Suis vite stressé",
    "Ai un vocabulaire riche",
    "Ne parle pas beaucoup",
    "M'intéresse aux gens",
    "Laisse traîner mes affaires",
    "Suis détendu la plupart du temps",
    "Ai du mal à comprendre les idées abstraites",
    "Me sens à l'aise en société",
    "Insulte les autres",
    "Fais attention aux détails",
    "Me fais du souci",
    "Ai une imagination vive",
    "Reste en retrait",
    "Compatis aux sentiments des autres",
    "Mets le désordre partout",
    "Me sens rarement abattu",
    "Ne m'intéresse pas aux idées abstraites",
    "Engage la conversation",
    "Ne m'intéresse pas vraiment aux autres",
    "Fais mes tâches tout de suite",
    "Me contrarie facilement",
    "Ai d'excellentes idées",
    "Ai peu de choses à dire",
    "Ai bon cœur",
    "Oublie souvent de ranger les choses à leur place",
    "Ne me laisse pas facilement perturber",
    "N'ai pas une bonne imagination",
    "Parle à beaucoup de monde en soirée",
    "Les autres me laissent plutôt indifférent",
    "Aime l'ordre",
    "Change souvent d'humeur",
    "Comprends vite",
    "N'aime pas attirer l'attention",
    "Prends du temps pour les autres",
    "Me dérobe à mes obligations",
    "Ai de fréquentes sautes d'humeur",
    "Emploie des mots compliqués",
    "Ne déteste pas être au centre de l'attention",
    "Ressens les émotions des autres",
    "Suis un planning",
    "M'irrite facilement",
    "Prends le temps de réfléchir",
    "Suis silencieux avec les inconnus",
    "Mets les gens à l'aise",
    "Suis très rigoureux dans mon travail",
    "Me sens souvent abattu",
    "Suis plein d'idées",
  ],
  pt: [
    "Sou a alma da festa",
    "Me importo pouco com os outros",
    "Estou sempre preparado",
    "Fico estressado com facilidade",
    "Tenho vocabulário rico",
    "Não falo muito",
    "Me interesso pelas pessoas",
    "Deixo minhas coisas espalhadas",
    "Fico relaxado na maior parte do tempo",
    "Tenho dificuldade com ideias abstratas",
    "Me sinto à vontade perto das pessoas",
    "Ofendo os outros",
    "Presto atenção aos detalhes",
    "Me preocupo com as coisas",
    "Tenho imaginação viva",
    "Fico em segundo plano",
    "Me solidarizo com os sentimentos dos outros",
    "Faço bagunça",
    "Raramente me sinto para baixo",
    "Não me interesso por ideias abstratas",
    "Puxo conversa",
    "Não me interesso de verdade pelos outros",
    "Faço as tarefas na hora",
    "Me chateio facilmente",
    "Tenho ideias excelentes",
    "Tenho pouco a dizer",
    "Tenho bom coração",
    "Esqueço de devolver as coisas ao lugar",
    "Não me abalo com facilidade",
    "Não tenho boa imaginação",
    "Converso com muita gente diferente nas festas",
    "Os outros me deixam bastante indiferente",
    "Gosto de ordem",
    "Meu humor muda muito",
    "Entendo as coisas rápido",
    "Não gosto de chamar atenção",
    "Reservo tempo para os outros",
    "Fujo das minhas obrigações",
    "Tenho mudanças de humor frequentes",
    "Uso palavras difíceis",
    "Não me incomodo em ser o centro das atenções",
    "Sinto as emoções dos outros",
    "Sigo uma agenda",
    "Fico irritado com facilidade",
    "Passo tempo refletindo",
    "Fico quieto perto de estranhos",
    "Deixo as pessoas à vontade",
    "Sou rigoroso no meu trabalho",
    "Me sinto para baixo com frequência",
    "Estou cheio de ideias",
  ],
  it: [
    "Sono l'anima della festa",
    "Mi importa poco degli altri",
    "Sono sempre preparato",
    "Mi stresso facilmente",
    "Ho un vocabolario ricco",
    "Non parlo molto",
    "Mi interesso alle persone",
    "Lascio le mie cose in giro",
    "Sono rilassato quasi sempre",
    "Faccio fatica a capire le idee astratte",
    "Mi sento a mio agio con la gente",
    "Insulto gli altri",
    "Faccio attenzione ai dettagli",
    "Mi preoccupo delle cose",
    "Ho una fantasia vivida",
    "Resto in secondo piano",
    "Comprendo i sentimenti degli altri",
    "Metto disordine ovunque",
    "Raramente mi sento giù",
    "Non mi interessano le idee astratte",
    "Inizio conversazioni",
    "Non mi interesso davvero agli altri",
    "Sbrigo subito le faccende",
    "Mi altero facilmente",
    "Ho ottime idee",
    "Ho poco da dire",
    "Ho un cuore tenero",
    "Dimentico spesso di rimettere le cose al loro posto",
    "Non mi lascio turbare facilmente",
    "Non ho molta immaginazione",
    "Parlo con molte persone diverse alle feste",
    "Gli altri mi lasciano piuttosto indifferente",
    "Amo l'ordine",
    "Il mio umore cambia spesso",
    "Capisco le cose in fretta",
    "Non amo attirare l'attenzione",
    "Trovo tempo per gli altri",
    "Mi sottraggo ai miei doveri",
    "Ho frequenti sbalzi d'umore",
    "Uso parole difficili",
    "Non mi dispiace essere al centro dell'attenzione",
    "Sento le emozioni degli altri",
    "Seguo un programma",
    "Mi irrito facilmente",
    "Dedico tempo a riflettere",
    "Sono silenzioso con gli sconosciuti",
    "Metto le persone a proprio agio",
    "Sono molto preciso nel lavoro",
    "Mi sento spesso giù",
    "Sono pieno di idee",
  ],
  nl: [
    "Ben het middelpunt van het feest",
    "Geef weinig om anderen",
    "Ben altijd voorbereid",
    "Raak snel gestrest",
    "Heb een rijke woordenschat",
    "Praat niet veel",
    "Ben geïnteresseerd in mensen",
    "Laat mijn spullen slingeren",
    "Ben meestal ontspannen",
    "Heb moeite met abstracte ideeën",
    "Voel me op mijn gemak bij mensen",
    "Beledig anderen",
    "Let op details",
    "Maak me zorgen over dingen",
    "Heb een levendige fantasie",
    "Blijf op de achtergrond",
    "Leef mee met de gevoelens van anderen",
    "Maak er een rommel van",
    "Voel me zelden somber",
    "Ben niet geïnteresseerd in abstracte ideeën",
    "Begin gesprekken",
    "Ben niet echt geïnteresseerd in anderen",
    "Doe klusjes meteen",
    "Raak snel van streek",
    "Heb uitstekende ideeën",
    "Heb weinig te zeggen",
    "Heb een zacht hart",
    "Vergeet vaak dingen terug te leggen",
    "Laat me niet snel van mijn stuk brengen",
    "Heb geen goede verbeelding",
    "Praat op feesten met veel verschillende mensen",
    "Anderen laten me tamelijk koud",
    "Houd van orde",
    "Wissel vaak van stemming",
    "Begrijp dingen snel",
    "Trek niet graag de aandacht",
    "Maak tijd voor anderen",
    "Ontloop mijn plichten",
    "Heb vaak stemmingswisselingen",
    "Gebruik moeilijke woorden",
    "Vind het niet erg in het middelpunt te staan",
    "Voel de emoties van anderen",
    "Volg een planning",
    "Raak snel geïrriteerd",
    "Neem tijd om na te denken",
    "Ben stil bij vreemden",
    "Stel mensen op hun gemak",
    "Ben nauwgezet in mijn werk",
    "Voel me vaak somber",
    "Zit vol ideeën",
  ],
  pl: [
    "Jestem duszą towarzystwa",
    "Mało obchodzą mnie inni",
    "Zawsze jestem przygotowany",
    "Łatwo się stresuję",
    "Mam bogate słownictwo",
    "Niewiele mówię",
    "Interesuję się ludźmi",
    "Zostawiam swoje rzeczy byle gdzie",
    "Przez większość czasu jestem rozluźniony",
    "Mam trudność ze zrozumieniem abstrakcyjnych idei",
    "Czuję się swobodnie wśród ludzi",
    "Obrażam innych",
    "Zwracam uwagę na szczegóły",
    "Martwię się o różne rzeczy",
    "Mam żywą wyobraźnię",
    "Trzymam się w cieniu",
    "Współodczuwam z innymi",
    "Robię bałagan",
    "Rzadko czuję przygnębienie",
    "Nie interesują mnie abstrakcyjne idee",
    "Zaczynam rozmowy",
    "Inni niespecjalnie mnie interesują",
    "Załatwiam obowiązki od razu",
    "Łatwo się denerwuję",
    "Mam znakomite pomysły",
    "Mam niewiele do powiedzenia",
    "Mam miękkie serce",
    "Często zapominam odłożyć rzeczy na miejsce",
    "Niełatwo wytrącić mnie z równowagi",
    "Nie mam dobrej wyobraźni",
    "Na imprezach rozmawiam z wieloma różnymi osobami",
    "Inni ludzie są mi raczej obojętni",
    "Lubię porządek",
    "Często zmienia mi się nastrój",
    "Szybko rozumiem",
    "Nie lubię zwracać na siebie uwagi",
    "Znajduję czas dla innych",
    "Uchylam się od obowiązków",
    "Miewam częste wahania nastroju",
    "Używam trudnych słów",
    "Nie przeszkadza mi bycie w centrum uwagi",
    "Wyczuwam emocje innych",
    "Trzymam się planu",
    "Łatwo mnie zirytować",
    "Poświęcam czas na przemyślenia",
    "Jestem cichy wśród obcych",
    "Sprawiam, że ludzie czują się swobodnie",
    "Jestem skrupulatny w pracy",
    "Często czuję przygnębienie",
    "Jestem pełen pomysłów",
  ],
};

const TRAIT_ORDER=['O','C','E','A','N'];
let current=0, answers={};

function pct(raw){ // raw 10-50 per trait → percentile (based on normative data)
  const t=(raw-10)/40; return Math.round(t*94+3);
}

function renderShell(){
  document.getElementById('test-root').innerHTML=`
  <div class="instruction-card">
    <h3>${_t('b5_how_title',"How It Works")}</h3>
    <ul>
      <li>${_t('b5_how0',"{n} short statements. Rate how accurately each describes you.").replace('{n}',ITEMS.length)}</li>
      <li>${_t('b5_how1',"There are no right or wrong answers — be honest for the most accurate result.")}</li>
      <li>${_t('b5_how2',"Takes about 7 minutes.")}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">🪄 Big Five Personality</span>
      <span id="b5-counter" class="q-counter">Question 1 of ${ITEMS.length}</span>
    </div>
    <div class="test-ui-body" id="b5-body">
      <p style="color:var(--text-2)">${_t('b5_start_desc',"The most accurate personality model in psychology, used by researchers worldwide.")}</p>
      <button class="btn btn-primary" onclick="B5Test.start()">Start Test</button>
    </div>
    <div style="padding:12px 24px;border-top:1px solid var(--border)">
      <div class="q-progress-bar"><div class="q-progress-fill" id="b5-prog" style="width:0%"></div></div>
    </div>
  </div>
  <div class="results-panel" id="b5-results"></div>`;
}

function renderQ(){
  const [text,,] = ITEMS[current];
  document.getElementById('b5-counter').textContent=`Question ${current+1} of ${ITEMS.length}`;
  document.getElementById('b5-prog').style.width=`${(current/ITEMS.length)*100}%`;
  const labels=[['1','Strongly\nDisagree'],['2','Disagree'],['3','Neutral'],['4','Agree'],['5','Strongly\nAgree']];
  const btns=labels.map(([n,l],i)=>`
    <button class="likert-btn" onclick="B5Test.answer(${i+1})">
      <span class="likert-num">${n}</span>
      <span class="likert-label">${l.replace('\n','<br>')}</span>
    </button>`).join('');
  document.getElementById('b5-body').innerHTML=`
    <p class="q-counter" style="margin-bottom:4px">Q${current+1} / ${ITEMS.length}</p>
    <p class="question-text">"${text}"</p>
    <div class="likert">${btns}</div>`;
}

function calcScores(){
  const raw={E:0,A:0,C:0,N:0,O:0};
  ITEMS.forEach(([,trait,rev],i)=>{
    const ans=answers[i]||3;
    raw[trait]+= rev?(6-ans):ans;
  });
  return raw;
}

function showResults(){
  const raw=calcScores();
  const pcts={};
  TRAIT_ORDER.forEach(t=>{ pcts[t]=pct(raw[t]); });

  const bars=TRAIT_ORDER.map(t=>{
    const info=TRAIT_INFO[t];
    const p=pcts[t];
    const desc=p>=60?info.high:p<=40?info.low:`A balanced mix of both ends of ${info.name}.`;
    return `<div class="trait-bar-item">
      <div class="trait-bar-top">
        <span class="trait-name" style="color:${info.color}">${info.name}</span>
        <span class="trait-pct">${(window.ordinal?window.ordinal(p):p+'th')} percentile</span>
      </div>
      <div class="trait-bar-track"><div class="trait-bar-fill" style="width:${p}%;background:${info.color}"></div></div>
      <p style="font-size:.78rem;color:var(--text-2);margin-top:6px;line-height:1.5">${desc}</p>
    </div>`;
  }).join('');

  // dominant trait
  const dom=TRAIT_ORDER.reduce((a,b)=>pcts[a]>pcts[b]?a:b);
  const domInfo=TRAIT_INFO[dom];

  document.getElementById('b5-results').innerHTML=`
  <div style="text-align:center;margin-bottom:24px">
    <h2 style="font-size:1.4rem;font-weight:800">${_t('b5_profile',"Your Personality Profile")}</h2>
    <p style="color:var(--text-2);font-size:.9rem;margin-top:6px">${_t('b5_dominant',"Dominant trait:")} <strong style="color:${domInfo.color}">${domInfo.name}</strong></p>
  </div>
  <div class="trait-bars">${bars}</div>
  <canvas id="b5-radar" style="max-width:320px;width:100%;display:block;margin:24px auto"></canvas>
  <div class="share-row" style="margin-top:8px">
    <button class="share-btn" id="share-copy" onclick="B5Test.copy()">📋 Copy Result</button>
    <button class="share-btn" onclick="B5Test.tweet()">𝕏 Share on X</button>
  </div>
  <div style="text-align:center;margin-top:20px"><button class="btn btn-secondary" onclick="B5Test.reset()">↺ Retake</button></div>`;
  document.getElementById('b5-results').classList.add('show');
  window._b5Result={pcts, dom:domInfo.name};

  // animate bars
  setTimeout(()=>{
    document.querySelectorAll('.trait-bar-fill').forEach(b=>{
      const w=b.style.width; b.style.width='0';
      setTimeout(()=>{b.style.transition='width 1s cubic-bezier(.4,0,.2,1)';b.style.width=w;},50);
    });
    drawRadar();
  },100);
}

function drawRadar(){
  const canvas=document.getElementById('b5-radar');
  if(!canvas||!window._b5Result) return;
  const {pcts}=window._b5Result;
  const size=320; canvas.width=size*window.devicePixelRatio; canvas.height=size*window.devicePixelRatio;
  const ctx=canvas.getContext('2d'); ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
  const cx=size/2, cy=size/2, r=size*0.38;
  const traits=TRAIT_ORDER;
  const angles=traits.map((_,i)=>(-Math.PI/2)+(2*Math.PI*i/traits.length));
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const gridC=isDark?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)';
  const textC=isDark?'rgba(255,255,255,.5)':'rgba(0,0,0,.45)';

  // grid
  [.25,.5,.75,1].forEach(f=>{
    ctx.beginPath(); ctx.strokeStyle=gridC; ctx.lineWidth=1;
    angles.forEach((a,i)=>{ const x=cx+Math.cos(a)*r*f, y=cy+Math.sin(a)*r*f; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.closePath(); ctx.stroke();
  });
  // spokes
  angles.forEach(a=>{ ctx.beginPath(); ctx.strokeStyle=gridC; ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); ctx.stroke(); });

  // data
  ctx.beginPath(); ctx.fillStyle='rgba(99,102,241,.18)'; ctx.strokeStyle='#6366f1'; ctx.lineWidth=2;
  angles.forEach((a,i)=>{
    const val=pcts[traits[i]]/100;
    const x=cx+Math.cos(a)*r*val, y=cy+Math.sin(a)*r*val;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // points
  angles.forEach((a,i)=>{
    const val=pcts[traits[i]]/100, x=cx+Math.cos(a)*r*val, y=cy+Math.sin(a)*r*val;
    ctx.beginPath(); ctx.fillStyle=TRAIT_INFO[traits[i]].color; ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
  });

  // labels
  ctx.fillStyle=textC; ctx.font=`bold ${11*window.devicePixelRatio/window.devicePixelRatio}px Inter, sans-serif`; ctx.textAlign='center';
  angles.forEach((a,i)=>{
    const lx=cx+Math.cos(a)*(r+22), ly=cy+Math.sin(a)*(r+22)+4;
    ctx.fillText(TRAIT_INFO[traits[i]].name.slice(0,3),lx,ly);
  });
}

window.B5Test={
  start(){current=0;answers={};renderQ();},
  answer(val){
    answers[current]=val;
    // flash selected
    document.querySelectorAll('.likert-btn').forEach((b,i)=>{ if(i===val-1) b.classList.add('selected'); });
    setTimeout(()=>{
      current++;
      if(current>=ITEMS.length) showResults();
      else renderQ();
    },280);
  },
  reset(){answers={};current=0;renderShell();},
  copy(){
    const r=window._b5Result;if(!r)return;
    const txt=TRAIT_ORDER.map(t=>`${TRAIT_INFO[t].name.slice(0,3)}:${r.pcts[t]}%`).join(' | ');
    navigator.clipboard?.writeText(`Big Five: ${txt} 🪄 Test yours: coreskillai.com`);
  },
  tweet(){
    const r=window._b5Result;if(!r)return;
    const txt=`My Big Five: Dominant trait is ${r.dom}. ${TRAIT_ORDER.map(t=>`${t}:${r.pcts[t]}%`).join(' ')} 🪄`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');
  }
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

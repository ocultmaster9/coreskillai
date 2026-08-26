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
  it:[
    "La scienza non è altro che un modo di guardare il mondo con occhi curiosi e mani pazienti, verificando ogni idea contro la realtà.",
    "Leggere è per la mente ciò che l'esercizio è per il corpo: ogni libro finito è una conversazione con una mente brillante attraverso il tempo.",
    "La più grande ricchezza è vivere contenti con poco. La saggezza comincia nella meraviglia, e sapere ciò che non si sa è già conoscenza.",
    "L'universo non ha alcun obbligo di avere senso per noi, ma ogni domanda che poniamo ci avvicina di un passo al suo vasto mistero.",
    "La tecnologia dà il meglio quando avvicina le persone. La rete ha dato voce a chiunque sul pianeta, nel bene e nel male.",
    "La creatività è l'intelligenza che si diverte. Il segreto della buona ricerca è restare un poco sotto impegnati, lasciando spazio alla mente per vagare.",
    "In principio era la parola. Il linguaggio dà forma al pensiero, e il pensiero dà forma al mondo che abitiamo ogni giorno.",
    "Ogni grande idea è nata come una frase nella mente di qualcuno, scritta di fretta su un foglio prima che potesse svanire.",
  ],
  nl:[
    "Wetenschap is niets anders dan een manier om naar de wereld te kijken met nieuwsgierige ogen en geduldige handen, waarbij elk idee aan de werkelijkheid wordt getoetst.",
    "Lezen is voor de geest wat beweging is voor het lichaam: elk boek dat je uitleest is een gesprek met een scherpe geest dwars door de tijd heen.",
    "De grootste rijkdom is tevreden leven met weinig. Wijsheid begint bij verwondering, en weten wat je niet weet is al een vorm van kennis.",
    "Het heelal is niet verplicht om logisch te zijn voor ons, maar elke vraag die we stellen brengt ons een stap dichter bij dat enorme mysterie.",
    "Techniek is op haar best wanneer ze mensen samenbrengt. Het internet gaf iedereen op deze planeet een stem, ten goede en ten kwade.",
    "Creativiteit is intelligentie die plezier maakt. Het geheim van goed onderzoek is een beetje onderbezet blijven, zodat je geest ruimte houdt om te dwalen.",
    "In het begin was het woord. Taal geeft vorm aan het denken, en het denken geeft vorm aan de wereld waarin we elke dag leven.",
    "Elk groot idee begon als een zin in iemands hoofd, haastig opgeschreven op een vel papier voordat het weer kon verdwijnen.",
  ],
  pl:[
    "Nauka to nic innego jak sposób patrzenia na świat ciekawymi oczami i cierpliwymi rękami, sprawdzając każdy pomysł w zderzeniu z rzeczywistością.",
    "Czytanie jest dla umysłu tym, czym ruch dla ciała: każda skończona książka to rozmowa z bystrym umysłem ponad czasem i przestrzenią.",
    "Największym bogactwem jest żyć w zadowoleniu z niewielu rzeczy. Mądrość zaczyna się od zdziwienia, a wiedza o tym, czego nie wiemy, też jest wiedzą.",
    "Wszechświat nie ma obowiązku być dla nas zrozumiały, ale każde zadane pytanie przybliża nas o krok do jego ogromnej tajemnicy.",
    "Technologia jest najlepsza wtedy, gdy zbliża ludzi. Internet dał głos każdemu na tej planecie, i na dobre, i na złe.",
    "Kreatywność to inteligencja, która dobrze się bawi. Sekret dobrych badań polega na byciu odrobinę niedociążonym, by umysł miał miejsce na wędrowanie.",
    "Na początku było słowo. Język nadaje kształt myśleniu, a myślenie nadaje kształt światu, w którym żyjemy każdego dnia.",
    "Każdy wielki pomysł zaczął się jako zdanie w czyjejś głowie, zapisane w pośpiechu na kartce, zanim zdążyło zniknąć.",
  ],
  ru:[
    "Наука — это всего лишь способ смотреть на мир любопытными глазами и терпеливыми руками, проверяя каждую мысль на прочность реальностью.",
    "Чтение для ума то же, что движение для тела: каждая дочитанная книга — это разговор с ясным умом сквозь время и расстояние.",
    "Самое большое богатство — жить в согласии с малым. Мудрость начинается с удивления, а знание того, чего ты не знаешь, тоже знание.",
    "Вселенная вовсе не обязана быть понятной для нас, но каждый заданный вопрос приближает нас на шаг к её огромной тайне.",
    "Техника хороша тогда, когда сближает людей. Сеть дала голос каждому человеку на планете, и к добру, и к худу.",
    "Творчество — это ум, которому весело. Секрет хорошего исследования в том, чтобы оставаться чуть недогруженным и давать мысли простор.",
    "В начале было слово. Язык придаёт форму мысли, а мысль придаёт форму миру, в котором мы живём каждый день.",
    "Любая великая идея начиналась как фраза в чьей-то голове, торопливо записанная на листе бумаги, пока не успела исчезнуть.",
  ],
  tr:[
    "Bilim, dünyaya meraklı gözler ve sabırlı ellerle bakmanın bir yolundan başka bir şey değildir; her fikri gerçekliğe karşı sınar.",
    "Okumak zihin için neyse, hareket de beden için odur: bitirdiğiniz her kitap zamanı aşan parlak bir zihinle yapılmış bir sohbettir.",
    "En büyük zenginlik aza kanaat ederek yaşamaktır. Bilgelik hayretle başlar ve bilmediğini bilmek de bir tür bilgidir.",
    "Evrenin bize anlamlı gelmek gibi bir yükümlülüğü yok, ama sorduğumuz her soru bizi o büyük gizeme bir adım yaklaştırır.",
    "Teknoloji en çok insanları bir araya getirdiğinde iyidir. İnternet gezegendeki herkese bir ses verdi, iyisiyle kötüsüyle.",
    "Yaratıcılık, eğlenen zekâdır. İyi araştırmanın sırrı biraz boş kalmakta, zihne dolaşacak alan bırakmaktadır.",
    "Başlangıçta söz vardı. Dil düşünceye biçim verir, düşünce de her gün içinde yaşadığımız dünyaya biçim verir.",
    "Her büyük fikir birinin zihninde bir cümle olarak başladı; kaybolmadan önce aceleyle bir kâğıda karalanmış bir cümle.",
  ],
  ro:[
    "Știința nu este altceva decât un mod de a privi lumea cu ochi curioși și mâini răbdătoare, verificând fiecare idee în fața realității.",
    "Cititul este pentru minte ceea ce mișcarea este pentru corp: fiecare carte terminată este o conversație cu o minte strălucită peste timp.",
    "Cea mai mare bogăție este să trăiești mulțumit cu puțin. Înțelepciunea începe cu mirarea, iar a ști ce nu știi este tot o formă de cunoaștere.",
    "Universul nu are nicio obligație să aibă sens pentru noi, dar fiecare întrebare pusă ne apropie cu un pas de misterul lui uriaș.",
    "Tehnologia este la înălțime atunci când apropie oamenii. Internetul a dat o voce fiecărui om de pe planetă, la bine și la rău.",
    "Creativitatea este inteligența care se distrează. Secretul cercetării bune este să rămâi puțin subîncărcat, lăsând minții loc să hoinărească.",
    "La început a fost cuvântul. Limba dă formă gândirii, iar gândirea dă formă lumii în care trăim în fiecare zi.",
    "Orice idee mare a început ca o propoziție în mintea cuiva, notată în grabă pe o foaie înainte să apuce să dispară.",
  ],
  sv:[
    "Vetenskap är inget annat än ett sätt att se på världen med nyfikna ögon och tålmodiga händer, där varje idé prövas mot verkligheten.",
    "Läsning är för sinnet vad rörelse är för kroppen: varje utläst bok är ett samtal med ett skarpt sinne tvärs genom tiden.",
    "Den största rikedomen är att leva nöjd med lite. Visdom börjar i förundran, och att veta vad man inte vet är också en sorts kunskap.",
    "Universum har ingen skyldighet att vara begripligt för oss, men varje fråga vi ställer för oss ett steg närmare dess väldiga mysterium.",
    "Tekniken är som bäst när den för människor samman. Internet gav varje människa på jorden en röst, på gott och ont.",
    "Kreativitet är intelligens som har roligt. Hemligheten bakom god forskning är att förbli en aning underbelastad och ge tanken rum att vandra.",
    "I begynnelsen var ordet. Språket formar tanken, och tanken formar den värld vi lever i varje dag.",
    "Varje stor idé började som en mening i någons huvud, hastigt nedskriven på ett papper innan den hann försvinna.",
  ],
  da:[
    "Videnskab er ikke andet end en måde at se på verden med nysgerrige øjne og tålmodige hænder, hvor hver idé prøves af mod virkeligheden.",
    "Læsning er for sindet, hvad bevægelse er for kroppen: hver bog du læser færdig er en samtale med et skarpt sind på tværs af tiden.",
    "Den største rigdom er at leve tilfreds med lidt. Visdom begynder i undren, og at vide hvad man ikke ved er også en slags viden.",
    "Universet har ingen pligt til at give mening for os, men hvert spørgsmål vi stiller bringer os et skridt nærmere dets enorme gåde.",
    "Teknologi er bedst, når den bringer mennesker sammen. Internettet gav enhver på planeten en stemme, på godt og ondt.",
    "Kreativitet er intelligens, der morer sig. Hemmeligheden bag god forskning er at forblive en anelse underbelastet og give tanken plads til at vandre.",
    "I begyndelsen var ordet. Sproget former tanken, og tanken former den verden, vi lever i hver dag.",
    "Enhver stor idé begyndte som en sætning i nogens hoved, skrevet hastigt ned på et stykke papir, før den nåede at forsvinde.",
  ],
  no:[
    "Vitenskap er ikke annet enn en måte å se verden på med nysgjerrige øyne og tålmodige hender, der hver idé prøves mot virkeligheten.",
    "Lesing er for sinnet det bevegelse er for kroppen: hver bok du leser ut er en samtale med et skarpt sinn på tvers av tiden.",
    "Den største rikdommen er å leve fornøyd med lite. Visdom begynner i undring, og å vite hva man ikke vet er også en form for kunnskap.",
    "Universet har ingen plikt til å gi mening for oss, men hvert spørsmål vi stiller bringer oss et skritt nærmere dets veldige mysterium.",
    "Teknologi er på sitt beste når den bringer mennesker sammen. Internett ga hver eneste person på kloden en stemme, på godt og vondt.",
    "Kreativitet er intelligens som har det gøy. Hemmeligheten bak god forskning er å forbli en anelse underbelastet og gi tanken rom til å vandre.",
    "I begynnelsen var ordet. Språket former tanken, og tanken former verden vi lever i hver eneste dag.",
    "Enhver stor idé begynte som en setning i noens hode, raskt skrevet ned på et ark før den rakk å forsvinne.",
  ],
  fi:[
    "Tiede ei ole muuta kuin tapa katsoa maailmaa uteliain silmin ja kärsivällisin käsin, ja koetella jokaista ajatusta todellisuutta vasten.",
    "Lukeminen on mielelle sitä mitä liikunta keholle: jokainen loppuun luettu kirja on keskustelu terävän mielen kanssa ajan halki.",
    "Suurin rikkaus on elää tyytyväisenä vähään. Viisaus alkaa ihmettelystä, ja sen tietäminen mitä ei tiedä on sekin tietoa.",
    "Maailmankaikkeudella ei ole velvollisuutta olla meille ymmärrettävä, mutta jokainen kysymys vie meidät askeleen lähemmäs sen valtavaa arvoitusta.",
    "Tekniikka on parhaimmillaan silloin kun se tuo ihmisiä yhteen. Verkko antoi äänen jokaiselle planeetan asukkaalle, hyvässä ja pahassa.",
    "Luovuus on älyä joka pitää hauskaa. Hyvän tutkimuksen salaisuus on pysyä hivenen alikuormitettuna ja jättää mielelle tilaa vaeltaa.",
    "Alussa oli sana. Kieli muovaa ajattelua, ja ajattelu muovaa maailmaa jossa elämme joka päivä.",
    "Jokainen suuri ajatus alkoi lauseena jonkun mielessä, kiireesti paperille raapustettuna ennen kuin se ehti kadota.",
  ],
  id:[
    "Ilmu pengetahuan tidak lain adalah cara memandang dunia dengan mata yang ingin tahu dan tangan yang sabar, menguji setiap gagasan pada kenyataan.",
    "Membaca bagi pikiran sama seperti olahraga bagi tubuh: setiap buku yang tamat adalah percakapan dengan pikiran cemerlang menembus waktu.",
    "Kekayaan terbesar adalah hidup berkecukupan dengan yang sedikit. Kebijaksanaan bermula dari rasa takjub, dan menyadari apa yang belum kita tahu juga sebuah pengetahuan.",
    "Alam semesta tidak berkewajiban masuk akal bagi kita, tetapi setiap pertanyaan yang kita ajukan membawa kita selangkah lebih dekat pada misterinya yang luas.",
    "Teknologi paling bermakna ketika mendekatkan manusia. Internet memberi suara kepada setiap orang di planet ini, untuk baik maupun buruk.",
    "Kreativitas adalah kecerdasan yang sedang bersenang-senang. Rahasia penelitian yang baik adalah tetap sedikit longgar, memberi ruang bagi pikiran untuk mengembara.",
    "Pada mulanya adalah kata. Bahasa membentuk pikiran, dan pikiran membentuk dunia tempat kita hidup setiap hari.",
    "Setiap gagasan besar bermula sebagai satu kalimat di kepala seseorang, ditulis tergesa di selembar kertas sebelum sempat menghilang.",
  ],
};

function getPassage(){
  const lang=window.I18n?.lang||window.PAGE_LANG||'en';
  const pool=PASSAGES[lang]||PASSAGES.en;
  return pool[Math.floor(Math.random()*pool.length)];
}

let passage='', typed='', startTime=0, endTime=0, phase='idle', timerInterval=null, timeLimit=60;

// ── Script-aware speed metric ─────────────────────────────
// "chars / 5" is the LATIN typing convention (a "word" = 5 characters) and the
// percentile table below it was built from ENGLISH norms. Applying either to
// CJK is meaningless: Japanese and Chinese are typed through an IME where one
// character costs several keystrokes, so a fast typist would score ~15 "WPM"
// and be told they are in the 1st percentile. Those scripts are measured in
// characters per minute instead, against their own norms.
//
// alpha : Latin, Cyrillic, Greek, Arabic, Hebrew, Devanagari - words ~5 chars
// direct: Hangul and Thai - typed directly, no conversion step, high CPM
// ime   : Japanese and Chinese - romaji/pinyin then conversion, lower CPM
const SPEED_FAMILY = { ja:'ime', zh:'ime', ko:'direct', th:'direct' };
function familyFor(lang){ return SPEED_FAMILY[lang] || 'alpha'; }

const SPEED_NORMS = {
  // [score, percentile]
  alpha:  [[0,1],[20,5],[30,15],[40,35],[55,50],[70,65],[85,78],[100,88],[120,95],[140,98],[160,99]],
  // IME scripts: characters/min. Average pinyin or romaji input lands near 50-70.
  ime:    [[0,1],[15,5],[25,15],[35,35],[50,50],[70,65],[90,78],[120,88],[150,95],[200,98],[250,99]],
  // Hangul and Thai are entered directly, so raw character rates run much higher.
  direct: [[0,1],[60,5],[100,15],[150,35],[200,50],[260,65],[320,78],[400,88],[500,95],[600,98],[700,99]],
};

function speedUnitKey(lang){ return familyFor(lang)==='alpha' ? 'typ_wpm' : 'typ_cpm'; }

function wpm(chars, seconds, lang){
  const l = lang || window.I18n?.lang || window.PAGE_LANG || 'en';
  return familyFor(l)==='alpha'
    ? Math.round((chars/5)/(seconds/60))   // words per minute
    : Math.round(chars/(seconds/60));      // characters per minute
}
function accuracy(original, input){
  let correct=0;
  const len=Math.min(original.length,input.length);
  for(let i=0;i<len;i++) if(original[i]===input[i]) correct++;
  return input.length>0?Math.round((correct/input.length)*100):100;
}
function pct(w, lang){
  const l = lang || window.I18n?.lang || window.PAGE_LANG || 'en';
  const map = SPEED_NORMS[familyFor(l)];
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
        <span><span id="typ-wpm-live">0</span> ${_t(speedUnitKey(window.I18n?.lang),'WPM')}</span>
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
  const lang=window.I18n?.lang||window.PAGE_LANG||'en';
  const wpmLabel=_t(speedUnitKey(lang), familyFor(lang)==='alpha'?'WPM':'CPM');

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
      <p class="result-desc">${(p>=88?_t('typ_res_fast','Impressive speed. {n} {u} puts you well above the professional threshold. Accuracy: {a}%.')
         :p>=50?_t('typ_res_mid','Solid speed at {n} {u} — above average for your language. With practice you can go noticeably faster.')
         :_t('typ_res_slow','{n} {u} is below average, but everyone starts somewhere. Ten focused minutes a day can double your speed in weeks.'))
         .replace('{n}',w).replace('{u}',wpmLabel).replace('{a}',acc)}</p>
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
  copy(){const r=window._typResult;if(!r)return;const t=`Typing speed: ${r.wpm} ${_t(speedUnitKey(window.I18n?.lang),'WPM')}, ${r.acc}% accuracy — ${r.text} (${(window.ordinal?window.ordinal(r.p):r.p+'th')} percentile) ⌨️ coreskillai.com`;navigator.clipboard?.writeText(t).then(()=>{const b=document.getElementById('share-copy');if(b){b.textContent='✓ Copied!';setTimeout(()=>b.textContent=`📋 ${_t('share_copy','Copy Result')}`,2000);}});},
  tweet(){const r=window._typResult;if(!r)return;const t=`My typing speed: ${r.wpm} ${_t(speedUnitKey(window.I18n?.lang),'WPM')} at ${r.acc}% accuracy — ${r.text} ⌨️`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(location.href)}`,'_blank','noopener');}
};
document.addEventListener('DOMContentLoaded',renderShell);
})();

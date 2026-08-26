/* CoreSkillAI — Emotional Intelligence Test (4-Branch Model) */
(function(){
function _t(k,fb){return window.I18n?.t(k)||fb||k;}
// 28 questions across 4 branches of Mayer-Salovey-Caruso EI model
// English master list. Translations live in ITEMS_I18N below; a market with
// no entry falls back to English. Note this is a FALLBACK, not a feature:
// a personality item a reader cannot understand produces a meaningless answer.
const ITEMS_EN=[
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
const BRANCHES={
  P:{name:'Perceiving Emotions', color:'#f97316', desc:'Your ability to accurately read emotions in faces, voices, and surroundings.'},
  U:{name:'Using Emotions',      color:'#f59e0b', desc:'How well you leverage emotional states to enhance thinking and creativity.'},
  N:{name:'Understanding Emotions', color:'#6366f1', desc:'Your knowledge of emotional dynamics — how they blend, evolve, and influence behavior.'},
  M:{name:'Managing Emotions',   color:'#10b981', desc:'Your capacity to regulate your own emotions and positively influence others.'},
  de: [
    "Ich erkenne an einem Gesicht, wie sich jemand fühlt.",
    "Ich merke, wenn Freunde bedrückt sind, auch wenn sie nichts sagen.",
    "Es fällt mir schwer, die Stimmung in einem Raum zu erfassen.",
    "An der Stimme höre ich meist, in welcher Stimmung jemand ist.",
    "Feine emotionale Signale im Gespräch entgehen mir oft.",
    "Ich lese Gefühle gut an der Körpersprache ab.",
    "Ich erkenne Gefühle in Kunst, Musik oder Geschichten treffsicher.",
    "Bei guter Laune habe ich mehr kreative Einfälle.",
    "Ich nutze meine Gefühle, um zu entscheiden, worauf ich mich konzentriere.",
    "Es fällt mir schwer, mich über meine Gefühle zu motivieren.",
    "Meine Gefühle helfen mir, komplexe Probleme klarer zu durchdenken.",
    "Ich schaffe es kaum, positive Gefühle in Arbeitsenergie umzusetzen.",
    "Ich stimme meine Stimmung auf die Aufgabe ab, etwa Ruhe für Präzisionsarbeit.",
    "Ich kann Begeisterung gezielt in Leistung umsetzen.",
    "Ich verstehe, wie Gefühle sich mit der Zeit entwickeln, etwa von Ärger zu Wut.",
    "Ich kann erklären, warum ein komplexes Gefühl wie Eifersucht entsteht.",
    "Es fällt mir schwer zu erklären, wodurch gemischte Gefühle entstehen.",
    "Ich verstehe, wie Stolz und Scham mit dem Selbstbild zusammenhängen.",
    "Oft verstehe ich nicht, warum Menschen so fühlen, wie sie fühlen.",
    "Ich benenne feine Unterschiede zwischen Gefühlen genau, etwa unruhig und ängstlich.",
    "Ich verstehe, wie leise Hintergrundgefühle wie Sorge das Denken mit der Zeit beeinflussen.",
    "Wenn ich aufgewühlt bin, beruhige ich mich recht schnell.",
    "Ich weiß, wie ich jemanden aufheitere, der traurig ist.",
    "Ich grüble und bleibe in schlechter Stimmung hängen.",
    "Auch unter Druck bleibe ich gefasst und denke klar.",
    "Es fällt mir schwer, anderen mit ihren negativen Gefühlen zu helfen.",
    "Ich löse Konflikte so, dass alle Beteiligten zufrieden sind.",
    "Starke negative Gefühle überwältigen mich und ich komme schlecht damit zurecht.",
  ],
  es: [
    "Sé cómo se siente alguien con solo mirarle la cara.",
    "Noto cuando un amigo está mal aunque no lo diga.",
    "Me cuesta captar el clima emocional de una sala.",
    "Por la voz suelo saber de qué humor está alguien.",
    "A menudo se me escapan las señales emocionales sutiles en una conversación.",
    "Se me da bien entender lo que sienten los demás por su lenguaje corporal.",
    "Identifico con precisión las emociones en el arte, la música o los relatos.",
    "Cuando estoy de buen humor se me ocurren más ideas creativas.",
    "Uso mis emociones para decidir en qué centrarme.",
    "Me cuesta usar mis emociones para motivarme.",
    "Mis emociones me ayudan a pensar con más claridad en problemas complejos.",
    "Me cuesta convertir las emociones positivas en energía para trabajar.",
    "Ajusto mi estado de ánimo a la tarea, por ejemplo calma para un trabajo de precisión.",
    "Sé canalizar el entusiasmo para rendir más.",
    "Entiendo cómo evolucionan las emociones con el tiempo, por ejemplo del fastidio a la ira.",
    "Sé explicar por qué surge una emoción compleja como los celos.",
    "Me cuesta explicar qué provoca las emociones mezcladas.",
    "Entiendo cómo el orgullo y la vergüenza se relacionan con la imagen de uno mismo.",
    "A menudo no entiendo por qué la gente siente lo que siente.",
    "Distingo con precisión matices entre emociones, por ejemplo inquietud y ansiedad.",
    "Entiendo cómo las emociones de fondo, como una preocupación leve, afectan al pensamiento con el tiempo.",
    "Cuando me altero, me calmo con bastante rapidez.",
    "Sé cómo animar a alguien que está triste.",
    "Tiendo a darle vueltas y quedarme atrapado en el mal humor.",
    "Mantengo la calma y pienso con claridad incluso bajo presión.",
    "Me cuesta ayudar a otros a manejar sus emociones negativas.",
    "Resuelvo conflictos de forma que todas las partes queden satisfechas.",
    "Las emociones negativas intensas me desbordan y no las gestiono bien.",
  ],
  fr: [
    "Je devine ce que quelqu'un ressent rien qu'en regardant son visage.",
    "Je remarque qu'un ami ne va pas bien même s'il ne dit rien.",
    "J'ai du mal à saisir l'ambiance émotionnelle d'une pièce.",
    "À la voix, je devine généralement l'humeur de quelqu'un.",
    "Les signaux émotionnels discrets m'échappent souvent dans une conversation.",
    "Je comprends bien ce que ressentent les gens à leur langage corporel.",
    "J'identifie précisément les émotions dans l'art, la musique ou les récits.",
    "Quand je suis de bonne humeur, j'ai davantage d'idées créatives.",
    "J'utilise mes émotions pour décider sur quoi me concentrer.",
    "J'ai du mal à me servir de mes émotions pour me motiver.",
    "Mes émotions m'aident à réfléchir plus clairement à des problèmes complexes.",
    "J'ai du mal à transformer les émotions positives en énergie de travail.",
    "J'ajuste mon état d'esprit à la tâche, par exemple le calme pour un travail de précision.",
    "Je sais canaliser l'enthousiasme pour améliorer mes performances.",
    "Je comprends comment les émotions évoluent, par exemple de l'agacement à la colère.",
    "Je sais expliquer pourquoi naît une émotion complexe comme la jalousie.",
    "J'ai du mal à expliquer ce qui provoque des émotions mêlées.",
    "Je comprends comment la fierté et la honte se rattachent à l'image de soi.",
    "Souvent je ne comprends pas pourquoi les gens ressentent ce qu'ils ressentent.",
    "Je nomme précisément des nuances entre émotions, par exemple inquiétude et anxiété.",
    "Je comprends comment des émotions de fond, comme une légère inquiétude, influencent la pensée à la longue.",
    "Quand je suis contrarié, je me calme assez vite.",
    "Je sais remonter le moral de quelqu'un qui est triste.",
    "J'ai tendance à ruminer et à rester bloqué dans une mauvaise humeur.",
    "Je reste posé et lucide même sous pression.",
    "J'ai du mal à aider les autres à gérer leurs émotions négatives.",
    "Je résous les conflits d'une manière qui satisfait toutes les parties.",
    "Les émotions négatives fortes me submergent et je les gère mal.",
  ],
  pt: [
    "Percebo como alguém está se sentindo só de olhar para o rosto.",
    "Noto quando um amigo está mal mesmo que não diga nada.",
    "Tenho dificuldade em captar o clima emocional de um ambiente.",
    "Pela voz geralmente sei em que humor a pessoa está.",
    "Muitas vezes deixo passar sinais emocionais sutis numa conversa.",
    "Sou bom em entender o que as pessoas sentem pela linguagem corporal.",
    "Identifico com precisão emoções em arte, música ou histórias.",
    "Quando estou de bom humor, tenho mais ideias criativas.",
    "Uso minhas emoções para decidir no que me concentrar.",
    "Tenho dificuldade em usar minhas emoções para me motivar.",
    "Minhas emoções me ajudam a pensar com mais clareza em problemas complexos.",
    "Tenho dificuldade em transformar emoções positivas em energia para o trabalho.",
    "Ajusto meu estado emocional à tarefa, por exemplo calma para trabalho de precisão.",
    "Consigo canalizar entusiasmo para render mais.",
    "Entendo como as emoções evoluem com o tempo, por exemplo do incômodo à raiva.",
    "Sei explicar por que surge uma emoção complexa como o ciúme.",
    "Tenho dificuldade em explicar o que causa emoções misturadas.",
    "Entendo como orgulho e vergonha se ligam à autoimagem.",
    "Muitas vezes não entendo por que as pessoas sentem o que sentem.",
    "Nomeio com precisão diferenças sutis entre emoções, por exemplo inquietação e ansiedade.",
    "Entendo como emoções de fundo, como uma preocupação leve, afetam o pensamento ao longo do tempo.",
    "Quando fico abalado, me acalmo relativamente rápido.",
    "Sei como animar alguém que está triste.",
    "Costumo ruminar e ficar preso no mau humor.",
    "Mantenho a calma e penso com clareza mesmo sob pressão.",
    "Tenho dificuldade em ajudar os outros a lidar com emoções negativas.",
    "Resolvo conflitos de um jeito que satisfaz todas as partes.",
    "Emoções negativas fortes me dominam e não consigo lidar bem com elas.",
  ],
  it: [
    "Capisco come si sente qualcuno solo guardandolo in faccia.",
    "Mi accorgo quando un amico sta male anche se non lo dice.",
    "Faccio fatica a cogliere il clima emotivo di una stanza.",
    "Dalla voce di solito capisco di che umore è una persona.",
    "Spesso mi sfuggono i segnali emotivi sottili in una conversazione.",
    "Sono bravo a capire cosa provano le persone dal linguaggio del corpo.",
    "Riconosco con precisione le emozioni nell'arte, nella musica o nei racconti.",
    "Quando sono di buon umore mi vengono più idee creative.",
    "Uso le mie emozioni per decidere su cosa concentrarmi.",
    "Faccio fatica a usare le emozioni per motivarmi.",
    "Le mie emozioni mi aiutano a ragionare più lucidamente su problemi complessi.",
    "Faccio fatica a trasformare le emozioni positive in energia per il lavoro.",
    "Adatto il mio stato d'animo al compito, per esempio la calma per un lavoro di precisione.",
    "So incanalare l'entusiasmo per rendere di più.",
    "Capisco come le emozioni evolvono nel tempo, per esempio dal fastidio alla rabbia.",
    "So spiegare perché nasce un'emozione complessa come la gelosia.",
    "Faccio fatica a spiegare cosa provoca le emozioni miste.",
    "Capisco come orgoglio e vergogna si legano all'immagine di sé.",
    "Spesso non capisco perché le persone provino quello che provano.",
    "Distinguo con precisione sfumature tra emozioni, per esempio inquietudine e ansia.",
    "Capisco come le emozioni di fondo, come una lieve preoccupazione, influenzino il pensiero nel tempo.",
    "Quando sono turbato mi calmo abbastanza in fretta.",
    "So come tirare su di morale chi è triste.",
    "Tendo a rimuginare e a restare bloccato nel malumore.",
    "Resto composto e lucido anche sotto pressione.",
    "Faccio fatica ad aiutare gli altri a gestire le emozioni negative.",
    "Risolvo i conflitti in modo che tutte le parti siano soddisfatte.",
    "Le emozioni negative forti mi travolgono e non riesco a gestirle bene.",
  ],
  nl: [
    "Ik zie aan iemands gezicht hoe die zich voelt.",
    "Ik merk het als vrienden ergens mee zitten, ook als ze niets zeggen.",
    "Ik heb moeite de emotionele sfeer in een ruimte aan te voelen.",
    "Aan iemands stem hoor ik meestal in wat voor bui die is.",
    "Subtiele emotionele signalen in een gesprek ontgaan me vaak.",
    "Ik lees goed af aan lichaamstaal wat mensen voelen.",
    "Ik herken emoties nauwkeurig in kunst, muziek of verhalen.",
    "Als ik goedgehumeurd ben, krijg ik meer creatieve invallen.",
    "Ik gebruik mijn gevoelens om te bepalen waar ik me op richt.",
    "Ik vind het lastig mijn emoties in te zetten om mezelf te motiveren.",
    "Mijn emoties helpen me helderder na te denken over complexe problemen.",
    "Ik krijg positieve emoties moeilijk omgezet in werkenergie.",
    "Ik stem mijn stemming af op de taak, bijvoorbeeld rust bij precisiewerk.",
    "Ik kan enthousiasme gericht inzetten om beter te presteren.",
    "Ik begrijp hoe emoties zich in de tijd ontwikkelen, bijvoorbeeld van ergernis naar woede.",
    "Ik kan uitleggen waarom een complexe emotie als jaloezie ontstaat.",
    "Ik vind het lastig uit te leggen waardoor gemengde gevoelens ontstaan.",
    "Ik begrijp hoe trots en schaamte samenhangen met het zelfbeeld.",
    "Vaak snap ik niet waarom mensen voelen wat ze voelen.",
    "Ik benoem subtiele verschillen tussen emoties nauwkeurig, bijvoorbeeld onrust en angst.",
    "Ik begrijp hoe achtergrondgevoelens, zoals lichte zorg, het denken op termijn kleuren.",
    "Als ik van slag ben, kalmeer ik vrij snel.",
    "Ik weet iemand op te beuren die verdrietig is.",
    "Ik blijf malen en blijf hangen in een slecht humeur.",
    "Ik blijf kalm en denk helder, ook onder druk.",
    "Ik vind het lastig anderen te helpen met hun negatieve emoties.",
    "Ik los conflicten op zodat alle partijen tevreden zijn.",
    "Sterke negatieve emoties overspoelen me en ik krijg er weinig grip op.",
  ],
  pl: [
    "Poznaję po twarzy, jak ktoś się czuje.",
    "Zauważam, że przyjaciel ma gorszy dzień, nawet gdy nic nie mówi.",
    "Trudno mi wyczuć emocjonalny nastrój w pomieszczeniu.",
    "Po głosie zwykle poznaję, w jakim ktoś jest nastroju.",
    "Często umykają mi subtelne sygnały emocjonalne w rozmowie.",
    "Dobrze odczytuję uczucia z mowy ciała.",
    "Trafnie rozpoznaję emocje w sztuce, muzyce czy opowieściach.",
    "W dobrym nastroju mam więcej twórczych pomysłów.",
    "Wykorzystuję emocje, by zdecydować, na czym się skupić.",
    "Trudno mi wykorzystać emocje do zmotywowania siebie.",
    "Emocje pomagają mi jaśniej myśleć o złożonych problemach.",
    "Z trudem zamieniam pozytywne emocje w energię do pracy.",
    "Dopasowuję nastrój do zadania, na przykład spokój przy pracy wymagającej precyzji.",
    "Potrafię ukierunkować entuzjazm, żeby lepiej działać.",
    "Rozumiem, jak emocje zmieniają się w czasie, na przykład od irytacji do gniewu.",
    "Umiem wyjaśnić, dlaczego pojawia się złożona emocja jak zazdrość.",
    "Trudno mi wyjaśnić, skąd biorą się mieszane uczucia.",
    "Rozumiem, jak duma i wstyd wiążą się z obrazem siebie.",
    "Często nie rozumiem, dlaczego ludzie czują to, co czują.",
    "Trafnie nazywam subtelne różnice między emocjami, na przykład niepokój i lęk.",
    "Rozumiem, jak tło emocjonalne, choćby lekki niepokój, wpływa z czasem na myślenie.",
    "Gdy się zdenerwuję, dość szybko się uspokajam.",
    "Wiem, jak poprawić komuś nastrój, gdy jest smutny.",
    "Mam skłonność do rozpamiętywania i tkwienia w złym nastroju.",
    "Zachowuję spokój i jasność myślenia nawet pod presją.",
    "Trudno mi pomagać innym radzić sobie z negatywnymi emocjami.",
    "Rozwiązuję konflikty tak, by wszystkie strony były zadowolone.",
    "Silne negatywne emocje mnie przytłaczają i słabo sobie z nimi radzę.",
  ],
  ru: [
    "Я понимаю по лицу, что человек чувствует.",
    "Я замечаю, когда другу плохо, даже если он молчит.",
    "Мне трудно уловить эмоциональную атмосферу в помещении.",
    "По голосу я обычно понимаю, в каком человек настроении.",
    "В разговоре я часто упускаю тонкие эмоциональные сигналы.",
    "Я хорошо считываю чувства по языку тела.",
    "Я точно распознаю эмоции в искусстве, музыке и историях.",
    "В хорошем настроении у меня появляется больше творческих идей.",
    "Я опираюсь на чувства, решая, на чём сосредоточиться.",
    "Мне трудно использовать эмоции, чтобы себя мотивировать.",
    "Эмоции помогают мне яснее думать над сложными задачами.",
    "Мне сложно превращать хорошее настроение в рабочую энергию.",
    "Я подстраиваю настроение под задачу, например спокойствие для точной работы.",
    "Я умею направлять воодушевление на результат.",
    "Я понимаю, как чувства развиваются со временем, например от досады к гневу.",
    "Я могу объяснить, почему возникает сложное чувство вроде ревности.",
    "Мне трудно объяснить, откуда берутся смешанные чувства.",
    "Я понимаю, как гордость и стыд связаны с образом себя.",
    "Часто я не понимаю, почему люди чувствуют то, что чувствуют.",
    "Я точно называю тонкие различия между чувствами, например беспокойство и тревогу.",
    "Я понимаю, как фоновые чувства, например лёгкая тревога, со временем влияют на мышление.",
    "Расстроившись, я довольно быстро успокаиваюсь.",
    "Я знаю, как поднять настроение тому, кому грустно.",
    "Я склонен прокручивать мысли и застревать в плохом настроении.",
    "Я сохраняю собранность и ясность даже под давлением.",
    "Мне трудно помогать другим справляться с тяжёлыми чувствами.",
    "Я разрешаю конфликты так, чтобы все стороны остались довольны.",
    "Сильные тяжёлые чувства захлёстывают меня, и я плохо с ними справляюсь.",
  ],
  tr: [
    "Birinin yüzüne bakarak nasıl hissettiğini anlarım.",
    "Arkadaşlarımın keyfi kaçtığında söylemeseler bile fark ederim.",
    "Bir ortamın duygusal havasını okumakta zorlanırım.",
    "Ses tonundan genellikle birinin ruh halini anlarım.",
    "Sohbetlerde ince duygusal ipuçlarını sıkça kaçırırım.",
    "İnsanların ne hissettiğini beden dilinden iyi anlarım.",
    "Sanatta, müzikte ya da hikâyelerde duyguları isabetle tanırım.",
    "Keyfim yerindeyken daha çok yaratıcı fikir üretirim.",
    "Neye odaklanacağıma karar verirken duygularımdan yararlanırım.",
    "Kendimi motive etmek için duygularımı kullanmakta zorlanırım.",
    "Duygularım karmaşık sorunları daha net düşünmeme yardım eder.",
    "Olumlu duyguları işe enerji olarak aktarmakta zorlanırım.",
    "Ruh halimi göreve göre ayarlarım, örneğin hassas iş için sakinlik.",
    "Heyecanı performansa dönüştürmeyi bilirim.",
    "Duyguların zamanla nasıl geliştiğini anlarım, örneğin sıkıntıdan öfkeye.",
    "Kıskançlık gibi karmaşık bir duygunun neden doğduğunu açıklayabilirim.",
    "Karışık duyguların nedenini açıklamakta zorlanırım.",
    "Gurur ve utancın benlik algısıyla nasıl ilişkilendiğini anlarım.",
    "İnsanların neden öyle hissettiğini çoğu zaman anlamam.",
    "Duygular arasındaki ince farkları doğru adlandırırım, örneğin huzursuzluk ile kaygı.",
    "Hafif bir tedirginlik gibi arka plan duygularının düşünceyi zamanla nasıl etkilediğini anlarım.",
    "Üzüldüğümde kendimi nispeten çabuk sakinleştiririm.",
    "Üzgün birinin moralini nasıl düzelteceğimi bilirim.",
    "Sürekli düşünüp kötü ruh halinde takılı kalırım.",
    "Baskı altında bile sakin kalır, net düşünürüm.",
    "Başkalarının olumsuz duygularıyla baş etmesine yardım etmekte zorlanırım.",
    "Çatışmaları tüm tarafları memnun edecek biçimde çözerim.",
    "Güçlü olumsuz duygular beni aşar ve onları iyi yönetemem.",
  ],
  ro: [
    "Îmi dau seama cum se simte cineva doar privindu-l în față.",
    "Observ când un prieten e supărat chiar dacă nu spune nimic.",
    "Îmi vine greu să citesc atmosfera emoțională dintr-o încăpere.",
    "După voce îmi dau seama de obicei în ce dispoziție e cineva.",
    "Adesea îmi scapă semnalele emoționale subtile dintr-o conversație.",
    "Mă pricep să înțeleg ce simt oamenii din limbajul corpului.",
    "Identific cu precizie emoțiile în artă, muzică sau povești.",
    "Când sunt bine dispus îmi vin mai multe idei creative.",
    "Îmi folosesc emoțiile ca să decid pe ce să mă concentrez.",
    "Îmi vine greu să-mi folosesc emoțiile ca să mă motivez.",
    "Emoțiile mă ajută să gândesc mai limpede la probleme complexe.",
    "Cu greu transform emoțiile pozitive în energie de lucru.",
    "Îmi potrivesc starea cu sarcina, de exemplu calmul pentru munca de precizie.",
    "Știu să canalizez entuziasmul ca să randez mai bine.",
    "Înțeleg cum evoluează emoțiile în timp, de exemplu de la agasare la furie.",
    "Pot explica de ce apare o emoție complexă precum gelozia.",
    "Îmi vine greu să explic ce provoacă emoțiile amestecate.",
    "Înțeleg cum se leagă mândria și rușinea de imaginea de sine.",
    "Adesea nu înțeleg de ce oamenii simt ceea ce simt.",
    "Numesc precis diferențe fine între emoții, de exemplu neliniște și anxietate.",
    "Înțeleg cum emoțiile de fond, precum o îngrijorare ușoară, influențează gândirea în timp.",
    "Când mă tulbur, mă calmez relativ repede.",
    "Știu cum să înveselesc pe cineva care e trist.",
    "Am tendința să rumeg și să rămân blocat în dispoziții proaste.",
    "Rămân calm și gândesc limpede chiar și sub presiune.",
    "Îmi vine greu să-i ajut pe alții să-și gestioneze emoțiile negative.",
    "Rezolv conflictele astfel încât toate părțile să fie mulțumite.",
    "Emoțiile negative puternice mă copleșesc și nu le gestionez bine.",
  ],
  sv: [
    "Jag ser på ansiktet hur någon mår.",
    "Jag märker när vänner mår dåligt även om de inget säger.",
    "Jag har svårt att läsa av stämningen i ett rum.",
    "På rösten hör jag oftast vilket humör någon är på.",
    "Jag missar ofta subtila känslosignaler i samtal.",
    "Jag är bra på att förstå vad folk känner via kroppsspråk.",
    "Jag känner träffsäkert igen känslor i konst, musik eller berättelser.",
    "När jag är på gott humör får jag fler kreativa idéer.",
    "Jag använder mina känslor för att avgöra vad jag ska fokusera på.",
    "Jag har svårt att använda känslor för att motivera mig.",
    "Mina känslor hjälper mig tänka klarare kring svåra problem.",
    "Jag har svårt att omsätta positiva känslor i arbetsenergi.",
    "Jag anpassar sinnesstämningen till uppgiften, till exempel lugn vid precisionsarbete.",
    "Jag kan kanalisera entusiasm för att prestera bättre.",
    "Jag förstår hur känslor utvecklas över tid, till exempel från irritation till ilska.",
    "Jag kan förklara varför en sammansatt känsla som svartsjuka uppstår.",
    "Jag har svårt att förklara vad som orsakar blandade känslor.",
    "Jag förstår hur stolthet och skam hänger ihop med självbilden.",
    "Ofta förstår jag inte varför människor känner som de gör.",
    "Jag sätter exakta ord på små skillnader mellan känslor, till exempel oro och ångest.",
    "Jag förstår hur bakgrundskänslor, som lätt oro, påverkar tänkandet över tid.",
    "När jag blir upprörd lugnar jag ner mig ganska snabbt.",
    "Jag vet hur jag muntrar upp någon som är ledsen.",
    "Jag tenderar att grubbla och fastna i dåligt humör.",
    "Jag håller mig samlad och tänker klart även under press.",
    "Jag har svårt att hjälpa andra hantera sina negativa känslor.",
    "Jag löser konflikter så att alla parter blir nöjda.",
    "Starka negativa känslor överväldigar mig och jag hanterar dem dåligt.",
  ],
  da: [
    "Jeg kan se på et ansigt, hvordan nogen har det.",
    "Jeg mærker, når venner har det skidt, selv om de intet siger.",
    "Jeg har svært ved at aflæse stemningen i et rum.",
    "På stemmen hører jeg som regel, hvilket humør nogen er i.",
    "Jeg overser ofte fine følelsesmæssige signaler i samtaler.",
    "Jeg er god til at forstå følelser gennem kropssprog.",
    "Jeg genkender præcist følelser i kunst, musik eller fortællinger.",
    "Når jeg er i godt humør, får jeg flere kreative idéer.",
    "Jeg bruger mine følelser til at afgøre, hvad jeg skal fokusere på.",
    "Jeg har svært ved at bruge følelser til at motivere mig selv.",
    "Mine følelser hjælper mig med at tænke klarere om komplekse problemer.",
    "Jeg har svært ved at omsætte positive følelser til arbejdsenergi.",
    "Jeg tilpasser mit humør til opgaven, for eksempel ro til præcisionsarbejde.",
    "Jeg kan kanalisere begejstring til bedre præstation.",
    "Jeg forstår, hvordan følelser udvikler sig over tid, for eksempel fra irritation til vrede.",
    "Jeg kan forklare, hvorfor en sammensat følelse som jalousi opstår.",
    "Jeg har svært ved at forklare, hvad der udløser blandede følelser.",
    "Jeg forstår, hvordan stolthed og skam hænger sammen med selvbilledet.",
    "Ofte forstår jeg ikke, hvorfor folk føler, som de gør.",
    "Jeg sætter præcise ord på små forskelle mellem følelser, for eksempel uro og angst.",
    "Jeg forstår, hvordan baggrundsfølelser som let bekymring påvirker tænkningen over tid.",
    "Når jeg bliver oprevet, falder jeg forholdsvis hurtigt til ro.",
    "Jeg ved, hvordan jeg opmuntrer en, der er ked af det.",
    "Jeg har tendens til at gruble og sidde fast i dårligt humør.",
    "Jeg bevarer roen og tænker klart selv under pres.",
    "Jeg har svært ved at hjælpe andre med deres negative følelser.",
    "Jeg løser konflikter, så alle parter er tilfredse.",
    "Stærke negative følelser overvælder mig, og jeg håndterer dem dårligt.",
  ],
  no: [
    "Jeg ser på ansiktet hvordan noen har det.",
    "Jeg merker når venner har det vondt selv om de ikke sier noe.",
    "Jeg har vansker med å lese stemningen i et rom.",
    "På stemmen hører jeg som regel hvilket humør noen er i.",
    "Jeg går ofte glipp av fine følelsesmessige signaler i samtaler.",
    "Jeg er god til å forstå følelser gjennom kroppsspråk.",
    "Jeg gjenkjenner presist følelser i kunst, musikk eller fortellinger.",
    "Når jeg er i godt humør får jeg flere kreative ideer.",
    "Jeg bruker følelsene mine til å avgjøre hva jeg skal fokusere på.",
    "Jeg har vansker med å bruke følelser til å motivere meg selv.",
    "Følelsene mine hjelper meg å tenke klarere om sammensatte problemer.",
    "Jeg klarer sjelden å gjøre positive følelser om til arbeidsenergi.",
    "Jeg tilpasser humøret til oppgaven, for eksempel ro til presisjonsarbeid.",
    "Jeg kan kanalisere entusiasme til bedre prestasjon.",
    "Jeg forstår hvordan følelser utvikler seg over tid, for eksempel fra irritasjon til sinne.",
    "Jeg kan forklare hvorfor en sammensatt følelse som sjalusi oppstår.",
    "Jeg har vansker med å forklare hva som utløser blandede følelser.",
    "Jeg forstår hvordan stolthet og skam henger sammen med selvbildet.",
    "Ofte forstår jeg ikke hvorfor folk føler som de gjør.",
    "Jeg setter presise ord på små forskjeller mellom følelser, for eksempel uro og angst.",
    "Jeg forstår hvordan bakgrunnsfølelser som lett bekymring påvirker tenkningen over tid.",
    "Når jeg blir opprørt roer jeg meg forholdsvis raskt.",
    "Jeg vet hvordan jeg muntrer opp noen som er lei seg.",
    "Jeg har lett for å gruble og bli sittende fast i dårlig humør.",
    "Jeg holder hodet kaldt og tenker klart selv under press.",
    "Jeg har vansker med å hjelpe andre med negative følelser.",
    "Jeg løser konflikter slik at alle parter blir fornøyde.",
    "Sterke negative følelser overvelder meg og jeg håndterer dem dårlig.",
  ],
  fi: [
    "Näen kasvoista, miltä jostakusta tuntuu.",
    "Huomaan kun ystävällä on paha olo, vaikka hän ei sano mitään.",
    "Minun on vaikea aistia tilan tunnelmaa.",
    "Äänestä kuulen yleensä, millä tuulella joku on.",
    "Hienovaraiset tunnevihjeet menevät keskustelussa usein ohi.",
    "Osaan lukea tunteita hyvin kehonkielestä.",
    "Tunnistan tarkasti tunteita taiteessa, musiikissa ja tarinoissa.",
    "Hyvällä tuulella saan enemmän luovia ideoita.",
    "Käytän tunteitani päättääkseni, mihin keskityn.",
    "Minun on vaikea käyttää tunteita itseni motivointiin.",
    "Tunteeni auttavat minua ajattelemaan selkeämmin monimutkaisia ongelmia.",
    "Minun on vaikea muuttaa myönteisiä tunteita työenergiaksi.",
    "Sovitan mielialani tehtävään, esimerkiksi rauhallisuuden tarkkuustyöhön.",
    "Osaan suunnata innostuksen suoritukseen.",
    "Ymmärrän miten tunteet kehittyvät ajan myötä, esimerkiksi ärtymyksestä vihaan.",
    "Osaan selittää, miksi monimutkainen tunne kuten mustasukkaisuus syntyy.",
    "Minun on vaikea selittää, mistä ristiriitaiset tunteet johtuvat.",
    "Ymmärrän miten ylpeys ja häpeä liittyvät minäkuvaan.",
    "Usein en ymmärrä, miksi ihmiset tuntevat niin kuin tuntevat.",
    "Nimeän tarkasti pieniä eroja tunteiden välillä, esimerkiksi levottomuuden ja ahdistuksen.",
    "Ymmärrän miten taustatunteet, kuten lievä huoli, vaikuttavat ajatteluun ajan myötä.",
    "Kun järkytyn, rauhoitun melko nopeasti.",
    "Tiedän miten piristää surullista ihmistä.",
    "Minulla on taipumus vatvoa ja jäädä jumiin huonoon mielialaan.",
    "Pysyn tyynenä ja ajattelen selkeästi myös paineen alla.",
    "Minun on vaikea auttaa muita käsittelemään kielteisiä tunteita.",
    "Ratkaisen ristiriidat niin, että kaikki osapuolet ovat tyytyväisiä.",
    "Voimakkaat kielteiset tunteet valtaavat minut enkä hallitse niitä hyvin.",
  ],
  id: [
    "Saya bisa tahu perasaan seseorang hanya dari wajahnya.",
    "Saya menyadari saat teman sedang tidak baik meski ia tidak mengatakannya.",
    "Saya sulit membaca suasana emosional dalam sebuah ruangan.",
    "Dari nada suara biasanya saya tahu suasana hati seseorang.",
    "Saya sering melewatkan isyarat emosi yang halus dalam percakapan.",
    "Saya pandai memahami perasaan orang melalui bahasa tubuh.",
    "Saya mengenali emosi dengan tepat dalam seni, musik, atau cerita.",
    "Saat suasana hati saya baik, ide kreatif lebih banyak muncul.",
    "Saya memakai perasaan untuk menentukan apa yang perlu difokuskan.",
    "Saya sulit memakai emosi untuk memotivasi diri sendiri.",
    "Emosi membantu saya berpikir lebih jernih tentang masalah rumit.",
    "Saya sulit mengubah emosi positif menjadi energi kerja.",
    "Saya menyesuaikan suasana hati dengan tugas, misalnya tenang untuk pekerjaan presisi.",
    "Saya bisa menyalurkan antusiasme untuk meningkatkan hasil kerja.",
    "Saya paham bagaimana emosi berkembang seiring waktu, misalnya dari jengkel menjadi marah.",
    "Saya bisa menjelaskan mengapa emosi rumit seperti cemburu muncul.",
    "Saya sulit menjelaskan penyebab perasaan yang bercampur aduk.",
    "Saya paham bagaimana rasa bangga dan malu berkaitan dengan citra diri.",
    "Sering saya tidak paham mengapa orang merasakan apa yang mereka rasakan.",
    "Saya bisa menamai perbedaan halus antaremosi, misalnya gelisah dan cemas.",
    "Saya paham bagaimana emosi latar, seperti kekhawatiran ringan, memengaruhi pikiran dari waktu ke waktu.",
    "Saat kesal, saya bisa menenangkan diri relatif cepat.",
    "Saya tahu cara menghibur orang yang sedang sedih.",
    "Saya cenderung terus memikirkan dan terjebak dalam suasana hati buruk.",
    "Saya tetap tenang dan berpikir jernih bahkan di bawah tekanan.",
    "Saya sulit membantu orang lain mengelola emosi negatif mereka.",
    "Saya menyelesaikan konflik sehingga semua pihak merasa puas.",
    "Emosi negatif yang kuat membuat saya kewalahan dan sulit dikelola.",
  ],
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
    <h3>${_t('eq_how_title',"How It Works")}</h3>
    <ul>
      <li>${_t('eq_how0',"{n} statements across the 4 dimensions of emotional intelligence.").replace('{n}',ITEMS.length)}</li>
      <li>${_t('eq_how1',"Rate how accurately each describes you. There are no right or wrong answers.")}</li>
      <li>${_t('eq_how2',"Based on the Mayer-Salovey-Caruso model — the leading scientific EI framework.")}</li>
    </ul>
  </div>
  <div class="test-card-ui">
    <div class="test-ui-header">
      <span class="test-ui-title">❤️ Emotional Intelligence</span>
      <span id="eq-counter" class="q-counter">Question 1 of ${ITEMS.length}</span>
    </div>
    <div class="test-ui-body" id="eq-body">
      <p style="color:var(--text-2)">${_t('eq_start_desc',"Discover your EQ across all 4 dimensions of emotional intelligence.")}</p>
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
      <p class="result-desc">${totalEQ>=115?_t('eq_res_high',"Your emotional intelligence is genuinely high. You read, use and manage emotions with exceptional skill — a strong predictor of relationship quality and teamwork."):totalEQ>=95?_t('eq_res_mid',"Your EQ is solid and functional. You navigate emotions well in most situations, with room to deepen specific dimensions."):_t('eq_res_low',"Your EQ has room to grow. Emotional intelligence is one of the most trainable skills there is — labelling feelings precisely and deliberate practice both show measurable gains.")}</p>
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

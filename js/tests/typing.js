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
  uk:[
    "Уміння швидко друкувати давно перестало бути вузькою канцелярською навичкою і перетворилося на щоденний інструмент майже кожної професії. Людина, яка не мусить шукати очима кожну літеру, витрачає увагу на зміст думки, а не на механіку її запису.",
    "Клавіатура з розкладкою ЙЦУКЕН пройшла довгий шлях від друкарських машинок кінця дев'ятнадцятого століття до сучасних ноутбуків. Розташування літер у ній визначалося частотою їх уживання, тому найпоширеніші символи опинилися під найсильнішими пальцями.",
    "Сліпий метод друку ґрунтується на простій ідеї: кожен палець відповідає за власну зону клавіатури, а погляд ніколи не опускається вниз. Спершу це здається повільнішим за звичне тицяння двома пальцями, проте вже за кілька тижнів різниця стає разючою.",
    "Дослідники, які вивчають роботу з текстом, помітили цікаву закономірність. Швидкість набору майже не залежить від того, наскільки швидко людина рухає руками. Вирішальним є те, наскільки добре мозок передбачає наступні кілька літер у слові.",
    "Помилка під час набору коштує дорожче, ніж здається на перший погляд. Щоб виправити одну літеру, потрібно зупинити потік думки, повернути курсор назад, стерти зайве й відновити ритм. Тому точність майже завжди вигідніша за поспіх.",
    "Українська мова має кілька особливостей, які помітно впливають на набір тексту. Апостроф трапляється значно частіше, ніж в інших слов'янських мовах, а літери «і», «ї» та «є» вимагають окремої уваги від тих, хто звик до російської розкладки.",
    "Регулярність важить більше за тривалість. Десять хвилин щоденних вправ дають кращий результат, ніж дві години раз на тиждень, бо навички моторної пам'яті закріплюються під час сну, а не під час самого тренування.",
    "Найкращі друкарі світу долають межу в сто двадцять слів за хвилину, але для повсякденної роботи цілком достатньо шістдесяти. Головне не рекорд, а те, щоб швидкість запису встигала за швидкістю думки й не заважала їй.",
  ],
  bg:[
    "Умението да се пише бързо отдавна престана да бъде тясна канцеларска дейност и се превърна в ежедневен инструмент на почти всяка професия. Човек, който не търси с очи всяка буква, посвещава вниманието си на смисъла, а не на механиката на записването.",
    "Българската клавиатурна подредба съществува в два основни варианта. Традиционната БДС разпределя буквите според честотата им в езика, докато фонетичната подрежда кирилицата според съответствията с латиницата и затова се усвоява значително по-лесно от начинаещите.",
    "Сляпото писане се основава на проста идея: всеки пръст отговаря за своя зона от клавиатурата, а погледът никога не се спуска надолу. Отначало изглежда по-бавно от обичайното чукане с два пръста, но само след няколко седмици разликата става очевидна.",
    "Изследователите, които изучават работата с текст, забелязали любопитна закономерност. Скоростта на писане почти не зависи от това колко бързо човек движи ръцете си. Решаващо е доколко добре мозъкът предвижда следващите няколко букви в думата.",
    "Една грешка при писането струва повече, отколкото изглежда на пръв поглед. За да поправите една буква, трябва да спрете потока на мисълта, да върнете курсора назад, да изтриете излишното и да възстановите ритъма. Затова точността почти винаги е по-изгодна от бързането.",
    "Българският език има особености, които влияят осезаемо върху писането. Определителният член се прибавя в края на думата, което удължава думите, а буквите «ъ» и «щ» нямат преки съответствия в повечето други езици и изискват отделно внимание.",
    "Редовността тежи повече от продължителността. Десет минути ежедневни упражнения дават по-добър резултат от два часа веднъж седмично, защото уменията на моторната памет се затвърждават по време на сън, а не по време на самата тренировка.",
    "Най-добрите машинописци в света преодоляват границата от сто и двадесет думи в минута, но за всекидневна работа шейсет са напълно достатъчни. Важен е не рекордът, а това скоростта на записване да догонва скоростта на мисълта и да не ѝ пречи.",
  ],
  sr:[
    "Вештина брзог куцања одавно је престала да буде уска канцеларијска делатност и претворила се у свакодневни алат готово сваке професије. Особа која не тражи очима свако слово посвећује пажњу смислу, а не механици записивања.",
    "Српска тастатура постоји у две варијанте, ћириличној и латиничној, а многи корисници свакодневно прелазе с једне на другу. Управо то пребацивање, а не сама брзина прстију, најчешће успорава оне који пишу пословне текстове.",
    "Слепо куцање почива на једноставној идеји: сваки прст одговара за своју зону тастатуре, а поглед никада не силази надоле. Испрва делује спорије од уобичајеног чукања с два прста, али већ након неколико недеља разлика постаје очигледна.",
    "Истраживачи који проучавају рад с текстом приметили су занимљиву законитост. Брзина куцања готово да не зависи од тога колико брзо човек помера руке. Пресудно је колико добро мозак предвиђа наредних неколико слова у речи.",
    "Једна грешка при куцању кошта више него што на први поглед изгледа. Да бисте исправили једно слово, морате зауставити ток мисли, вратити курсор, обрисати вишак и обновити ритам. Зато је тачност готово увек исплативија од журбе.",
    "Српски језик има особености које приметно утичу на куцање. Слова попут «ђ», «ћ», «џ» и «љ» немају непосредне парњаке у већини других језика, а падежни наставци чине речи дужима него у аналитичким језицима.",
    "Редовност вреди више од трајања. Десет минута свакодневне вежбе даје бољи резултат од два сата једном недељно, јер се вештине моторне меморије учвршћују током сна, а не током саме вежбе.",
    "Најбољи дактилографи на свету прелазе границу од сто двадесет речи у минуту, али за свакодневни рад шездесет је сасвим довољно. Није важан рекорд, већ то да брзина записивања стиже брзину мисли и да јој не смета.",
  ],
  mk:[
    "Вештината за брзо пишување одамна престана да биде тесна канцелариска дејност и се претвори во секојдневна алатка на речиси секоја професија. Човек што не бара со очи секоја буква ѝ го посветува вниманието на смислата, а не на механиката на запишувањето.",
    "Македонската тастатура ги содржи буквите «ѓ», «ќ», «ѕ», «џ», «љ» и «њ», кои немаат непосредни парници во повеќето други јазици. Токму тие клавиши најчесто ги забавуваат оние што минуваат од друга кирилична распределба.",
    "Слепото пишување почива на едноставна идеја: секој прст одговара за својата зона од тастатурата, а погледот никогаш не се спушта надолу. Отпрвин изгледа побавно од вообичаеното чукање со два прста, но веќе по неколку недели разликата станува очигледна.",
    "Истражувачите што ја проучуваат работата со текст забележале интересна законитост. Брзината на пишување речиси и да не зависи од тоа колку брзо човекот ги движи рацете. Пресудно е колку добро мозокот ги предвидува следните неколку букви во зборот.",
    "Една грешка при пишувањето чини повеќе отколку што изгледа на прв поглед. За да поправите една буква, мора да го запрете текот на мислата, да го вратите курсорот назад, да го избришете вишокот и да го обновите ритамот. Затоа точноста речиси секогаш е поисплатлива од брзањето.",
    "Македонскиот јазик има особености што забележливо влијаат на пишувањето. Определената форма се додава на крајот од зборот, што ги издолжува зборовите, а троjниот член бара внимание какво што другите словенски јазици не бараат.",
    "Редовноста вреди повеќе од траењето. Десет минути секојдневна вежба даваат подобар резултат од два часа еднаш неделно, бидејќи вештините на моторната меморија се зацврстуваат за време на сон, а не за време на самата вежба.",
    "Најдобрите дактилографи во светот ја надминуваат границата од сто и дваесет зборови во минута, но за секојдневна работа шеесет се сосема доволни. Не е важен рекордот, туку тоа брзината на запишување да ја стигнува брзината на мислата и да не ѝ пречи.",
  ],
  el:[
    "Η ικανότητα γρήγορης πληκτρολόγησης έπαψε προ πολλού να είναι στενή γραφειακή δεξιότητα και μετατράπηκε σε καθημερινό εργαλείο σχεδόν κάθε επαγγέλματος. Όποιος δεν ψάχνει με τα μάτια κάθε γράμμα αφιερώνει την προσοχή του στο νόημα και όχι στη μηχανική της καταγραφής.",
    "Το ελληνικό πληκτρολόγιο ακολουθεί τη διάταξη QWERTY με αντιστοίχιση των ελληνικών γραμμάτων στις λατινικές θέσεις. Οι τόνοι απαιτούν ξεχωριστό πάτημα πριν από το φωνήεν, κάτι που στην αρχή δυσκολεύει όσους έχουν συνηθίσει σε άλλες γλώσσες.",
    "Η τυφλή πληκτρολόγηση στηρίζεται σε μια απλή ιδέα: κάθε δάχτυλο ευθύνεται για τη δική του ζώνη του πληκτρολογίου και το βλέμμα δεν κατεβαίνει ποτέ. Στην αρχή φαίνεται πιο αργή από το συνηθισμένο χτύπημα με δύο δάχτυλα, όμως μετά από λίγες εβδομάδες η διαφορά γίνεται ολοφάνερη.",
    "Οι ερευνητές που μελετούν την εργασία με κείμενο παρατήρησαν μια ενδιαφέρουσα κανονικότητα. Η ταχύτητα πληκτρολόγησης σχεδόν δεν εξαρτάται από το πόσο γρήγορα κινεί κανείς τα χέρια του. Καθοριστικό είναι το πόσο καλά ο εγκέφαλος προβλέπει τα επόμενα γράμματα της λέξης.",
    "Ένα λάθος κατά την πληκτρολόγηση κοστίζει περισσότερο απ' όσο φαίνεται με την πρώτη ματιά. Για να διορθώσετε ένα γράμμα πρέπει να σταματήσετε τη ροή της σκέψης, να γυρίσετε τον δρομέα πίσω, να σβήσετε το περιττό και να ξαναβρείτε τον ρυθμό. Γι' αυτό η ακρίβεια σχεδόν πάντα συμφέρει περισσότερο από τη βιασύνη.",
    "Η ελληνική γλώσσα έχει ιδιαιτερότητες που επηρεάζουν αισθητά την πληκτρολόγηση. Το τελικό σίγμα έχει δική του μορφή, ο τονισμός είναι υποχρεωτικός σε κάθε πολυσύλλαβη λέξη και τα διαλυτικά προσθέτουν ακόμη ένα επίπεδο προσοχής.",
    "Η τακτικότητα μετράει περισσότερο από τη διάρκεια. Δέκα λεπτά καθημερινής εξάσκησης δίνουν καλύτερο αποτέλεσμα από δύο ώρες μία φορά την εβδομάδα, επειδή οι δεξιότητες της κινητικής μνήμης εδραιώνονται κατά τη διάρκεια του ύπνου και όχι κατά την ίδια την προπόνηση.",
    "Οι καλύτεροι δακτυλογράφοι στον κόσμο ξεπερνούν το όριο των εκατόν είκοσι λέξεων ανά λεπτό, αλλά για την καθημερινή εργασία οι εξήντα είναι υπεραρκετές. Σημασία δεν έχει το ρεκόρ, αλλά η ταχύτητα καταγραφής να προλαβαίνει την ταχύτητα της σκέψης και να μην την εμποδίζει.",
  ],
  cs:[
    "Schopnost rychle psát na klávesnici dávno přestala být úzkou kancelářskou dovedností a proměnila se v každodenní nástroj téměř každé profese. Člověk, který nehledá očima každé písmeno, věnuje pozornost smyslu, a nikoli mechanice zapisování.",
    "Česká klávesnice existuje ve dvou hlavních podobách. Rozložení QWERTZ s háčky a čárkami v horní řadě je u nás tradiční, zatímco programátoři často zůstávají u QWERTY a diakritiku doplňují jinak. Obě volby mají své zastánce i svá úskalí.",
    "Psaní všemi deseti stojí na jednoduché myšlence: každý prst odpovídá za svou zónu klávesnice a pohled nikdy neklesá dolů. Zpočátku to působí pomaleji než obvyklé ťukání dvěma prsty, ale už po několika týdnech je rozdíl zřejmý.",
    "Badatelé, kteří zkoumají práci s textem, si všimli zajímavé zákonitosti. Rychlost psaní téměř nezávisí na tom, jak rychle člověk pohybuje rukama. Rozhodující je, jak dobře mozek předvídá několik dalších písmen ve slově.",
    "Jedna chyba při psaní stojí víc, než se na první pohled zdá. Abyste opravili jediné písmeno, musíte zastavit tok myšlenky, vrátit kurzor zpět, smazat přebytek a obnovit rytmus. Proto se přesnost téměř vždy vyplatí víc než spěch.",
    "Čeština má zvláštnosti, které znatelně ovlivňují psaní. Háčky a čárky vyžadují mrtvé klávesy nebo horní řadu, souhláskové skupiny jako „ztvrdl“ nutí prsty k neobvyklým přechodům a délka slov kolísá víc než v angličtině.",
    "Pravidelnost váží víc než délka. Deset minut každodenního cvičení přináší lepší výsledek než dvě hodiny jednou týdně, protože dovednosti motorické paměti se upevňují během spánku, a nikoli během samotného tréninku.",
    "Nejlepší písaři na světě překonávají hranici sto dvaceti slov za minutu, ale pro běžnou práci úplně stačí šedesát. Nejde o rekord, nýbrž o to, aby rychlost zápisu stíhala rychlost myšlenky a nebránila jí.",
  ],
  hr:[
    "Vještina brzog tipkanja odavno je prestala biti uska uredska djelatnost i pretvorila se u svakodnevni alat gotovo svake struke. Osoba koja ne traži očima svako slovo posvećuje pažnju smislu, a ne mehanici zapisivanja.",
    "Hrvatska tipkovnica slijedi raspored QWERTZ, u kojem su slova Y i Z zamijenjena u odnosu na engleski. Dijakritički znakovi č, ć, ž, š i đ imaju vlastite tipke, pa se hrvatski tekst piše bez mrtvih tipki i dodatnih kombinacija.",
    "Slijepo tipkanje počiva na jednostavnoj zamisli: svaki prst odgovara za svoju zonu tipkovnice, a pogled nikada ne silazi prema dolje. Isprva djeluje sporije od uobičajenog lupkanja s dva prsta, no već nakon nekoliko tjedana razlika postaje očita.",
    "Istraživači koji proučavaju rad s tekstom uočili su zanimljivu zakonitost. Brzina tipkanja gotovo i ne ovisi o tome koliko brzo čovjek pomiče ruke. Presudno je koliko dobro mozak predviđa sljedećih nekoliko slova u riječi.",
    "Jedna pogreška pri tipkanju stoji više nego što se na prvi pogled čini. Da biste ispravili jedno slovo, morate zaustaviti tijek misli, vratiti pokazivač natrag, obrisati višak i obnoviti ritam. Zato se točnost gotovo uvijek isplati više od žurbe.",
    "Hrvatski jezik ima osobitosti koje primjetno utječu na tipkanje. Pet dijakritičkih slova pojavljuje se često, a padežni nastavci čine riječi duljima nego u analitičkim jezicima poput engleskoga.",
    "Redovitost vrijedi više od trajanja. Deset minuta svakodnevne vježbe daje bolji rezultat od dva sata jednom tjedno, jer se vještine motoričkog pamćenja učvršćuju tijekom sna, a ne tijekom same vježbe.",
    "Najbolji daktilografi na svijetu prelaze granicu od sto dvadeset riječi u minuti, ali za svakodnevni rad šezdeset je posve dovoljno. Nije važan rekord, nego to da brzina zapisivanja stigne brzinu misli i da joj ne smeta.",
  ],
  sk:[
    "Schopnosť rýchlo písať na klávesnici dávno prestala byť úzkou kancelárskou zručnosťou a premenila sa na každodenný nástroj takmer každej profesie. Človek, ktorý nehľadá očami každé písmeno, venuje pozornosť zmyslu, a nie mechanike zapisovania.",
    "Slovenská klávesnica používa rozloženie QWERTZ, v ktorom sú písmená Y a Z prehodené oproti anglickému. Mäkčene a dĺžne sídlia v hornom rade tam, kde inde bývajú číslice, čo spočiatku prekvapí každého, kto prechádza z inej krajiny.",
    "Písanie všetkými desiatimi stojí na jednoduchej myšlienke: každý prst zodpovedá za svoju zónu klávesnice a pohľad nikdy neklesá nadol. Spočiatku to pôsobí pomalšie než obvyklé ťukanie dvoma prstami, ale už po niekoľkých týždňoch je rozdiel zjavný.",
    "Bádatelia, ktorí skúmajú prácu s textom, si všimli zaujímavú zákonitosť. Rýchlosť písania takmer nezávisí od toho, ako rýchlo človek pohybuje rukami. Rozhodujúce je, ako dobre mozog predvída niekoľko ďalších písmen v slove.",
    "Jedna chyba pri písaní stojí viac, než sa na prvý pohľad zdá. Aby ste opravili jediné písmeno, musíte zastaviť tok myšlienky, vrátiť kurzor späť, zmazať prebytok a obnoviť rytmus. Preto sa presnosť takmer vždy vyplatí viac než zhon.",
    "Slovenčina má zvláštnosti, ktoré citeľne ovplyvňujú písanie. Mäkčene, dĺžne a vokáň nad ô vyžadujú horný rad alebo mŕtve klávesy, a rytmické krátenie mení dĺžky tam, kde by ich písaci čakal.",
    "Pravidelnosť váži viac než dĺžka. Desať minút každodenného cvičenia prináša lepší výsledok než dve hodiny raz týždenne, pretože zručnosti motorickej pamäte sa upevňujú počas spánku, a nie počas samotného tréningu.",
    "Najlepší pisári na svete prekonávajú hranicu stodvadsiatich slov za minútu, ale na bežnú prácu úplne stačí šesťdesiat. Nejde o rekord, ale o to, aby rýchlosť zápisu stíhala rýchlosť myšlienky a neprekážala jej.",
  ],
  sl:[
    "Spretnost hitrega tipkanja je že zdavnaj prenehala biti ozka pisarniška veščina in se je spremenila v vsakodnevno orodje skoraj vsakega poklica. Človek, ki z očmi ne išče vsake črke, posveča pozornost pomenu in ne mehaniki zapisovanja.",
    "Slovenska tipkovnica uporablja razporeditev QWERTZ, pri kateri sta črki Y in Z zamenjani glede na angleško. Šumniki č, š in ž imajo svoje tipke desno od črkovnega bloka, zato slovenskega besedila ni treba pisati z mrtvimi tipkami.",
    "Slepo tipkanje sloni na preprosti zamisli: vsak prst odgovarja za svoje območje tipkovnice, pogled pa nikoli ne pade navzdol. Sprva se zdi počasnejše od običajnega tipkanja z dvema prstoma, a že po nekaj tednih postane razlika očitna.",
    "Raziskovalci, ki proučujejo delo z besedilom, so opazili zanimivo zakonitost. Hitrost tipkanja skoraj ni odvisna od tega, kako hitro človek premika roke. Odločilno je, kako dobro možgani napovedujejo naslednjih nekaj črk v besedi.",
    "Ena napaka pri tipkanju stane več, kot se zdi na prvi pogled. Da popravite eno samo črko, morate ustaviti tok misli, vrniti kazalec nazaj, izbrisati odvečno in obnoviti ritem. Zato se natančnost skoraj vedno bolj izplača kot hitenje.",
    "Slovenščina ima posebnosti, ki opazno vplivajo na tipkanje. Poleg treh šumnikov ima dvojino, zaradi katere se oblike besed množijo, sklonske končnice pa besede podaljšujejo bolj kot v analitičnih jezikih.",
    "Rednost šteje več kot trajanje. Deset minut vsakodnevne vaje da boljši rezultat kot dve uri enkrat na teden, saj se veščine gibalnega spomina utrjujejo med spanjem in ne med samo vadbo.",
    "Najboljši tipkarji na svetu presegajo mejo stodvajsetih besed na minuto, a za vsakdanje delo jih šestdeset povsem zadošča. Ne gre za rekord, temveč za to, da hitrost zapisovanja dohaja hitrost misli in ji ne stoji na poti.",
  ],
  hu:[
    "A gyors gépelés képessége már rég nem szűk irodai készség, hanem szinte minden szakma mindennapi eszköze. Aki nem keresi szemével minden egyes betűt, a figyelmét a gondolat tartalmára fordítja, nem pedig a leírás mechanikájára.",
    "A magyar billentyűzet QWERTZ elrendezésű, és a hosszú magánhangzók külön billentyűket kaptak a betűblokk jobb oldalán. Aki angol kiosztásról vált, elsősorban az ő, ű és az ékezetes párok elhelyezkedésén akad fenn, nem a sebességén.",
    "A vakon gépelés egyszerű gondolaton nyugszik: minden ujj a saját billentyűzónájáért felel, a tekintet pedig soha nem száll lefelé. Eleinte lassabbnak tűnik a megszokott kétujjas kopogásnál, de néhány hét után a különbség nyilvánvalóvá válik.",
    "A szöveggel végzett munkát kutatók érdekes szabályszerűséget vettek észre. A gépelés sebessége szinte nem függ attól, milyen gyorsan mozgatja valaki a kezét. A döntő az, mennyire jól jelzi előre az agy a szó következő néhány betűjét.",
    "Egyetlen gépelési hiba többe kerül, mint amennyinek elsőre látszik. Egy betű javításához meg kell állítani a gondolat folyamát, vissza kell vinni a kurzort, törölni a felesleget és újra felvenni a ritmust. Ezért a pontosság szinte mindig jobban megéri a sietségnél.",
    "A magyar nyelvnek vannak sajátosságai, amelyek érezhetően hatnak a gépelésre. A toldalékoló szerkezet miatt a szavak jóval hosszabbak, mint az angolban, a magánhangzó-harmónia pedig hosszú, egybefüggő betűsorokat eredményez.",
    "A rendszeresség többet nyom a latban, mint az időtartam. Napi tíz perc gyakorlás jobb eredményt ad, mint heti egy alkalommal két óra, mert a mozgásos emlékezet készségei alvás közben rögzülnek, nem pedig maga a gyakorlás alatt.",
    "A világ legjobb gépírói átlépik a percenkénti százhúsz szavas határt, de a mindennapi munkához hatvan bőven elég. Nem a rekord számít, hanem az, hogy a leírás sebessége utolérje a gondolatét, és ne álljon az útjába.",
  ],
  lt:[
    "Gebėjimas greitai spausdinti jau seniai nustojo būti siaura raštinės įgūdis ir virto kasdieniu beveik kiekvienos profesijos įrankiu. Žmogus, kuris akimis neieško kiekvienos raidės, dėmesį skiria minties turiniui, o ne užrašymo mechanikai.",
    "Lietuviška klaviatūra turi savitą bruožą: raidės su nosinėmis ir varnelėmis užima viršutinę eilę ten, kur kitur būna skaitmenys. Todėl pereinantys nuo angliškos klaviatūros iš pradžių sutrinka būtent ties ą, č, ę, ė, į, š, ų, ū ir ž.",
    "Aklas spausdinimas remiasi paprasta mintimi: kiekvienas pirštas atsako už savo klaviatūros zoną, o žvilgsnis niekada nenusileidžia žemyn. Iš pradžių tai atrodo lėčiau nei įprastas bakstelėjimas dviem pirštais, bet jau po kelių savaičių skirtumas tampa akivaizdus.",
    "Tyrėjai, nagrinėjantys darbą su tekstu, pastebėjo įdomų dėsningumą. Spausdinimo greitis beveik nepriklauso nuo to, kaip greitai žmogus judina rankas. Lemiama yra tai, kaip gerai smegenys numato kelias kitas žodžio raides.",
    "Viena klaida spausdinant kainuoja daugiau, nei atrodo iš pirmo žvilgsnio. Kad ištaisytumėte vieną raidę, reikia sustabdyti minties tėkmę, grąžinti žymeklį atgal, ištrinti perteklių ir atkurti ritmą. Todėl tikslumas beveik visada apsimoka labiau nei skubėjimas.",
    "Lietuvių kalba turi ypatumų, kurie pastebimai veikia spausdinimą. Ilgos galūnės ir linksniavimas daro žodžius gerokai ilgesnius nei anglų kalboje, o devynios raidės su diakritiniais ženklais reikalauja atskiro dėmesio.",
    "Reguliarumas sveria daugiau nei trukmė. Dešimt minučių kasdienių pratybų duoda geresnį rezultatą nei dvi valandos kartą per savaitę, nes judesių atminties įgūdžiai įsitvirtina miego metu, o ne per pačias treniruotes.",
    "Geriausi pasaulio spausdintojai peržengia šimto dvidešimties žodžių per minutę ribą, bet kasdieniam darbui visiškai pakanka šešiasdešimties. Svarbu ne rekordas, o tai, kad užrašymo greitis spėtų paskui minties greitį ir jai netrukdytų.",
  ],
  lv:[
    "Spēja ātri rakstīt uz tastatūras sen vairs nav šaura biroja prasme, bet gan gandrīz katras profesijas ikdienas darbarīks. Cilvēks, kurš ar acīm nemeklē katru burtu, uzmanību velta domas jēgai, nevis pierakstīšanas mehānikai.",
    "Latviešu tastatūrai ir sava īpatnība: garumzīmes un mīkstinājuma zīmes visbiežāk ievada ar atsevišķu taustiņu vai apostrofa metodi. Tieši tas sākumā apgrūtina tos, kuri pārnāk no angļu izkārtojuma.",
    "Aklā rakstīšana balstās uz vienkāršu domu: katrs pirksts atbild par savu tastatūras zonu, bet skatiens nekad nenolaižas lejup. Sākumā tas šķiet lēnāk par ierasto klaudzināšanu ar diviem pirkstiem, bet jau pēc dažām nedēļām atšķirība kļūst acīmredzama.",
    "Pētnieki, kas nodarbojas ar darbu ar tekstu, pamanīja interesantu likumsakarību. Rakstīšanas ātrums gandrīz nav atkarīgs no tā, cik ātri cilvēks kustina rokas. Izšķirošais ir tas, cik labi smadzenes paredz nākamos dažus burtus vārdā.",
    "Viena kļūda rakstot maksā vairāk, nekā šķiet no pirmā acu uzmetiena. Lai izlabotu vienu burtu, jāaptur domas plūsma, jāatgriež kursors atpakaļ, jāizdzēš liekais un jāatjauno ritms. Tāpēc precizitāte gandrīz vienmēr atmaksājas labāk nekā steiga.",
    "Latviešu valodai ir īpatnības, kas manāmi ietekmē rakstīšanu. Vienpadsmit burti ar diakritiskajām zīmēm parādās bieži, bet locījumu galotnes padara vārdus garākus nekā analītiskajās valodās.",
    "Regularitāte sver vairāk nekā ilgums. Desmit minūtes ikdienas vingrinājumu dod labāku rezultātu nekā divas stundas reizi nedēļā, jo kustību atmiņas prasmes nostiprinās miega laikā, nevis pašas treniņa laikā.",
    "Labākie rakstītāji pasaulē pārsniedz simt divdesmit vārdu minūtē robežu, bet ikdienas darbam pilnīgi pietiek ar sešdesmit. Svarīgs nav rekords, bet gan tas, lai pierakstīšanas ātrums panāktu domas ātrumu un tai netraucētu.",
  ],
  et:[
    "Oskus kiiresti klaviatuuril kirjutada lakkas ammu olemast kitsas kontorioskus ja muutus peaaegu iga elukutse igapäevaseks tööriistaks. Inimene, kes ei otsi silmadega iga tähte, pühendab tähelepanu mõtte sisule, mitte kirjapaneku mehaanikale.",
    "Eesti klaviatuur järgib QWERTY paigutust, kuid täpitähed õ, ä, ö ja ü on saanud omaenda klahvid tähebloki paremal serval. Just nende asukoht paneb alguses komistama neid, kes tulevad üle inglise paigutuselt.",
    "Pimekirjutamine tugineb lihtsal mõttel: iga sõrm vastutab oma klaviatuuritsooni eest ja pilk ei lasku kunagi alla. Alguses tundub see aeglasem kui harjumuspärane kahe sõrmega toksimine, kuid juba mõne nädala pärast muutub vahe ilmseks.",
    "Uurijad, kes tegelevad tekstitööga, märkasid huvitavat seaduspära. Kirjutamiskiirus ei sõltu peaaegu üldse sellest, kui kiiresti inimene käsi liigutab. Otsustav on see, kui hästi aju ennustab sõna järgmisi tähti.",
    "Üks viga kirjutamisel maksab rohkem, kui esmapilgul näib. Ühe tähe parandamiseks tuleb peatada mõttevoog, viia kursor tagasi, kustutada üleliigne ja taastada rütm. Seepärast tasub täpsus peaaegu alati rohkem ära kui kiirustamine.",
    "Eesti keelel on omapärad, mis mõjutavad kirjutamist märgatavalt. Käänamine teeb sõnad pikemaks kui inglise keeles, kolm välteastet muudavad kirjapilti ja liitsõnad võivad venida märkimisväärselt pikaks.",
    "Regulaarsus kaalub rohkem kui kestus. Kümme minutit igapäevast harjutamist annab parema tulemuse kui kaks tundi kord nädalas, sest liigutusmälu oskused kinnistuvad une ajal, mitte treeningu enda käigus.",
    "Maailma parimad kirjutajad ületavad saja kahekümne sõna piiri minutis, kuid igapäevatööks piisab täiesti kuuekümnest. Oluline pole rekord, vaid see, et kirjapaneku kiirus jõuaks mõtte kiirusele järele ja ei segaks seda.",
  ],
  ar:[
    "لم تعد مهارة الكتابة السريعة على لوحة المفاتيح مهارة مكتبية ضيقة، بل صارت أداة يومية في كل مهنة تقريبًا. فمن لا يبحث بعينيه عن كل حرف يوجّه انتباهه إلى المعنى لا إلى ميكانيكا التدوين.",
    "تتبع لوحة المفاتيح العربية ترتيبًا وُضع في زمن الآلات الكاتبة، ويضع الحروف الأكثر شيوعًا تحت الأصابع الأقوى. غير أن الكتابة بالعربية تفرض تحديًا إضافيًا: اتصال الحروف وتغيّر شكلها بحسب موقعها في الكلمة.",
    "تقوم الكتابة دون النظر على فكرة بسيطة: لكل إصبع منطقته على لوحة المفاتيح، والنظر لا ينزل إلى الأسفل أبدًا. تبدو في البداية أبطأ من النقر المعتاد بإصبعين، لكن الفارق يصير واضحًا بعد أسابيع قليلة.",
    "لاحظ الباحثون في مجال العمل على النصوص قاعدة لافتة. فسرعة الكتابة لا تكاد تعتمد على سرعة تحريك اليدين، بل الحاسم هو مدى قدرة الدماغ على توقّع الحروف القليلة التالية في الكلمة.",
    "يكلّف الخطأ الواحد أثناء الكتابة أكثر مما يبدو للوهلة الأولى. فلتصحيح حرف واحد عليك أن توقف تدفق الفكرة وتعيد المؤشر وتمحو الزائد ثم تستعيد الإيقاع. لذلك تكون الدقة أجدى من العجلة في معظم الأحوال.",
    "للعربية خصائص تؤثر في الكتابة تأثيرًا ملموسًا. فالحروف تتصل ببعضها وتتبدل أشكالها بحسب موضعها، والتشكيل يضيف طبقة أخرى، كما أن الكتابة تجري من اليمين إلى اليسار بينما تسير الأرقام في الاتجاه المعاكس.",
    "الانتظام أثقل وزنًا من طول الجلسة. فعشر دقائق من التمرين اليومي تعطي نتيجة أفضل من ساعتين مرة في الأسبوع، لأن مهارات الذاكرة الحركية ترسخ أثناء النوم لا أثناء التمرين نفسه.",
    "يتجاوز أمهر الكتّاب في العالم حاجز مئة وعشرين كلمة في الدقيقة، غير أن ستين كلمة تكفي تمامًا للعمل اليومي. فالمهم ليس الرقم القياسي بل أن تلحق سرعة التدوين بسرعة الفكرة دون أن تعرقلها.",
  ],
  he:[
    "היכולת להקליד במהירות חדלה מזמן להיות מיומנות משרדית צרה והפכה לכלי יומיומי כמעט בכל מקצוע. אדם שאינו מחפש בעיניו כל אות מקדיש את תשומת לבו למשמעות ולא למכניקה של הרישום.",
    "המקלדת העברית נשענת על פריסה שנקבעה עוד בימי מכונות הכתיבה, והאותיות השכיחות ביותר הוצבו תחת האצבעות החזקות. אלא שהכתיבה בעברית מוסיפה אתגר משלה: הטקסט זורם מימין לשמאל בעוד המספרים נכתבים בכיוון ההפוך.",
    "הקלדה עיוורת נשענת על רעיון פשוט: לכל אצבע אזור משלה במקלדת, והמבט לעולם אינו יורד למטה. בהתחלה זה נראה איטי יותר מהנקישה הרגילה בשתי אצבעות, אבל כבר אחרי שבועות אחדים ההבדל נעשה ברור.",
    "חוקרים שעוסקים בעבודה עם טקסט הבחינו בחוקיות מעניינת. מהירות ההקלדה כמעט אינה תלויה במהירות שבה אדם מזיז את ידיו. המכריע הוא עד כמה טוב המוח חוזה את האותיות הבאות במילה.",
    "טעות אחת בהקלדה עולה יותר ממה שנדמה במבט ראשון. כדי לתקן אות אחת צריך לעצור את זרם המחשבה, להחזיר את הסמן, למחוק את המיותר ולשחזר את הקצב. לכן הדיוק כמעט תמיד משתלם יותר מהחיפזון.",
    "לעברית יש מאפיינים שמשפיעים על ההקלדה במידה ניכרת. הכתיב חסר הניקוד מחייב את הקורא להשלים תנועות מתוך ההקשר, השורשים משנים צורה לפי הבניין, והמעבר בין עברית לאנגלית מחייב החלפת פריסה תכופה.",
    "הסדירות שוקלת יותר מהמשך. עשר דקות של תרגול יומי נותנות תוצאה טובה יותר משעתיים פעם בשבוע, משום שמיומנויות הזיכרון המוטורי מתקבעות בזמן השינה ולא בזמן האימון עצמו.",
    "המקלידים הטובים בעולם חוצים את רף מאה ועשרים המילים בדקה, אבל לעבודה יומיומית שישים מספיקות בהחלט. לא השיא הוא העיקר אלא שמהירות הרישום תדביק את מהירות המחשבה ולא תעמוד בדרכה.",
  ],
  fa:[
    "توانایی تایپ سریع دیگر مدت‌هاست مهارتی تنگ و اداری نیست و به ابزاری روزمره در تقریباً هر پیشه بدل شده است. کسی که با چشم دنبال تک‌تک حرف‌ها نمی‌گردد، توجهش را به معنا می‌سپارد نه به سازوکار نوشتن.",
    "صفحه‌کلید فارسی بر پایهٔ چیدمانی است که از روزگار ماشین‌های تحریر به جا مانده و پرکاربردترین حرف‌ها را زیر انگشتان تواناتر نشانده است. با این همه، نوشتن به فارسی دشواری ویژهٔ خود را دارد: حرف‌ها به هم می‌چسبند و شکلشان بسته به جایگاه در واژه دگرگون می‌شود.",
    "تایپ ده‌انگشتی بر اندیشه‌ای ساده استوار است: هر انگشت مسئول ناحیهٔ خویش از صفحه‌کلید است و نگاه هرگز پایین نمی‌رود. نخست کندتر از ضربه‌زدن معمول با دو انگشت می‌نماید، اما همین که چند هفته بگذرد تفاوت آشکار می‌شود.",
    "پژوهشگرانی که کار با متن را می‌کاوند به قاعده‌ای جالب برخوردند. سرعت تایپ تقریباً به سرعت حرکت دست‌ها بستگی ندارد. آنچه تعیین‌کننده است این است که مغز چند حرف بعدی واژه را چه اندازه خوب پیش‌بینی می‌کند.",
    "یک خطا هنگام تایپ گران‌تر از آن است که در نگاه نخست می‌نماید. برای درست‌کردن یک حرف باید جریان اندیشه را بازداشت، مکان‌نما را بازگرداند، زیادی را پاک کرد و آهنگ کار را از نو یافت. از این رو دقت تقریباً همیشه از شتاب به‌صرفه‌تر است.",
    "زبان فارسی ویژگی‌هایی دارد که تایپ را به‌روشنی زیر تأثیر می‌گیرد. نیم‌فاصله در واژه‌های مرکب نقشی کلیدی دارد، حرف‌ها به هم می‌پیوندند، و نوشتار از راست به چپ پیش می‌رود در حالی که ارقام در جهت وارونه نوشته می‌شوند.",
    "پیوستگی از درازای جلسه مهم‌تر است. ده دقیقه تمرین روزانه نتیجه‌ای بهتر از دو ساعت یک بار در هفته می‌دهد، زیرا مهارت‌های حافظهٔ حرکتی در هنگام خواب پایدار می‌شوند نه در حین خود تمرین.",
    "بهترین تایپیست‌های جهان از مرز صد و بیست واژه در دقیقه می‌گذرند، اما برای کار روزمره شصت واژه کاملاً بس است. آنچه اهمیت دارد رکورد نیست، بلکه این است که سرعت نوشتن به سرعت اندیشه برسد و سد راه آن نشود.",
  ],
  hi:[
    "तेज़ टाइप करने की क्षमता अब कोई सीमित दफ़्तरी हुनर नहीं रह गई, बल्कि लगभग हर पेशे का रोज़मर्रा का औज़ार बन चुकी है। जो व्यक्ति आँखों से हर अक्षर नहीं खोजता, वह अपना ध्यान अर्थ पर लगाता है, लिखने की यांत्रिकी पर नहीं।",
    "हिंदी टाइपिंग के दो प्रचलित तरीक़े हैं। इनस्क्रिप्ट कुंजीपटल में हर व्यंजन और मात्रा की अपनी कुंजी होती है, जबकि लिप्यंतरण में लोग रोमन में लिखते हैं और शब्द देवनागरी में बदल जाता है। दूसरा तरीक़ा सीखना आसान है पर पहला अंतत: तेज़ पड़ता है।",
    "बिना देखे टाइप करना एक सीधे विचार पर टिका है: हर उँगली कुंजीपटल के अपने क्षेत्र की ज़िम्मेदार है और नज़र कभी नीचे नहीं जाती। शुरू में यह दो उँगलियों की आदत से धीमा लगता है, पर कुछ ही हफ़्तों में अंतर साफ़ दिखने लगता है।",
    "पाठ पर काम का अध्ययन करने वाले शोधकर्ताओं ने एक दिलचस्प नियम देखा। टाइप करने की गति इस पर लगभग निर्भर नहीं करती कि व्यक्ति हाथ कितनी तेज़ी से चलाता है। निर्णायक यह है कि मस्तिष्क शब्द के अगले कुछ अक्षरों का अनुमान कितना अच्छा लगाता है।",
    "टाइप करते समय एक भूल उससे कहीं महँगी पड़ती है जितनी पहली नज़र में लगती है। एक अक्षर सुधारने के लिए विचार की धारा रोकनी पड़ती है, कर्सर पीछे लाना पड़ता है, अतिरिक्त मिटाना पड़ता है और फिर लय पानी पड़ती है। इसीलिए जल्दबाज़ी से सटीकता लगभग हमेशा बेहतर सौदा है।",
    "देवनागरी की अपनी विशेषताएँ टाइपिंग पर स्पष्ट असर डालती हैं। मात्राएँ, संयुक्ताक्षर और हलंत एक दिखने वाले अक्षर के लिए कई कुंजियाँ माँगते हैं, और शिरोरेखा शब्द को एक इकाई की तरह बाँधती है।",
    "नियमितता अवधि से अधिक भारी पड़ती है। रोज़ दस मिनट का अभ्यास हफ़्ते में एक बार दो घंटे से बेहतर परिणाम देता है, क्योंकि पेशीय स्मृति के कौशल नींद के दौरान पक्के होते हैं, अभ्यास के दौरान नहीं।",
    "दुनिया के सबसे कुशल टंकक प्रति मिनट सौ से ऊपर शब्द पार कर जाते हैं, पर रोज़ के काम के लिए तीस से चालीस पूरी तरह पर्याप्त हैं। महत्त्व रिकॉर्ड का नहीं, इस बात का है कि लिखने की गति विचार की गति के साथ चले और उसके आड़े न आए।",
  ],
  ja:[
    "速く入力できることは、もはや限られた事務の技能ではなく、ほとんどの職業で毎日使う道具になりました。一文字ずつ目で探さずに済む人は、書き取る手つきではなく、書こうとしている中身のほうに注意を向けられます。",
    "日本語の入力は、ローマ字で打った音をかな漢字に変換する方式が広く使われています。つまり画面に現れる一文字の裏側で、いくつものキーが押されているわけです。速さを文字数で数えるのはそのためです。",
    "指を見ずに打つ方法は、単純な考えの上に成り立っています。どの指がどの範囲を受け持つかを決め、視線は決して手元へ落とさない。最初は二本指で打つより遅く感じますが、数週間もすれば違いがはっきりしてきます。",
    "文章を書く作業を調べてきた研究者たちは、興味深い規則性に気づきました。入力の速さは、手をどれだけ速く動かせるかにはあまり左右されません。決め手は、次に来る文字を脳がどれだけうまく先読みできるかにあります。",
    "打ち間違いは、見た目より高くつきます。一文字直すためには、考えの流れを止め、カーソルを戻し、余分を消し、そして調子を取り戻さなければなりません。ですから急ぐより正確に打つほうが、たいていは得になります。",
    "日本語には入力を左右する独特の事情があります。変換の候補から適切な語を選ぶ手間がかかり、同じ読みでも意味の違う語が並びます。この選ぶ時間もまた、入力の速さの一部なのです。",
    "続けることは、一度に長くやることより大切です。毎日十分の練習は、週に一度二時間の練習より良い結果をもたらします。体で覚えた技能は、練習しているあいだではなく、眠っているあいだに定着するからです。",
    "世界で最も速い打ち手は毎分数百字を超えますが、日常の仕事にはその半分もあれば十分です。大切なのは記録ではなく、書き取る速さが考える速さに追いつき、その邪魔をしないことです。",
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
const SPEED_FAMILY = { ja:'ime', zh:'ime', ko:'direct', th:'direct', hi:'indic' };
function familyFor(lang){ return SPEED_FAMILY[lang] || 'alpha'; }

const SPEED_NORMS = {
  // [score, percentile]
  alpha:  [[0,1],[20,5],[30,15],[40,35],[55,50],[70,65],[85,78],[100,88],[120,95],[140,98],[160,99]],
  // IME scripts: characters/min. Average pinyin or romaji input lands near 50-70.
  ime:    [[0,1],[15,5],[25,15],[35,35],[50,50],[70,65],[90,78],[120,88],[150,95],[200,98],[250,99]],
  // Hangul and Thai are entered directly, so raw character rates run much higher.
  direct: [[0,1],[60,5],[100,15],[150,35],[200,50],[260,65],[320,78],[400,88],[500,95],[600,98],[700,99]],
  // Devanagari is word-segmented, so words/min still applies - but the curve is
  // NOT the Latin one. A matra, conjunct or halant costs several keystrokes for
  // one visible character, so the same finger speed yields far fewer words.
  // India's own typist competency standard is 25 wpm Hindi against 30-35 English;
  // scored on the Latin curve an ordinary Hindi typist would land near the 5th
  // percentile, which measures the script, not the person.
  indic:  [[0,1],[10,5],[16,15],[22,35],[30,50],[38,65],[46,78],[55,88],[70,95],[85,98],[100,99]],
};

function speedUnitKey(lang){ return familyFor(lang)==='alpha' ? 'typ_wpm' : 'typ_cpm'; }

function wpm(chars, seconds, lang){
  const l = lang || window.I18n?.lang || window.PAGE_LANG || 'en';
  const fam = familyFor(l);
  return (fam==='alpha' || fam==='indic')
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

# -*- coding: utf-8 -*-
"""Remove validity claims we cannot support.

"Scientifically Validated" was the first of four selling points on the homepage
in all 43 languages. Validation is a specific technical claim: evidence that a
test measures what it says it measures, gathered by correlating it against
established instruments. We have none for any of our tests. What IS true is that
the constructs come from published research - Raven's matrices, the Big Five,
Stroop, digit span - so that is what we now say.

Order: why1_title, footer_promise, b5_start_desc
"""
import os, sys
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

NAMES = ["why1_title", "footer_promise", "b5_start_desc"]

K = {
"en": ["Built on Published Research","Research-based • Free forever • No account required","The most empirically supported personality model in psychology, used by researchers worldwide."],
"af": ["Gebou op Gepubliseerde Navorsing","Navorsingsgebaseer • Vir altyd gratis • Geen rekening nodig","Die mees empiries ondersteunde persoonlikheidsmodel in die sielkunde, wêreldwyd deur navorsers gebruik."],
"ar": ["مبني على أبحاث منشورة","قائم على البحث • مجاني دائمًا • دون حساب","أكثر نماذج الشخصية استنادًا إلى الأدلة في علم النفس، ويستخدمه الباحثون حول العالم."],
"bg": ["Изградено върху публикувани изследвания","Основано на изследвания • Безплатно завинаги • Без регистрация","Най-добре емпирично подкрепеният модел на личността в психологията, използван от изследователи по цял свят."],
"cs": ["Postaveno na publikovaném výzkumu","Vychází z výzkumu • Navždy zdarma • Bez účtu","Empiricky nejlépe podložený model osobnosti v psychologii, který používají výzkumníci po celém světě."],
"da": ["Bygget på publiceret forskning","Forskningsbaseret • Gratis for altid • Ingen konto","Den empirisk bedst underbyggede personlighedsmodel i psykologien, brugt af forskere verden over."],
"de": ["Auf publizierter Forschung aufgebaut","Forschungsbasiert • Für immer kostenlos • Kein Konto nötig","Das empirisch am besten belegte Persönlichkeitsmodell der Psychologie, weltweit in der Forschung verwendet."],
"el": ["Βασισμένο σε δημοσιευμένη έρευνα","Βασισμένο στην έρευνα • Δωρεάν για πάντα • Χωρίς λογαριασμό","Το εμπειρικά πιο τεκμηριωμένο μοντέλο προσωπικότητας στην ψυχολογία, σε χρήση από ερευνητές παγκοσμίως."],
"es": ["Basado en investigación publicada","Basado en investigación • Gratis para siempre • Sin cuenta","El modelo de personalidad con más respaldo empírico de la psicología, usado por investigadores de todo el mundo."],
"et": ["Rajatud avaldatud uuringutele","Teaduspõhine • Igavesti tasuta • Kontot pole vaja","Psühholoogia empiiriliselt kõige paremini toetatud isiksusemudel, mida kasutavad teadlased üle maailma."],
"fa": ["بر پایهٔ پژوهش‌های منتشرشده","بر پایهٔ پژوهش • همیشه رایگان • بدون نیاز به حساب","پشتوانه‌دارترین مدل شخصیت در روان‌شناسی از نظر تجربی، که پژوهشگران سراسر جهان به کار می‌برند."],
"fi": ["Rakennettu julkaistun tutkimuksen varaan","Tutkimukseen perustuva • Ilmainen ikuisesti • Ei tiliä","Psykologian empiirisesti parhaiten tuettu persoonallisuusmalli, tutkijoiden käytössä kaikkialla maailmassa."],
"fr": ["Fondé sur des recherches publiées","Fondé sur la recherche • Gratuit pour toujours • Sans compte","Le modèle de personnalité le mieux étayé empiriquement en psychologie, utilisé par les chercheurs du monde entier."],
"he": ["מבוסס על מחקר שפורסם","מבוסס מחקר • חינם לתמיד • ללא חשבון","מודל האישיות המבוסס ביותר אמפירית בפסיכולוגיה, בשימוש חוקרים ברחבי העולם."],
"hi": ["प्रकाशित शोध पर आधारित","शोध-आधारित • हमेशा मुफ़्त • खाते की ज़रूरत नहीं","मनोविज्ञान में सबसे अधिक प्रयोगसिद्ध समर्थन वाला व्यक्तित्व मॉडल, जिसका उपयोग दुनिया भर के शोधकर्ता करते हैं।"],
"hr": ["Izgrađeno na objavljenim istraživanjima","Temeljeno na istraživanjima • Zauvijek besplatno • Bez računa","Empirijski najbolje potkrijepljen model osobnosti u psihologiji, koji koriste istraživači diljem svijeta."],
"hu": ["Publikált kutatásokra építve","Kutatásalapú • Örökre ingyenes • Fiók nélkül","A pszichológia empirikusan legjobban alátámasztott személyiségmodellje, amelyet világszerte használnak a kutatók."],
"id": ["Dibangun dari riset yang dipublikasikan","Berbasis riset • Gratis selamanya • Tanpa akun","Model kepribadian dengan dukungan empiris terkuat dalam psikologi, dipakai peneliti di seluruh dunia."],
"it": ["Costruito su ricerca pubblicata","Basato sulla ricerca • Gratis per sempre • Nessun account","Il modello di personalità con il maggior supporto empirico in psicologia, usato dai ricercatori di tutto il mondo."],
"ja": ["公表された研究に基づく設計","研究に基づく • ずっと無料 • アカウント不要","心理学で最も実証的な裏づけのある性格モデルで、世界中の研究者に使われています。"],
"ko": ["공개된 연구에 기반","연구 기반 • 영원히 무료 • 계정 불필요","심리학에서 실증적 근거가 가장 탄탄한 성격 모형으로, 전 세계 연구자들이 사용합니다."],
"lt": ["Remiasi paskelbtais tyrimais","Grįsta tyrimais • Visada nemokama • Paskyros nereikia","Empiriškai geriausiai pagrįstas asmenybės modelis psichologijoje, naudojamas tyrėjų visame pasaulyje."],
"lv": ["Balstīts publicētos pētījumos","Balstīts pētījumos • Vienmēr bez maksas • Bez konta","Empīriski vislabāk pamatotais personības modelis psiholoģijā, ko izmanto pētnieki visā pasaulē."],
"mk": ["Изградено врз објавени истражувања","Засновано на истражувања • Засекогаш бесплатно • Без сметка","Емпириски најпоткрепениот модел на личност во психологијата, што го користат истражувачи ширум светот."],
"ms": ["Dibina atas penyelidikan diterbitkan","Berasaskan penyelidikan • Percuma selamanya • Tanpa akaun","Model personaliti dengan sokongan empirikal paling kukuh dalam psikologi, digunakan penyelidik di seluruh dunia."],
"nl": ["Gebouwd op gepubliceerd onderzoek","Op onderzoek gebaseerd • Altijd gratis • Geen account nodig","Het empirisch best onderbouwde persoonlijkheidsmodel in de psychologie, wereldwijd gebruikt door onderzoekers."],
"no": ["Bygget på publisert forskning","Forskningsbasert • Gratis for alltid • Ingen konto","Den empirisk best underbygde personlighetsmodellen i psykologien, brukt av forskere over hele verden."],
"pl": ["Oparte na opublikowanych badaniach","Oparte na badaniach • Zawsze za darmo • Bez konta","Najlepiej potwierdzony empirycznie model osobowości w psychologii, używany przez badaczy na całym świecie."],
"pt": ["Construído sobre investigação publicada","Baseado em investigação • Gratuito para sempre • Sem conta","O modelo de personalidade com maior apoio empírico na psicologia, usado por investigadores em todo o mundo."],
"ro": ["Construit pe cercetare publicată","Bazat pe cercetare • Gratuit pentru totdeauna • Fără cont","Modelul de personalitate cu cel mai solid sprijin empiric din psihologie, folosit de cercetători din toată lumea."],
"ru": ["Опирается на опубликованные исследования","На основе исследований • Навсегда бесплатно • Без регистрации","Наиболее эмпирически обоснованная модель личности в психологии, используемая исследователями по всему миру."],
"sk": ["Postavené na publikovanom výskume","Vychádza z výskumu • Navždy zadarmo • Bez účtu","Empiricky najlepšie podložený model osobnosti v psychológii, ktorý používajú výskumníci na celom svete."],
"sl": ["Zgrajeno na objavljenih raziskavah","Temelji na raziskavah • Za vedno brezplačno • Brez računa","Empirično najbolje podprt model osebnosti v psihologiji, ki ga uporabljajo raziskovalci po vsem svetu."],
"sq": ["Ndërtuar mbi kërkime të botuara","Bazuar në kërkime • Falas përgjithmonë • Pa llogari","Modeli i personalitetit me mbështetjen empirike më të fortë në psikologji, i përdorur nga studiues anembanë botës."],
"sr": ["Изграђено на објављеним истраживањима","Засновано на истраживањима • Заувек бесплатно • Без налога","Емпиријски најпоткрепљенији модел личности у психологији, који користе истраживачи широм света."],
"sv": ["Byggt på publicerad forskning","Forskningsbaserat • Gratis för alltid • Inget konto","Den empiriskt bäst underbyggda personlighetsmodellen inom psykologin, använd av forskare världen över."],
"sw": ["Imejengwa juu ya utafiti uliochapishwa","Inategemea utafiti • Bure milele • Hakuna akaunti","Muundo wa haiba wenye uthibitisho mkubwa zaidi wa kitaalamu katika saikolojia, unaotumiwa na watafiti duniani kote."],
"th": ["สร้างบนงานวิจัยที่ตีพิมพ์","อิงงานวิจัย • ฟรีตลอดไป • ไม่ต้องสมัคร","แบบจำลองบุคลิกภาพที่มีหลักฐานเชิงประจักษ์หนักแน่นที่สุดในจิตวิทยา นักวิจัยทั่วโลกใช้กัน"],
"tl": ["Nakabatay sa nailathalang pananaliksik","Batay sa pananaliksik • Libre habambuhay • Walang account","Ang modelo ng personalidad na may pinakamatibay na ebidensiya sa sikolohiya, ginagamit ng mga mananaliksik sa buong mundo."],
"tr": ["Yayımlanmış araştırmalara dayanıyor","Araştırmaya dayalı • Sonsuza dek ücretsiz • Hesap gerekmez","Psikolojide ampirik olarak en güçlü desteğe sahip kişilik modeli; dünya genelinde araştırmacılarca kullanılıyor."],
"uk": ["Спирається на опубліковані дослідження","На основі досліджень • Назавжди безкоштовно • Без реєстрації","Найкраще емпірично обґрунтована модель особистості в психології, якою користуються дослідники в усьому світі."],
"vi": ["Dựa trên nghiên cứu đã công bố","Dựa trên nghiên cứu • Miễn phí mãi mãi • Không cần tài khoản","Mô hình nhân cách có bằng chứng thực nghiệm vững nhất trong tâm lý học, được giới nghiên cứu khắp thế giới sử dụng."],
"zh": ["建立在公开发表的研究之上","基于研究 • 永久免费 • 无需账号","心理学中实证支持最充分的人格模型，全球研究者都在使用。"],
}

ready = T.ready_langs()
missing = [l for l in ready if l not in K]
if missing:
    print('NO TRANSLATIONS FOR:', missing); sys.exit(1)
for lang in ready:
    v = K[lang]
    assert len(v) == len(NAMES), (lang, len(v))
    T.set_keys(lang, dict(zip(NAMES, v)))
print('done: %d claim keys x %d languages' % (len(NAMES), len(ready)))

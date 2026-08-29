# -*- coding: utf-8 -*-
"""IQ test page <title> / description for all 43 markets.

Every one of the 43 descriptions advertised a test that no longer exists:
"40 questions across 3 domains", "20 minutes", "number series, visual matrices
and analogies", plus a "global percentile" we cannot produce. These strings are
the snippet Google shows for our flagship page.

The test is now 36 non-verbal matrix puzzles in 30 minutes, reported with a
confidence interval.
"""
import os, sys, io, re
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

D = {
"en": "36 non-verbal matrix puzzles measuring fluid reasoning. Free, 30 minutes, results given as a confidence interval. No sign-up, fresh puzzles every attempt.",
"af": "36 nie-verbale matrikspuzzels wat vloeiende redenasie meet. Gratis, 30 minute, uitslae as 'n vertrouensinterval. Geen registrasie, nuwe puzzels elke keer.",
"ar": "٣٦ لغزًا مصفوفيًا غير لفظي لقياس الاستدلال المرن. مجاني، ٣٠ دقيقة، والنتيجة تُعطى كفاصل ثقة. بلا تسجيل، وألغاز جديدة في كل محاولة.",
"bg": "36 невербални матрични задачи, измерващи флуидното мислене. Безплатно, 30 минути, резултат като доверителен интервал. Без регистрация, нови задачи всеки път.",
"cs": "36 neverbálních maticových úloh měřících fluidní uvažování. Zdarma, 30 minut, výsledek jako interval spolehlivosti. Bez registrace, nové úlohy při každém pokusu.",
"da": "36 nonverbale matrixopgaver, der måler flydende ræsonnement. Gratis, 30 minutter, resultat som konfidensinterval. Uden tilmelding, nye opgaver hver gang.",
"de": "36 nonverbale Matrizenaufgaben zur Messung des fluiden Denkens. Kostenlos, 30 Minuten, Ergebnis als Konfidenzintervall. Ohne Anmeldung, jedes Mal neue Aufgaben.",
"el": "36 μη λεκτικά ερωτήματα μητρών που μετρούν τη ρευστή σκέψη. Δωρεάν, 30 λεπτά, αποτέλεσμα ως διάστημα εμπιστοσύνης. Χωρίς εγγραφή, νέα ερωτήματα κάθε φορά.",
"es": "36 puzles matriciales no verbales que miden el razonamiento fluido. Gratis, 30 minutos, resultado como intervalo de confianza. Sin registro, puzles nuevos cada vez.",
"et": "36 mitteverbaalset maatriksülesannet, mis mõõdavad voolavat arutlust. Tasuta, 30 minutit, tulemus usaldusvahemikuna. Registreerimiseta, iga kord uued ülesanded.",
"fa": "۳۶ معمای ماتریسی غیرکلامی برای سنجش استدلال سیال. رایگان، ۳۰ دقیقه، نتیجه در قالب بازهٔ اطمینان. بدون ثبت‌نام و با معماهای تازه در هر بار.",
"fi": "36 sanatonta matriisitehtävää, jotka mittaavat joustavaa päättelyä. Ilmainen, 30 minuuttia, tulos luottamusvälinä. Ilman rekisteröitymistä, uudet tehtävät joka kerta.",
"fr": "36 puzzles matriciels non verbaux mesurant le raisonnement fluide. Gratuit, 30 minutes, résultat donné sous forme d'intervalle de confiance. Sans inscription, puzzles nouveaux à chaque essai.",
"he": "36 חידות מטריצה לא-מילוליות המודדות חשיבה גמישה. חינם, 30 דקות, תוצאה כרווח בר-סמך. בלי הרשמה, חידות חדשות בכל ניסיון.",
"hi": "द्रव तर्कशक्ति मापने वाली 36 अशाब्दिक आव्यूह पहेलियाँ। नि:शुल्क, 30 मिनट, परिणाम विश्वास अंतराल के रूप में। बिना पंजीकरण, हर बार नई पहेलियाँ।",
"hr": "36 neverbalnih matričnih zadataka koji mjere fluidno zaključivanje. Besplatno, 30 minuta, rezultat kao interval pouzdanosti. Bez registracije, novi zadaci pri svakom pokušaju.",
"hu": "36 nem verbális mátrixfeladat a fluid gondolkodás mérésére. Ingyenes, 30 perc, az eredmény konfidenciaintervallumként. Regisztráció nélkül, minden alkalommal új feladatok.",
"id": "36 teka-teki matriks non-verbal yang mengukur penalaran cair. Gratis, 30 menit, hasil berupa selang kepercayaan. Tanpa pendaftaran, teka-teki baru setiap percobaan.",
"it": "36 rompicapi matriciali non verbali che misurano il ragionamento fluido. Gratis, 30 minuti, risultato come intervallo di confidenza. Senza registrazione, rompicapi nuovi ogni volta.",
"ja": "流動性推理を測る36問の非言語的な行列課題。無料、30分、結果は信頼区間で表示。登録不要で、毎回新しい問題が出ます。",
"ko": "유동적 추론을 측정하는 36개의 비언어 행렬 문제. 무료, 30분, 결과는 신뢰구간으로 제시됩니다. 가입 불필요, 시도할 때마다 새로운 문제.",
"lt": "36 neverbalinės matricų užduotys, matuojančios sklandųjį mąstymą. Nemokamai, 30 minučių, rezultatas kaip pasikliautinasis intervalas. Be registracijos, kaskart naujos užduotys.",
"lv": "36 neverbāli matricu uzdevumi, kas mēra plūstošo spriešanu. Bez maksas, 30 minūtes, rezultāts kā ticamības intervāls. Bez reģistrācijas, katru reizi jauni uzdevumi.",
"mk": "36 невербални матрични задачи што го мерат флуидното расудување. Бесплатно, 30 минути, резултат како интервал на доверба. Без регистрација, нови задачи при секој обид.",
"ms": "36 teka-teki matriks bukan lisan yang mengukur penaakulan cair. Percuma, 30 minit, keputusan sebagai selang keyakinan. Tanpa pendaftaran, teka-teki baharu setiap percubaan.",
"nl": "36 non-verbale matrixpuzzels die vloeiend redeneren meten. Gratis, 30 minuten, resultaat als betrouwbaarheidsinterval. Zonder registratie, elke poging nieuwe puzzels.",
"no": "36 ikke-verbale matriseoppgaver som måler flytende resonnering. Gratis, 30 minutter, resultat som konfidensintervall. Uten registrering, nye oppgaver hver gang.",
"pl": "36 niewerbalnych zadań macierzowych mierzących rozumowanie płynne. Za darmo, 30 minut, wynik jako przedział ufności. Bez rejestracji, nowe zadania przy każdym podejściu.",
"pt": "36 puzzles matriciais não verbais que medem o raciocínio fluido. Grátis, 30 minutos, resultado dado como intervalo de confiança. Sem registo, puzzles novos em cada tentativa.",
"ro": "36 de puzzle-uri matriciale non-verbale care măsoară raționamentul fluid. Gratuit, 30 de minute, rezultat sub formă de interval de încredere. Fără cont, puzzle-uri noi la fiecare încercare.",
"ru": "36 невербальных матричных задач, измеряющих подвижное мышление. Бесплатно, 30 минут, результат в виде доверительного интервала. Без регистрации, каждый раз новые задачи.",
"sk": "36 neverbálnych maticových úloh meriacich fluidné uvažovanie. Zadarmo, 30 minút, výsledok ako interval spoľahlivosti. Bez registrácie, nové úlohy pri každom pokuse.",
"sl": "36 nebesednih matričnih nalog, ki merijo fluidno sklepanje. Brezplačno, 30 minut, rezultat kot interval zaupanja. Brez registracije, ob vsakem poskusu nove naloge.",
"sq": "36 enigma matricore joverbale që matin arsyetimin e rrjedhshëm. Falas, 30 minuta, rezultati jepet si interval besimi. Pa regjistrim, enigma të reja çdo herë.",
"sr": "36 невербалних матричних задатака који мере флуидно закључивање. Бесплатно, 30 минута, резултат као интервал поверења. Без регистрације, нови задаци при сваком покушају.",
"sv": "36 icke-verbala matrisuppgifter som mäter flytande resonemang. Gratis, 30 minuter, resultat som konfidensintervall. Utan registrering, nya uppgifter varje gång.",
"sw": "Mafumbo 36 ya matriki yasiyo ya maneno yanayopima ufikiri unaobadilika. Bila malipo, dakika 30, matokeo hutolewa kama kipimo cha mpaka wa uhakika. Bila kujisajili, mafumbo mapya kila jaribio.",
"th": "โจทย์เมทริกซ์ไม่ใช้ภาษา 36 ข้อ วัดการให้เหตุผลแบบยืดหยุ่น ฟรี 30 นาที รายงานผลเป็นช่วงความเชื่อมั่น ไม่ต้องสมัคร และสร้างโจทย์ใหม่ทุกครั้ง",
"tl": "36 na di-berbal na palaisipang matris na sumusukat sa fluid reasoning. Libre, 30 minuto, resulta bilang confidence interval. Walang pagpaparehistro, bagong palaisipan sa bawat pagsubok.",
"tr": "Akışkan muhakemeyi ölçen 36 sözel olmayan matris bulmacası. Ücretsiz, 30 dakika, sonuç güven aralığı olarak verilir. Kayıt yok, her denemede yeni bulmacalar.",
"uk": "36 невербальних матричних задач, що вимірюють рухливе мислення. Безкоштовно, 30 хвилин, результат подано як довірчий інтервал. Без реєстрації, щоразу нові задачі.",
"vi": "36 câu đố ma trận phi ngôn ngữ đo tư duy linh hoạt. Miễn phí, 30 phút, kết quả trình bày dưới dạng khoảng tin cậy. Không cần đăng ký, câu đố mới mỗi lần làm.",
"zh": "36 道非语言矩阵题，测量流体推理能力。免费，30 分钟，结果以置信区间呈现。无需注册，每次作答都是全新题目。",
}


def esc_attr(s):
    return s.replace('&', '&amp;').replace('"', '&quot;')


ready = T.ready_langs()
missing = [l for l in ready if l not in D]
if missing:
    print('NO DESCRIPTION FOR:', missing); sys.exit(1)

n = 0
for lang in ready:
    desc = D[lang]
    f = 'tests/iq/index.html' if lang == 'en' else '%s/tests/iq/index.html' % lang
    h = io.open(f, encoding='utf-8').read()
    orig = h
    for pat in (r'(<meta name="description" content=")[^"]*(")',
                r'(<meta property="og:description" content=")[^"]*(")',
                r'(<meta name="og:description" content=")[^"]*(")',
                r'(<meta property="twitter:description" content=")[^"]*(")',
                r'(<meta name="twitter:description" content=")[^"]*(")'):
        h = re.sub(pat, lambda m: m.group(1) + esc_attr(desc) + m.group(2), h, count=1)
    if h != orig:
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
        n += 1
print('IQ page descriptions rewritten on %d pages' % n)

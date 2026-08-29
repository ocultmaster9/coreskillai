# -*- coding: utf-8 -*-
"""Short IQ-test labels for the new matrix format.
Order: iq_f_items, iq_f_fair, iq_f_fair_sub, iq_f_method, iq_f_method_sub,
       iq_ci, iq_band_easy, iq_band_mid, iq_band_hard
"""
import os, sys
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

NAMES = ["iq_f_items","iq_f_fair","iq_f_fair_sub","iq_f_method","iq_f_method_sub",
         "iq_ci","iq_band_easy","iq_band_mid","iq_band_hard"]

K = {
"en": ["Items","Culture-fair","Non-verbal","Method","Matrix reasoning","95% confidence interval","Easier items","Moderate items","Hardest items"],
"af": ["Items","Kultuurregverdig","Nie-verbaal","Metode","Matriksredenering","95% vertrouensinterval","Makliker items","Matige items","Moeilikste items"],
"ar": ["الأسئلة","محايد ثقافيًا","غير لفظي","الطريقة","الاستدلال المصفوفي","فاصل ثقة ٩٥٪","الأسئلة الأسهل","الأسئلة المتوسطة","الأسئلة الأصعب"],
"bg": ["Задачи","Културно неутрален","Невербален","Метод","Матрично мислене","95% доверителен интервал","По-лесни задачи","Средни задачи","Най-трудни задачи"],
"cs": ["Položky","Kulturně nezávislý","Neverbální","Metoda","Maticové usuzování","95% interval spolehlivosti","Snazší položky","Střední položky","Nejtěžší položky"],
"da": ["Opgaver","Kulturneutral","Nonverbal","Metode","Matrixræsonnement","95% konfidensinterval","Lettere opgaver","Middelsvære opgaver","Sværeste opgaver"],
"de": ["Aufgaben","Kulturfair","Nonverbal","Methode","Matrizenlogik","95%-Konfidenzintervall","Leichtere Aufgaben","Mittlere Aufgaben","Schwerste Aufgaben"],
"el": ["Ερωτήματα","Πολιτισμικά ουδέτερο","Μη λεκτικό","Μέθοδος","Συλλογισμός μητρών","95% διάστημα εμπιστοσύνης","Ευκολότερα ερωτήματα","Μέτρια ερωτήματα","Δυσκολότερα ερωτήματα"],
"es": ["Ítems","Neutral culturalmente","No verbal","Método","Razonamiento matricial","Intervalo de confianza del 95%","Ítems más fáciles","Ítems intermedios","Ítems más difíciles"],
"et": ["Ülesanded","Kultuurineutraalne","Mitteverbaalne","Meetod","Maatriksarutlus","95% usaldusvahemik","Lihtsamad ülesanded","Keskmised ülesanded","Raskeimad ülesanded"],
"fa": ["پرسش‌ها","مستقل از فرهنگ","غیرکلامی","روش","استدلال ماتریسی","فاصلهٔ اطمینان ۹۵٪","پرسش‌های آسان‌تر","پرسش‌های متوسط","دشوارترین پرسش‌ها"],
"fi": ["Tehtävät","Kulttuurineutraali","Sanaton","Menetelmä","Matriisipäättely","95 %:n luottamusväli","Helpommat tehtävät","Keskitason tehtävät","Vaikeimmat tehtävät"],
"fr": ["Items","Neutre culturellement","Non verbal","Méthode","Raisonnement matriciel","Intervalle de confiance à 95%","Items les plus faciles","Items intermédiaires","Items les plus difficiles"],
"he": ["פריטים","ניטרלי תרבותית","לא מילולי","שיטה","חשיבה מטריצות","רווח בר-סמך של 95%","פריטים קלים יותר","פריטים בינוניים","הפריטים הקשים ביותר"],
"hi": ["प्रश्न","संस्कृति-निरपेक्ष","अशाब्दिक","विधि","आव्यूह तर्क","95% विश्वास अंतराल","आसान प्रश्न","मध्यम प्रश्न","सबसे कठिन प्रश्न"],
"hr": ["Zadaci","Kulturno neutralan","Neverbalan","Metoda","Matrično zaključivanje","95% interval pouzdanosti","Lakši zadaci","Srednji zadaci","Najteži zadaci"],
"hu": ["Feladatok","Kultúrafüggetlen","Nem verbális","Módszer","Mátrixkövetkeztetés","95%-os konfidenciaintervallum","Könnyebb feladatok","Közepes feladatok","Legnehezebb feladatok"],
"id": ["Soal","Netral budaya","Non-verbal","Metode","Penalaran matriks","Interval kepercayaan 95%","Soal lebih mudah","Soal menengah","Soal tersulit"],
"it": ["Item","Culturalmente neutro","Non verbale","Metodo","Ragionamento matriciale","Intervallo di confidenza al 95%","Item più facili","Item intermedi","Item più difficili"],
"ja": ["問題数","文化差の影響なし","非言語","方式","行列推理","95%信頼区間","易しい問題","標準的な問題","最も難しい問題"],
"ko": ["문항","문화 중립","비언어","방식","행렬 추론","95% 신뢰구간","쉬운 문항","보통 문항","가장 어려운 문항"],
"lt": ["Užduotys","Kultūriškai neutralus","Neverbalinis","Metodas","Matricinis mąstymas","95% pasikliautinasis intervalas","Lengvesnės užduotys","Vidutinės užduotys","Sunkiausios užduotys"],
"lv": ["Uzdevumi","Kultūrneitrāls","Neverbāls","Metode","Matricu spriešana","95% ticamības intervāls","Vieglākie uzdevumi","Vidēji uzdevumi","Grūtākie uzdevumi"],
"mk": ["Задачи","Културно неутрален","Невербален","Метод","Матрично расудување","95% интервал на доверба","Полесни задачи","Средни задачи","Најтешки задачи"],
"ms": ["Item","Neutral budaya","Bukan lisan","Kaedah","Penaakulan matriks","Selang keyakinan 95%","Item lebih mudah","Item sederhana","Item tersukar"],
"nl": ["Items","Cultuurneutraal","Non-verbaal","Methode","Matrixredeneren","95%-betrouwbaarheidsinterval","Makkelijkere items","Gemiddelde items","Moeilijkste items"],
"no": ["Oppgaver","Kulturnøytral","Ikke-verbal","Metode","Matriseresonnering","95% konfidensintervall","Lettere oppgaver","Middels oppgaver","Vanskeligste oppgaver"],
"pl": ["Zadania","Neutralny kulturowo","Niewerbalny","Metoda","Rozumowanie macierzowe","95% przedział ufności","Łatwiejsze zadania","Średnie zadania","Najtrudniejsze zadania"],
"pt": ["Itens","Neutro culturalmente","Não verbal","Método","Raciocínio matricial","Intervalo de confiança de 95%","Itens mais fáceis","Itens intermédios","Itens mais difíceis"],
"ro": ["Itemi","Neutru cultural","Non-verbal","Metodă","Raționament matricial","Interval de încredere 95%","Itemi mai ușori","Itemi medii","Cei mai grei itemi"],
"ru": ["Задания","Культурно нейтральный","Невербальный","Метод","Матричное мышление","95% доверительный интервал","Более лёгкие задания","Средние задания","Самые сложные задания"],
"sk": ["Položky","Kultúrne neutrálny","Neverbálny","Metóda","Maticové uvažovanie","95% interval spoľahlivosti","Ľahšie položky","Stredné položky","Najťažšie položky"],
"sl": ["Naloge","Kulturno nevtralen","Nebesedni","Metoda","Matrično sklepanje","95% interval zaupanja","Lažje naloge","Srednje naloge","Najtežje naloge"],
"sq": ["Pyetje","Neutral kulturalisht","Joverbal","Metoda","Arsyetim me matrica","Interval besimi 95%","Pyetjet më të lehta","Pyetjet mesatare","Pyetjet më të vështira"],
"sr": ["Задаци","Културно неутралан","Невербалан","Метод","Матрично закључивање","95% интервал поверења","Лакши задаци","Средњи задаци","Најтежи задаци"],
"sv": ["Uppgifter","Kulturneutral","Icke-verbal","Metod","Matrisresonemang","95% konfidensintervall","Lättare uppgifter","Medelsvåra uppgifter","Svåraste uppgifterna"],
"sw": ["Maswali","Isiyoegemea utamaduni","Isiyo ya maneno","Mbinu","Utambuzi wa matriki","Kipimo cha uhakika cha 95%","Maswali rahisi","Maswali ya wastani","Maswali magumu zaidi"],
"th": ["ข้อคำถาม","เป็นกลางทางวัฒนธรรม","ไม่ใช้ภาษา","วิธี","การให้เหตุผลแบบเมทริกซ์","ช่วงความเชื่อมั่น 95%","ข้อที่ง่ายกว่า","ข้อระดับกลาง","ข้อที่ยากที่สุด"],
"tl": ["Mga aytem","Patas sa lahat ng kultura","Di-berbal","Paraan","Pangangatwirang matris","95% confidence interval","Mas madaling aytem","Katamtamang aytem","Pinakamahirap na aytem"],
"tr": ["Soru","Kültürden bağımsız","Sözel olmayan","Yöntem","Matris muhakemesi","%95 güven aralığı","Daha kolay sorular","Orta düzey sorular","En zor sorular"],
"uk": ["Завдання","Культурно нейтральний","Невербальний","Метод","Матричне мислення","95% довірчий інтервал","Легші завдання","Середні завдання","Найважчі завдання"],
"vi": ["Câu hỏi","Trung lập văn hóa","Phi ngôn ngữ","Phương pháp","Suy luận ma trận","Khoảng tin cậy 95%","Câu dễ hơn","Câu trung bình","Câu khó nhất"],
"zh": ["题目数","跨文化公平","非语言","方式","矩阵推理","95% 置信区间","较易题目","中等题目","最难题目"],
}

ready = T.ready_langs()
missing = [l for l in ready if l not in K]
if missing:
    print('NO TRANSLATIONS FOR:', missing); sys.exit(1)
for lang in ready:
    vals = K[lang]
    assert len(vals) == len(NAMES), (lang, len(vals))
    T.set_keys(lang, dict(zip(NAMES, vals)))
print('done: %d short IQ keys x %d languages' % (len(NAMES), len(ready)))

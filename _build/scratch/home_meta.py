# -*- coding: utf-8 -*-
"""Homepage <title> and meta description for all 43 markets.

Ten titles ended with a translated "Compare Globally", and roughly thirty
descriptions promised a "world percentile" / "see how you compare worldwide".
We have no comparison sample at all - the percentile shown after a test is
computed from an assumed normal curve. These are the strings Google displays in
the search result, so they were the most widely seen untrue claim we had.

Replaced with what is true and still carries the ranking keywords: free IQ test,
brain tests, no sign-up, and 43 languages - which is a genuine differentiator no
competitor can match.

Updates <title>, og:title, twitter:title, description, og:description,
twitter:description.
"""
import os, sys, io, re
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

# lang -> (title, description)
M = {
"en": ("Free IQ Test and Brain Tests Online | CoreSkillAI","Nine free tests built on published research: IQ, memory, reaction time, attention, typing and personality. No sign-up, instant results, in 43 languages."),
"af": ("Gratis IK-toets en Breintoetse Aanlyn | CoreSkillAI","Nege gratis toetse gebou op gepubliseerde navorsing: IK, geheue, reaksietyd, aandag, tik en persoonlikheid. Geen registrasie, dadelike uitslae, in 43 tale."),
"ar": ("اختبار ذكاء مجاني واختبارات الدماغ | CoreSkillAI","تسعة اختبارات مجانية مبنية على أبحاث منشورة: الذكاء والذاكرة وزمن رد الفعل والانتباه والكتابة والشخصية. بلا تسجيل، نتيجة فورية، بـ43 لغة."),
"bg": ("IQ тест онлайн безплатно и тестове за мозъка | CoreSkillAI","Девет безплатни теста, изградени върху публикувани изследвания: интелигентност, памет, реакция, внимание, писане и личност. Без регистрация, мигновен резултат, на 43 езика."),
"cs": ("IQ test online zdarma a testy mozku | CoreSkillAI","Devět testů zdarma postavených na publikovaném výzkumu: IQ, paměť, reakce, pozornost, psaní a osobnost. Bez registrace, okamžitý výsledek, ve 43 jazycích."),
"da": ("Gratis IQ-test og Hjernetests Online | CoreSkillAI","Ni gratis tests bygget på publiceret forskning: IQ, hukommelse, reaktionstid, opmærksomhed, tastning og personlighed. Uden tilmelding, resultat med det samme, på 43 sprog."),
"de": ("Kostenloser IQ-Test und Gehirntests online | CoreSkillAI","Neun kostenlose Tests auf Basis publizierter Forschung: IQ, Gedächtnis, Reaktionszeit, Aufmerksamkeit, Tippen und Persönlichkeit. Ohne Anmeldung, sofort Ergebnis, in 43 Sprachen."),
"el": ("Τεστ IQ online δωρεάν και τεστ για τον εγκέφαλο | CoreSkillAI","Εννέα δωρεάν τεστ βασισμένα σε δημοσιευμένη έρευνα: IQ, μνήμη, χρόνος αντίδρασης, προσοχή, πληκτρολόγηση και προσωπικότητα. Χωρίς εγγραφή, άμεσο αποτέλεσμα, σε 43 γλώσσες."),
"es": ("Test de CI Gratis y Tests de Cerebro Online | CoreSkillAI","Nueve tests gratuitos basados en investigación publicada: CI, memoria, tiempo de reacción, atención, mecanografía y personalidad. Sin registro, resultados al instante, en 43 idiomas."),
"et": ("Tasuta IQ test internetis ja ajutestid | CoreSkillAI","Üheksa tasuta testi, mis põhinevad avaldatud uuringutel: IQ, mälu, reaktsiooniaeg, tähelepanu, trükkimine ja isiksus. Registreerimiseta, kohene tulemus, 43 keeles."),
"fa": ("آزمون هوش آنلاین رایگان و آزمون‌های مغز | CoreSkillAI","نه آزمون رایگان بر پایهٔ پژوهش‌های منتشرشده: هوش، حافظه، زمان واکنش، توجه، تایپ و شخصیت. بدون ثبت‌نام، نتیجهٔ آنی، به ۴۳ زبان."),
"fi": ("Ilmainen ÄO-testi ja aivotestit verkossa | CoreSkillAI","Yhdeksän ilmaista testiä julkaistun tutkimuksen pohjalta: ÄO, muisti, reaktioaika, tarkkaavaisuus, kirjoitus ja persoonallisuus. Ilman rekisteröitymistä, tulos heti, 43 kielellä."),
"fr": ("Test de QI Gratuit et Tests Cérébraux en Ligne | CoreSkillAI","Neuf tests gratuits fondés sur des recherches publiées : QI, mémoire, temps de réaction, attention, frappe et personnalité. Sans inscription, résultats immédiats, en 43 langues."),
"he": ("מבחן משכל אונליין בחינם ומבחני מוח | CoreSkillAI","תשעה מבחנים חינמיים הבנויים על מחקר שפורסם: משכל, זיכרון, זמן תגובה, קשב, הקלדה ואישיות. ללא הרשמה, תוצאה מיידית, ב-43 שפות."),
"hi": ("नि:शुल्क ऑनलाइन बुद्धि परीक्षण और मस्तिष्क परीक्षण | CoreSkillAI","प्रकाशित शोध पर बने नौ मुफ़्त परीक्षण: बुद्धि, स्मृति, प्रतिक्रिया समय, ध्यान, टंकण और व्यक्तित्व। बिना पंजीकरण, तत्काल परिणाम, 43 भाषाओं में।"),
"hr": ("IQ test online besplatno i testovi za mozak | CoreSkillAI","Devet besplatnih testova građenih na objavljenim istraživanjima: IQ, pamćenje, vrijeme reakcije, pažnja, tipkanje i osobnost. Bez registracije, trenutačan rezultat, na 43 jezika."),
"hu": ("Ingyenes online IQ-teszt és agytesztek | CoreSkillAI","Kilenc ingyenes teszt publikált kutatás alapján: IQ, memória, reakcióidő, figyelem, gépelés és személyiség. Regisztráció nélkül, azonnali eredmény, 43 nyelven."),
"id": ("Tes IQ Gratis dan Tes Otak Online | CoreSkillAI","Sembilan tes gratis yang dibangun dari riset yang dipublikasikan: IQ, memori, waktu reaksi, perhatian, mengetik, dan kepribadian. Tanpa pendaftaran, hasil instan, dalam 43 bahasa."),
"it": ("Test del QI Gratis e Test Cognitivi Online | CoreSkillAI","Nove test gratuiti costruiti su ricerca pubblicata: QI, memoria, tempo di reazione, attenzione, digitazione e personalità. Senza registrazione, risultati immediati, in 43 lingue."),
"ja": ("無料IQテスト・脳トレ診断 | CoreSkillAI","公表された研究に基づく9つの無料テスト。IQ、記憶、反応速度、注意力、タイピング、性格。登録不要、結果はすぐに表示、43言語対応。"),
"ko": ("무료 지능 테스트와 두뇌 테스트 | CoreSkillAI","공개된 연구를 바탕으로 만든 아홉 가지 무료 검사: 지능, 기억력, 반응 속도, 주의력, 타자, 성격. 가입 불필요, 즉시 결과 확인, 43개 언어 지원."),
"lt": ("IQ testas internetu nemokamai ir smegenų testai | CoreSkillAI","Devyni nemokami testai, sukurti pagal paskelbtus tyrimus: IQ, atmintis, reakcijos laikas, dėmesys, spausdinimas ir asmenybė. Be registracijos, rezultatas iškart, 43 kalbomis."),
"lv": ("IQ tests tiešsaistē bez maksas un smadzeņu testi | CoreSkillAI","Deviņi bezmaksas testi, balstīti publicētos pētījumos: IQ, atmiņa, reakcijas laiks, uzmanība, rakstīšana un personība. Bez reģistrācijas, tūlītējs rezultāts, 43 valodās."),
"mk": ("IQ тест онлајн бесплатно и тестови за мозокот | CoreSkillAI","Девет бесплатни тестови изградени врз објавени истражувања: интелигенција, помнење, време на реакција, внимание, пишување и личност. Без регистрација, веднаш резултат, на 43 јазици."),
"ms": ("Ujian IQ dan Ujian Otak Percuma Dalam Talian | CoreSkillAI","Sembilan ujian percuma dibina daripada penyelidikan diterbitkan: IQ, ingatan, masa tindak balas, perhatian, menaip dan personaliti. Tanpa pendaftaran, keputusan segera, dalam 43 bahasa."),
"nl": ("Gratis IQ-test en Hersentests Online | CoreSkillAI","Negen gratis tests gebouwd op gepubliceerd onderzoek: IQ, geheugen, reactietijd, aandacht, typen en persoonlijkheid. Zonder registratie, direct resultaat, in 43 talen."),
"no": ("Gratis IQ-test og Hjernetester på nett | CoreSkillAI","Ni gratis tester bygget på publisert forskning: IQ, hukommelse, reaksjonstid, oppmerksomhet, tasting og personlighet. Uten registrering, resultat med en gang, på 43 språk."),
"pl": ("Darmowy Test IQ i Testy Mózgu Online | CoreSkillAI","Dziewięć darmowych testów opartych na opublikowanych badaniach: IQ, pamięć, czas reakcji, uwaga, pisanie i osobowość. Bez rejestracji, wynik od razu, w 43 językach."),
"pt": ("Teste de QI Grátis e Testes Cerebrais Online | CoreSkillAI","Nove testes gratuitos construídos sobre investigação publicada: QI, memória, tempo de reação, atenção, escrita e personalidade. Sem registo, resultado imediato, em 43 línguas."),
"ro": ("Test IQ Gratuit și Teste Cognitive Online | CoreSkillAI","Nouă teste gratuite construite pe cercetare publicată: IQ, memorie, timp de reacție, atenție, tastare și personalitate. Fără cont, rezultate instant, în 43 de limbi."),
"ru": ("Бесплатный тест IQ и тесты для мозга онлайн | CoreSkillAI","Девять бесплатных тестов на основе опубликованных исследований: IQ, память, скорость реакции, внимание, печать и личность. Без регистрации, результат сразу, на 43 языках."),
"sk": ("IQ test online zadarmo a testy mozgu | CoreSkillAI","Deväť bezplatných testov postavených na publikovanom výskume: IQ, pamäť, reakčný čas, pozornosť, písanie a osobnosť. Bez registrácie, okamžitý výsledok, v 43 jazykoch."),
"sl": ("IQ test na spletu brezplačno in testi za možgane | CoreSkillAI","Devet brezplačnih testov, zgrajenih na objavljenih raziskavah: IQ, spomin, odzivni čas, pozornost, tipkanje in osebnost. Brez registracije, takojšen rezultat, v 43 jezikih."),
"sq": ("Test IQ-je dhe Teste Truri Falas Online | CoreSkillAI","Nëntë teste falas të ndërtuara mbi kërkime të botuara: IQ, kujtesa, koha e reagimit, vëmendja, shkrimi dhe personaliteti. Pa regjistrim, rezultate të menjëhershme, në 43 gjuhë."),
"sr": ("IQ тест онлајн бесплатно и тестови за мозак | CoreSkillAI","Девет бесплатних тестова грађених на објављеним истраживањима: IQ, памћење, време реакције, пажња, куцање и личност. Без регистрације, тренутни резултат, на 43 језика."),
"sv": ("Gratis IQ-test och Hjärntester Online | CoreSkillAI","Nio gratis test byggda på publicerad forskning: IQ, minne, reaktionstid, uppmärksamhet, skrivning och personlighet. Utan registrering, resultat direkt, på 43 språk."),
"sw": ("Jaribio la IQ na Majaribio ya Ubongo Bila Malipo | CoreSkillAI","Majaribio tisa bila malipo yaliyojengwa juu ya utafiti uliochapishwa: IQ, kumbukumbu, muda wa mwitikio, umakini, uchapaji na haiba. Bila kujisajili, matokeo papo hapo, kwa lugha 43."),
"th": ("แบบทดสอบเชาวน์ปัญญาและแบบทดสอบสมองฟรีออนไลน์ | CoreSkillAI","แบบทดสอบฟรีเก้าชุดที่สร้างจากงานวิจัยที่ตีพิมพ์ ได้แก่ เชาวน์ปัญญา ความจำ เวลาตอบสนอง สมาธิ การพิมพ์ และบุคลิกภาพ ไม่ต้องสมัคร ทราบผลทันที ใน 43 ภาษา"),
"tl": ("Libreng IQ Test at Pagsusulit sa Utak Online | CoreSkillAI","Siyam na libreng pagsusulit na nakabatay sa nailathalang pananaliksik: IQ, memorya, oras ng reaksyon, atensyon, pagta-type at personalidad. Walang pagpaparehistro, agad ang resulta, sa 43 wika."),
"tr": ("Ücretsiz IQ Testi ve Beyin Testleri Online | CoreSkillAI","Yayımlanmış araştırmalara dayanan dokuz ücretsiz test: IQ, hafıza, tepki süresi, dikkat, klavye ve kişilik. Kayıt yok, anında sonuç, 43 dilde."),
"uk": ("Тест IQ онлайн безкоштовно та тести на мозок | CoreSkillAI","Дев'ять безкоштовних тестів на основі опублікованих досліджень: IQ, пам'ять, швидкість реакції, увага, друк і особистість. Без реєстрації, результат одразу, 43 мовами."),
"vi": ("Kiểm tra IQ và trí não miễn phí trực tuyến | CoreSkillAI","Chín bài kiểm tra miễn phí dựng trên nghiên cứu đã công bố: IQ, trí nhớ, thời gian phản xạ, sự chú ý, gõ phím và tính cách. Không cần đăng ký, có kết quả ngay, bằng 43 ngôn ngữ."),
"zh": ("免费智力测试与大脑测试 | CoreSkillAI","九项基于公开研究的免费测验：智力、记忆、反应速度、注意力、打字和人格。无需注册，即时出结果，支持 43 种语言。"),
}

def esc(s):
    return s.replace('&', '&amp;')

def esc_attr(s):
    return s.replace('&', '&amp;').replace('"', '&quot;')

ready = T.ready_langs()
missing = [l for l in ready if l not in M]
if missing:
    print('NO METADATA FOR:', missing); sys.exit(1)

n = 0
for lang in ready:
    title, desc = M[lang]
    f = 'index.html' if lang == 'en' else '%s/index.html' % lang
    h = io.open(f, encoding='utf-8').read()
    orig = h

    h = re.sub(r'<title>[^<]*</title>', '<title>%s</title>' % esc(title), h, count=1)
    for prop, val in (('description', desc),):
        h = re.sub(r'(<meta name="%s" content=")[^"]*(")' % prop,
                   lambda m: m.group(1) + esc_attr(val) + m.group(2), h, count=1)
    for prop, val in (('og:title', title), ('og:description', desc),
                      ('twitter:title', title), ('twitter:description', desc)):
        h = re.sub(r'(<meta property="%s" content=")[^"]*(")' % re.escape(prop),
                   lambda m: m.group(1) + esc_attr(val) + m.group(2), h, count=1)
        h = re.sub(r'(<meta name="%s" content=")[^"]*(")' % re.escape(prop),
                   lambda m: m.group(1) + esc_attr(val) + m.group(2), h, count=1)

    if h != orig:
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
        n += 1
print('homepage metadata rewritten on %d pages' % n)

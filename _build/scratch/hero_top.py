# -*- coding: utf-8 -*-
"""The hero badge and subtitle - the first words anyone reads.

  hero_badge  "...100% anonymous"  - untrue while GA4 and AdSense run.
  hero_sub    "See how you compare with millions of people worldwide." - we have
              no comparison sample whatsoever. The percentile is computed from an
              assumed normal curve, not from millions of people.

Replaced with the two things that ARE true and are better hooks anyway:
no account needed, and 43 languages - which no competitor comes close to.
Order: hero_badge, hero_sub
"""
import os, sys
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

NAMES = ["hero_badge", "hero_sub"]

K = {
"en": ["Free • No account • No paywall","9 free tests built on published research. Clear results in minutes, in 43 languages."],
"af": ["Gratis • Geen rekening • Geen betaalmuur","9 gratis toetse gebou op gepubliseerde navorsing. Duidelike uitslae in minute, in 43 tale."],
"ar": ["مجاني • بلا حساب • بلا اشتراك","٩ اختبارات مجانية مبنية على أبحاث منشورة. نتائج واضحة في دقائق، بـ٤٣ لغة."],
"bg": ["Безплатно • Без акаунт • Без плащане","9 безплатни теста, изградени върху публикувани изследвания. Ясни резултати за минути, на 43 езика."],
"cs": ["Zdarma • Bez účtu • Bez placení","9 testů zdarma postavených na publikovaném výzkumu. Jasné výsledky během minut, ve 43 jazycích."],
"da": ["Gratis • Ingen konto • Ingen betaling","9 gratis tests bygget på publiceret forskning. Klare resultater på minutter, på 43 sprog."],
"de": ["Kostenlos • Kein Konto • Keine Bezahlschranke","9 kostenlose Tests auf Basis publizierter Forschung. Klare Ergebnisse in Minuten, in 43 Sprachen."],
"el": ["Δωρεάν • Χωρίς λογαριασμό • Χωρίς χρέωση","9 δωρεάν τεστ βασισμένα σε δημοσιευμένη έρευνα. Καθαρά αποτελέσματα σε λεπτά, σε 43 γλώσσες."],
"es": ["Gratis • Sin cuenta • Sin pago","9 tests gratuitos basados en investigación publicada. Resultados claros en minutos, en 43 idiomas."],
"et": ["Tasuta • Kontot pole • Tasumüüri pole","9 tasuta testi, mis põhinevad avaldatud uuringutel. Selged tulemused minutitega, 43 keeles."],
"fa": ["رایگان • بدون حساب • بدون پرداخت","۹ آزمون رایگان بر پایهٔ پژوهش‌های منتشرشده. نتیجهٔ روشن در چند دقیقه، به ۴۳ زبان."],
"fi": ["Ilmainen • Ei tiliä • Ei maksumuuria","9 ilmaista testiä julkaistun tutkimuksen pohjalta. Selkeät tulokset minuuteissa, 43 kielellä."],
"fr": ["Gratuit • Sans compte • Sans paiement","9 tests gratuits fondés sur des recherches publiées. Des résultats clairs en quelques minutes, en 43 langues."],
"he": ["חינם • בלי חשבון • בלי תשלום","9 מבחנים חינמיים הבנויים על מחקר שפורסם. תוצאות ברורות בדקות, ב-43 שפות."],
"hi": ["मुफ़्त • खाता नहीं • भुगतान नहीं","प्रकाशित शोध पर बने 9 मुफ़्त परीक्षण। मिनटों में स्पष्ट परिणाम, 43 भाषाओं में।"],
"hr": ["Besplatno • Bez računa • Bez naplate","9 besplatnih testova građenih na objavljenim istraživanjima. Jasni rezultati u nekoliko minuta, na 43 jezika."],
"hu": ["Ingyenes • Nincs fiók • Nincs fizetés","9 ingyenes teszt publikált kutatás alapján. Világos eredmény percek alatt, 43 nyelven."],
"id": ["Gratis • Tanpa akun • Tanpa bayar","9 tes gratis yang dibangun dari riset yang dipublikasikan. Hasil jelas dalam hitungan menit, dalam 43 bahasa."],
"it": ["Gratis • Nessun account • Nessun pagamento","9 test gratuiti costruiti su ricerca pubblicata. Risultati chiari in pochi minuti, in 43 lingue."],
"ja": ["無料 • 登録不要 • 課金なし","公表された研究に基づく9つの無料検査。数分で明快な結果を、43言語で。"],
"ko": ["무료 • 계정 불필요 • 결제 없음","공개된 연구를 바탕으로 만든 9가지 무료 검사. 몇 분 만에 분명한 결과를, 43개 언어로."],
"lt": ["Nemokama • Be paskyros • Be mokesčių","9 nemokami testai, sukurti pagal paskelbtus tyrimus. Aiškūs rezultatai per kelias minutes, 43 kalbomis."],
"lv": ["Bez maksas • Bez konta • Bez samaksas","9 bezmaksas testi, balstīti publicētos pētījumos. Skaidri rezultāti dažās minūtēs, 43 valodās."],
"mk": ["Бесплатно • Без сметка • Без плаќање","9 бесплатни тестови изградени врз објавени истражувања. Јасни резултати за неколку минути, на 43 јазици."],
"ms": ["Percuma • Tanpa akaun • Tanpa bayaran","9 ujian percuma dibina daripada penyelidikan diterbitkan. Keputusan jelas dalam beberapa minit, dalam 43 bahasa."],
"nl": ["Gratis • Geen account • Geen betaalmuur","9 gratis tests gebouwd op gepubliceerd onderzoek. Heldere resultaten in minuten, in 43 talen."],
"no": ["Gratis • Ingen konto • Ingen betaling","9 gratis tester bygget på publisert forskning. Klare resultater på minutter, på 43 språk."],
"pl": ["Za darmo • Bez konta • Bez opłat","9 darmowych testów opartych na opublikowanych badaniach. Jasne wyniki w kilka minut, w 43 językach."],
"pt": ["Grátis • Sem conta • Sem pagamento","9 testes gratuitos construídos sobre investigação publicada. Resultados claros em minutos, em 43 línguas."],
"ro": ["Gratuit • Fără cont • Fără plată","9 teste gratuite construite pe cercetare publicată. Rezultate clare în câteva minute, în 43 de limbi."],
"ru": ["Бесплатно • Без аккаунта • Без оплаты","9 бесплатных тестов на основе опубликованных исследований. Понятный результат за минуты, на 43 языках."],
"sk": ["Zadarmo • Bez účtu • Bez platby","9 bezplatných testov postavených na publikovanom výskume. Jasné výsledky za pár minút, v 43 jazykoch."],
"sl": ["Brezplačno • Brez računa • Brez plačila","9 brezplačnih testov, zgrajenih na objavljenih raziskavah. Jasni rezultati v nekaj minutah, v 43 jezikih."],
"sq": ["Falas • Pa llogari • Pa pagesë","9 teste falas të ndërtuara mbi kërkime të botuara. Rezultate të qarta për pak minuta, në 43 gjuhë."],
"sr": ["Бесплатно • Без налога • Без плаћања","9 бесплатних тестова грађених на објављеним истраживањима. Јасни резултати за неколико минута, на 43 језика."],
"sv": ["Gratis • Inget konto • Ingen betalvägg","9 gratis test byggda på publicerad forskning. Tydliga resultat på minuter, på 43 språk."],
"sw": ["Bure • Hakuna akaunti • Hakuna malipo","Vipimo 9 bure vilivyojengwa juu ya utafiti uliochapishwa. Matokeo wazi ndani ya dakika, kwa lugha 43."],
"th": ["ฟรี • ไม่ต้องมีบัญชี • ไม่มีค่าใช้จ่าย","แบบทดสอบฟรี 9 ชุดที่สร้างจากงานวิจัยที่ตีพิมพ์ ผลชัดเจนภายในไม่กี่นาที ใน 43 ภาษา"],
"tl": ["Libre • Walang account • Walang bayad","9 librengpagsusulit na nakabatay sa nailathalang pananaliksik. Malinaw na resulta sa loob ng minuto, sa 43 wika."],
"tr": ["Ücretsiz • Hesap yok • Ödeme yok","Yayımlanmış araştırmalara dayanan 9 ücretsiz test. Dakikalar içinde net sonuç, 43 dilde."],
"uk": ["Безкоштовно • Без акаунта • Без оплати","9 безкоштовних тестів на основі опублікованих досліджень. Зрозумілий результат за хвилини, 43 мовами."],
"vi": ["Miễn phí • Không tài khoản • Không trả phí","9 bài kiểm tra miễn phí dựng trên nghiên cứu đã công bố. Kết quả rõ ràng trong vài phút, bằng 43 ngôn ngữ."],
"zh": ["免费 • 无需账号 • 无需付费","9 项基于公开研究的免费测验。几分钟得出清晰结果，支持 43 种语言。"],
}

ready = T.ready_langs()
missing = [l for l in ready if l not in K]
if missing:
    print('NO TRANSLATIONS FOR:', missing); sys.exit(1)
for lang in ready:
    v = K[lang]
    assert len(v) == len(NAMES), (lang, len(v))
    T.set_keys(lang, dict(zip(NAMES, v)))
print('done: %d hero keys x %d languages' % (len(NAMES), len(ready)))

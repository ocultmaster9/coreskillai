# -*- coding: utf-8 -*-
"""Remove the "global percentile" claim from the remaining 8 test pages.

125 of 344 meta descriptions promised a comparison against a world population we
do not have. The percentile every test shows is computed from an assumed normal
curve, not from our visitors - the same fabrication already removed from the
homepage and the IQ page.

A related one: 14 markets told visitors to "compare your result with the world
average of 261 ms". Simple visual reaction time norms are published, but 261 is a
precise figure we cannot source, so it goes too and is replaced with what the
test genuinely reports - your own average in milliseconds.

This edits clauses rather than rewriting whole descriptions, so the per-market
SEO copy that is otherwise fine stays intact.
"""
import os, sys, io, re
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

# lang -> [(find, replace), ...]
R = {
"af": [("Gratis, onmiddellike uitslae met wêreldwye persentielvergelyking.", "Gratis, onmiddellike uitslae."),
       ("Vind jou WPM en wêreldwye rangorde uit.", "Vind jou WPM en akkuraatheid uit.")],
"ar": [("قارن نتيجتك بالمتوسط العالمي البالغ 261 مللي ثانية.", "واطّلع على متوسط زمنك بالمللي ثانية."),
       ("وحساب الكلمات في الدقيقة والدقة ونسبة مئوية عالمية.", "وحساب الكلمات في الدقيقة والدقة.")],
"bg": [("Сравнете резултата си със световната средна от 261 мс.", "Вижте средното си време в милисекунди."),
       (", световен персентил.", ".")],
"cs": [("Porovnejte svůj výsledek se světovým průměrem 261 ms.", "Zjistěte svůj průměrný čas v milisekundách."),
       (", světový percentil.", ".")],
"da": [("Resultat med global percentil.", "Resultat med det samme."),
       (" — med global sammenligning.", " — på 60 sekunder.")],
"de": [("Ergebnis mit weltweitem Perzentil.", "Ergebnis sofort."),
       (" — mit weltweitem Vergleich.", " — in 60 Sekunden.")],
"el": [(", παγκόσμιο εκατοστημόριο.", ".")],
"en": [("Free, instant results with global percentile comparison.", "Free, instant results."),
       ("Find out your WPM and global ranking.", "Find out your WPM and accuracy.")],
"es": [("Resultado con percentil global.", "Resultado al instante."),
       (", con comparación mundial.", ", en 60 segundos.")],
"et": [("Võrrelge oma tulemust maailma keskmisega 261 ms.", "Näete oma keskmist aega millisekundites."),
       (", maailma protsentiil.", ".")],
"fa": [("نتیجهٔ خود را با میانگین جهانی ۲۶۱ میلی‌ثانیه بسنجید.", "میانگین زمان خود را برحسب میلی‌ثانیه ببینید."),
       ("، صدک جهانی.", ".")],
"fi": [("Tulos maailmanlaajuisella prosenttipisteellä.", "Tulos heti."),
       (", maailmanlaajuisella vertailulla.", ", 60 sekunnissa.")],
"fr": [("Résultat avec percentile mondial.", "Résultat immédiat."),
       (", avec comparaison mondiale.", ", en 60 secondes.")],
"he": [(", אחוזון עולמי.", ".")],
"hi": [("अपने परिणाम की तुलना 261 मिलीसेकंड के विश्व औसत से कीजिए।", "अपना औसत समय मिलीसेकंड में देखिए।"),
       (", विश्व प्रतिशतक।", "।")],
"hr": [("Usporedite svoj rezultat sa svjetskim prosjekom od 261 ms.", "Pogledajte svoje prosječno vrijeme u milisekundama."),
       (", svjetski percentil.", ".")],
"hu": [("Vesse össze eredményét a 261 ms-os világátlaggal.", "Nézze meg átlagos idejét ezredmásodpercben."),
       (", világszintű percentilis.", ".")],
"id": [("Hasil dengan persentil dunia.", "Hasil langsung."),
       (", dengan perbandingan dunia.", ", dalam 60 detik.")],
"it": [("Risultato con percentile globale.", "Risultato immediato."),
       (", con confronto mondiale.", ", in 60 secondi.")],
"ja": [("全5回の無料テストで、世界平均261ミリ秒と比べられます。", "全5回の無料テストで、平均反応時間をミリ秒で表示します。"),
       ("60秒で毎分の文字数と正確率、世界パーセンタイルが分かります。", "60秒で毎分の文字数と正確率が分かります。")],
"ko": [("무료이며 전 세계 백분위 비교와 함께 즉시 결과를 확인할 수 있습니다.", "무료이며 즉시 결과를 확인할 수 있습니다."),
       ("분당 낱말 수와 전 세계 순위를 확인하세요.", "분당 낱말 수와 정확도를 확인하세요.")],
"mk": [("Споредете го резултатот со светскиот просек од 261 мс.", "Видете го просечното време во милисекунди."),
       (", светски перцентил.", ".")],
"ms": [("Percuma, keputusan serta-merta dengan perbandingan persentil global.", "Percuma, keputusan serta-merta."),
       ("Ketahui WPM dan kedudukan global anda.", "Ketahui WPM dan ketepatan anda.")],
"nl": [("Resultaat met wereldwijd percentiel.", "Direct resultaat."),
       (", met wereldwijde vergelijking.", ", in 60 seconden.")],
"no": [("Resultat med global persentil.", "Resultat med en gang."),
       (", med global sammenligning.", ", på 60 sekunder.")],
"pl": [("Wynik z percentylem światowym.", "Wynik od razu."),
       (", z porównaniem światowym.", ", w 60 sekund.")],
"pt": [("Resultado com percentil global.", "Resultado imediato."),
       (", com comparação mundial.", ", em 60 segundos.")],
"ro": [("Rezultat cu percentilă mondială.", "Rezultat imediat."),
       (", cu comparație mondială.", ", în 60 de secunde.")],
"ru": [("Результат с мировым процентилем.", "Результат сразу."),
       (", со сравнением по миру.", ", за 60 секунд.")],
"sk": [("Porovnajte svoj výsledok so svetovým priemerom 261 ms.", "Zistite svoj priemerný čas v milisekundách."),
       (", svetový percentil.", ".")],
"sl": [("Primerjajte svoj rezultat s svetovnim povprečjem 261 ms.", "Oglejte si svoj povprečni čas v milisekundah."),
       (", svetovni percentil.", ".")],
"sq": [("Falas, rezultate të menjëhershme me krahasim global përqindjeje.", "Falas, rezultate të menjëhershme."),
       ("Zbuloni WPM-në dhe renditjen tuaj globale.", "Zbuloni WPM-në dhe saktësinë tuaj.")],
"sr": [("Упоредите свој резултат са светским просеком од 261 мс.", "Погледајте своје просечно време у милисекундама."),
       (", светски перцентил.", ".")],
"sv": [("Resultat med global percentil.", "Resultat direkt."),
       (", med global jämförelse.", ", på 60 sekunder.")],
"sw": [("Bila malipo, matokeo ya papo hapo yenye ulinganisho wa asilimia za kimataifa.", "Bila malipo, matokeo ya papo hapo."),
       ("Jua WPM yako na nafasi yako duniani.", "Jua WPM yako na usahihi wako.")],
"th": [("ฟรี ได้ผลทันทีพร้อมการเปรียบเทียบเปอร์เซ็นไทล์ทั่วโลก", "ฟรี ได้ผลทันที"),
       ("มาดูจำนวนคำต่อนาทีและอันดับโลกของคุณ", "มาดูจำนวนคำต่อนาทีและความแม่นยำของคุณ")],
"tl": [("Libre, agarang resulta na may pandaigdigang paghahambing ng persentil.", "Libre, agarang resulta."),
       ("Alamin ang iyong WPM at pandaigdigang ranggo.", "Alamin ang iyong WPM at katumpakan.")],
"tr": [("Dünya yüzdelik dilimiyle sonuç.", "Anında sonuç."),
       ("dünya karşılaştırmasıyla öğrenin.", "60 saniyede öğrenin.")],
"uk": [("Порівняйте свій результат зі світовим середнім 261 мс.", "Перегляньте свій середній час у мілісекундах."),
       (", світовий процентиль.", ".")],
"zh": [("免费，即时出结果并提供全球百分位对比，无需注册。", "免费，即时出结果，无需注册。"),
       ("看看你的每分钟词数和全球排名。", "看看你的每分钟词数和正确率。")],
}

TESTS = ['reaction-time', 'memory', 'pattern', 'color-vision', 'big-five', 'eq', 'focus', 'typing']
META = [r'(<meta name="description" content=")([^"]*)(")',
        r'(<meta property="og:description" content=")([^"]*)(")',
        r'(<meta name="og:description" content=")([^"]*)(")',
        r'(<meta property="twitter:description" content=")([^"]*)(")',
        r'(<meta name="twitter:description" content=")([^"]*)(")']

changed = 0
applied = {}
for lang in T.ready_langs():
    pairs = R.get(lang)
    if not pairs:
        continue
    for t in TESTS:
        f = 'tests/%s/index.html' % t if lang == 'en' else '%s/tests/%s/index.html' % (lang, t)
        if not os.path.isfile(f):
            continue
        h = io.open(f, encoding='utf-8').read()
        orig = h
        def fix(m):
            body = m.group(2)
            for a, b in pairs:
                if a in body:
                    body = body.replace(a, b)
                    applied[(lang, a)] = applied.get((lang, a), 0) + 1
            return m.group(1) + body + m.group(3)
        for pat in META:
            h = re.sub(pat, fix, h, count=1)
        if h != orig:
            io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
            changed += 1

print('pages edited: %d' % changed)
unused = [(l, a[:40]) for l in R for a, _ in R[l] if (l, a) not in applied]
print('patterns that matched nothing (check these): %s' % (unused if unused else 'NONE'))

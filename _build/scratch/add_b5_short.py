# -*- coding: utf-8 -*-
"""Short trait labels for the Big Five radar axes.

The radar previously drew name.slice(0,3). Once the names were translated that
produced garbage: Thai gave three identical labels ("ควา"), German five copies of
prefixes, Russian "Экс/Доб/Доб/Ней/Отк" (two collisions). These are hand-made
abbreviations that stay distinct within each language.
Order: E, A, C, N, O
"""
import os, sys
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

NAMES = ["b5_s_e","b5_s_a","b5_s_c","b5_s_n","b5_s_o"]

K = {
"en": ["Ext","Agr","Con","Neu","Opn"],
"af": ["Ekst","Inskik","Pligs","Neur","Oop"],
"ar": ["انبساط","وداعة","ضمير","عصابية","انفتاح"],
"bg": ["Екстр","Добро","Съвест","Невр","Откр"],
"cs": ["Extr","Přív","Svěd","Neur","Otev"],
"da": ["Ekst","Ven","Samv","Neur","Åben"],
"de": ["Extra","Verträg","Gewiss","Neuro","Offen"],
"el": ["Εξωσ","Προσ","Ευσυν","Νευρ","Δεκτ"],
"es": ["Extra","Amab","Resp","Neuro","Apert"],
"et": ["Ekst","Sõbr","Meel","Neur","Avat"],
"fa": ["برون‌گرایی","توافق","وظیفه","روان‌رنجوری","گشودگی"],
"fi": ["Ulos","Sovin","Tunno","Neuro","Avoim"],
"fr": ["Extra","Agréab","Consc","Névro","Ouvert"],
"he": ["מוחצ","נעימ","מצפ","נוירו","פתיח"],
"hi": ["बहिर्","सहमति","कर्तव्य","स्नाय","खुला"],
"hr": ["Ekst","Ugod","Savj","Neur","Otvor"],
"hu": ["Extra","Barát","Lelkiism","Neuro","Nyitott"],
"id": ["Ekstra","Keramah","Kehati","Neuro","Keterb"],
"it": ["Estro","Amic","Cosc","Nevro","Apert"],
"ja": ["外向","協調","誠実","神経","開放"],
"ko": ["외향","우호","성실","신경","개방"],
"lt": ["Ekstr","Sutar","Sąžin","Neur","Atvir"],
"lv": ["Ekst","Laip","Apzin","Neir","Atvēr"],
"mk": ["Екстр","Прија","Совес","Невр","Отвор"],
"ms": ["Ekstra","Kerama","Keteli","Neuro","Keterb"],
"nl": ["Extra","Vriend","Zorgv","Neuro","Open"],
"no": ["Ekst","Ven","Plikt","Nevr","Åpen"],
"pl": ["Ekstra","Ugod","Sumien","Neuro","Otwart"],
"pt": ["Extro","Amab","Consc","Neuro","Abert"],
"ro": ["Extra","Amab","Consti","Nevro","Desch"],
"ru": ["Экстр","Доброж","Добросов","Невро","Откр"],
"sk": ["Extr","Príve","Svedo","Neur","Otvor"],
"sl": ["Ekst","Prijet","Vestn","Nevr","Odprt"],
"sq": ["Ekstra","Pajtue","Ndërgj","Neuro","Hapje"],
"sr": ["Екстр","Приј","Савес","Неур","Отвор"],
"sv": ["Extra","Vänl","Målmed","Neuro","Öppen"],
"sw": ["Uchang","Ukarim","Uangal","Wasiwas","Uwazi"],
"th": ["แสดงตัว","ประนีประนอม","มีสติ","ไม่มั่นคง","เปิดรับ"],
"tl": ["Ekstra","Pagkama","Pagkama-asa","Neuro","Pagkabukas"],
"tr": ["Dışa","Uyum","Sorum","Nevro","Açık"],
"uk": ["Екстр","Доброз","Сумлін","Невро","Відкр"],
"vi": ["Hướng ngoại","Dễ chịu","Tận tâm","Bất ổn","Cởi mở"],
"zh": ["外向","宜人","尽责","神经质","开放"],
}

ready = T.ready_langs()
missing = [l for l in ready if l not in K]
if missing:
    print('NO TRANSLATIONS FOR:', missing); sys.exit(1)
bad = []
for lang in ready:
    vals = K[lang]
    assert len(vals) == len(NAMES), (lang, len(vals))
    if len(set(vals)) != len(vals):
        bad.append(lang)            # collisions defeat the whole point
if bad:
    print('DUPLICATE SHORT LABELS IN:', bad); sys.exit(1)
for lang in ready:
    T.add_keys(lang, dict(zip(NAMES, K[lang])))
print('done: %d short labels x %d languages' % (len(NAMES), len(ready)))

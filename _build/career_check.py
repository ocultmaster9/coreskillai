# -*- coding: utf-8 -*-
"""Validate career-test translations: _build/content/_career/<lang>.json and
_build/content/<lang>/career.html against the English masters."""
import io, json, os, re, sys, glob
B = os.path.dirname(os.path.abspath(__file__))
EN = json.load(io.open(os.path.join(B, 'content/_career/en.json'), encoding='utf-8'))
ENH = io.open(os.path.join(B, 'content/en/career.html'), encoding='utf-8').read()
def cnt(h): return tuple(len(re.findall('<%s[ >]' % t, h)) for t in ('h2','h3','p','li','strong','em','a'))
def check(lang):
    errs = []
    jf = os.path.join(B, 'content/_career/%s.json' % lang)
    hf = os.path.join(B, 'content/%s/career.html' % lang)
    if not os.path.isfile(jf): return ['no json']
    try: d = json.load(io.open(jf, encoding='utf-8'))
    except Exception as e: return ['bad json: %s' % e]
    miss = set(EN['keys']) - set(d.get('keys', {})); extra = set(d.get('keys', {})) - set(EN['keys'])
    if miss: errs.append('missing keys %s' % sorted(miss))
    if extra: errs.append('extra keys %s' % sorted(extra))
    if len(d.get('items', [])) != 60: errs.append('items %d' % len(d.get('items', [])))
    if len(d.get('careers', [])) != 109: errs.append('careers %d' % len(d.get('careers', [])))
    k = d.get('keys', {})
    if '{n}' not in k.get('car_how1', ''): errs.append('car_how1 lost {n}')
    for kk, v in k.items():
        if not v.strip(): errs.append('empty ' + kk)
        if '"' in v and kk.startswith('meta'): errs.append('quote in ' + kk)
    if not os.path.isfile(hf): errs.append('no html')
    else:
        h = io.open(hf, encoding='utf-8').read()
        if '{{SOURCES}}' not in h and '<ul class="sources" lang="en">' not in h: errs.append('no sources slot')
        hh = re.sub(r'(?is)<ul class="sources" lang="en">.*?</ul>', '{{SOURCES}}', h).replace('{{SOURCES}}', re.search(r'(?is)<ul class="sources" lang="en">.*?</ul>', ENH).group(0))
        if cnt(hh) != cnt(ENH): errs.append('html structure %s vs en %s' % (cnt(hh), cnt(ENH)))
    return errs
if __name__ == '__main__':
    langs = sys.argv[1:] or sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(B, 'content/_career/*.json')) if not f.endswith(('en.json', 'master.json')))
    bad = 0
    for l in langs:
        e = check(l); bad += bool(e)
        print(l, 'OK' if not e else e)
    sys.exit(1 if bad else 0)

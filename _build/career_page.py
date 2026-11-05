# -*- coding: utf-8 -*-
"""Build the Career Interest Test (tests/career) in every market.

Sources (all in _build/content):
  _career/en.json, _career/<lang>.json   UI keys, 60 items, 109 career titles
  en/career.html, <lang>/career.html     long-form article ({{SOURCES}} = EN list)

What it does, idempotently:
  1. injects ITEMS_I18N / CAREER_I18N into js/tests/career.js
  2. writes the car_* keys into js/i18n/<lang>.js
  3. clones tests/career/index.html from English into each market and sets
     its title / description / og / twitter / ld+json name
  4. writes the long-form article into each market's page
  5. adds the test card to the home and /tests/ grids and a footer link on
     every page

RUN (then prerender + refresh + checks, see enable_markets.py):
  cd websites/coreskillai.com && python3 _build/career_page.py
"""
import io, os, re, json, sys, glob
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import tools as T
import apply_longform as AL
import career_check as CC

C = os.path.join(HERE, 'content')
EN = json.load(io.open(os.path.join(C, '_career/en.json'), encoding='utf-8'))
ENH = io.open(os.path.join(C, 'en/career.html'), encoding='utf-8').read()
SRC = re.search(r'(?is)<ul class="sources" lang="en">.*?</ul>', ENH).group(0)

def jsarr(a): return '[' + ','.join(json.dumps(x, ensure_ascii=False) for x in a) + ']'

def main():
    langs = [l for l in T.ready_langs() if l != 'en']
    bad = [(l, CC.check(l)) for l in langs if CC.check(l)]
    if bad:
        print('TRANSLATIONS INCOMPLETE:', bad); return 1
    data = {l: json.load(io.open(os.path.join(C, '_career/%s.json' % l), encoding='utf-8')) for l in langs}

    # 1. JS banks
    p = 'js/tests/career.js'; s = io.open(p, encoding='utf-8').read()
    items = ''.join('  %s:%s,\n' % (l, jsarr(data[l]['items'])) for l in sorted(langs))
    car = ''.join('  %s:%s,\n' % (l, jsarr(data[l]['careers'])) for l in sorted(langs))
    s = re.sub(r'const ITEMS_I18N=\{.*?\n\};', lambda m: 'const ITEMS_I18N={\n' + items + '};', s, count=1, flags=re.S)
    s = re.sub(r'const CAREER_I18N=\{.*?\n\};', lambda m: 'const CAREER_I18N={\n' + car + '};', s, count=1, flags=re.S)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

    # 2. UI keys
    for l in langs + ['en']:
        k = EN['keys'] if l == 'en' else data[l]['keys']
        f = 'js/i18n/%s.js' % l; s = io.open(f, encoding='utf-8').read()
        s = re.sub(r'(?m)^\s*car_[a-z0-9_]+:".*",?\n', '', s)
        add = ''.join('    %s:%s,\n' % (kk, json.dumps(v, ensure_ascii=False)) for kk, v in k.items() if kk.startswith('car_'))
        i = s.rstrip().rfind('};'); s = s[:i] + add + s[i:]
        io.open(f, 'w', encoding='utf-8', newline='\n').write(s)

    # 3 + 4. pages
    saved = T.PAGES; T.PAGES = ['tests/career']
    try:
        for l in langs:
            T.generate_pages(l)
    finally:
        T.PAGES = saved
    for l in ['en'] + langs:
        k = EN['keys'] if l == 'en' else data[l]['keys']
        f = T.path_for(l, 'tests/career'); h = io.open(f, encoding='utf-8').read()
        t, d = k['meta_title'], k['meta_desc'].replace('"', '&quot;')
        h = re.sub(r'<title>[^<]*</title>', lambda m: '<title>%s</title>' % t, h, count=1)
        for pat in ['name="description"', 'property="og:description"', 'name="twitter:description"']:
            h = re.sub(r'(<meta %s content=")[^"]*' % pat, lambda m: m.group(1) + d, h, count=1)
        for pat in ['property="og:title"', 'name="twitter:title"']:
            h = re.sub(r'(<meta %s content=")[^"]*' % pat, lambda m: m.group(1) + t, h, count=1)
        h = re.sub(r'("@type":"WebApplication","name":")[^"]*', lambda m: m.group(1) + k['car_title'].replace('"', ''), h, count=1)
        if l != 'en':
            # /blog/ and /methodology/ exist in English only (guides.py adds those
            # links to EN pages). Cloned from EN, the markets would link to 404s.
            h = re.sub(r'\n[ \t]*<a href="/%s/blog/">[^<]*</a>' % l, '', h)
            h = re.sub(r'\n[ \t]*<li><a href="/%s/(?:blog|methodology)/">[^<]*</a></li>' % l, '', h)
            h = h.replace('"url":"https://coreskillai.com/tests/career/"', '"url":"https://coreskillai.com/%s/tests/career/"' % l, 1)
            h = re.sub(r'(<meta property="og:url" content=")https://coreskillai\.com/tests/career/', r'\1https://coreskillai.com/%s/tests/career/' % l, h, count=1)
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
        art = io.open(os.path.join(C, '%s/career.html' % l), encoding='utf-8').read().strip().replace('{{SOURCES}}', SRC)
        if T.add_science(l, {'career': AL.localise_links(art, l)}) != 1:
            print('science section not written for', l); return 1

    # 5. cards + footer
    card = ('<a href="%s/tests/career/" class="test-card">\n'
            '  <div class="test-card-accent" style="background:#0ea5e9"></div>\n'
            '  <div class="test-card-body">\n'
            '    <div class="test-icon">🧭</div>\n'
            '    <h3 data-i18n="car_title">Career Interest Test</h3>\n'
            '    <p data-i18n="car_desc">%s</p>\n'
            '    <div class="test-card-meta">\n'
            '      <span class="badge badge-green" data-i18n="diff_easy">Easy</span>\n'
            '      <span class="badge">&#9203; ~8 <span data-i18n="card_min">min</span></span>\n'
            '    </div>\n'
            '  </div>\n'
            '  <div class="test-card-foot"><span data-i18n="card_take">Take Test</span> &#8594; <span>~8 <span data-i18n="card_min">min</span></span></div>\n'
            '</a>') 
    nc = 0
    for l in ['en'] + langs:
        pre = '' if l == 'en' else '/' + l
        for page in ['home', 'tests']:
            f = T.path_for(l, page); h = io.open(f, encoding='utf-8').read()
            if '/tests/career/" class="test-card"' in h: continue
            m = re.search(r'<a href="%s/tests/rotation/" class="test-card">.*?</a>' % re.escape(pre), h, re.S)
            if not m: print('no rotation card in', f); return 1
            h = h[:m.end()] + '\n' + card % (pre, EN['keys']['car_desc']) + h[m.end():]
            io.open(f, 'w', encoding='utf-8', newline='\n').write(h); nc += 1
    nf = 0
    for f in glob.glob('**/*.html', recursive=True):
        if f.startswith('_'): continue
        h = io.open(f, encoding='utf-8').read()
        if 'data-i18n="car_title">' in h and '/tests/career/" data-i18n="car_title"' in h: continue
        m = re.search(r'<li><a href="(/[a-z]{2})?/tests/typing/" data-i18n="typ_title">[^<]*</a></li>', h)
        if not m: continue
        li = '<li><a href="%s/tests/career/" data-i18n="car_title">Career Interest Test</a></li>' % (m.group(1) or '')
        h = h[:m.end()] + li + h[m.end():]
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h); nf += 1
    print('career test built: %d markets, %d cards, %d footers' % (len(langs) + 1, nc, nf))
    return 0

if __name__ == '__main__':
    sys.exit(main())

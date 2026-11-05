# -*- coding: utf-8 -*-
"""Build a new single test in every market from one config. Generalised from
career_page.py (which stays as the record of how the career test was built).

  python3 _build/test_page.py hearing

Sources (in _build/content):
  _<slug>/en.json, _<slug>/<lang>.json   {"keys": {...}}  meta_title, meta_desc, <prefix>_*
  en/<slug>.html, <lang>/<slug>.html     long-form article, {{SOURCES}} = EN list
  en/_<slug>_sources.html                the <ul class="sources" lang="en"> list

Steps, idempotent:
  1. EN page tests/<slug>/index.html cloned from tests/<template>/ (title, meta,
     h1, description, badge minutes, script, canonical, og, ld+json)
  2. <prefix>_* keys into js/i18n/<lang>.js
  3. market pages cloned from EN (tools.generate_pages), meta localised, the
     EN-only /blog/ and /methodology/ links removed
  4. long-form article into every market
  5. card on home + /tests/ grids after the <after> card, footer link on every page
Then: prerender, refresh.py, check_* (see enable_markets.py RUN section).
"""
import io, os, re, json, sys, glob
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import tools as T
import apply_longform as AL

CONF = {
  'hearing': dict(prefix='hea', icon='🎧', accent='#14b8a6', minutes=6, template='career',
                  tpl_prefix='car', tpl_minutes=8, after='career', footer_after='car_title',
                  diff='diff_easy'),
}

def structure(h):
    return tuple(len(re.findall('<%s[ >]' % t, h)) for t in ('h2', 'h3', 'p', 'li', 'strong', 'em', 'a', 'ul'))

def check(slug, lang):
    """[] when <lang> has every key and an article with the English structure."""
    c = CONF[slug]; C = os.path.join(HERE, 'content')
    EN = json.load(io.open(os.path.join(C, '_%s/en.json' % slug), encoding='utf-8'))['keys']
    ENH = io.open(os.path.join(C, 'en/%s.html' % slug), encoding='utf-8').read()
    errs = []
    jf = os.path.join(C, '_%s/%s.json' % (slug, lang)); hf = os.path.join(C, '%s/%s.html' % (lang, slug))
    if not os.path.isfile(jf): return ['no json']
    try: k = json.load(io.open(jf, encoding='utf-8'))['keys']
    except Exception as e: return ['bad json: %s' % e]
    miss = set(EN) - set(k); extra = set(k) - set(EN)
    if miss: errs.append('missing %s' % sorted(miss))
    if extra: errs.append('extra %s' % sorted(extra))
    for kk, v in k.items():
        if not v.strip(): errs.append('empty ' + kk)
        if kk.startswith('meta') and '"' in v: errs.append('quote in ' + kk)
        if '<' in v: errs.append('markup in ' + kk)
    if not os.path.isfile(hf): errs.append('no html')
    else:
        h = io.open(hf, encoding='utf-8').read()
        if '{{SOURCES}}' not in h: errs.append('no {{SOURCES}}')
        if structure(h) != structure(ENH): errs.append('structure %s vs en %s' % (structure(h), structure(ENH)))
        hrefs = sorted(re.findall(r'href="([^"]*)"', h)); en_h = sorted(re.findall(r'href="([^"]*)"', ENH))
        if hrefs != en_h: errs.append('links differ')
    return errs

def en_page(slug, c, EN):
    src = T.path_for('en', 'tests/' + c['template']); dst = T.path_for('en', 'tests/' + slug)
    h = io.open(src, encoding='utf-8').read()
    t, tp = slug, c['template']
    h = re.sub(r'(<link rel="canonical" href="https://coreskillai\.com/tests/)%s/' % tp, r'\g<1>%s/' % t, h)
    h = re.sub(r'(content="https://coreskillai\.com/tests/)%s/' % tp, r'\g<1>%s/' % t, h)
    h = re.sub(r'("url":"https://coreskillai\.com/tests/)%s/' % tp, r'\g<1>%s/' % t, h)
    h = re.sub(r'(<link rel="alternate" hreflang="[^"]+" href="https://coreskillai\.com/(?:[a-z]{2}/)?tests/)%s/' % tp, r'\g<1>%s/' % t, h)
    h = re.sub(r'<script src="/js/tests/%s\.js(\?v=[a-z0-9]+)?"></script>' % tp, '<script src="/js/tests/%s.js"></script>' % t, h)
    p, q = c['prefix'], c['tpl_prefix']
    h = re.sub(r'<span data-i18n="%s_title">[^<]*</span></h1>' % q, '<span data-i18n="%s_title">%s</span></h1>' % (p, EN[p + '_title']), h, count=1)
    h = re.sub(r'<p data-i18n="%s_desc">[^<]*</p>' % q, '<p data-i18n="%s_desc">%s</p>' % (p, EN[p + '_desc']), h, count=1)
    h = h.replace('&#9203; ~%d <span data-i18n="card_min">' % c['tpl_minutes'], '&#9203; ~%d <span data-i18n="card_min">' % c['minutes'], 1)
    h = re.sub(r'<section style="max-width:860px.*?</section>\n?', '', h, count=1, flags=re.S)
    if '/js/tests/%s.js' % t not in h or '%s_title' % p not in h:
        print('EN page template substitution failed'); sys.exit(1)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    io.open(dst, 'w', encoding='utf-8', newline='\n').write(h)

def meta(h, k, p, lang, slug):
    t, d = k['meta_title'], k['meta_desc'].replace('"', '&quot;')
    h = re.sub(r'<title>[^<]*</title>', lambda m: '<title>%s</title>' % t, h, count=1)
    for pat in ['name="description"', 'property="og:description"', 'name="twitter:description"']:
        h = re.sub(r'(<meta %s content=")[^"]*' % pat, lambda m: m.group(1) + d, h, count=1)
    for pat in ['property="og:title"', 'name="twitter:title"']:
        h = re.sub(r'(<meta %s content=")[^"]*' % pat, lambda m: m.group(1) + t, h, count=1)
    h = re.sub(r'("@type":"WebApplication","name":")[^"]*', lambda m: m.group(1) + k[p + '_title'].replace('"', ''), h, count=1)
    if lang != 'en':
        h = re.sub(r'\n[ \t]*<a href="/%s/blog/">[^<]*</a>' % lang, '', h)
        h = re.sub(r'\n[ \t]*<li><a href="/%s/(?:blog|methodology)/">[^<]*</a></li>' % lang, '', h)
        h = re.sub(r'(<meta property="og:url" content=")https://coreskillai\.com/tests/%s/' % slug,
                   r'\1https://coreskillai.com/%s/tests/%s/' % (lang, slug), h, count=1)
        h = re.sub(r'("url":")https://coreskillai\.com/tests/%s/' % slug, r'\1https://coreskillai.com/%s/tests/%s/' % (lang, slug), h, count=1)
    return h

def main(slug):
    c = CONF[slug]; p = c['prefix']; C = os.path.join(HERE, 'content')
    langs = [l for l in T.ready_langs() if l != 'en']
    bad = [(l, check(slug, l)) for l in langs if check(slug, l)]
    if bad:
        print('TRANSLATIONS INCOMPLETE (%d):' % len(bad)); [print(' ', b) for b in bad]; return 1
    EN = json.load(io.open(os.path.join(C, '_%s/en.json' % slug), encoding='utf-8'))['keys']
    data = {l: json.load(io.open(os.path.join(C, '_%s/%s.json' % (slug, l)), encoding='utf-8'))['keys'] for l in langs}
    SRC = io.open(os.path.join(C, 'en/_%s_sources.html' % slug), encoding='utf-8').read().strip()

    en_page(slug, c, EN)
    for l in langs + ['en']:
        k = EN if l == 'en' else data[l]
        f = 'js/i18n/%s.js' % l; s = io.open(f, encoding='utf-8').read()
        s = re.sub(r'(?m)^\s*%s_[a-z0-9_]+:".*",?\n' % p, '', s)
        add = ''.join('    %s:%s,\n' % (kk, json.dumps(v, ensure_ascii=False)) for kk, v in k.items() if kk.startswith(p + '_'))
        i = s.rstrip().rfind('};'); s = s[:i] + add + s[i:]
        io.open(f, 'w', encoding='utf-8', newline='\n').write(s)

    saved = T.PAGES; T.PAGES = ['tests/' + slug]
    try:
        for l in langs: T.generate_pages(l)
    finally:
        T.PAGES = saved
    for l in ['en'] + langs:
        k = EN if l == 'en' else data[l]
        f = T.path_for(l, 'tests/' + slug)
        h = meta(io.open(f, encoding='utf-8').read(), k, p, l, slug)
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
        art = io.open(os.path.join(C, '%s/%s.html' % (l, slug)), encoding='utf-8').read().strip().replace('{{SOURCES}}', SRC)
        if T.add_science(l, {slug: AL.localise_links(art, l)}) != 1:
            print('science section not written for', l); return 1

    card = ('<a href="%%s/tests/%s/" class="test-card">\n'
            '  <div class="test-card-accent" style="background:%s"></div>\n'
            '  <div class="test-card-body">\n'
            '    <div class="test-icon">%s</div>\n'
            '    <h3 data-i18n="%s_title">%s</h3>\n'
            '    <p data-i18n="%s_desc">%s</p>\n'
            '    <div class="test-card-meta">\n'
            '      <span class="badge badge-green" data-i18n="%s">Easy</span>\n'
            '      <span class="badge">&#9203; ~%d <span data-i18n="card_min">min</span></span>\n'
            '    </div>\n'
            '  </div>\n'
            '  <div class="test-card-foot"><span data-i18n="card_take">Take Test</span> &#8594; <span>~%d <span data-i18n="card_min">min</span></span></div>\n'
            '</a>') % (slug, c['accent'], c['icon'], p, EN[p + '_title'], p, EN[p + '_desc'], c['diff'], c['minutes'], c['minutes'])
    nc = 0
    for l in ['en'] + langs:
        pre = '' if l == 'en' else '/' + l
        for page in ['home', 'tests']:
            f = T.path_for(l, page); h = io.open(f, encoding='utf-8').read()
            if '/tests/%s/" class="test-card"' % slug in h: continue
            m = re.search(r'<a href="%s/tests/%s/" class="test-card">.*?</a>' % (re.escape(pre), c['after']), h, re.S)
            if not m: print('no %s card in' % c['after'], f); return 1
            h = h[:m.end()] + '\n' + card % pre + h[m.end():]
            io.open(f, 'w', encoding='utf-8', newline='\n').write(h); nc += 1
    nf = 0
    for f in glob.glob('**/*.html', recursive=True):
        if f.startswith('_'): continue
        h = io.open(f, encoding='utf-8').read()
        if '/tests/%s/" data-i18n="%s_title"' % (slug, p) in h: continue
        m = re.search(r'<li><a href="(/[a-z]{2})?/tests/%s/" data-i18n="%s">[^<]*</a></li>' % (c['after'], c['footer_after']), h)
        if not m: continue
        li = '<li><a href="%s/tests/%s/" data-i18n="%s_title">%s</a></li>' % (m.group(1) or '', slug, p, EN[p + '_title'])
        h = h[:m.end()] + li + h[m.end():]
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h); nf += 1
    print('%s built: %d markets, %d cards, %d footers' % (slug, len(langs) + 1, nc, nf))
    return 0

if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[2] == 'check':
        for l in sorted(T.ready_langs()):
            if l != 'en': print(l, check(sys.argv[1], l) or 'OK')
    else:
        sys.exit(main(sys.argv[1]))

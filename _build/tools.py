# -*- coding: utf-8 -*-
"""Build-time injectors for translations, statement banks, typing passages and
the per-language science sections.

These lived in /tmp and were wiped twice by workspace resets. They are project
tooling, so they belong in the repo. _build/ is excluded from the deploy rsync,
so none of this ships to visitors.
"""
import io, os, re, sys, unicodedata

PAGES = ['home','about','privacy','terms','contact','tests',
         'tests/iq','tests/reaction-time','tests/memory','tests/pattern',
         'tests/color-vision','tests/big-five','tests/eq','tests/focus','tests/typing']
TESTS = ['iq','reaction-time','memory','pattern','color-vision','big-five','eq','focus','typing']
# A language may legitimately use more than one script - Japanese mixes hiragana,
# katakana and kanji - so each entry is a tuple of acceptable prefixes.
SCRIPT_OF = {'ru':('CYRILLIC',),'uk':('CYRILLIC',),'bg':('CYRILLIC',),
             'sr':('CYRILLIC',),'mk':('CYRILLIC',),
             'el':('GREEK',),'he':('HEBREW',),'ar':('ARABIC',),'fa':('ARABIC',),
             'hi':('DEVANAGARI',),'th':('THAI',),
             # CJK had NO Latin-bleed check at all, which let a bare English
             # word sit inside a Japanese string undetected.
             'ja':('HIRAGANA','KATAKANA','CJK'),
             'zh':('CJK',),
             'ko':('HANGUL','CJK')}

# ── paths / urls ──────────────────────────────────────────
def path_for(lang, page):
    sub = '' if page == 'home' else page
    base = '' if lang == 'en' else lang
    parts = [p for p in (base, sub) if p]
    return os.path.join(*parts, 'index.html') if parts else 'index.html'

def url_for(lang, page):
    sub = '' if page == 'home' else page + '/'
    base = '' if lang == 'en' else lang + '/'
    return 'https://coreskillai.com/' + base + sub

def ready_langs():
    s = io.open('js/languages.js', encoding='utf-8').read()
    return [m.group(1) for m in re.finditer(r'  ([a-z]{2}): \{[^}]*ready: true', s)]

# ── shared guard ──────────────────────────────────────────
BRAND_TOKENS = ['CoreSkillAI', 'AdSense', 'Google', 'IQ', 'EQ', 'WPM', 'CPM',
                'MBTI', 'DNS', 'X', 'AI', 'SD']
BRAND_RE = re.compile('|'.join(sorted(BRAND_TOKENS, key=len, reverse=True)))

def mixed_script_guard(lang, texts, latin_tolerance=0.25):
    """Authoring hundreds of strings in a script you cannot proofread by eye is
    exactly where a stray character slips in. This already caught real Cyrillic
    typed into German and a CJK glyph in Russian."""
    for t in texts:
        plain = re.sub(r'<[^>]+>', ' ', t)
        # Brand and technical tokens are legitimately Latin inside every script:
        # "Про CoreSkillAI" is correct Ukrainian, not a typo. Mask them before
        # counting or the ratio test fires on every correct About/IQ string.
        # {n}, {ms}, {top} are template slots, never prose. Counting their
        # letters as "Latin" made short RTL strings like "سطح {l} — {n} رقم"
        # fail the ratio test purely because the Arabic half was short.
        counted = re.sub(r'\{[a-zA-Z_][a-zA-Z0-9_]*\}', ' ', plain)
        counted = BRAND_RE.sub(' ', counted)
        names = [unicodedata.name(c, '') for c in counted if c.isalpha()]
        if any('CJK' in n for n in names) and lang not in ('ja', 'zh', 'ko'):
            print('  %s: CJK character in %r' % (lang, plain[:44])); sys.exit(1)
        want = SCRIPT_OF.get(lang)
        if want:
            native = sum(1 for n in names if any(w in n for w in want))
            latin = sum(1 for n in names if n.startswith('LATIN'))
            if native and latin > native * latin_tolerance:
                print('  %s: Latin bleeding into %s: %r' % (lang, want, plain[:44])); sys.exit(1)
        elif any(n.startswith('CYRILLIC') for n in names):
            print('  %s: Cyrillic in a Latin-script language: %r' % (lang, plain[:44])); sys.exit(1)

# ── UI strings ────────────────────────────────────────────
def add_keys(lang, keys):
    mixed_script_guard(lang, list(keys.values()))
    p = 'js/i18n/%s.js' % lang
    s = io.open(p, encoding='utf-8').read()
    add = "".join('    %s:"%s",\n' % (k, keys[k].replace('"', '\\"'))
                  for k in sorted(keys) if ('\n    %s:' % k) not in s)
    anchor = 'window.TRANSLATIONS.%s = {\n' % lang
    i = s.index(anchor) + len(anchor)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s[:i] + add + s[i:])
    print('  %s: %d keys added' % (lang, len(keys)))

# ── Big Five / EQ statement banks ─────────────────────────
def add_items(fname, lang, arr, expect):
    mixed_script_guard(lang, arr)
    if len(arr) != expect:
        print('  %s/%s: got %d items, expected %d' % (fname, lang, len(arr), expect)); sys.exit(1)
    p = 'js/tests/%s.js' % fname
    s = io.open(p, encoding='utf-8').read()
    m = re.search(r'const ITEMS_I18N = \{(.*?)\n\};', s, re.S)
    if re.search(r'\n  %s: \[' % lang, m.group(1)):
        print('  %s/%s: already present' % (fname, lang)); return
    body = '\n  %s: [\n%s\n  ],' % (lang, "\n".join('    "%s",' % t.replace('\\', '\\\\').replace('"', '\\"') for t in arr))
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s[:m.end(1)] + body + s[m.end(1):])
    print('  %s/%s: %d items added' % (fname, lang, len(arr)))

# ── typing passages ───────────────────────────────────────
def add_passages(lang, arr, expect=8):
    mixed_script_guard(lang, arr, latin_tolerance=0.15)
    if len(arr) != expect:
        print('  %s: got %d passages, expected %d' % (lang, len(arr), expect)); sys.exit(1)
    for t in arr:
        if len(t) < 70:
            print('  %s: passage too short (%d chars)' % (lang, len(t))); sys.exit(1)
    p = 'js/tests/typing.js'
    s = io.open(p, encoding='utf-8').read()
    m = re.search(r'const PASSAGES=\{(.*?)\n\};', s, re.S)
    if re.search(r'\n  %s:\[' % lang, m.group(1)):
        print('  %s: passages already present' % lang); return
    body = '\n  %s:[\n%s\n  ],' % (lang, "\n".join('    "%s",' % t.replace('\\', '\\\\').replace('"', '\\"') for t in arr))
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s[:m.end(1)] + body + s[m.end(1):])
    print('  %s: %d passages added' % (lang, len(arr)))

# ── long-form science section ─────────────────────────────
SEC = re.compile(r'<section style="max-width:860px[^"]*">.*?</section>', re.S)
WRAP = '<section style="max-width:860px;margin:2.5rem auto;padding:0 1.25rem;line-height:1.65">%s</section>'

def add_science(lang, articles):
    mixed_script_guard(lang, list(articles.values()))
    n = 0
    for slug, html in articles.items():
        f = os.path.join('' if lang == 'en' else lang, 'tests', slug, 'index.html')
        if not os.path.isfile(f): continue
        h = io.open(f, encoding='utf-8').read()
        block = WRAP % html
        if SEC.search(h):
            h = SEC.sub(lambda m: block, h, count=1)
        elif '<footer>' in h:
            h = h.replace('<footer>', block + '\n\n<footer>', 1)
        else:
            continue
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
        n += 1
    print('  %s: %d science sections' % (lang, n))
    return n

# ── page meta (title / description / og / twitter) ────────
def add_meta(lang, meta):
    ready = ready_langs()
    changed = 0
    for page in PAGES:
        f = path_for(lang, page)
        if not os.path.isfile(f): continue
        m = meta.get(page)
        if not m: continue
        h = io.open(f, encoding='utf-8').read()
        t, d = m['title'], m['desc']
        h = re.sub(r'<title>.*?</title>', '<title>%s</title>' % t, h, count=1, flags=re.S)
        for attr, val in (('name="description"', d), ('property="og:title"', t),
                          ('property="og:description"', d), ('name="twitter:title"', t),
                          ('name="twitter:description"', d)):
            h = re.sub(r'(<meta %s content=")[^"]*(">)' % re.escape(attr),
                       lambda mm: mm.group(1) + val + mm.group(2), h, count=1)
        io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
        changed += 1
    print('  %s: meta on %d pages' % (lang, changed))
    return changed


def new_language(lang, keys):
    """Bootstrap a market that has no strings file yet. Refuses unless the key
    set matches English exactly, so a new language can never ship half-built."""
    import json
    en_src = io.open('js/i18n/en.js', encoding='utf-8').read()
    en_body = re.search(r'window\.TRANSLATIONS\.en = \{\n(.*?)\n\};', en_src, re.S).group(1)
    en = {}
    i = 0; n = len(en_body)
    while i < n:
        if en_body[i] == '"':
            i += 1
            while i < n and en_body[i] != '"': i += 2 if en_body[i] == '\\' else 1
            i += 1; continue
        m = re.match(r'([A-Za-z_]\w*)\s*:\s*"', en_body[i:])
        if m:
            j = i + m.end(); v = ''
            while j < n and en_body[j] != '"':
                v += en_body[j]; j += 2 if en_body[j] == '\\' else 1
            en[m.group(1)] = v; i = j + 1; continue
        i += 1
    missing = [k for k in en if k not in keys]
    extra = [k for k in keys if k not in en]
    if missing:
        print('  %s: MISSING %d keys: %s' % (lang, len(missing), missing[:8])); sys.exit(1)
    if extra:
        print('  %s: UNKNOWN keys: %s' % (lang, extra[:8])); sys.exit(1)
    mixed_script_guard(lang, list(keys.values()))
    body = "".join('    %s:"%s",\n' % (k, keys[k].replace('\\', '\\\\').replace('"', '\\"')) for k in en)
    out = ("/* CoreSkillAI - %s strings. One file per language: a visitor loads only\n"
           "   English (fallback) plus their own language, never all 43. */\n"
           "window.TRANSLATIONS = window.TRANSLATIONS || {};\n"
           "window.TRANSLATIONS.%s = {\n%s};\n") % (lang, lang, body)
    io.open('js/i18n/%s.js' % lang, 'w', encoding='utf-8', newline='\n').write(out)
    print('  %s: new strings file with %d keys' % (lang, len(keys)))


ASSET = re.compile(r'^/(css|js|favicon|og|og-image|apple-touch-icon|ads\.txt|robots\.txt|sitemap\.xml|cdn-cgi)')

def direction(lang):
    s = io.open('js/languages.js', encoding='utf-8').read()
    m = re.search(r'  %s: \{ name: "[^"]+", dir: "(\w+)"' % lang, s)
    return m.group(1) if m else 'ltr'

def generate_pages(lang):
    """Clone the English page set into /<lang>/ with the right lang, dir,
    canonical, PAGE_LANG, strings file and internal link prefixes."""
    d = direction(lang)
    made = 0
    for page in PAGES:
        src, dst = path_for('en', page), path_for(lang, page)
        if not os.path.isfile(src): continue
        os.makedirs(os.path.dirname(dst) or '.', exist_ok=True)
        h = io.open(src, encoding='utf-8').read()
        h = re.sub(r'<html lang="en">',
                   '<html lang="%s"%s>' % (lang, ' dir="rtl"' if d == 'rtl' else ''), h, count=1)
        sub = '' if page == 'home' else page + '/'
        h = re.sub(r'<link rel="canonical" href="[^"]*">',
                   '<link rel="canonical" href="https://coreskillai.com/%s/%s">' % (lang, sub), h, count=1)
        h = h.replace('<script src="/js/languages.js"></script>',
                      '<script>window.PAGE_LANG="%s";</script><script src="/js/languages.js"></script>' % lang, 1)
        h = h.replace('<script src="/js/i18n/en.js"></script>',
                      '<script src="/js/i18n/en.js"></script><script src="/js/i18n/%s.js"></script>' % lang, 1)
        h = re.sub(r'href="(/[^"]*)"',
                   lambda m: 'href="%s"' % m.group(1) if ASSET.match(m.group(1)) else 'href="/%s%s"' % (lang, m.group(1)), h)
        io.open(dst, 'w', encoding='utf-8', newline='\n').write(h)
        made += 1
    print('  %s: %d pages generated' % (lang, made))
    return made

STROOP_NAMES = ["Red", "Blue", "Green", "Yellow", "Purple"]

def add_stroop(lang, words):
    """Colour words for the Stroop task. Not cosmetic: the effect only exists if
    the reader automatically reads the word, so an untranslated market returns a
    score that measures nothing."""
    mixed_script_guard(lang, words)
    if len(words) != 5:
        print('  %s: need exactly 5 colour words' % lang); sys.exit(1)
    p = 'js/tests/focus.js'; s = io.open(p, encoding='utf-8').read()
    n = 0
    for name, val in zip(STROOP_NAMES, words):
        m = re.search(r"(%s:\s*\{[^}]*?)(\}),", name and (name + r"") or "", ) if False else re.search(r"(%s:\s*\{[^}]*?)(\}),"%name, s)
        if not m: continue
        if re.search(r"\b%s:" % lang, m.group(1)): continue
        s = s[:m.end(1)] + ", %s:'%s'" % (lang, val.replace("'", "\\'")) + s[m.end(1):]
        n += 1
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
    print('  %s: %d Stroop colour words' % (lang, n))


# ── card wiring + pre-render ──────────────────────────────
# Two bugs found live on 2026-08-27, both invisible to checks 1-9:
#
#  1. The nine test cards on the home and /tests/ pages carried NO data-i18n at
#     all. "IQ Test", "Measure your cognitive reasoning...", "Take Test" and
#     "~20 min" were hard-coded English in EVERY language, including the four
#     original markets. Humans and crawlers both saw English.
#
#  2. generate_pages() clones the ENGLISH pages, so every market built that way
#     shipped English inside its data-i18n elements. Client-side i18n repaired
#     it for humans, but the served HTML - the thing Bing indexes, and Bing is
#     ~26:1 of this site's traffic - was English. 479 of 583 visible words on
#     the Arabic home page were English before this fix.
CARD_PREFIX = {'iq':'iq','reaction-time':'rt','memory':'mem','pattern':'pat',
               'color-vision':'cv','big-five':'b5','eq':'eq','focus':'foc',
               'typing':'typ'}

def wire_cards(path):
    """Attach data-i18n to the parts of each test card that never had it."""
    h = io.open(path, encoding='utf-8').read()
    orig = h

    def fix(m):
        block, slug = m.group(0), m.group(1)
        pre = CARD_PREFIX.get(slug)
        if not pre: return block
        block = re.sub(r'<h3(?![^>]*data-i18n)>', '<h3 data-i18n="%s_title">' % pre, block, count=1)
        block = re.sub(r'<p(?![^>]*data-i18n)>',  '<p data-i18n="%s_desc">'  % pre, block, count=1)
        # "~20 min" -> keep the numeral, translate the unit only.
        # NB: no (?!<) lookahead here - "~2 min" is always followed by "</span>",
        # so that guard blocked every real match. Guard against double-wrapping
        # by checking for the marker instead.
        if 'card_min' not in block:
            block = re.sub(r'~(\d+)\s*min\b',
                           lambda d: '~%s <span data-i18n="card_min">min</span>' % d.group(1), block)
        block = re.sub(r'(<div class="test-card-foot">)\s*Take Test',
                       r'\1<span data-i18n="card_take">Take Test</span>', block, count=1)
        return block

    h = re.sub(r'<a href="[^"]*/tests/([a-z\-]+)/" class="test-card">.*?</a>', fix, h, flags=re.S)
    if h != orig:
        io.open(path, 'w', encoding='utf-8', newline='\n').write(h)
        return True
    return False


def strings_for(lang):
    """Parse js/i18n/<lang>.js into a dict."""
    f = os.path.join('js', 'i18n', lang + '.js')
    if not os.path.isfile(f): return {}
    s = io.open(f, encoding='utf-8').read()
    out = {}
    for m in re.finditer(r'(?m)^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*$', s):
        out[m.group(1)] = m.group(2).replace('\\"', '"').replace('\\\\', '\\')
    return out


def prerender(lang):
    """Replace the inner text of every data-i18n element with this language's
    string, so the SERVED HTML is already localised. Client-side i18n still
    runs and is now a no-op on first paint. Elements whose key is missing keep
    the English fallback rather than being blanked."""
    K = strings_for(lang)
    if not K: return 0
    changed = 0
    for page in PAGES:
        f = path_for(lang, page)
        if not os.path.isfile(f): continue
        h = io.open(f, encoding='utf-8').read()
        def sub(m):
            open_tag, key, inner, close = m.group(1), m.group(2), m.group(3), m.group(4)
            val = K.get(key)
            if val is None or '<' in inner: return m.group(0)   # nested markup: leave alone
            return open_tag + val + close
        new = re.sub(r'(<([a-z0-9]+)[^>]*\bdata-i18n="([a-z0-9_]+)"[^>]*>)([^<]*)(</\2>)',
                     lambda m: m.group(1) + (K.get(m.group(3)) or m.group(4)) + m.group(5), h)
        if new != h:
            io.open(f, 'w', encoding='utf-8', newline='\n').write(new)
            changed += 1
    return changed


def wire_home_blocks(path):
    """The 4th 'how it works' step, the whole 'Why These Tests?' band and the
    closing science paragraph shipped with no data-i18n on any language. Found
    by reading the LIVE Arabic home page, not by any local check."""
    h = io.open(path, encoding='utf-8').read(); orig = h
    pairs = [
        (r'<h4>Share It</h4>', '<h4 data-i18n="step4_title">Share It</h4>'),
        (r'(<div class="step observe"><div class="step-num">4</div><h4[^>]*>.*?</h4>)<p>',
         r'\1<p data-i18n="step4_desc">'),
        (r'<h2 class="section-title text-center">Why These Tests\?</h2>',
         '<h2 class="section-title text-center" data-i18n="why_title">Why These Tests?</h2>'),
        (r'<p class="section-subtitle text-center">(?!.*data-i18n)',
         '<p class="section-subtitle text-center" data-i18n="why_sub">'),
    ]
    for pat, rep in pairs:
        h = re.sub(pat, rep, h, count=1, flags=re.S)

    n = [0]
    def sci(m):
        n[0] += 1
        i = n[0]
        blk = m.group(0)
        blk = re.sub(r'<h3(?![^>]*data-i18n)>', '<h3 data-i18n="why%d_title">' % i, blk, count=1)
        blk = re.sub(r'<p(?![^>]*data-i18n)>',  '<p data-i18n="why%d_desc">'  % i, blk, count=1)
        return blk
    h = re.sub(r'<div class="science-card">.*?</div>', sci, h, flags=re.S)

    def close(m):
        b = m.group(0)
        b = re.sub(r'<h2(?![^>]*data-i18n)>', '<h2 data-i18n="home_sci_title">', b, count=1)
        b = re.sub(r'<p(?![^>]*data-i18n)>',  '<p data-i18n="home_sci_body">',  b, count=1)
        return b
    h = re.sub(r'<section style="max-width:860px.*?</section>', close, h, count=1, flags=re.S)

    if h != orig:
        io.open(path, 'w', encoding='utf-8', newline='\n').write(h)
        return True
    return False


# ── info pages (about / privacy / terms / contact) ────────
# These four shipped as byte-identical English on all 33 non-English markets:
# 132 duplicate pages sitting in the sitemap. Privacy, terms and contact are
# exactly the pages an AdSense reviewer opens. Same approach as add_science:
# the body is prose, not UI strings, so it is written straight into the page
# rather than bloating every language's strings file.
INFO_SHELL = ('<div class="page">\n'
              '  <section class="section section-sm" style="padding-top:60px">\n'
              '%s\n'
              '  </section>\n'
              '</div>\n')

def set_info(lang, page, inner):
    """Replace the body of an info page with localised markup.

    Anchored on "<div class=\"page\"> ... up to <footer" rather than a matching
    </div>: the about page on newly generated markets closes with </section>
    instead, so a </div>-based anchor silently skipped it. Any ad-wrap block in
    the original is carried over - /about/ carries a unit, and preflight check 3
    fails any page that loses its AdSense.
    """
    f = path_for(lang, page)
    if not os.path.isfile(f):
        return False
    h = io.open(f, encoding='utf-8').read()
    mixed_script_guard(lang, [re.sub(r'<[^>]+>', ' ', inner)])
    m = re.search(r'<div class="page">.*?(?=<footer)', h, re.S)
    if not m:
        raise SystemExit('  %s/%s: no <div class="page"> block' % (lang, page))
    ads = re.findall(r'<div class="ad-wrap">.*?</div>\s*</div>', m.group(0), re.S)
    body = (INFO_SHELL % inner) + ('\n'.join(ads) + '\n' if ads else '')
    new = h[:m.start()] + body + h[m.end():]
    if new == h:
        return False
    io.open(f, 'w', encoding='utf-8', newline='\n').write(new)
    return True


def info_title(lang, page, title, desc):
    """Set <title>/description/og/twitter for one info page."""
    return add_meta(lang, {page: {'title': title, 'desc': desc}})

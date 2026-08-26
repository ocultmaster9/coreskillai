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
SCRIPT_OF = {'ru':'CYRILLIC','uk':'CYRILLIC','bg':'CYRILLIC','sr':'CYRILLIC','mk':'CYRILLIC',
             'el':'GREEK','he':'HEBREW','ar':'ARABIC','fa':'ARABIC','hi':'DEVANAGARI','th':'THAI'}

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
def mixed_script_guard(lang, texts, latin_tolerance=0.25):
    """Authoring hundreds of strings in a script you cannot proofread by eye is
    exactly where a stray character slips in. This already caught real Cyrillic
    typed into German and a CJK glyph in Russian."""
    for t in texts:
        plain = re.sub(r'<[^>]+>', ' ', t)
        names = [unicodedata.name(c, '') for c in plain if c.isalpha()]
        if any('CJK' in n for n in names) and lang not in ('ja', 'zh', 'ko'):
            print('  %s: CJK character in %r' % (lang, plain[:44])); sys.exit(1)
        want = SCRIPT_OF.get(lang)
        if want:
            native = sum(1 for n in names if n.startswith(want))
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

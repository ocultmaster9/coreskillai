# -*- coding: utf-8 -*-
"""Flip `ready: true` for markets whose pages are already complete on disk.

THE BUG
js/languages.js carries a `ready` flag per market. main.js builds the language
<select> from it and refresh.py builds hreflang + sitemap.xml from it, so a
market without the flag is invisible: no way for a visitor to reach it, and no
way for Google to discover it.

18 of the 43 markets were generated but never had the flag set:
  ar bg cs el et fa he hi hr hu ja lt lv mk sk sl sr uk
They have all 16 pages on disk, fully translated - ja/tests/rotation/index.html
carries the Japanese science section, not the English one - but the sitemap
listed 25 of 43 and the dropdown offered 25 of 43. Roughly 40% of the site was
unreachable.

WHY THIS IS SAFE
The flag's stated purpose (see the comment in languages.js) is "this market has
real pages on disk, so the selector can never produce a 404". This script only
sets the flag once it has confirmed every page in PAGES actually exists. It
never sets it optimistically.

WHAT IT DELIBERATELY DOES NOT DO
It does not check that the CONTENT is translated. That is check_untranslated.py's
job, and that guard only looks at ready markets - so these 18 have never been
through it. Flipping them brings them under every preflight guard for the first
time. If the next deploy fails on one of them, the guard is doing its job and
found something real; fix the market, do not un-flip the flag to make it quiet.

RUN
  cd websites/coreskillai.com && python3 _build/enable_markets.py
Then, in order:
  python3 _build/fix_rotation_header.py
  python3 -c "import sys;sys.path.insert(0,'_build');import tools as T;[T.prerender(l) for l in T.ready_langs()]"
  python3 _build/refresh.py
  python3 _build/check_untranslated.py && python3 _build/check_prerender.py
"""
import os, sys, io, re
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

LANGFILE = 'js/languages.js'
ENTRY = re.compile(r'^  ([a-z]{2}): \{(.*?)\},$', re.M)


def pages_for(lang):
    out = []
    for p in T.PAGES:
        rel = '' if p == 'home' else p
        base = rel if lang == 'en' else ('%s/%s' % (lang, rel) if rel else lang)
        out.append(os.path.join(base, 'index.html') if base else 'index.html')
    return out


def main():
    src = io.open(LANGFILE, encoding='utf-8').read()
    entries = ENTRY.findall(src)
    if not entries:
        print('FATAL: could not parse %s - refusing to touch it' % LANGFILE)
        return 1

    already = [l for l, body in entries if 'ready: true' in body]
    candidates = [l for l, body in entries if 'ready: true' not in body]
    print('%d markets already ready, %d candidates' % (len(already), len(candidates)))
    if not candidates:
        print('nothing to do')
        return 0

    enable, refuse = [], []
    for lang in candidates:
        missing = [p for p in pages_for(lang) if not os.path.isfile(p)]
        if missing:
            refuse.append((lang, '%d page(s) missing, first: %s' % (len(missing), missing[0])))
        else:
            enable.append(lang)

    out = src
    for lang in enable:
        # Insert before the closing brace of that market's entry only.
        pat = re.compile(r'^(  %s: \{)(.*?)(\},)$' % lang, re.M)
        m = pat.search(out)
        if not m:
            refuse.append((lang, 'entry vanished between parse and write'))
            continue
        body = m.group(2).rstrip()
        if not body.endswith(','):
            body += ','
        out = out[:m.start()] + '  %s: {%s ready: true },' % (lang, body) + out[m.end():]

    if enable:
        io.open(LANGFILE, 'w', encoding='utf-8', newline='\n').write(out)

    # Read it back through the real accessor - if ready_langs() does not now
    # report them, the rewrite did not take and everything downstream is wrong.
    got = set(T.ready_langs())
    bad = [l for l in enable if l not in got]
    if bad:
        print('FATAL: wrote the flag but ready_langs() still omits: %s' % ', '.join(bad))
        return 1

    print('enabled %d market(s): %s' % (len(enable), ' '.join(sorted(enable)) or '-'))
    print('ready_langs() now reports %d markets' % len(got))
    if refuse:
        print('REFUSED (pages incomplete - generate them first):')
        for lang, why in refuse:
            print('  %s: %s' % (lang, why))
    return 0


if __name__ == '__main__':
    sys.exit(main())

# -*- coding: utf-8 -*-
"""Fail if the served HTML disagrees with js/i18n/<lang>.js.

WHY
Pages ship with the translated text baked into the HTML (prerender), and the
client-side i18n then re-applies the same strings on load. That means a stale
prerender is INVISIBLE in a browser - the JS quietly corrects it - while search
engines, social previews and no-JS visitors keep seeing the old text.

That is exactly what happened: hero_badge, hero_sub, why1_title and why3_desc
were corrected in all 43 language files, the live pages looked right when
checked with JS running, and the raw HTML still said "100% anonymous",
"No tracking" and "See how you compare with millions of people worldwide" -
three claims that were not true. Google crawls the HTML.

tools.prerender(lang) fixes it, but nothing in refresh.py calls it, so it is a
manual step someone has to remember. Same failure mode as stamp_assets(). This
check removes the need to remember.

Usage: python3 _build/check_prerender.py [root]
"""
import io, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tools as T

TAG = re.compile(r'<([a-z0-9]+)[^>]*\bdata-i18n="([a-z0-9_]+)"[^>]*>([^<]*)</\1>')


def norm(s):
    # The HTML is entity-encoded and whitespace-collapsed by the writer; compare
    # on the same footing rather than reporting cosmetic differences.
    s = (s.replace('&amp;', '&').replace('&#183;', '·').replace('&#8226;', '•')
          .replace('&nbsp;', ' ').replace('&#8212;', '—').replace('&quot;', '"')
          .replace('&#39;', "'").replace('&lt;', '<').replace('&gt;', '>'))
    return re.sub(r'\s+', ' ', s).strip()


def scan(root):
    stale = []
    for lang in T.ready_langs():
        K = T.strings_for(lang)
        if not K:
            continue
        for page in T.PAGES:
            rel = T.path_for(lang, page)
            f = os.path.join(root, rel)
            if not os.path.isfile(f):
                continue
            h = io.open(f, encoding='utf-8').read()
            for m in TAG.finditer(h):
                key, inner = m.group(2), m.group(3)
                want = K.get(key)
                if want is None:
                    continue                      # no string for this key: English fallback is fine
                if norm(inner) != norm(want):
                    stale.append((rel, key, norm(inner)[:60], norm(want)[:60]))
    return stale


if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else '.'
    cwd = os.getcwd()
    os.chdir(root)
    try:
        stale = scan('.')
    finally:
        os.chdir(cwd)
    for rel, key, got, want in stale[:12]:
        print('::error::stale prerender %s [%s] HTML=%r i18n=%r' % (rel, key, got, want))
    if stale:
        print('  %d stale element(s). Run tools.prerender(lang) for every language.' % len(stale))
    else:
        print('  served HTML matches the translation files')
    sys.exit(1 if stale else 0)

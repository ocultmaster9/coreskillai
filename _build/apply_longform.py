# -*- coding: utf-8 -*-
"""Write the long-form test articles (_build/content/<lang>/<slug>.html) into
each market's test pages, replacing the old ~150-word science section.

A market is written only when ALL ten articles exist for it, so a half-done
language can never ship a mix of new and old sections. Internal links in the
fragments are authored against the English paths (/tests/iq/, /privacy/) and
localised here, so a translator cannot get a prefix wrong.

Usage:  python3 _build/apply_longform.py [lang ...]     (default: every ready one)
"""
import io, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import tools as T

CONTENT = os.path.join(HERE, 'content')

def localise_links(html, lang):
    if lang == 'en':
        return html
    return re.sub(r'href="/(?!/)', 'href="/%s/' % lang, html)

def load(lang):
    d = os.path.join(CONTENT, lang)
    if not os.path.isdir(d):
        return None
    arts = {}
    for slug in T.TESTS:
        f = os.path.join(d, slug + '.html')
        if not os.path.isfile(f):
            return None
        arts[slug] = localise_links(io.open(f, encoding='utf-8').read().strip(), lang)
    return arts

def main(langs):
    done, skipped = [], []
    for lang in langs:
        arts = load(lang)
        if arts is None:
            skipped.append(lang); continue
        n = T.add_science(lang, arts)
        if n != len(T.TESTS):
            print('  %s: only %d of %d pages written' % (lang, n, len(T.TESTS))); sys.exit(1)
        done.append(lang)
    print('long-form applied: %s' % (' '.join(done) or '-'))
    if skipped:
        print('not complete yet (left untouched): %s' % ' '.join(skipped))

if __name__ == '__main__':
    langs = sys.argv[1:] or sorted({d for d in os.listdir('.') if re.fullmatch(r'[a-z]{2}', d) and os.path.isdir(d)} | {'en'})
    main(langs)

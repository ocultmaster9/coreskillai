# -*- coding: utf-8 -*-
"""Group the test cards on the home page and /tests/ into categories.

Run after any build step that adds a card (test_page.py inserts new cards
after an existing one). Idempotent: the grouped block sits between
<!--cats--> and <!--/cats--> and is rebuilt from the cards inside it.
Every test slug must be listed in CATS; an unknown card stops the run.
"""
import io, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import tools

CATS = [
    ('cog',   '\U0001F9E0', 'Mind & Reasoning',     ['iq', 'pattern', 'memory', 'rotation', 'focus']),
    ('speed', '⚡',     'Speed & Skills',       ['reaction-time', 'typing']),
    ('pers',  '\U0001F3AD', 'Personality & Career', ['big-five', 'eq', 'career']),
    ('sense', '\U0001F441️', 'Senses & Health', ['color-vision', 'hearing', 'vision']),
]
CARD = re.compile(r'<a href="[^"]*/tests/([a-z\-]+)/" class="test-card">.*?</a>', re.S)

def build(cards, K):
    nav = ['<nav class="cat-nav" aria-labelledby="tests-h">']
    blocks = []
    for cid, icon, en, slugs in CATS:
        got = [cards[s] for s in slugs if s in cards]
        if not got: continue
        name = K.get('cat_' + cid, en)
        nav.append('<a class="cat-chip" href="#cat-%s"><span aria-hidden="true">%s</span> <span data-i18n="cat_%s">%s</span> <span class="cat-n">%d</span></a>'
                   % (cid, icon, cid, name, len(got)))
        blocks.append('<div class="test-cat" id="cat-%s">\n<h2 class="cat-title"><span aria-hidden="true">%s</span> <span data-i18n="cat_%s">%s</span></h2>\n<div class="tests-grid">\n%s</div>\n</div>'
                      % (cid, icon, cid, name, '\n'.join(got)))
    nav.append('</nav>')
    return '<!--cats-->\n' + '\n'.join(nav) + '\n' + '\n'.join(blocks) + '\n<!--/cats-->'

def run(path, K):
    h = io.open(path, encoding='utf-8').read()
    m = re.search(r'<!--cats-->.*?<!--/cats-->', h, re.S)
    if not m:
        m = re.search(r'<div class="tests-grid">\s*(?:<a href="[^"]*/tests/[a-z\-]+/" class="test-card">.*?</a>\s*)+</div>', h, re.S)
    if not m: raise SystemExit('no test grid in ' + path)
    cards = {c.group(1): c.group(0) for c in CARD.finditer(m.group(0))}
    known = {s for c in CATS for s in c[3]}
    extra = set(cards) - known
    if extra: raise SystemExit('%s: cards with no category %s - add them to CATS' % (path, sorted(extra)))
    new = build(cards, K)
    # the section heading the nav is labelled by
    h2 = h[:m.start()] + new + h[m.end():]
    h2 = re.sub(r'<(h1|h2) class="section-title"([^>]*) data-i18n="tests_title">',
                lambda x: '<%s class="section-title"%s data-i18n="tests_title">' % (x.group(1), x.group(2)) if 'id="tests-h"' in x.group(2)
                else '<%s class="section-title" id="tests-h"%s data-i18n="tests_title">' % (x.group(1), x.group(2)), h2, count=1)
    if h2 != h:
        io.open(path, 'w', encoding='utf-8', newline='\n').write(h2)
    return len(cards)

if __name__ == '__main__':
    n = 0
    for lang in tools.ready_langs():
        K = tools.strings_for(lang)
        for page in ('home', 'tests'):
            f = tools.path_for(lang, page)
            c = run(f, K); n += 1
    print('categories: %d pages grouped, %d cards each' % (n, c))

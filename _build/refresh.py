# -*- coding: utf-8 -*-
"""Re-derive ready markets, then rebuild hreflang, robots and the sitemap.
Run after any market changes state. One command so the three can never drift."""
import io, os, re, sys
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
import sync_ready
from tools import PAGES, path_for, url_for, ready_langs

def main():
    done = sync_ready.sync()
    ready = sorted(ready_langs())
    langs = sorted({d for d in os.listdir('.') if os.path.isdir(d) and re.fullmatch(r'[a-z]{2}', d)} | {'en'})
    n = 0
    for lang in langs:
        for page in PAGES:
            f = path_for(lang, page)
            if not os.path.isfile(f): continue
            h = io.open(f, encoding='utf-8').read()
            block = "\n".join('<link rel="alternate" hreflang="%s" href="%s">' % (c, url_for(c, page)) for c in ready)
            block += '\n<link rel="alternate" hreflang="x-default" href="%s">' % url_for('en', page)
            new = re.sub(r'(?:\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">)+', '\n' + block, h, count=1)
            new = new.replace('<meta name="robots" content="noindex,follow">\n', '')
            if lang not in ready:
                new = new.replace('<link rel="canonical"',
                                  '<meta name="robots" content="noindex,follow">\n<link rel="canonical"', 1)
            if new != h:
                io.open(f, 'w', encoding='utf-8', newline='\n').write(new); n += 1
    body = []
    for lg in ready:
        for pg in PAGES:
            f = path_for(lg, pg)
            if not os.path.isfile(f): continue
            body.append('  <url>\n    <loc>%s</loc>\n    <changefreq>monthly</changefreq>\n    <priority>%s</priority>\n  </url>'
                        % (url_for(lg, pg), '1.0' if pg == 'home' else ('0.9' if pg.startswith('tests') else '0.5')))
    io.open('sitemap.xml', 'w', encoding='utf-8', newline='\n').write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(body) + '\n</urlset>\n')
    import xml.etree.ElementTree as ET; ET.parse('sitemap.xml')
    print('ready: %s | hreflang updated on %d pages | sitemap %d urls' % (' '.join(ready), n, len(body)))

if __name__ == '__main__':
    main()

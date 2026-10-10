# -*- coding: utf-8 -*-
"""Render the English-only editorial pages and wire them into the English site.

Run from the site root:  python3 _build/guides.py
Idempotent: pages are regenerated from content/guides/*.html, and edits to
existing English pages use markers or presence checks so reruns change nothing.

Why English only: these pages are original long-form writing. Machine-translating
them into 40 languages would add volume, not value, so the translated markets
keep their own tests and long-form test articles and do not get a blog.
"""
import io, json, math, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from guides_data import *

CONTENT = os.path.join(HERE, 'content', 'guides')
EN_PAGES = ['index.html', 'about/index.html', 'privacy/index.html', 'terms/index.html',
            'contact/index.html', 'tests/index.html'] + \
           ['tests/%s/index.html' % t for t in TEST_NAMES]

def rd(p): return io.open(p, encoding='utf-8').read()
def wr(p, s):
    d = os.path.dirname(p)
    if d and not os.path.isdir(d): os.makedirs(d)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

# ── shared maths for tables / widgets ─────────────────────
def cdf(z): return 0.5 * (1 + math.erf(z / math.sqrt(2)))
def pct_of_iq(iq): return cdf((iq - 100) / 15.0) * 100
def fmt_pct(p):
    if p >= 99.95: return '99.9+'
    if p >= 99: return '%.1f' % p
    if p < 0.05: return '<0.1'
    if p < 1: return '%.1f' % p
    return '%d' % round(p)
def ordinal(n):
    n = int(n)
    return '%d%s' % (n, 'th' if 10 <= n % 100 <= 20 else {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th'))

def iq_table():
    rows = ''
    for iq in [55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 160]:
        p = pct_of_iq(iq)
        above = 100 - p
        rows += '<tr><td>%d</td><td>%s</td><td>%s</td></tr>\n' % (
            iq, 'about ' + fmt_pct(p) + '%', ('1 in %s' % format(int(round(100.0 / above)), ',')) if above < 50 and above > 0.0001 else '—')
    return ('<div class="table-wrap"><table><thead><tr><th>IQ score</th><th>Percentile (share scoring lower)</th>'
            '<th>How rare at or above</th></tr></thead><tbody>\n%s</tbody></table></div>' % rows)

IQ_WIDGET = '''<div class="widget" id="iqw"><label for="iqin">Enter an IQ score (mean 100, SD 15)</label>
<input id="iqin" type="number" min="40" max="180" value="115" inputmode="numeric"> <output id="iqout" for="iqin">An IQ of 115 is higher than about 84% of the population.</output>
<noscript><p>Turn on JavaScript for the converter. The table above gives the same values.</p></noscript></div>
<script>(function(){function c(z){var t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2),p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p;}
var i=document.getElementById('iqin'),o=document.getElementById('iqout');function u(){var v=parseFloat(i.value);if(isNaN(v)){o.textContent='';return;}var p=c((v-100)/15)*100;o.textContent='An IQ of '+v+' is higher than about '+(p>99.9?'99.9+':p<0.1?'less than 0.1':p.toFixed(p<10||p>90?1:0))+'% of the population.';}
i.addEventListener('input',u);u();})();</script>'''

WPM_WIDGET = '''<div class="widget"><label for="wc">Characters typed (including spaces)</label><input id="wc" type="number" min="0" value="1250" inputmode="numeric">
<label for="wt" style="margin-top:10px">Time in seconds</label><input id="wt" type="number" min="1" value="60" inputmode="numeric">
<output id="wout">250 words in 60 seconds is 250 characters per word...</output>
<noscript><p>Turn on JavaScript for the calculator. The formula is: words = characters ÷ 5; WPM = words ÷ minutes.</p></noscript></div>
<script>(function(){var c=document.getElementById('wc'),t=document.getElementById('wt'),o=document.getElementById('wout');function u(){var a=parseFloat(c.value),s=parseFloat(t.value);if(!(a>=0)||!(s>0)){o.textContent='';return;}var w=a/5/(s/60);o.textContent='Speed: '+w.toFixed(1)+' WPM ('+(a/(s/60)).toFixed(0)+' characters per minute).';}
c.addEventListener('input',u);t.addEventListener('input',u);u();})();</script>'''

PLACEHOLDERS = {'{{IQ_TABLE}}': iq_table, '{{IQ_WIDGET}}': lambda: IQ_WIDGET, '{{WPM_WIDGET}}': lambda: WPM_WIDGET}

AD = '''<div class="ad-wrap">
  <div>
    <div class="ad-label" data-i18n="ad_label">Advertisement</div>
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5798786176755576" data-ad-slot="6610588103" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
  </div>
</div>
'''

# ── shell taken from the live About page so nav/footer never drift ────
def shell():
    h = rd('about/index.html')
    head_tail = h[h.index('<link rel="stylesheet"'):h.index('</head>')]
    pre = h[h.index('<body>'):h.index('<div class="page">')]
    tail = AD + h[h.index('<footer>'):]
    tail = tail.replace('<script src="/js/languages.js', '<script>window.EN_ONLY=true;</script><script src="/js/languages.js', 1)
    return head_tail, pre, tail

def esc(s): return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')

def head(title, desc, canon, extra_ld, head_tail):
    t = esc(title + ' | CoreSkillAI') if len(title) < 52 else esc(title)
    return ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
            '<title>%s</title>\n<meta name="description" content="%s">\n'
            '<meta property="og:title" content="%s">\n<meta property="og:description" content="%s">\n'
            '<meta property="og:url" content="%s">\n<meta property="og:type" content="article">\n'
            '<meta property="og:image" content="https://www.coreskillai.com/og.png">\n'
            '<meta name="twitter:card" content="summary_large_image">\n'
            '<meta name="twitter:title" content="%s">\n<meta name="twitter:description" content="%s">\n'
            '<link rel="canonical" href="%s">\n%s%s\n</head>\n') % (
        t, esc(desc), esc(title), esc(desc), canon, esc(title), esc(desc), canon,
        head_tail, '\n<script type="application/ld+json">%s</script>' % json.dumps(extra_ld, ensure_ascii=False))

def ld_article(p, canon):
    return {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": p['title'], "description": p['desc'],
         "datePublished": PUBLISHED, "dateModified": PUBLISHED,
         "author": {"@type": "Person", "name": AUTHOR, "url": SITE + "/about/"},
         "publisher": {"@type": "Organization", "name": "CoreSkillAI", "url": SITE + "/"},
         "mainEntityOfPage": canon, "inLanguage": "en"},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Blog" if p['kind'] == 'blog' else "Guides", "item": SITE + "/blog/"},
            {"@type": "ListItem", "position": 3, "name": p['title'], "item": canon}]}]}

def by_slug(): return {p['slug']: p for p in PAGES}

def cta(p):
    out = ''
    for t in p['tests'][:1]:
        out += ('<div class="cta-box"><div><strong>Try it yourself: %s</strong><span>Free, no sign-up, results shown on this device.</span></div>'
                '<a class="btn btn-primary" href="/tests/%s/">Take the test</a></div>\n') % (TEST_NAMES[t], t)
    return out

def related(p):
    bs = by_slug(); items = []
    for t in p['tests']:
        items.append('<li><a href="/tests/%s/">%s</a> (free test)</li>' % (t, TEST_NAMES[t]))
    for s in p['ref']:
        if s in bs: items.append('<li><a href="/%s/">%s</a></li>' % (s, bs[s]['title']))
    for q in PAGES:
        if q is p or q['kind'] != 'blog' or len(items) >= 7: continue
        if set(q['tests']) & set(p['tests']): items.append('<li><a href="/blog/%s/">%s</a></li>' % (q['slug'], q['title']))
    return '<div class="related"><h2>Related reading and tests</h2><ul>%s</ul></div>' % ''.join(items)

AUTHOR_BOX = ('<div class="author-box"><strong>About the author.</strong> %s builds and maintains CoreSkillAI from Romania. '
              'He is a web developer, not a clinician. Articles are written from published research, cited at the end, and '
              'corrected when a reader or a source shows an error. See the <a href="/methodology/">methodology page</a> '
              'and <a href="/about/">about page</a>. To report a mistake, use the <a href="/contact/">contact page</a>. '
              'Nothing on this site is medical or psychological advice.</div>') % AUTHOR

def render_page(p, hd):
    head_tail, pre, tail = hd
    body = rd(os.path.join(CONTENT, p['slug'] + '.html')).strip()
    for k, fn in PLACEHOLDERS.items(): body = body.replace(k, fn())
    m = re.match(r'\s*<p class="lead">.*?</p>', body, re.S)
    lead = '<p class="lead">%s</p>' % esc(p['desc']).replace('&quot;', '"') if not m else ''
    canon = url_of(p)
    section = 'Blog' if p['kind'] == 'blog' else ('Methodology' if p['kind'] == 'page' else 'Guides')
    crumbs = '<div class="crumbs"><a href="/">Home</a> › <a href="/blog/">%s</a> › %s</div>' % (
        'Blog' if p['kind'] == 'blog' else 'Guides', esc(p['title'].split(':')[0]))
    if p['kind'] == 'page': crumbs = '<div class="crumbs"><a href="/">Home</a> › Methodology</div>'
    byline = '<p class="byline">By <a href="/about/">%s</a> · Published %s · %d min read</p>' % (AUTHOR, PUBLISHED_HUMAN, p['min'])
    html = head(p['title'], p['desc'], canon, ld_article(p, canon), head_tail)
    html += pre + '<div class="page">\n<article class="article">\n%s\n<h1>%s</h1>\n%s\n%s\n%s\n%s\n%s\n%s\n</article>\n</div>\n' % (
        crumbs, esc(p['title']), byline, lead, body, cta(p), related(p), AUTHOR_BOX)
    html += tail
    return html

def render_index(hd):
    head_tail, pre, tail = hd
    cards = lambda kind: ''.join(
        '<a class="guide-card" href="/%s"><h3>%s</h3><p>%s</p></a>\n' % (path_of(p), esc(p['title']), esc(p['desc']))
        for p in PAGES if p['kind'] == kind)
    title = 'Blog and Guides on Intelligence, Memory, Attention and Personality'
    desc = 'Original, sourced articles and reference pages that explain what each CoreSkillAI test measures and how to read your results.'
    canon = SITE + '/blog/'
    ld = {"@context": "https://schema.org", "@type": "CollectionPage", "name": title, "url": canon, "description": desc,
          "publisher": {"@type": "Organization", "name": "CoreSkillAI"}}
    html = head(title, desc, canon, ld, head_tail).replace('og:type" content="article"', 'og:type" content="website"')
    html += pre + ('<div class="page">\n<article class="article" style="max-width:980px">\n'
        '<div class="crumbs"><a href="/">Home</a> › Blog</div>\n<h1>Blog and Guides</h1>\n'
        '<p class="lead">%s</p>\n<h2>Articles</h2>\n<div class="guide-grid">\n%s</div>\n'
        '<h2>Reference pages</h2>\n<div class="guide-grid">\n%s<a class="guide-card" href="/methodology/"><h3>Methodology</h3>'
        '<p>How each test is built, scored and corrected.</p></a>\n</div>\n'
        '<h2>The tests</h2>\n<p>Every article links to the test it explains. All ten tests are free and need no account: '
        '<a href="/tests/">see all tests</a>.</p>\n%s\n</article>\n</div>\n') % (
        esc(desc), cards('blog'), cards('ref'), AUTHOR_BOX)
    return html + tail

# ── edits to existing English pages (idempotent) ──────────
def patch_nav_footer(h):
    if '/blog/' in h: return h
    h = h.replace('<a href="/about/" data-i18n="nav_about">About</a>',
                  '<a href="/about/" data-i18n="nav_about">About</a>\n      <a href="/blog/">Blog</a>')
    h = h.replace('<li><a href="/about/" data-i18n="footer_about">About</a></li>',
                  '<li><a href="/about/" data-i18n="footer_about">About</a></li>\n        <li><a href="/blog/">Blog</a></li>\n        <li><a href="/methodology/">Methodology</a></li>')
    return h

def put_block(h, key, block, anchor):
    """Insert/replace <!--key-->...<!--/key--> immediately before `anchor`."""
    pat = re.compile(r'<!--%s-->.*?<!--/%s-->\n?' % (key, key), re.S)
    new = '<!--%s-->\n%s\n<!--/%s-->\n' % (key, block, key)
    if pat.search(h): return pat.sub(lambda m: new, h, count=1)
    i = h.rindex(anchor)
    return h[:i] + new + h[i:]

def test_block(t):
    lis = ''
    for p in PAGES:
        if t in p['tests']:
            lis += '<li><a href="/%s">%s</a> <span style="color:var(--text-3)">· %d min read</span></li>\n' % (path_of(p), esc(p['title']), p['min'])
    return ('<section class="article-links" style="max-width:860px;margin:0 auto 2.5rem;padding:0 1.25rem;line-height:1.65">'
            '<h2>Guides related to the %s</h2>\n<ul>\n%s</ul>\n<p><a href="/methodology/">How our tests are built and scored</a> · '
            '<a href="/blog/">All articles</a></p></section>' % (TEST_NAMES[t], lis))

def patch_existing():
    for f in EN_PAGES:
        if not os.path.isfile(f): continue
        h = rd(f); o = h
        h = patch_nav_footer(h)
        if f.startswith('tests/') and f != 'tests/index.html':
            t = f.split('/')[1]
            h = put_block(h, 'guides', test_block(t), '<footer>')
        if f == 'index.html':
            top = [p for p in PAGES if p['kind'] == 'blog'][:6]
            cards = ''.join('<a class="guide-card" href="/%s"><h3>%s</h3><p>%s</p></a>\n' % (path_of(p), esc(p['title']), esc(p['desc'])) for p in top)
            blk = ('<section class="section" style="padding-top:8px"><h2 class="section-title">Guides: what the tests measure</h2>'
                   '<p class="section-subtitle">Sourced explanations of IQ, memory, reaction time, personality and more.</p>'
                   '<div class="guide-grid">\n%s</div><p><a href="/blog/">Read all articles</a></p></section>' % cards)
            h = put_block(h, 'guides-home', blk, '<footer>')
        if f == 'tests/index.html':
            blk = ('<section class="section" style="padding-top:8px"><h2 class="section-title">Learn what your result means</h2>'
                   '<div class="guide-grid">\n%s</div></section>' % ''.join(
                       '<a class="guide-card" href="/%s"><h3>%s</h3><p>%s</p></a>\n' % (path_of(p), esc(p['title']), esc(p['desc']))
                       for p in PAGES if p['kind'] == 'ref'))
            h = put_block(h, 'guides-tests', blk, '<footer>')
        if h != o: wr(f, h)

def main():
    patch_existing()          # first, so the shell below already carries the nav/footer links
    hd = shell()
    n = 0
    missing = [p['slug'] for p in PAGES if not os.path.isfile(os.path.join(CONTENT, p['slug'] + '.html'))]
    if missing:
        print('missing content (skipped): ' + ' '.join(missing))
    for p in PAGES:
        if p['slug'] in missing: continue
        wr(os.path.join(path_of(p), 'index.html'), render_page(p, hd)); n += 1
    wr('blog/index.html', render_index(hd))
    print('guides: %d pages + blog index written' % n)

if __name__ == '__main__':
    main()

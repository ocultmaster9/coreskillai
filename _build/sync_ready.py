# -*- coding: utf-8 -*-
"""`ready: true` is derived from the audit, not set by hand.

A market is listed in hreflang and included in the sitemap ONLY when it is
complete. Incomplete markets stay on disk, stay in the language selector and
keep building, but are noindex.
"""
import io, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audit as A

# `ready: true` = INDEXED: listed in hreflang, in the sitemap, and without the
# noindex tag. It is set for every market that passes the audit (all pages, native
# titles, the full long-form article on every test page). A market that fails the
# audit stays in the language selector and keeps working, but is noindex until its
# content is complete. There is deliberately no hand-kept allowlist here: a fixed
# list of ten hid 23 complete markets from Google.

def complete_langs():
    rows, _ = A.audit()
    out = []
    for r in rows:
        ok = (r['keys_ok'] and r['pages'] == 15 and r['eng_title'] == 0
              and r['sci_missing'] == 0 and r['sci_english'] == 0 and r['thin'] == 0
              and r['passages'] >= 8 and r['stroop'] == 5
              and (r['b5'] == 50 or r['lang'] == 'en') and (r['eq'] == 28 or r['lang'] == 'en'))
        if ok: out.append(r['lang'])
    return out

def sync():
    done = set(complete_langs())
    p = 'js/languages.js'; s = io.open(p, encoding='utf-8').read()
    def mark(m):
        code, name, d = m.group(1), m.group(2), m.group(3)
        return '  %s: { name: "%s", dir: "%s"%s },' % (code, name, d, ', ready: true' if code in done else '')
    s = re.sub(r'  ([a-z]{2}): \{ name: "([^"]+)", dir: "(\w+)"(?:, ready: true)? \},', mark, s)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
    return sorted(done)

if __name__ == '__main__':
    d = sync()
    print('ready (complete) markets: %d -> %s' % (len(d), ' '.join(d)))

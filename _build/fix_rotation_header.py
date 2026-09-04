# -*- coding: utf-8 -*-
"""Fix two clone leftovers on the Mental Rotation page, all 43 markets.

WHAT WAS WRONG
generate_pages() clones an existing test page, and the rotation page was cloned
from the pattern page. Two bits of the source page survived and shipped live:

  1. The header paragraph still carried data-i18n="pat_desc" and therefore read
     "Find the hidden rule and complete the matrix - a measure of fluid
     intelligence." That is the PATTERN test's description sitting under the
     Mental Rotation heading, in every market.
  2. The duration badge still said ~5 min. The rotation test is 6 minutes
     (TIME_LIMIT = 6*60 in js/tests/rotation.js).

WHY rot_desc AND NOT A NEW KEY
Every other test page uses ONE key for both the page header and the start card -
tests/iq/index.html line 82 and js/tests/iq.js both render iq_desc. rot_desc is
already translated in all 43 js/i18n/*.js files, so reusing it matches the site
convention and needs no new translation.

The visible text is read back out of js/i18n/<lang>.js rather than hard-coded
here, so this cannot drift from the translations. English falls back to the
literal used in js/tests/rotation.js.

RUN
  cd websites/coreskillai.com && python3 _build/fix_rotation_header.py
Then re-run check_prerender.py and check_untranslated.py; both must exit 0.
"""
import os, sys, io, re
sys.path.insert(0, os.path.join(os.getcwd(), '_build'))
import tools as T

EN_FALLBACK = ('20 spatial puzzles measuring how well you turn shapes in your mind. '
               'No words, no numbers.')

# rot_desc:"...."  - tolerate single or double quotes and an optional quoted key.
KEYPAT = re.compile(r'''["']?rot_desc["']?\s*:\s*(["'])(.*?)(?<!\\)\1''', re.S)

# The header paragraph, whatever text prerender() last wrote into it.
HDR = re.compile(r'<p data-i18n="pat_desc">.*?</p>', re.S)

# "&#9203; ~5 <span data-i18n="card_min">" - only inside the duration badge, so a
# stray "~5" elsewhere on the page is never touched.
DUR = re.compile(r'(&#9203;\s*~)5(\s*<span data-i18n="card_min">)')


def rot_desc_for(lang):
    if lang == 'en':
        return EN_FALLBACK
    p = os.path.join('js', 'i18n', '%s.js' % lang)
    if not os.path.isfile(p):
        return None
    m = KEYPAT.search(io.open(p, encoding='utf-8').read())
    if not m:
        return None
    return m.group(2).replace('\\"', '"').replace("\\'", "'")


def main():
    ready = T.ready_langs()
    fixed = hdr_n = dur_n = 0
    problems = []

    for lang in ready:
        f = ('tests/rotation/index.html' if lang == 'en'
             else '%s/tests/rotation/index.html' % lang)
        if not os.path.isfile(f):
            problems.append('%s: page missing (%s)' % (lang, f))
            continue

        desc = rot_desc_for(lang)
        if not desc:
            problems.append('%s: no rot_desc in js/i18n/%s.js' % (lang, lang))
            continue

        h = io.open(f, encoding='utf-8').read()
        before = h

        if HDR.search(h):
            h = HDR.sub('<p data-i18n="rot_desc">%s</p>' % desc, h, count=1)
            hdr_n += 1
        elif 'data-i18n="rot_desc"' not in h:
            problems.append('%s: header paragraph not found and not already fixed' % lang)

        if DUR.search(h):
            h = DUR.sub(r'\g<1>6\g<2>', h, count=1)
            dur_n += 1

        # A page that still advertises the pattern test anywhere is not fixed.
        if 'pat_desc' in h:
            problems.append('%s: pat_desc still present after rewrite' % lang)

        if h != before:
            io.open(f, 'w', encoding='utf-8', newline='\n').write(h)
            fixed += 1

    print('rewrote %d pages  (header %d, duration %d)' % (fixed, hdr_n, dur_n))
    if problems:
        print('PROBLEMS:')
        for p in problems:
            print('  ' + p)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())

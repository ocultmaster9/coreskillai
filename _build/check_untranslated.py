# -*- coding: utf-8 -*-
"""Fail if a localised page ships hard-coded English.

Why this exists
---------------
On 2026-08-27 the live Arabic home page was 479 of 583 visible words English.
Two separate causes, and checks 1-9 caught NEITHER of them:

  * The nine test cards ("IQ Test", "Measure your cognitive reasoning...",
    "Take Test", "~20 min") carried no data-i18n at all, in every language
    including the four original markets. Nothing was ever going to translate
    them, at build time or at runtime.
  * generate_pages() clones the ENGLISH pages, so newly built markets shipped
    English inside their data-i18n elements. Client-side i18n fixed it for
    humans; the served HTML that Bing indexes stayed English, and Bing is
    ~26:1 of this site's traffic.

The existing checks all looked at the wrong thing: <title> tags, key counts,
and page length. Every one of them was green while the body was English.

What this checks
----------------
Any visible text node of two or more Latin words on a non-English page, that
is not inside a data-i18n element and is not the brand name, is untranslated
content. That test is language-agnostic: it works for Latin-script markets
where a word-frequency heuristic cannot tell German from English.

Usage:  python3 _build/check_untranslated.py [lang ...]
"""
import io, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tools import ready_langs, PAGES, path_for

# Brand, units and markup fragments that are legitimately Latin everywhere.
ALLOW = re.compile(
    r'^(CoreSkillAI|Core|Skill|AI|IQ|EQ|SD|X|min|ms|wpm|cpm|Stroop|Big Five|'
    r'Mayer|Salovey|Caruso|Raven|Flynn|Miller|Cattell|Horn|Carroll|'
    r'Farnsworth|Munsell|Spearman|Cowan|Binet|Goleman|USB|QWERTY|QWERTZ)$', re.I)

STRIP = re.compile(r'(?is)<(script|style|head|select|option|noscript)[^>]*>.*?</\1>')
# A data-i18n element and everything inside it is by definition translatable.
I18N = re.compile(r'(?is)<([a-z0-9]+)[^>]*\bdata-i18n=.*?</\1>')


def text_nodes(path, strip_i18n=True):
    """Visible text nodes. strip_i18n drops data-i18n subtrees.

    The ENGLISH reference must be read with strip_i18n=False: it is the source
    of truth for "what does the English wording look like". Stripping it too
    removed English's own correctly-wired strings from the reference set, so
    an untranslated "IQ Test" on another page had nothing to match against.
    """
    h = io.open(path, encoding='utf-8').read()
    h = STRIP.sub(' ', h)
    if strip_i18n:
        h = I18N.sub(' ', h)
    h = re.sub(r'(?s)<!--.*?-->', ' ', h)
    out = []
    for m in re.finditer(r'>([^<>]+)<', h):
        txt = re.sub(r'&[a-z#0-9]+;', ' ', m.group(1))
        txt = ' '.join(txt.split())
        if not txt:
            continue
        words = [w for w in txt.split() if re.fullmatch(r"[A-Za-z][A-Za-z'\-\.]*", w)]
        # Two Latin words in total, at least one of which is not brand/unit.
        # Requiring TWO non-brand words was too weak: "IQ Test" filtered down to
        # a single word and sailed through, which is exactly the string this
        # check exists to catch. One bare word ("Contact") can coincide across
        # languages by chance, so two words is the floor.
        if len(words) >= 2 and any(not ALLOW.match(w) for w in words):
            out.append(txt)
    return out


def offenders(lang_path, en_path):
    """A string is untranslated only if it appears VERBATIM on the English page.

    Comparing against English rather than guessing "does this look English?" is
    what makes this reliable for Latin-script markets: "Ilmu di balik tes IQ" is
    perfectly good Indonesian and must not be flagged, while "Our Mission" is
    byte-identical to English and must be.
    """
    if not os.path.isfile(en_path):
        return []
    en = set(text_nodes(en_path, strip_i18n=False))
    return [t for t in text_nodes(lang_path) if t in en]


# The four info pages are known to be English in every market - about 34,000
# words of translation still outstanding as of 2026-08-27. They are reported
# every run so the debt stays visible, but they do not block a deploy; the
# pages that ARE translated must never regress, and those do block.
PENDING = {'about', 'privacy', 'terms', 'contact'}


def main(langs):
    bad = pending = 0
    for lang in langs:
        if lang == 'en':
            continue
        for page in PAGES:
            f = path_for(lang, page)
            if not os.path.isfile(f):
                continue
            hits = offenders(f, path_for('en', page))
            if not hits:
                continue
            if page in PENDING:
                pending += len(hits)
                continue
            bad += len(hits)
            print('::error::%s has %d untranslated English string(s)' % (f, len(hits)))
            for t in hits[:4]:
                print('    %s' % t[:88])
    if pending:
        print('::warning::%d untranslated string(s) on the info pages (%s) - known debt'
              % (pending, ', '.join(sorted(PENDING))))
    if bad:
        print('\n%d untranslated string(s) on pages that are supposed to be translated.' % bad)
        return 1
    print('  translated pages carry no hard-coded English')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:] or ready_langs()))

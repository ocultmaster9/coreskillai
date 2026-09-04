# -*- coding: utf-8 -*-
"""Fail if the test JS asks I18n for a key that no language file defines.

WHY
`_t('foc_interference','Stroop effect')` returns the second argument when the
key is missing. In English that is invisible - the fallback IS the English
copy. In the other 42 markets it is a raw English string in the middle of a
translated page, and nothing else catches it:

  * check_untranslated.py reads the SERVED HTML; these strings are written by
    JS at runtime and are not in the file.
  * check_js_english.py and verify_tests.js render the page and the started
    test; every one of these keys lives in the RESULT panel, which appears only
    after the test has been played to the end.

Nine keys were missing from en.js on 2026-09-03 - foc_congruent,
foc_incongruent, foc_interference, foc_res_new, foc_res_unscored,
foc_unscored, mem_second_try, rot_floor, rot_unanswered - so the Stroop result
panel, the memory retry line and two mental-rotation result branches were
English in all 42 non-English markets. Found by playing the Arabic tests to
completion in a real browser, which is a slow way to find a one-line static
mismatch. This is the fast way.

Two halves, both required:

  1. every key the test JS asks for exists in js/i18n/en.js;
  2. every key en.js defines exists in each READY market's file.

Half 2 overlaps audit.py's key check but is not redundant: audit compares key
COUNTS and set difference across every in-flight market and is easy to satisfy
by adding a key to en.js and forgetting the rest, which is exactly how a market
starts rendering English fallbacks again. Failing here keeps that out of a
deploy rather than out of a report.

Usage: python3 _build/check_js_keys.py [root]
"""
import io, os, re, sys, glob

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audit as A

# Keys built by concatenation at runtime - `_t('color_'+name)`, `_t('b5_'+trait)`.
# The regex sees the literal prefix, which is not a key. These are covered by
# audit.py's key-count check instead.
PREFIXES = re.compile(r'_$')

KEY_CALL = re.compile(r"""_t\(\s*['"]([a-z0-9_]+)['"]""")


def keys_of(root, lang):
    p = os.path.join(root, 'js/i18n/%s.js' % lang)
    if not os.path.isfile(p):
        return None
    s = io.open(p, encoding='utf-8').read()
    m = re.search(r'window\.TRANSLATIONS\.%s = \{\n(.*?)\n\};' % lang, s, re.S)
    if not m:
        print('FATAL: could not parse %s' % p)
        sys.exit(2)
    # audit.parse_block is quote-aware. A plain regex also matches word:" inside
    # a VALUE - "piece", "sequence", "trait" and "was" were all reported as keys
    # missing from 42 markets on the first run of this check.
    return set(A.parse_block(m.group(1)))


def ready_langs(root):
    s = io.open(os.path.join(root, 'js/languages.js'), encoding='utf-8').read()
    return [m.group(1) for m in re.finditer(r'\s([a-z]{2}):\s*\{[^}]*ready:\s*true', s)]


def main(root='.'):
    have = keys_of(root, 'en')
    if have is None:
        print('FATAL: js/i18n/en.js not found')
        return 2
    missing = {}
    for f in sorted(glob.glob(os.path.join(root, 'js/**/*.js'), recursive=True)):
        if '/i18n/' in f.replace(os.sep, '/'):
            continue
        s = io.open(f, encoding='utf-8').read()
        for k in set(KEY_CALL.findall(s)):
            if PREFIXES.search(k) or k in have:
                continue
            missing.setdefault(k, []).append(os.path.relpath(f, root).replace(os.sep, '/'))
    bad = 0
    if missing:
        bad += len(missing)
        print('FAIL: %d key(s) requested by the test JS are not in js/i18n/en.js.' % len(missing))
        print('      Every non-English market renders the English fallback for these.')
        for k in sorted(missing):
            print('  %-22s %s' % (k, ', '.join(missing[k])))

    for lang in sorted(ready_langs(root)):
        if lang == 'en':
            continue
        theirs = keys_of(root, lang)
        if theirs is None:
            bad += 1
            print('FAIL: %s is ready but has no js/i18n/%s.js' % (lang, lang))
            continue
        gap = sorted(have - theirs)
        if gap:
            bad += len(gap)
            print('FAIL: %s is missing %d key(s) that en.js defines: %s%s'
                  % (lang, len(gap), ', '.join(gap[:6]), ' ...' if len(gap) > 6 else ''))

    if bad:
        return 1
    print('  every _t() key the test JS uses is in en.js, and every ready market has every en.js key')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else '.'))

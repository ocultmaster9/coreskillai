# -*- coding: utf-8 -*-
"""Fail if a test script renders hardcoded English into the DOM.

WHY THIS IS NOT JUST A REGEX
verify_tests.js renders each test, but only the start screen and the first
question. It cannot see a RESULT panel without completing the test, and that is
where the rating ladders, breakdown labels and score-ring units live. Every one
of those once shipped in English to 43 markets. So we read the source instead.

The previous version of this check lived inline in deploy.yml and stripped
substitutions with a single regex:

    re.sub(r'\\$\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}', ' ', block)

That regex handles one level of braces. It has two failures:

  1. FALSE POSITIVES. A conditional like
         ${floored ? `<p>${_t('iq_floor','...')}</p>` : `<div>...</div>`}
     is not matched, so the stripper leaves it in place and the scanner then
     reports the JavaScript identifier `floored` as "hardcoded English". That is
     what broke deploy run #32.

  2. FALSE NEGATIVES, which are worse. Because the outer template was found with
     `([^`]*)` - non-backtick content - any template containing a NESTED template
     ended early. Real English sitting inside a nested branch was never scanned
     at all. The check was blind to exactly the construct it most needed to read.

This version walks the source properly: it tracks strings, comments, template
literals and ${...} substitutions at any depth, and collects the literal text of
every template including nested ones.
"""
import io, re, glob, os, sys

# Latin tokens that are legitimately Latin inside any market: our own brand,
# technical units, the researchers the science copy cites, and a few JS
# identifiers that legitimately appear as literal text.
OK = re.compile(r"^(CoreSkillAI|AdSense|Google|IQ|EQ|WPM|CPM|MBTI|Stroop|Raven|Miller|"
                r"Goldberg|IPIP|MSCEIT|WAIS|Binet|Ishihara|Farnsworth|Munsell|OCEAN|Mayer|"
                r"Salovey|Caruso|QWERTY|ms|min|avg|px|err|of|Q|X|v)$", re.I)


def template_texts(src):
    """[(line, literal_text)] for every template literal, nested ones included.

    Only the literal parts are returned; ${...} substitutions become a space,
    because their value comes from _t() at runtime and is translated.
    """
    res = []
    n = len(src)

    def skip_quoted(i):
        q = src[i]; i += 1
        while i < n:
            if src[i] == '\\':
                i += 2; continue
            if src[i] == q:
                return i + 1
            if src[i] == '\n':          # unterminated - bail rather than run away
                return i
            i += 1
        return i

    def scan_template(i):
        line = src.count('\n', 0, i) + 1
        i += 1
        buf = []
        while i < n:
            c = src[i]
            if c == '\\':
                i += 2; continue
            if c == '`':
                i += 1; break
            if c == '$' and i + 1 < n and src[i + 1] == '{':
                i += 2
                depth = 1
                while i < n and depth:
                    c2 = src[i]
                    if c2 == '\\':
                        i += 2; continue
                    if c2 in '\'"':
                        i = skip_quoted(i); continue
                    if c2 == '`':
                        i = scan_template(i)      # nested template: record its text too
                        continue
                    if c2 == '{':
                        depth += 1
                    elif c2 == '}':
                        depth -= 1
                    i += 1
                buf.append(' ')
                continue
            buf.append(c)
            i += 1
        res.append((line, ''.join(buf)))
        return i

    i = 0
    while i < n:
        c = src[i]
        if c in '\'"':
            i = skip_quoted(i); continue
        if c == '`':
            i = scan_template(i); continue
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            while i < n and src[i] != '\n':
                i += 1
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '*':
            i += 2
            while i + 1 < n and not (src[i] == '*' and src[i + 1] == '/'):
                i += 1
            i += 2; continue
        i += 1
    return res


def scan(paths):
    bad = []
    for f in sorted(paths):
        src = io.open(f, encoding='utf-8').read()
        for line, blk in template_texts(src):
            if '<' not in blk:
                continue                     # not markup, not rendered as text
            t = re.sub(r'<[^>]+>', ' ', blk)
            for w in re.findall(r"[A-Za-z][A-Za-z']{2,}", t):
                if not OK.match(w):
                    bad.append('%s:%d %s' % (os.path.basename(f), line, w))
                    break
    return bad


if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else '.'
    bad = scan(glob.glob(os.path.join(root, 'js', 'tests', '*.js')))
    for b in bad[:12]:
        print('::error::hardcoded English rendered by a test script -> %s' % b)
    print('  test scripts render no hardcoded English' if not bad
          else '  %d problem(s)' % len(bad))
    sys.exit(1 if bad else 0)

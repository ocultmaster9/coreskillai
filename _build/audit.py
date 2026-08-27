# -*- coding: utf-8 -*-
"""Completeness audit. A market is DONE only when every column passes.
Run from the site root. Exits non-zero if any ready market is incomplete."""
import io, os, re, sys, glob, unicodedata

PAGES = ['home','about','privacy','terms','contact','tests',
         'tests/iq','tests/reaction-time','tests/memory','tests/pattern',
         'tests/color-vision','tests/big-five','tests/eq','tests/focus','tests/typing']
TESTS = ['iq','reaction-time','memory','pattern','color-vision','big-five','eq','focus','typing']
SCRIPT_OF = {'ru':'CYRILLIC','uk':'CYRILLIC','bg':'CYRILLIC','sr':'CYRILLIC','mk':'CYRILLIC',
             'el':'GREEK','he':'HEBREW','ar':'ARABIC','fa':'ARABIC','hi':'DEVANAGARI','th':'THAI',
             'ja':'CJK','zh':'CJK','ko':'HANGUL'}

def parse_block(b):
    out={}; i=0; n=len(b)
    while i<n:
        if b[i]=='"':
            i+=1
            while i<n and b[i]!='"': i+= 2 if b[i]=='\\' else 1
            i+=1; continue
        m=re.match(r'([A-Za-z_]\w*)\s*:\s*"',b[i:])
        if m:
            j=i+m.end(); v=''
            while j<n and b[j]!='"':
                v+=b[j]; j+= 2 if b[j]=='\\' else 1
            out[m.group(1)]=v; i=j+1; continue
        i+=1
    return out

def strings(lang):
    p='js/i18n/%s.js'%lang
    if not os.path.isfile(p): return {}
    s=io.open(p,encoding='utf-8').read()
    m=re.search(r'window\.TRANSLATIONS\.%s = \{\n(.*?)\n\};'%lang,s,re.S)
    return parse_block(m.group(1)) if m else {}

def path_for(lang,page):
    sub='' if page=='home' else page
    base='' if lang=='en' else lang
    parts=[x for x in (base,sub) if x]
    return os.path.join(*parts,'index.html') if parts else 'index.html'

def body_text(h):
    b=re.search(r'<body.*?</body>',h,re.S)
    if not b: return ''
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',b.group(0),flags=re.S)
    return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',t)).strip()

def ready():
    s=io.open('js/languages.js',encoding='utf-8').read()
    return [m.group(1) for m in re.finditer(r'  ([a-z]{2}): \{[^}]*ready: true',s)]

def registry():
    s=io.open('js/languages.js',encoding='utf-8').read()
    return [m.group(1) for m in re.finditer(r'  ([a-z]{2}): \{ name:',s)]

def in_flight():
    """Every market with work started - a strings file on disk. Reporting only
    `ready` ones would say "3 of 3 complete" and hide all remaining work."""
    return sorted({os.path.basename(f)[:-3] for f in glob.glob('js/i18n/*.js')})

def passages(lang):
    s=io.open('js/tests/typing.js',encoding='utf-8').read()
    b=re.search(r'const PASSAGES=\{(.*?)\n\};',s,re.S).group(1)
    m=re.search(r'\n  %s:\[(.*?)\n  \]'%lang,b,re.S)
    return len(re.findall(r'"',m.group(1)))//2 if m else 0

def items(fname, lang):
    """How many statements exist for this language in the ITEMS_I18N bank."""
    s=io.open('js/tests/%s.js'%fname,encoding='utf-8').read()
    m=re.search(r'ITEMS_I18N = \{(.*?)\n\};', s, re.S)
    if not m: return 0
    b=re.search(r'\n?\s*%s:\s*\[(.*?)\n?\s*\]'%lang, m.group(1), re.S)
    return len(re.findall(r'"', b.group(1)))//2 if b else 0

def stroop(lang):
    s=io.open('js/tests/focus.js',encoding='utf-8').read()
    b=re.search(r'const WORDS=\{(.*?)\n\};', s, re.S).group(1)
    return len(re.findall(r'%s:\s*[\'"]'%lang, b))


def thin_count(ratios):
    """Flag pages that are short FOR THIS LANGUAGE.

    Comparing raw character counts against English is invalid across scripts.
    Japanese renders the same content in ~73% of the characters English needs,
    so a flat "80% of English" rule marked all nine Japanese test pages thin
    while they were in fact complete. This is the same mistake that once
    flagged Finnish - fixed then by switching words to characters - but
    characters are just as script-dependent as words.

    So: take this language's own median ratio to English as its natural
    density and flag only pages falling well below that. No per-language
    constants, and it works for any script added later. The absolute floor
    still catches a language that is genuinely under-written everywhere.
    """
    if not ratios:
        return 0
    vals = sorted(r for _, r in ratios)
    med = vals[len(vals) // 2]
    if med < 0.45:                 # every page short => genuinely thin, not dense
        return len(ratios)
    return sum(1 for _, r in ratios if r < med * 0.80)


def audit():
    EN=strings('en'); nkeys=len(EN)
    en_titles=set()
    EN_LEN={}
    for pg in PAGES:
        f=path_for('en',pg)
        if os.path.isfile(f):
            EN_LEN[pg]=len(body_text(io.open(f,encoding='utf-8').read()))
    EN_SCI=set()
    for slug in TESTS:
        f=path_for('en','tests/'+slug)
        if os.path.isfile(f):
            ms=re.search(r'<section style="max-width:860px[^"]*">(.*?)</section>',
                         io.open(f,encoding='utf-8').read(),re.S)
            if ms:
                EN_SCI.add(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',ms.group(1))).strip()[:120])
    for pg in PAGES:
        f=path_for('en',pg)
        if os.path.isfile(f):
            mt=re.search(r'<title>(.*?)</title>',io.open(f,encoding='utf-8').read(),re.S)
            if mt: en_titles.add(mt.group(1).strip())
    rows=[]
    for lang in in_flight():
        T=strings(lang)
        keys_ok = len(T)==nkeys and not (set(EN)-set(T))
        pages_ok = sum(1 for pg in PAGES if os.path.isfile(path_for(lang,pg)))
        eng_title=0; sci_missing=0; sci_english=0; thin=0; ratios=[]
        for pg in PAGES:
            f=path_for(lang,pg)
            if not os.path.isfile(f): continue
            h=io.open(f,encoding='utf-8').read()
            mt=re.search(r'<title>(.*?)</title>',h,re.S)
            if lang!='en' and mt and mt.group(1).strip() in en_titles: eng_title+=1
            if pg.startswith('tests/'):
                ms=re.search(r'<section style="max-width:860px[^"]*">(.*?)</section>',h,re.S)
                if not ms: sci_missing+=1
                else:
                    # Compare against the ACTUAL English text, not a word-prefix regex.
                    # "Emotionale Intelligenz messen" matched /Emotional/ and produced a
                    # false positive on a correctly translated German page.
                    txt=re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',ms.group(1))).strip()
                    if lang!='en' and txt[:120] in EN_SCI:
                        sci_english+=1
                # Thin-ness must be measured against the ENGLISH equivalent, in
                # CHARACTERS. A word-count threshold is English-calibrated and
                # wrong for agglutinative languages: the Finnish IQ page carries
                # 263 words but 2,191 characters against English's 336 words /
                # 2,179 characters - MORE text, 22% fewer words. Characters are
                # comparable across alphabetic scripts; words are not.
                en_chars = EN_LEN.get(pg, 0)
                if en_chars: ratios.append((pg, len(body_text(h)) / float(en_chars)))
        rows.append(dict(lang=lang, keys=len(T), keys_ok=keys_ok, pages=pages_ok,
                         eng_title=eng_title, sci_missing=sci_missing, sci_english=sci_english,
                         thin=thin_count(ratios), passages=passages(lang),
                         stroop=stroop(lang), b5=items('big-five',lang), eq=items('eq',lang)))
    return rows, nkeys

if __name__=='__main__':
    rows, nkeys = audit()
    print('%-4s %-8s %-6s %-8s %-8s %-8s %-5s %-6s %-7s %-6s %s' %
          ('lang','keys','pages','enTitle','sciMiss','sciEng','thin','pass/8','stroop/5','b5/50','eq/28'))
    bad=0
    for r in rows:
        ok = (r['keys_ok'] and r['pages']==15 and r['eng_title']==0
              and r['sci_missing']==0 and r['sci_english']==0 and r['thin']==0
              and r['passages']>=8 and r['stroop']==5
              and (r['b5']==50 or r['lang']=='en') and (r['eq']==28 or r['lang']=='en'))
        flag = '' if ok else '  <-- INCOMPLETE'
        if flag: bad+=1
        print('%-4s %-8s %-6s %-8s %-8s %-8s %-5s %-6s %-8s %-6s %-6s%s' %
              (r['lang'], r['keys'], r['pages'], r['eng_title'], r['sci_missing'],
               r['sci_english'], r['thin'], r['passages'], r['stroop'], r['b5'], r['eq'], flag))
    done=len(rows)-bad
    print('\n%d complete | %d in progress | %d of %d markets in the registry not started'
          % (done, len(rows)-done, len(registry())-len(rows), len(registry())))
    print('OVERALL: %d of %d markets done (%.0f%%)' % (done, len(registry()), 100*done/len(registry())))
    sys.exit(1 if bad else 0)

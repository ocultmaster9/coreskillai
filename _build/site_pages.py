# -*- coding: utf-8 -*-
"""Rewrite the English About, Contact and Privacy pages, add the Mental Rotation
test to the indexed translated privacy pages, rebuild 404.html, and strip claims that are no longer true from the translated About pages.

Idempotent. Run from the site root after sync_ready/refresh so the language list
on the About page matches the markets that are actually indexed.
"""
import io, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from guides_data import AUTHOR, TEST_NAMES

def rd(p): return io.open(p, encoding='utf-8').read()
def wr(p, s): io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

P = 'style="font-size:.95rem;color:var(--text-2);line-height:1.8"'
EMAIL = 'ocultmaster9@gmail.com'

def ready_names():
    s = rd('js/languages.js')
    return [m.group(2) for m in re.finditer(r'  ([a-z]{2}): \{ name: "([^"]+)", dir: "\w+", ready: true', s)]

def swap_main(path, new_main, start='<div class="page">', end=None):
    h = rd(path)
    i = h.index(start)
    j = h.index(end, i) if end else h.index('<footer>', i)
    wr(path, h[:i] + new_main + h[j:])

def about_main():
    names = ready_names()
    tests = ''.join('<li><a href="/tests/%s/">%s</a></li>' % (k, v) for k, v in TEST_NAMES.items())
    return '''<div class="page">
  <section class="section section-sm" style="padding-top:60px;max-width:860px">
    <h1 style="font-size:2rem;font-weight:800;margin-bottom:12px">About CoreSkillAI</h1>
    <p %(P)s>CoreSkillAI is a free collection of ten cognitive and personality tests, with plain-language explanations of what each one measures, how it is scored and what the result can and cannot tell you.</p>

    <h2 class="section-title" style="margin-top:32px">Who runs this site</h2>
    <p %(P)s>CoreSkillAI is built, written and maintained by <strong>%(A)s</strong>, an independent web developer based in Romania. It is a one-person project, not a company or a research institute. I am not a psychologist or a clinician, and the site does not pretend to be a clinic. What I do is read the published research behind each test, build a careful web version, and be open about where it falls short.</p>
    <p %(P)s>You can reach me through the <a href="/contact/">contact page</a>. If you find a mistake, please tell me.</p>

    <h2 class="section-title" style="margin-top:32px">Why it exists</h2>
    <p %(P)s>Most free online "IQ tests" and "personality quizzes" give a flattering number, hide the real result behind a payment, and say nothing about how the score was produced. I wanted a site where the test is free, the method is written down, the limits are stated, and the result page is honest enough to say "this test cannot estimate a score from your answers" when that is the truth.</p>

    <h2 class="section-title" style="margin-top:32px">What is here</h2>
    <ul %(P)s>%(tests)s</ul>
    <p %(P)s>Each test page has a long explanation beneath the test: what is measured, how the test works, how the score is calculated, how to read it, and sources. The <a href="/blog/">blog and guides</a> go further, with articles such as <a href="/blog/what-is-a-good-iq-score/">what is a good IQ score</a> and <a href="/blog/are-online-iq-tests-accurate/">are online IQ tests accurate</a>.</p>

    <h2 class="section-title" style="margin-top:32px">How the tests are built</h2>
    <p %(P)s>The tests adapt established tasks: matrix reasoning (Raven; Carpenter, Just and Shell), digit span (Wechsler; Miller; Cowan), simple reaction time, hue arrangement (Farnsworth), the Stroop task, mental rotation (Shepard and Metzler), the Mayer-Salovey model of emotional intelligence, and the IPIP Big-Five markers (Goldberg). The IQ test has 36 matrix puzzles and reports a guessing-corrected score with a 95%% confidence interval, capped at 135. None of the tests has been standardised on a representative population sample, and each page says what its percentile is based on. The full description is on the <a href="/methodology/">methodology page</a>.</p>

    <h2 class="section-title" style="margin-top:32px">Editorial standards</h2>
    <ul %(P)s>
      <li>Articles are written from published research and list their sources.</li>
      <li>Figures are checked against the source before they go on a page. If I cannot verify a number, it is left out.</li>
      <li>Errors are corrected when they are reported. Substantive corrections are noted on the page.</li>
      <li>Nothing here is medical, psychological or career advice, and no test here is a diagnostic tool.</li>
    </ul>

    <h2 class="section-title" style="margin-top:32px">Privacy, ads and money</h2>
    <p %(P)s>No account is needed. Your answers are scored in your browser. The IQ, pattern recognition and mental rotation tests can send anonymous item-level results (which puzzle rules appeared, whether each was answered correctly, timings, the total score, language and date) so that item difficulty can be measured. No name, email, IP address or device identifier is stored with them.</p>
    <p %(P)s>The site is funded by advertising through Google AdSense, and Google Analytics counts page visits. Both are third-party services that may use cookies; the <a href="/privacy/">privacy policy</a> has the details. Advertising does not influence the content or the scoring.</p>

    <h2 class="section-title" style="margin-top:32px">Languages</h2>
    <p %(P)s>The tests and their explanations are available in %(N)d languages (%(L)s). English is the original; the other editions are translations of the test pages, and the blog and guides are in English only. Languages that are not fully translated are left out of search results until they are complete.</p>
  </section>
</div>
''' % dict(P=P, A=AUTHOR, tests=tests, N=len(names), L=', '.join(names))

def contact_main():
    return '''<div class="page">
  <section class="section section-sm" style="padding-top:60px;max-width:860px">
    <h1 style="font-size:2rem;font-weight:800;margin-bottom:12px">Contact</h1>
    <p %(P)s>CoreSkillAI is run by <strong>%(A)s</strong>, an independent web developer in Romania. It is a personal project, not a company, so there is no office or phone line. Email is the best way to reach me.</p>
    <div class="instruction-card">
      <p %(P)s><strong>Email:</strong> <a href="mailto:%(E)s">%(E)s</a></p>
      <p %(P)s><strong>Location:</strong> Romania</p>
      <p %(P)s><strong>Replies:</strong> I read every message. Replies can take several days.</p>
    </div>

    <h2 class="section-title" style="margin-top:28px">Send a message</h2>
    <p %(P)s>This form opens your email app with the message filled in; nothing is stored on this site. If your email app does not open, write to the address above.</p>
    <form class="contact-form" action="mailto:%(E)s" method="post" enctype="text/plain">
      <label for="cf-name">Your name</label>
      <input id="cf-name" name="name" type="text" autocomplete="name">
      <label for="cf-email">Your email</label>
      <input id="cf-email" name="email" type="email" autocomplete="email">
      <label for="cf-topic">Topic</label>
      <select id="cf-topic" name="topic">
        <option>Error or correction on a page</option>
        <option>A test is not working</option>
        <option>Scoring looks wrong</option>
        <option>Translation mistake</option>
        <option>Accessibility problem</option>
        <option>Press or partnership</option>
        <option>Something else</option>
      </select>
      <label for="cf-msg">Message (include the page address if it concerns a page)</label>
      <textarea id="cf-msg" name="message" rows="6"></textarea>
      <p style="margin-top:14px"><button class="btn btn-primary" type="submit">Open in my email app</button></p>
    </form>

    <h2 class="section-title" style="margin-top:28px">Before you write</h2>
    <ul %(P)s>
      <li>I cannot interpret individual results or give psychological, medical or career advice. For that, speak to a qualified professional.</li>
      <li>To report a factual error, please include the page address and the statement you think is wrong. See how we handle corrections on the <a href="/methodology/">methodology page</a>.</li>
      <li>Privacy questions: see the <a href="/privacy/">privacy policy</a>.</li>
    </ul>
  </section>
</div>
''' % dict(P=P, A=AUTHOR, E=EMAIL)

def fix_privacy():
    p = 'privacy/index.html'; h = rd(p)
    h = h.replace('When you finish the IQ or Pattern test we record how it went',
                  'When you finish the IQ, Pattern or Mental Rotation test we record how it went')
    if 'Contact form:' not in h:
        h = h.replace('<strong>Contact:</strong>',
            '<strong>Contact form:</strong> The form on the contact page opens your own email app. It does not send anything to this site. Messages you email us are used only to reply to you.<br><br>\n      <strong>Contact:</strong>', 1)
    wr(p, h)

def privacy_main():
    H = '<h2 class="section-title" style="margin-top:32px">%s</h2>'
    return ("""<div class="page">
  <section class="section section-sm" style="padding-top:60px;max-width:860px">
    <h1 style="font-size:2rem;font-weight:800;margin-bottom:12px">Privacy Policy</h1>
    <p %(P)s>Last updated: 10 October 2026. This policy explains what coreskillai.com records, what the third-party services on the site do, and the choices you have.</p>

    """ + H % 'Who is responsible' + """
    <p %(P)s>CoreSkillAI is run by <strong>%(A)s</strong>, an individual based in Romania (European Union). There is no company behind the site. For any privacy question write to <a href="mailto:%(E)s">%(E)s</a>.</p>

    """ + H % 'What the tests record' + """
    <p %(P)s><strong>What we collect:</strong> When you finish the IQ, Pattern or Mental Rotation test we record how it went: which puzzle rules appeared, whether each was answered correctly, how long each took, your total score, your language and the date. We do not record your name, email, IP address, or any account or device identifier, and we set nothing that would let us recognise you if you came back.</p>
    <p %(P)s>The other tests (reaction time, working memory, colour vision, Big Five, emotional intelligence, focus and typing) are scored entirely in your browser. Their answers and results are not sent to us.</p>
    <p %(P)s>No account exists on this site, so we hold no profile, password or email list.</p>

    """ + H % 'Why this data is collected' + """
    <p %(P)s><strong>Why:</strong> This test has no standardisation sample yet. Response data is the only way to measure how hard each puzzle actually is and how well it separates strong reasoning from weak, which is what turns a plausible-looking score into a meaningful one. It is not used for anything else and is never sold.</p>

    """ + H % 'Cookies and local storage' + """
    <p %(P)s>We keep your theme and language choice in your browser's local storage. We write nothing else to your device. The cookies you may see on this site are set by the two Google services described below, not by us.</p>

    """ + H % 'Advertising' + """
    <p %(P)s>We use Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your earlier visits to this site or to other websites. Google's advertising cookies let Google and its partners show ads based on those visits.</p>
    <ul %(P)s>
      <li>You can turn off personalised advertising in <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.</li>
      <li>You can opt out of personalised advertising from other participating vendors at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">aboutads.info</a> or, in Europe, at <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener">youronlinechoices.eu</a>.</li>
      <li>How Google uses information from sites that use its services is explained at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">policies.google.com/technologies/partner-sites</a>. See also Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">privacy policy</a>.</li>
    </ul>
    <p %(P)s>Advertising does not influence the tests, the scoring or the articles.</p>

    """ + H % 'Analytics' + """
    <p %(P)s>We use Google Analytics to see which pages get visited. Google collects that on its own terms, which include approximate location and device type. We see totals only, not individual visitors. You can block it with Google's <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Analytics opt-out browser add-on</a>.</p>

    """ + H % 'Your choices and rights' + """
    <p %(P)s><strong>Your data:</strong> Because the test records contain nothing that identifies you, we cannot locate, export or delete an individual person's entry — there is no link back to you. If you would rather nothing were collected, simply do not finish the test: nothing is sent until your result appears.</p>
    <p %(P)s>You can block or delete cookies in your browser settings; the tests keep working without them. If you are in the European Economic Area or the United Kingdom, data-protection law gives you rights of access, correction, deletion and objection over personal data. For data held by Google, use the Google links above. For anything you have emailed to us, write to the address below and it will be deleted on request. You may also complain to your national data-protection authority; in Romania that is the ANSPDCP.</p>

    """ + H % 'Children' + """
    <p %(P)s>The site is written for a general audience and is not directed at children under 13. We do not knowingly collect personal information from children.</p>

    """ + H % 'Contact form and email' + """
    <p %(P)s><strong>Contact form:</strong> The form on the contact page opens your own email app. It does not send anything to this site. Messages you email us are used only to reply to you.</p>

    """ + H % 'Changes to this policy' + """
    <p %(P)s>If what the site records changes, this page is updated first and the date at the top changes with it.</p>

    """ + H % 'Contact' + """
    <p %(P)s><strong>Contact:</strong> <a href="mailto:%(E)s">%(E)s</a></p>
  </section>
</div>
""") % dict(P=P, A=AUTHOR, E=EMAIL)


# The translated privacy pages still said data is recorded for two tests. The
# Mental Rotation test posts to /api/response as well (js/tests/rotation.js), so
# the indexed markets are corrected here. Each pair is (old, new), idempotent.
PRIVACY_ROTATION = {
    'es': ('el test de IQ o el de patrones registramos', 'el test de IQ, el de patrones o el de rotación mental registramos'),
    'pt': ('o teste de QI ou o de padrões, registamos', 'o teste de QI, o de padrões ou o de rotação mental, registamos'),
    'fr': ('le test de QI ou de motifs, nous', 'le test de QI, de motifs ou de rotation mentale, nous'),
    'de': ('Wenn Sie den IQ- oder Mustertest beenden', 'Wenn Sie den IQ-Test, den Mustertest oder den Test zur mentalen Rotation beenden'),
    'it': ('il test del QI o quello dei pattern registriamo', 'il test del QI, quello dei pattern o quello di rotazione mentale registriamo'),
    'ro': ('testul de inteligență sau cel de tipare, înregistrăm', 'testul de inteligență, cel de tipare sau cel de rotație mentală, înregistrăm'),
    'pl': ('test inteligencji lub test wzorów, zapisujemy', 'test inteligencji, test wzorów lub test rotacji mentalnej, zapisujemy'),
    'ru': ('тест интеллекта или тест закономерностей, мы', 'тест интеллекта, тест закономерностей или тест мысленного вращения, мы'),
    'tr': ('Zeka testini veya örüntü testini bitirdiğinizde', 'Zeka testini, örüntü testini veya zihinsel döndürme testini bitirdiğinizde'),
}

def fix_translated_privacy():
    n = 0
    for lg, (old, new) in PRIVACY_ROTATION.items():
        p = os.path.join(lg, 'privacy', 'index.html')
        h = rd(p)
        if new in h: continue
        if old not in h: raise SystemExit('privacy sentence not found in ' + p)
        wr(p, h.replace(old, new, 1)); n += 1
    return n


def build_404():
    """404.html used to be a stale clone of the old home page: it showed
    '4.2M tests completed', '190+ countries', '100%% anonymous' and a 40-question
    IQ test, none of which is true. Build it from the blog shell instead, so it
    carries the current nav and footer, and keep it free of ads and noindex
    (ads on an error page breach AdSense policy; preflight check 2 enforces it)."""
    h = rd('blog/index.html')
    i = h.index('<div class="page">'); j = h.index('<footer>', i)
    main = """<div class="page">
  <section class="section section-sm" style="padding-top:60px;max-width:860px">
    <h1 style="font-size:2rem;font-weight:800;margin-bottom:12px">Page not found</h1>
    <p %(P)s>There is no page at this address. It may have been moved, or the link may be mistyped.</p>
    <p style="margin:20px 0"><a href="/" class="btn btn-primary">Go to the home page</a> <a href="/tests/" class="btn btn-secondary">See all tests</a></p>
    <h2 class="section-title" style="margin-top:32px">Tests</h2>
    <ul %(P)s>%(tests)s</ul>
    <h2 class="section-title" style="margin-top:32px">Reading</h2>
    <ul %(P)s>
      <li><a href="/blog/">Blog and guides</a></li>
      <li><a href="/methodology/">Methodology</a></li>
      <li><a href="/about/">About</a> &middot; <a href="/contact/">Contact</a></li>
    </ul>
  </section>
</div>
""" % dict(P=P, tests=''.join('<li><a href="/tests/%s/">%s</a></li>' % (k, v) for k, v in TEST_NAMES.items()))
    h = h[:i] + main + h[j:]
    title = 'Page Not Found | CoreSkillAI'
    desc = 'This page does not exist. Use the links to reach the tests, the blog or the home page.'
    h = re.sub(r'<title>.*?</title>', '<title>%s</title>' % title, h, 1, flags=re.S)
    h = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % desc, h, 1)
    # no social cards, canonical, structured data or ad loader on an error page
    h = re.sub(r'<meta (?:property="og:|name="twitter:)[^>]*>\n?', '', h)
    h = re.sub(r'<link rel="canonical"[^>]*>\n?', '', h)
    h = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', '', h, flags=re.S)
    h = re.sub(r'<script async src="https://pagead2\.googlesyndication\.com[^>]*></script>\n?', '', h)
    h = h.replace('<head>', '<head>\n<meta name="robots" content="noindex, follow">', 1)
    assert 'googlesyndication' not in h and 'adsbygoogle' not in h, '404 must carry no ads'
    wr('404.html', h)


def clean_translated_about():
    """The old About text promised 'zero tracking', 'we store nothing', 'no advertising
    targeted at you' and '34 languages', and described a 40-question IQ test.
    None of that is accurate. Remove those blocks in every non-English market
    rather than leave a false statement in a language nobody here can proofread."""
    n = 0
    for d in sorted(os.listdir('.')):
        if not re.fullmatch(r'[a-z]{2}', d) or d == 'en': continue
        p = os.path.join(d, 'about', 'index.html')
        if not os.path.isfile(p): continue
        h = rd(p); o = h
        for emo in ('\U0001F512', '\U0001F310', '\U0001F4CA'):
            h = re.sub(r'<div class="science-card"><span style="font-size:1.8rem">%s</span>.*?</div>\n?' % emo, '', h, flags=re.S)
        # first instruction-card inside the science list is the stale 40-question IQ description
        m = re.search(r'<div class="instruction-card" style="margin-bottom:14px">.*?</div>\n?', h, flags=re.S)
        if m and ('IQ' in m.group(0)[:200]): h = h[:m.start()] + h[m.end():]
        if h != o: wr(p, h); n += 1
    return n

if __name__ == '__main__':
    swap_main('about/index.html', about_main())
    swap_main('contact/index.html', contact_main())
    swap_main('privacy/index.html', privacy_main())
    print('translated privacy pages corrected: %d' % fix_translated_privacy())
    build_404()
    print('translated About pages cleaned: %d' % clean_translated_about())

# coreskillai.com

Nine free cognitive tests (IQ, reaction time, working memory, pattern recognition,
colour vision, Big Five, emotional IQ, focus, typing) plus mental rotation, in 43
markets. Static site on Cloudflare Pages.

## Deploying

Push to `main`. That is the only path to production — there is no manual upload.
The pipeline stages a clean copy, runs preflight checks, deploys to Cloudflare
Pages, purges the edge cache, then verifies the live site and fails loudly if
anything is wrong.

| Setting | Value |
|---|---|
| Cloudflare Pages project | `coreskillai` |
| Served host | `https://www.coreskillai.com` |
| GA4 (this site only) | `G-RKSK3LMNKN` |
| AdSense publisher | `ca-pub-5798786176755576` |

Required repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`CLOUDFLARE_ZONE_ID`.

## The two hostnames — read before touching canonicals

The HTML in this repo carries **apex** canonicals (`https://coreskillai.com/...`).
The `coreskillai-canonical-fix` Worker rewrites them to `www` at the edge, which
is why `www.coreskillai.com` shows a www canonical while `coreskillai.pages.dev`
shows the apex.

Do **not** rewrite the canonicals to `www` in this repo without retiring that
Worker first, or the rewrite double-applies. `og:image` is the exception: the
Worker rewrites `canonical` and `og:url` only and leaves `og:image` alone, so
that one tag carries `www` **in this repo** and must not be added to the
Worker's rewrite list. This layout also once looked like
"the local folder is stale" — it isn't; compare against `coreskillai.pages.dev`
(the raw origin), never against `www`.

## Layout

```
index.html, about/, privacy/, tests/          English
es/  pt/  fr/  de/                            translated mirrors
js/translations.js                            all five languages, one file
js/main.js                                    theme, i18n, ordinal(), AdSense push
js/tests/<test>.js                            one file per test
```

AdSense slots are pushed centrally from `main.js` — one `push({})` per
`.adsbygoogle` element on `DOMContentLoaded`. There are deliberately no inline
push calls in the HTML; counting inline pushes will make the ads look broken
when they are not.

## What the preflight checks catch

1. Binary assets that are secretly HTML (a mirror script did this to three sites).
2. Ads or a missing `noindex` on `404.html` — ads on error pages breach Google policy.
3. A page missing AdSense, missing this site's GA4 tag, or with a canonical that
   doesn't match its own path.
4. `ads.txt` not naming our publisher id.
5. Test JavaScript that doesn't parse, or a test page that doesn't load its script.
6. **Translation/template integrity.** Values that repeat decoration the template
   already prints, keys missing from a language, and fabricated ordinals like
   `3th`. This is the guard for the 2026-08-24 bugs where the IQ result panel
   read "Your IQ Score 3% % of people" and "BETTER THAN 3th".
7. A sitemap URL with no file behind it.
8. **Runtime i18n keys.** `_t('foc_interference','Stroop effect')` silently
   returns its English fallback when the key is missing, so a key the test JS
   uses but no language file defines ships as English in all 42 non-English
   markets. Nine did: the Stroop result panel, the memory retry line and two
   mental-rotation result branches. `check_js_keys.py` fails on a key the test
   JS asks for that en.js lacks, and on a ready market missing a key en.js has.
   Nothing else covers this - these strings live in the RESULT panel, which
   appears only after the test has been played to the end.

All ten tests (the nine plus mental rotation) have been played end to end in a
real browser - Chromium via Playwright against the built files, in English and
in Arabic - asserting that a result panel renders and that its text carries no
raw i18n key, no doubled `%`, no `undefined`/`NaN` and no fabricated ordinal.

Live verification then confirms all nine tests and their scripts return 200, the
Worker still rewrites the canonical, `iq.js` still carries the double-click guard,
and the served translations have no doubled `%`.

## Known issues

- Origin canonicals depend on the Worker (above). Worth simplifying one day.
- The typing test has no paste guard and no plausibility ceiling. Pasting the
  passage scores in the thousands of WPM and renders a shareable "Impressive
  speed" result.
- `tests/rotation` is in `tools.PAGES` but not in `audit.TESTS` or in
  `verify_tests.js`, so the mental-rotation page is outside the science-section
  and per-test render checks.

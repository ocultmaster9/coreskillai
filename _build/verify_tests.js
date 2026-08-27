/* Load every test page for the given languages in jsdom, run the test's own
 * startup path, and assert the visible text is actually in that language.
 *
 * This exists because "the files are present and the audit is green" is a
 * weaker claim than "the test runs". Four tests (big-five, eq, pattern,
 * color-vision) once shipped with a missing `_t` helper: every key was
 * present, the audit was green, and the page threw on load.
 *
 * The harness lived in /tmp twice and was wiped by a workspace reset both
 * times, so it lives in the repo now. _build/ is excluded from the deploy.
 *
 * Usage:  NODE_PATH=/tmp/node_modules node _build/verify_tests.js uk bg sr
 *         (no args = every language marked ready in js/languages.js)
 */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const TESTS = ['iq', 'reaction-time', 'memory', 'pattern', 'color-vision',
               'big-five', 'eq', 'focus', 'typing'];

// Scripts that must never appear in the jsdom run: they reach the network,
// and a failed ad/analytics fetch is not a test failure.
const SKIP_SRC = /adsbygoogle|googletagmanager|googlesyndication|fundingchoices/i;

function readyLangs() {
  const s = fs.readFileSync(path.join(ROOT, 'js/languages.js'), 'utf8');
  const out = [];
  const re = /\s([a-z]{2}):\s*\{[^}]*ready:\s*true/g;
  let m;
  while ((m = re.exec(s))) out.push(m[1]);
  return out;
}

// Latin-script languages can't be checked by codepoint, so for those we
// assert the page is NOT byte-identical to English instead.
const SCRIPT_RE = {
  uk: /[Ѐ-ӿ]/, bg: /[Ѐ-ӿ]/, sr: /[Ѐ-ӿ]/,
  mk: /[Ѐ-ӿ]/, ru: /[Ѐ-ӿ]/,
  el: /[Ͱ-Ͽ]/, he: /[֐-׿]/,
  ar: /[؀-ۿ]/, fa: /[؀-ۿ]/,
  hi: /[ऀ-ॿ]/, th: /[฀-๿]/,
  ja: /[぀-ヿ一-鿿]/, zh: /[一-鿿]/,
  ko: /[가-힯]/,
};

function loadPage(lang, test) {
  const file = path.join(ROOT, lang === 'en' ? '' : lang, 'tests', test, 'index.html');
  if (!fs.existsSync(file)) throw new Error('missing page: ' + file);

  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<script[^>]*src="[^"]*"[^>]*>\s*<\/script>/g, tag =>
    SKIP_SRC.test(tag) ? '' : tag);

  const vc = new VirtualConsole();
  const errors = [];
  vc.on('jsdomError', e => errors.push(e.message));
  vc.on('error', (...a) => errors.push(a.join(' ')));

  const dom = new JSDOM(html, {
    url: 'https://coreskillai.com/' + (lang === 'en' ? '' : lang + '/') + 'tests/' + test + '/',
    runScripts: 'dangerously',
    resources: undefined,
    virtualConsole: vc,
    pretendToBeVisual: true,
navigator: undefined,
  });

  // jsdom implements neither matchMedia nor the Web Animations API. Both are
  // universal in real browsers, so stub them rather than let the harness
  // report a browser gap as a site defect.
  if (!dom.window.matchMedia) {
    dom.window.matchMedia = q => ({
      matches: false, media: q, onchange: null,
      addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
    });
  }
  if (!dom.window.Element.prototype.animate) {
    dom.window.Element.prototype.animate = () => ({ finished: Promise.resolve(), cancel() {}, play() {} });
  }
  if (!dom.window.IntersectionObserver) {
    // Fires the callback immediately as if everything were on screen, so any
    // reveal-on-scroll content is present in the text we assert against.
    dom.window.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this); }
      unobserve() {} disconnect() {} takeRecords() { return []; }
    };
  }
  if (!dom.window.ResizeObserver) {
    dom.window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  }
  if (!dom.window.scrollTo) dom.window.scrollTo = () => {};

  // jsdom does not fetch local <script src>, so feed them in by hand.
  const doc = dom.window.document;
  for (const s of [...doc.querySelectorAll('script[src]')]) {
    const src = s.getAttribute('src');
    if (SKIP_SRC.test(src)) continue;
    const p = path.join(ROOT, src.replace(/^\//, '').split('?')[0]);
    if (!fs.existsSync(p)) { errors.push('404 script: ' + src); continue; }
    try {
      dom.window.eval(fs.readFileSync(p, 'utf8'));
    } catch (e) {
      errors.push(src + ' threw: ' + e.message);
    }
  }
  doc.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));

  return { dom, doc, errors };
}

function visibleText(doc) {
  const main = doc.querySelector('main') || doc.body;
  return (main.textContent || '').replace(/\s+/g, ' ').trim();
}

// Tests whose substance is a QUESTION BANK rendered only after the visitor
// starts. The landing shell for these can be perfectly localised while every
// statement is still English - which is exactly what shipped: the 33 language
// banks sat in TRAIT_INFO/BRANCHES instead of ITEMS_I18N, so itemsFor() fell
// back to the English master on every market. Shell-only checks cannot see it.
const ITEM_TESTS = {
  'big-five': { api: 'B5Test', sel: '.question-text' },
  'eq':       { api: 'EQTest', sel: '.question-text' },
};

function firstQuestion(r, spec) {
  const api = r.dom.window[spec.api];
  if (!api || typeof api.start !== 'function') return null;
  try { api.start(); } catch (e) { return null; }
  const el = r.doc.querySelector(spec.sel);
  return el ? el.textContent.trim() : null;
}

function run(langs) {
  let fails = 0, checked = 0;
  const enText = {};
  const enFirstQ = {};
  for (const t of TESTS) {
    try { enText[t] = visibleText(loadPage('en', t).doc); } catch (e) { enText[t] = ''; }
  }
  for (const t of Object.keys(ITEM_TESTS)) {
    try { enFirstQ[t] = firstQuestion(loadPage('en', t), ITEM_TESTS[t]); } catch (e) { enFirstQ[t] = null; }
  }

  for (const lang of langs) {
    const bad = [];
    for (const test of TESTS) {
      checked++;
      let r;
      try {
        r = loadPage(lang, test);
      } catch (e) {
        bad.push(`${test}: ${e.message}`); continue;
      }
      if (r.errors.length) { bad.push(`${test}: ${r.errors[0]}`); continue; }

      const txt = visibleText(r.doc);
      if (txt.length < 120) { bad.push(`${test}: only ${txt.length} chars rendered`); continue; }

      const re = SCRIPT_RE[lang];
      if (re) {
        if (!re.test(txt)) { bad.push(`${test}: no native script in rendered text`); continue; }
      } else if (lang !== 'en' && txt === enText[test]) {
        bad.push(`${test}: rendered text identical to English`); continue;
      }

      // The QUESTIONS themselves must be localised, not just the shell.
      if (lang !== 'en' && ITEM_TESTS[test]) {
        const q = firstQuestion(r, ITEM_TESTS[test]);
        if (!q) { bad.push(`${test}: could not render a question`); continue; }
        if (enFirstQ[test] && q === enFirstQ[test]) {
          bad.push(`${test}: question bank is ENGLISH -> ${JSON.stringify(q.slice(0, 48))}`);
          continue;
        }
      }

      // The start control is what a visitor actually clicks. If it is missing
      // the page looks fine and does nothing.
      const hasStart = !!r.doc.querySelector(
        '#start, #startBtn, .start-btn, [data-start], button');
      if (!hasStart) { bad.push(`${test}: no start control`); continue; }
    }

    if (bad.length) {
      fails += bad.length;
      console.log(`FAIL ${lang}`);
      bad.forEach(b => console.log('       ' + b));
    } else {
      console.log(`ok   ${lang}  ${TESTS.length}/9 tests render`);
    }
  }

  console.log(`\n${checked} page loads, ${fails} problem(s)`);
  process.exit(fails ? 1 : 0);
}

const args = process.argv.slice(2);
run(args.length ? args : readyLangs());

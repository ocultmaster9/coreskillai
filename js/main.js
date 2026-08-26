/* ============================================================
   CoreSkillAI — Shared JS
   Theme, i18n, results utils
   ============================================================ */

/* ── Theme ─────────────────────────────────────────────── */
const Theme = {
  init() {
    const saved = localStorage.getItem('csa-theme');
    const pref  = saved || (window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
    this.set(pref);
  },
  set(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('csa-theme', t);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
  },
  toggle() {
    const cur = document.documentElement.getAttribute('data-theme');
    this.set(cur === 'dark' ? 'light' : 'dark');
  }
};

/* ── Language / i18n ────────────────────────────────────── */
// Right-to-left scripts. Everything else is LTR.
const RTL_LANGS = ['ar','fa','he','ur'];

const I18n = {
  lang: 'en',
  // SINGLE SOURCE OF TRUTH. The old code hardcoded the language list in three
  // separate places, so adding a language meant editing all three or getting
  // silent breakage. Derive it from the translations file instead.
  // Languages with real pages. Translations are loaded per-page (only en +
  // the current language), so Object.keys(TRANSLATIONS) is NOT the list.
  codes() {
    const reg = window.LANGS || {};
    const ready = Object.keys(reg).filter(c => reg[c].ready);
    return ready.length ? ready : Object.keys(window.TRANSLATIONS || { en: 1 });
  },
  prefixes() { return this.codes().filter(c => c !== 'en'); },
  init() {
    const VALID = this.codes();
    // 1. URL path wins (e.g. /es/tests/ -> 'es')
    const urlLang = location.pathname.split('/').find(s => this.prefixes().includes(s)) || null;
    // 2. window.PAGE_LANG set by template for lang pages
    const pageLang = (window.PAGE_LANG && VALID.includes(window.PAGE_LANG)) ? window.PAGE_LANG : null;
    // 3. localStorage, then browser
    const saved   = localStorage.getItem('csa-lang');
    const browser = (navigator.language || 'en').slice(0, 2);
    this.lang = urlLang || pageLang || (VALID.includes(saved) ? saved : (VALID.includes(browser) ? browser : 'en'));
    localStorage.setItem('csa-lang', this.lang);
    this.applyDir();
    this.buildSelector();
    this.apply();
    const sel = document.getElementById('lang-select');
    if (sel) sel.value = this.lang;
  },
  // Render the language <select> from window.LANGS so adding a market never
  // requires touching the HTML. Falls back to whatever is already in the markup.
  buildSelector() {
    const sel = document.getElementById('lang-select');
    const reg = window.LANGS;
    if (!sel || !reg) return;
    const have = this.codes();
    // Alphabetical by the name the user actually reads (the endonym), not by
    // language code - a Dutch speaker looks for "Nederlands", not "nl". Sorted
    // here at build time so the order can never drift out of the registry.
    sel.innerHTML = Object.keys(reg)
      .filter(c => have.includes(c))
      .sort((a, b) => reg[a].name.localeCompare(reg[b].name, 'en', { sensitivity: 'base' }))
      .map(c => `<option value="${c}" lang="${c}"${c === this.lang ? ' selected' : ''}>${reg[c].name}</option>`)
      .join('');
  },
  applyDir() {
    const rtl = RTL_LANGS.includes(this.lang);
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', this.lang);
  },
  set(lang) {
    localStorage.setItem('csa-lang', lang);
    // Navigate to language-prefixed version of current page
    const parts    = location.pathname.split('/').filter(Boolean);
    const hasLang  = this.prefixes().includes(parts[0]);
    const base     = hasLang ? parts.slice(1) : parts;
    const newPath  = lang === 'en'
      ? '/' + (base.length ? base.join('/') + '/' : '')
      : '/' + lang + '/' + (base.length ? base.join('/') + '/' : '');
    location.href = newPath;
  },
  t(key) {
    const T = window.TRANSLATIONS || {};
    return (T[this.lang] && T[this.lang][key]) || (T['en'] && T['en'][key]) || key;
  },
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
  }
};

/* ── Mobile nav ─────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const nav    = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) nav.classList.remove('open');
  });
}

/* ── Bell curve canvas ──────────────────────────────────── */
function drawBellCurve(canvasId, userPct, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const W    = canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
  const H    = canvas.height = (canvas.offsetWidth * 0.38) * window.devicePixelRatio;
  const dpr  = window.devicePixelRatio;
  ctx.scale(dpr, dpr);
  const w = W / dpr, h = H / dpr;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridC  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textC  = isDark ? 'rgba(255,255,255,0.4)'  : 'rgba(0,0,0,0.35)';
  const curveC = color || '#6366f1';

  ctx.clearRect(0,0,w,h);

  // grid lines
  ctx.strokeStyle = gridC; ctx.lineWidth = 1;
  [0.1,0.5,0.9].forEach(p => {
    ctx.beginPath(); ctx.moveTo(p*w, 0); ctx.lineTo(p*w, h*0.85); ctx.stroke();
  });

  // normal distribution bell curve (approx)
  function phi(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x > 0 ? 1 - p : p;
  }
  function invphi(p) {
    const a = [0,-3.969683028,220.9460984,-275.9285104,138.3577517,-30.66479806,2.506628277];
    const b = [-54.47609879,161.5858368,-155.6989798,66.80131188,-13.28068155];
    const c = [-0.007784894002,0.3224671290,2.445134137,3.754408661];
    const d2 = [0.01386718855,0.4135190484,1.246789061];
    const plow = 0.02425, phigh = 1 - plow;
    let q, r;
    if (p < plow) { q = Math.sqrt(-2*Math.log(p)); return (((c[0]*q+c[1])*q+c[2])*q+c[3]) / ((d2[0]*q+d2[1])*q+1); }
    if (p <= phigh) { q = p-0.5; r = q*q; return (((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1); }
    q = Math.sqrt(-2*Math.log(1-p)); return -(((c[0]*q+c[1])*q+c[2])*q+c[3]) / ((d2[0]*q+d2[1])*q+1);
  }

  const margin = 24, bh = h * 0.75;
  const xmin = -3.5, xmax = 3.5;
  function xToCanvas(x) { return margin + (x - xmin) / (xmax - xmin) * (w - 2*margin); }

  // fill up to user's z
  const pct = Math.max(1, Math.min(99, userPct)) / 100;
  const uz  = invphi(pct);
  const gaussY = x => Math.exp(-x*x/2) / Math.sqrt(2*Math.PI);
  const maxG   = gaussY(0);
  const toY    = v => h - 12 - (v / maxG) * bh;

  const steps = 200;
  const dx    = (xmax - xmin) / steps;

  // shaded area (user side)
  ctx.fillStyle = curveC + '28';
  ctx.beginPath();
  ctx.moveTo(xToCanvas(xmin), h - 12);
  for (let i = 0; i <= steps; i++) {
    const x = xmin + i * dx;
    if (x > uz) break;
    ctx.lineTo(xToCanvas(x), toY(gaussY(x)));
  }
  ctx.lineTo(xToCanvas(Math.min(uz, xmax)), h - 12);
  ctx.closePath();
  ctx.fill();

  // full curve
  ctx.beginPath();
  ctx.strokeStyle = curveC; ctx.lineWidth = 2.5;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + i * dx;
    const y = toY(gaussY(x));
    i === 0 ? ctx.moveTo(xToCanvas(x), y) : ctx.lineTo(xToCanvas(x), y);
  }
  ctx.stroke();

  // baseline
  ctx.beginPath(); ctx.strokeStyle = gridC; ctx.lineWidth = 1;
  ctx.moveTo(margin, h-12); ctx.lineTo(w-margin, h-12); ctx.stroke();

  // user marker
  if (uz <= xmax) {
    const ux = xToCanvas(uz);
    ctx.beginPath(); ctx.strokeStyle = curveC; ctx.lineWidth = 2;
    ctx.setLineDash([4,3]);
    ctx.moveTo(ux, toY(gaussY(uz))); ctx.lineTo(ux, h-12);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.fillStyle = curveC;
    ctx.arc(ux, h-12, 5, 0, Math.PI*2); ctx.fill();
  }

  // labels
  ctx.fillStyle = textC; ctx.font = `${11*dpr/dpr}px Inter, sans-serif`; ctx.textAlign = 'center';
  ['Bottom 25%','Average','Top 25%'].forEach((lbl, i) => {
    ctx.fillText(lbl, [0.1,0.5,0.9][i] * w, h);
  });
}

/* ── Score ring animation ───────────────────────────────── */
function animateRing(svgId, pct, color) {
  const fill = document.getElementById(svgId);
  if (!fill) return;
  const r   = 55;
  const circ = 2 * Math.PI * r;
  fill.style.stroke = color || '#6366f1';
  fill.setAttribute('stroke-dasharray', circ);
  fill.setAttribute('stroke-dashoffset', circ);
  setTimeout(() => {
    fill.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';
    fill.setAttribute('stroke-dashoffset', circ * (1 - Math.min(100, Math.max(0, pct)) / 100));
  }, 100);
}

/* ── Share ──────────────────────────────────────────────── */
function shareResult(text) {
  const url = window.location.href;
  const full = `${text} — Take the test: ${url}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(full).then(() => {
      const btn = document.getElementById('share-copy');
      if (btn) { btn.textContent = '✓ Copied!'; btn.classList.add('copied'); setTimeout(() => { btn.textContent = '📋 Copy Result'; btn.classList.remove('copied'); }, 2000); }
    });
  }
}
function shareTwitter(text) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'noopener');
}

/* ── Ordinal suffix (English share strings only) ─────────── */
function ordinal(n){
  n = Number(n);
  if (!isFinite(n)) return String(n);
  const r100 = n % 100, r10 = n % 10;
  if (r100 >= 11 && r100 <= 13) return n + 'th';
  if (r10 === 1) return n + 'st';
  if (r10 === 2) return n + 'nd';
  if (r10 === 3) return n + 'rd';
  return n + 'th';
}
window.ordinal = ordinal;

/* ── AdSense push ────────────────────────────────────────── */
function pushAds() {
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
}

/* ── Counter animation ──────────────────────────────────── */
function animateCount(el, target, duration) {
  if (!el) return;
  const start = Date.now();
  const step = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Intersection observer for animations ───────────────── */
function initFadeIns() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fade-in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.observe').forEach(el => obs.observe(el));
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  I18n.init();
  initMobileNav();
  initFadeIns();
  document.getElementById('theme-btn')?.addEventListener('click', () => Theme.toggle());
  document.getElementById('lang-select')?.addEventListener('change', e => I18n.set(e.target.value));
  // re-apply i18n after any dynamic content renders
  window.I18n = I18n;
  // animate stat counters on homepage
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCount(el, target, 1500); obs.disconnect(); }
    });
    obs.observe(el);
  });
  // Ad slots are pushed inline, immediately after each <ins> in the HTML -
  // the same shape that got calculator-free.com approved. Doing it here as
  // well would push each slot twice and AdSense throws
  // "All ins elements in the DOM with class=adsbygoogle already have ads in them".
});

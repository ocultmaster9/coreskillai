/* Item-response collection endpoint.
 *
 * WHY THIS EXISTS
 * Our IQ test currently has no standardisation sample, no measured reliability
 * and no empirical item statistics. Its difficulty ordering is a rule-count
 * heuristic I wrote, not measured human difficulty. None of that can be fixed by
 * writing better code - it can only be fixed with response data.
 *
 * With enough completions this gives us:
 *   - item difficulty (p-value) per rule signature
 *   - item discrimination (point-biserial against the person's total)
 *   - a Rasch / 2PL calibration
 *   - real Cronbach's alpha instead of the .85 currently ASSUMED to draw the
 *     confidence interval we show users
 *   - differential item functioning across 43 markets, which is the one study
 *     only we are positioned to run
 *
 * WHAT IS DELIBERATELY NOT STORED
 * No IP, no user agent, no cookie, no device or session identifier, no clock
 * time (day granularity only). We never read request.headers.get('cf-connecting-ip')
 * and we never persist anything Cloudflare puts on the request. An IP is
 * personal data under Breyer (CJEU C-582/14); a rule signature and a boolean is
 * not. Keeping it that way is what lets this stay anonymous statistics.
 *
 * WHERE THE BINDING LIVES
 * There are TWO things called "coreskillai" in the Cloudflare account: a Worker
 * with no routes, and the Pages project that actually serves the site. Bindings
 * added to the Worker do nothing here. The binding must be on
 *   Pages project -> Settings -> (Production) -> Bindings -> D1 -> RESPONSES
 * and it only takes effect on the NEXT deployment after it is saved.
 *
 * FAILS SAFE
 * If the D1 binding is absent - which is the case until someone creates the
 * database and binds it - this returns 204 and stores nothing. So it is safe to
 * deploy before the storage exists, and safe to deploy before the privacy policy
 * describes it. Nothing is collected until both are in place.
 */

const MAX_ITEMS = 60;
const MAX_BODY = 16 * 1024;
// Whitelist. A test missing from here has its data silently discarded, which
// is the right default for an open endpoint but easy to forget when adding
// a new test - the page works, the POST returns 204, and nothing is stored.
const TESTS = { iq: 1, pattern: 1, rotation: 1 };

const json = (obj, status) =>
  new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function onRequestPost({ request, env }) {
  // Always answer fast and never block the visitor's result screen.
  try {
    const len = parseInt(request.headers.get('content-length') || '0', 10);
    if (len > MAX_BODY) return new Response(null, { status: 204 });

    const body = await request.json();
    const rec = validate(body);
    if (!rec) return new Response(null, { status: 204 });

    // No binding yet -> accept and discard. Deploying this file changes nothing
    // until a D1 database called RESPONSES is bound to the Pages project.
    if (!env || !env.RESPONSES) return new Response(null, { status: 204 });

    const day = new Date().toISOString().slice(0, 10);   // date only, never a timestamp
    const ins = await env.RESPONSES.prepare(
      'INSERT INTO sessions (day, test, lang, n, raw, secs) VALUES (?,?,?,?,?,?)'
    ).bind(day, rec.test, rec.lang, rec.n, rec.raw, rec.secs).run();

    const sid = ins.meta && ins.meta.last_row_id;
    if (!sid) return new Response(null, { status: 204 });

    const stmt = env.RESPONSES.prepare(
      'INSERT INTO responses (session_id, pos, sig, difficulty, correct, ms) VALUES (?,?,?,?,?,?)'
    );
    await env.RESPONSES.batch(
      rec.items.map(it => stmt.bind(sid, it.p, it.sig, it.d, it.ok, it.ms))
    );
    return new Response(null, { status: 204 });
  } catch (e) {
    // A logging endpoint must never surface an error to the visitor.
    return new Response(null, { status: 204 });
  }
}

// Nothing from the client is trusted. Anyone can POST here, so the shape, the
// ranges and the vocabulary are all checked before a row is written. This keeps
// the dataset analysable rather than merely large.
function validate(b) {
  if (!b || typeof b !== 'object') return null;
  if (b.v !== 1) return null;
  if (!TESTS[b.test]) return null;
  if (!/^[a-z]{2}$/.test(b.lang || '')) return null;
  if (!Array.isArray(b.items)) return null;
  if (b.items.length < 1 || b.items.length > MAX_ITEMS) return null;

  const n = int(b.n, 1, MAX_ITEMS);
  const raw = int(b.raw, 0, MAX_ITEMS);
  const secs = b.secs === undefined ? 0 : int(b.secs, 0, 7200);
  if (n === null || raw === null || secs === null || raw > n) return null;
  if (b.items.length !== n) return null;

  const items = [];
  const seen = {};
  for (const it of b.items) {
    if (!it || typeof it !== 'object') return null;
    const p = int(it.p, 1, MAX_ITEMS);
    const d = int(it.d, 0, 40);
    // Present-but-invalid is rejected rather than coerced. A negative response
    // time means the payload was tampered with or the clock jumped; silently
    // writing 0 would hide that and quietly poison the timing data.
    const ms = it.ms === undefined ? 0 : int(it.ms, 0, 3600000);
    if (p === null || d === null || ms === null) return null;
    if (seen[p]) return null;                 // duplicate position = malformed
    seen[p] = 1;
    if (typeof it.sig !== 'string' || it.sig.length > 120) return null;
    if (!/^[a-z0-9:|_]+$/.test(it.sig)) return null;
    if (it.ok !== 0 && it.ok !== 1) return null;
    items.push({ p, sig: it.sig, d, ok: it.ok, ms });
  }
  // The claimed total has to match the responses, or the row is inconsistent.
  if (items.filter(i => i.ok === 1).length !== raw) return null;

  return { test: b.test, lang: b.lang, n, raw, secs, items };
}

function int(v, lo, hi) {
  if (typeof v !== 'number' || !isFinite(v)) return null;
  const x = Math.round(v);
  return x < lo || x > hi ? null : x;
}

// GET returns how much data exists, so progress toward a usable sample is
// visible without opening the Cloudflare dashboard.
export async function onRequestGet({ env }) {
  if (!env || !env.RESPONSES) return json({ storage: 'not configured', sessions: 0 });
  try {
    const r = await env.RESPONSES.prepare(
      'SELECT test, COUNT(*) AS n FROM sessions GROUP BY test'
    ).all();
    const total = await env.RESPONSES.prepare('SELECT COUNT(*) AS n FROM sessions').first();
    // Item responses matter more than sessions: calibration needs roughly 250
    // people for stable Rasch difficulties and 500-1000 for a 2PL model, and
    // each completed IQ test contributes 36 item responses toward that.
    const items = await env.RESPONSES.prepare('SELECT COUNT(*) AS n FROM responses').first();
    const sessions = (total && total.n) || 0;
    return json({
      storage: 'ok',
      sessions,
      itemResponses: (items && items.n) || 0,
      byTest: r.results || [],
      milestones: { rasch: 250, twoPL: 1000, remainingToRasch: Math.max(0, 250 - sessions) },
    });
  } catch (e) {
    return json({ storage: 'error' }, 200);
  }
}

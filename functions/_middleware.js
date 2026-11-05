/* Keep the *.pages.dev origin out of Google's index.
 *
 * WHY THIS IS A PAGES FUNCTION AND NOT THE WORKER
 * The coreskillai-canonical-fix Worker is routed on www.coreskillai.com, so
 * requests to coreskillai.pages.dev never reach it - that is exactly why the
 * pages.dev host still serves the un-rewritten apex canonical. Workers cannot
 * be routed onto *.pages.dev either, because that zone belongs to Cloudflare
 * rather than to us. A Pages Function runs on every request the project
 * serves, on BOTH hostnames, which is the only place this rule can live.
 *
 * WHY IT MATTERS
 * pages.dev served the entire 510-page site with "Allow: /" in robots.txt and
 * no noindex, so the preview origin was a crawlable duplicate of the whole
 * property. The canonical points at coreskillai.com and Google usually
 * consolidates on that, but "usually" is a bad bet ahead of an AdSense review
 * where duplicate/thin content is the most common rejection reason.
 *
 * SAFETY
 * The custom domain must never be noindexed - that would deindex the real
 * site. So the header is only ever ADDED, only on a .pages.dev hostname, and
 * every other request is passed straight through untouched. The deploy's
 * "Verify live" step asserts both halves of that on every push.
 */
/* RETIRED URLS -> 410 Gone
 * The domain used to host an AI-products / developer-tools site. Search
 * Console still lists 37 of those URLs as 404 and Google kept re-crawling
 * them into September, so the index mixes two unrelated sites. 410 tells
 * Google the removal is permanent and drops them faster than 404. Only exact
 * old paths and old-only prefixes are listed: /tests/, /blog/<current>/ and
 * /api/response must never match.
 */
const GONE_PREFIX = ['/products/', '/tools/', '/services/'];
const GONE_EXACT = new Set([
  '/products', '/tools', '/services', '/api/capture-email',
  '/blog/tax-refund-calculator-guide', '/blog/unscramble-tool-word-games',
  '/blog/why-ai-setups-fail-within-30-days',
  '/jwt-decoder', '/csv-to-json', '/text-diff', '/url-encoder',
  '/json-formatter', '/readability',
]);
function isGone(path) {
  const p = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return GONE_EXACT.has(p) || GONE_PREFIX.some(x => path.startsWith(x));
}
const GONE_HTML = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="robots" content="noindex"><title>Page removed | CoreSkillAI</title></head>' +
  '<body><h1>This page has been permanently removed</h1>' +
  '<p><a href="https://www.coreskillai.com/">Go to CoreSkillAI free brain tests</a></p></body></html>';

export async function onRequest(context) {
  let path = '/';
  try { path = new URL(context.request.url).pathname; } catch {}
  if (path === '/privacy-policy' || path === '/privacy-policy/') {
    return Response.redirect('https://www.coreskillai.com/privacy/', 301);
  }
  if (isGone(path)) {
    return new Response(GONE_HTML, { status: 410, headers: {
      'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }
  const response = await context.next();

  let hostname;
  try {
    hostname = new URL(context.request.url).hostname;
  } catch {
    return response; // never let this middleware be the reason a page fails
  }

  if (!hostname.endsWith('.pages.dev')) return response;

  // Headers on the original response can be immutable, so clone it.
  const out = new Response(response.body, response);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}

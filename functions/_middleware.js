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
export async function onRequest(context) {
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

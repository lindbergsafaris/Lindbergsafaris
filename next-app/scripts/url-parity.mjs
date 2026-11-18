/**
 * Cross-platform URL parity script for Lindberg Safaris Next.js migration.
 * Fetches https://www.lindbergsafaris.com/sitemap.xml, queries the local Next.js server
 * without following redirects, verifies status codes, redirect targets, and flags chains.
 */

const LOCAL_PORT = process.env.PORT || 3005;
const LOCAL_HOST = process.env.HOST || '127.0.0.1';
const LOCAL_BASE = `http://${LOCAL_HOST}:${LOCAL_PORT}`;
const LIVE_SITEMAP = 'https://www.lindbergsafaris.com/sitemap.xml';

async function fetchLiveSitemap() {
  console.log(`Fetching live sitemap from ${LIVE_SITEMAP}...`);
  const res = await fetch(LIVE_SITEMAP);
  if (!res.ok) {
    throw new Error(`Failed to fetch live sitemap: HTTP ${res.status}`);
  }
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

async function checkUrl(path) {
  const url = `${LOCAL_BASE}${path}`;
  const res = await fetch(url, { redirect: 'manual' });
  const status = res.status;
  const location = res.headers.get('location') || '';

  let chainLength = 1;
  let finalStatus = status;
  let nextTarget = location;

  // Check if redirect leads to another redirect (chain > 1 hop)
  if ([301, 302, 307, 308].includes(status) && location) {
    const nextUrl = location.startsWith('http') ? location : `${LOCAL_BASE}${location}`;
    try {
      const hopRes = await fetch(nextUrl, { redirect: 'manual' });
      finalStatus = hopRes.status;
      if ([301, 302, 307, 308].includes(finalStatus)) {
        chainLength = 2;
        nextTarget = `${location} -> ${hopRes.headers.get('location') || ''}`;
      }
    } catch {
      // ignore
    }
  }

  let flag = '';
  if (![200, 301, 308].includes(status)) {
    flag = `STATUS ${status}`;
  } else if (chainLength > 1) {
    flag = `CHAIN (${chainLength} hops)`;
  }

  return {
    path,
    status,
    location,
    chainLength,
    flag: flag || 'OK',
  };
}

async function main() {
  console.log(`Targeting local Next.js server at: ${LOCAL_BASE}`);
  const liveUrls = await fetchLiveSitemap();
  console.log(`Found ${liveUrls.length} URLs in live sitemap.\n`);

  const results = [];
  for (let i = 0; i < liveUrls.length; i++) {
    const fullUrl = liveUrls[i];
    let pathname = '/';
    try {
      const parsed = new URL(fullUrl);
      pathname = parsed.pathname || '/';
    } catch {
      pathname = fullUrl.replace('https://www.lindbergsafaris.com', '') || '/';
    }

    const res = await checkUrl(pathname);
    results.push(res);
  }

  // Print results table
  console.log(
    `${'Path'.padEnd(65)} | ${'Status'.padEnd(6)} | ${'Flag'.padEnd(10)} | Redirect Target`
  );
  console.log('-'.repeat(120));

  let count200 = 0;
  let countRedirect = 0;
  let countFlagged = 0;

  for (const r of results) {
    const statusStr = String(r.status).padEnd(6);
    const flagStr = r.flag.padEnd(10);
    const pathStr = r.path.padEnd(65);
    const locStr = r.location || '-';

    console.log(`${pathStr} | ${statusStr} | ${flagStr} | ${locStr}`);

    if (r.status === 200) count200++;
    else if ([301, 308].includes(r.status)) countRedirect++;

    if (r.flag !== 'OK') countFlagged++;
  }

  console.log('\n========================================');
  console.log('URL PARITY SUMMARY');
  console.log('========================================');
  console.log(`Total URLs Tested:       ${results.length}`);
  console.log(`HTTP 200 (Direct OK):    ${count200}`);
  console.log(`HTTP 301/308 (Redirect): ${countRedirect}`);
  console.log(`Flagged Issues:          ${countFlagged}`);
  console.log('========================================\n');

  if (countFlagged > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('URL Parity Error:', err);
  process.exit(1);
});

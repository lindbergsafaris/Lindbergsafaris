import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = process.env.VITE_SITE_URL || 'https://www.lindbergsafaris.com';

const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'tdpau1kt',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-01-01',
});

// ---------------------------------------------------------------------------
// Static routes: NO lastmod (we don't know when the code last changed, so
// omitting is more honest than stamping today's date). Google will discover
// the real date itself.
// ---------------------------------------------------------------------------
const staticRoutes = [
    { url: '/' },
    { url: '/tours' },
    { url: '/services' },
    { url: '/services/transport' },
    // /services/hotels is noindex — omitted from sitemap
    { url: '/services/hotel-booking' },
    { url: '/services/flights' },
    { url: '/services/visa' },
    { url: '/services/custom-itineraries' },
    { url: '/contact' },
    { url: '/blog' },
    { url: '/company' },
    // /quiz is noindex — omitted
    // /gallery is noindex — omitted
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Slugify a title into a URL-safe string */
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip diacritics
        .replace(/[^a-z0-9\s-]/g, '')   // keep alphanum, space, dash
        .trim()
        .replace(/\s+/g, '-')            // spaces → dashes
        .replace(/-+/g, '-');            // collapse consecutive dashes
}

/**
 * De-duplicate a URL list by loc.
 * If two entries share a loc, keep the one with the most-recent lastmod.
 */
function deduplicateUrls(urls) {
    const map = new Map();
    for (const u of urls) {
        const existing = map.get(u.loc);
        if (!existing) {
            map.set(u.loc, u);
        } else if (u.lastmod && (!existing.lastmod || u.lastmod > existing.lastmod)) {
            // More recent lastmod wins
            map.set(u.loc, u);
        }
    }
    const deduped = Array.from(map.values());
    // Report duplicates that were dropped
    if (deduped.length < urls.length) {
        console.warn(`⚠  Removed ${urls.length - deduped.length} duplicate URL(s) from sitemap.`);
    }
    return deduped;
}

// ---------------------------------------------------------------------------
// Slug collision resolver: given a base slug and a Set of already-used slugs,
// return a unique slug (appending -2, -3, … if needed).
// ---------------------------------------------------------------------------
function uniqueSlug(base, usedSlugs) {
    if (!usedSlugs.has(base)) {
        usedSlugs.add(base);
        return base;
    }
    let n = 2;
    while (usedSlugs.has(`${base}-${n}`)) n++;
    const s = `${base}-${n}`;
    usedSlugs.add(s);
    return s;
}

async function generateSitemap() {
    console.log('Generating sitemap.xml...');

    // Static pages — no lastmod
    const urls = staticRoutes.map(r => ({ loc: `${DOMAIN}${r.url}` }));

    try {
        // ----------------------------------------------------------------
        // Tours — use slug.current if present, fall back to _id
        // ----------------------------------------------------------------
        const tours = await client.fetch(
            '*[_type == "tour"]{ _id, "slug": slug.current, title, _updatedAt }'
        );
        const usedTourSlugs = new Set();
        tours.forEach((t) => {
            const raw = t.slug || t.title || t._id;
            const slug = uniqueSlug(slugify(raw), usedTourSlugs);
            urls.push({
                loc: `${DOMAIN}/tours/${slug}`,
                lastmod: (t._updatedAt || '').split('T')[0] || undefined,
            });
        });

        // ----------------------------------------------------------------
        // Blog Posts — use slug.current if present, fall back to _id
        // ----------------------------------------------------------------
        const posts = await client.fetch(
            '*[_type == "blogPost"]{ _id, "slug": slug.current, title, _updatedAt }'
        );
        const usedBlogSlugs = new Set();
        posts.forEach((p) => {
            const raw = p.slug || p.title || p._id;
            const slug = uniqueSlug(slugify(raw), usedBlogSlugs);
            urls.push({
                loc: `${DOMAIN}/blog/${slug}`,
                lastmod: (p._updatedAt || '').split('T')[0] || undefined,
            });
        });

        // ----------------------------------------------------------------
        // Regions (destination categories) — already use slug.current
        // ----------------------------------------------------------------
        const regions = await client.fetch(
            '*[_type == "destinationCategory"]{ "slug": slug.current, _updatedAt }'
        );
        regions.forEach((r) => {
            if (r.slug) {
                const slug = slugify(r.slug);
                urls.push({
                    loc: `${DOMAIN}/regions/${slug}`,
                    lastmod: (r._updatedAt || '').split('T')[0] || undefined,
                });
            }
        });

        // ----------------------------------------------------------------
        // Destinations — already use slug.current
        // Fix known typo: ambosseli → amboseli
        // ----------------------------------------------------------------
        const destinations = await client.fetch(
            '*[_type == "destinationPost"]{ "slug": slug.current, _updatedAt }'
        );
        destinations.forEach((d) => {
            if (d.slug) {
                // Fix typo in slug if still present in Sanity
                const slug = slugify(d.slug.replace('ambosseli', 'amboseli'));
                urls.push({
                    loc: `${DOMAIN}/destinations/${slug}`,
                    lastmod: (d._updatedAt || '').split('T')[0] || undefined,
                });
            }
        });

        // ----------------------------------------------------------------
        // Accommodations — generate slug from name; also emit category pages
        // ----------------------------------------------------------------
        const accommodations = await client.fetch(
            '*[_type == "accommodation"]{ _id, name, type, _updatedAt }'
        );
        const accTypes = new Set();
        const usedAccSlugs = new Set();
        accommodations.forEach((a) => {
            if (a.type) accTypes.add(a.type);
            const slug = uniqueSlug(slugify(a.name || a._id), usedAccSlugs);
            urls.push({
                loc: `${DOMAIN}/accommodation/${slug}`,
                lastmod: (a._updatedAt || '').split('T')[0] || undefined,
            });
        });
        accTypes.forEach((type) => {
            urls.push({ loc: `${DOMAIN}/accommodation/${type}` }); // no lastmod for category pages
        });

        // ----------------------------------------------------------------
        // Themed Packages — one URL per unique category
        // ----------------------------------------------------------------
        const themedPackages = await client.fetch(
            '*[_type == "themedPackage"]{ category, _updatedAt } | order(_updatedAt desc)'
        );
        const seenPackageCategories = new Set();
        themedPackages.forEach((pkg) => {
            if (pkg.category && !seenPackageCategories.has(pkg.category)) {
                seenPackageCategories.add(pkg.category);
                urls.push({
                    loc: `${DOMAIN}/packages/${pkg.category}`,
                    lastmod: (pkg._updatedAt || '').split('T')[0] || undefined,
                });
            }
        });

    } catch (err) {
        console.warn('Warning: Could not fetch dynamic routes from Sanity:', err.message);
    }

    // Deduplicate
    const deduped = deduplicateUrls(urls);

    // Detect any remaining duplicates (case + trailing slash variants)
    const normalized = deduped.map(u => u.loc.toLowerCase().replace(/\/$/, ''));
    const seen = new Set();
    const collisions = [];
    normalized.forEach((loc, i) => {
        if (seen.has(loc)) collisions.push(deduped[i].loc);
        seen.add(loc);
    });
    if (collisions.length > 0) {
        console.warn('⚠  Remaining near-duplicate URLs detected:', collisions);
    }

    // Build XML — only emit <lastmod> when we have a real date
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${deduped.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    // Write to public/
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

    // Also write to dist/ if it already exists
    const distDir = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
    }

    // robots.txt
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${DOMAIN}/sitemap.xml
`;
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
    if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
    }

    console.log(`✅ sitemap.xml: ${deduped.length} unique URLs | robots.txt updated`);
}

generateSitemap();

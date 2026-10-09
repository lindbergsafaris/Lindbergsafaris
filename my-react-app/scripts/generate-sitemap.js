import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://lindbergsafaris.com';

const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'tdpau1kt',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-01-01',
});

// Static routes on the site
const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/tours', priority: '0.9', changefreq: 'daily' },
    { url: '/services', priority: '0.8', changefreq: 'weekly' },
    { url: '/services/transport', priority: '0.8', changefreq: 'weekly' },
    { url: '/services/hotels', priority: '0.8', changefreq: 'weekly' },
    { url: '/services/hotel-booking', priority: '0.8', changefreq: 'weekly' },
    { url: '/services/flights', priority: '0.8', changefreq: 'weekly' },
    { url: '/services/visa', priority: '0.8', changefreq: 'weekly' },
    { url: '/services/custom-itineraries', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/quiz', priority: '0.7', changefreq: 'monthly' },
    { url: '/company', priority: '0.7', changefreq: 'monthly' },
    { url: '/gallery', priority: '0.7', changefreq: 'weekly' },
];

async function generateSitemap() {
    console.log('Generating sitemap.xml...');

    const today = new Date().toISOString().split('T')[0];
    const urls = [...staticRoutes.map(r => ({ loc: `${DOMAIN}${r.url}`, lastmod: today, priority: r.priority, changefreq: r.changefreq }))];

    try {
        // Fetch Tours
        const tours = await client.fetch('*[_type == "tour"]{ _id, _updatedAt }');
        tours.forEach((t) => {
            urls.push({
                loc: `${DOMAIN}/tours/${t._id}`,
                lastmod: (t._updatedAt || today).split('T')[0],
                priority: '0.9',
                changefreq: 'weekly',
            });
        });

        // Fetch Blog Posts
        const posts = await client.fetch('*[_type == "blogPost"]{ _id, _updatedAt }');
        posts.forEach((p) => {
            urls.push({
                loc: `${DOMAIN}/blog/${p._id}`,
                lastmod: (p._updatedAt || today).split('T')[0],
                priority: '0.8',
                changefreq: 'weekly',
            });
        });

        // Fetch Regions
        const regions = await client.fetch('*[_type == "destinationCategory"]{ "slug": slug.current, _updatedAt }');
        regions.forEach((r) => {
            if (r.slug) {
                urls.push({
                    loc: `${DOMAIN}/regions/${r.slug}`,
                    lastmod: (r._updatedAt || today).split('T')[0],
                    priority: '0.8',
                    changefreq: 'weekly',
                });
            }
        });

        // Fetch Destinations
        const destinations = await client.fetch('*[_type == "destinationPost"]{ "slug": slug.current, _updatedAt }');
        destinations.forEach((d) => {
            if (d.slug) {
                urls.push({
                    loc: `${DOMAIN}/destinations/${d.slug}`,
                    lastmod: (d._updatedAt || today).split('T')[0],
                    priority: '0.8',
                    changefreq: 'weekly',
                });
            }
        });

        // Fetch Accommodations
        const accommodations = await client.fetch('*[_type == "accommodation"]{ _id, type, _updatedAt }');
        const accTypes = new Set();
        accommodations.forEach((a) => {
            if (a.type) accTypes.add(a.type);
            urls.push({
                loc: `${DOMAIN}/accommodation/view/${a._id}`,
                lastmod: (a._updatedAt || today).split('T')[0],
                priority: '0.7',
                changefreq: 'monthly',
            });
        });
        accTypes.forEach((type) => {
            urls.push({
                loc: `${DOMAIN}/accommodation/${type}`,
                lastmod: today,
                priority: '0.7',
                changefreq: 'weekly',
            });
        });

        // Fetch Themed Packages
        const themedPackages = await client.fetch('*[_type == "themedPackage"]{ category, _updatedAt }');
        themedPackages.forEach((pkg) => {
            if (pkg.category) {
                urls.push({
                    loc: `${DOMAIN}/packages/${pkg.category}`,
                    lastmod: (pkg._updatedAt || today).split('T')[0],
                    priority: '0.8',
                    changefreq: 'weekly',
                });
            }
        });

    } catch (err) {
        console.warn('Warning: Could not fetch dynamic routes from Sanity during sitemap generation:', err.message);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Save to public directory
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

    // Save to dist if exists
    const distDir = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
    }

    // Create robots.txt
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

    console.log(`Successfully generated sitemap.xml (${urls.length} URLs) and robots.txt`);
}

generateSitemap();

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { build } from 'vite';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'tdpau1kt',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
});

async function runPrerender() {
    console.log('🚀 Starting SSG pre-rendering pipeline...');

    // 1. Build SSR bundle
    console.log('📦 Building SSR bundle...');
    await build({
        build: {
            ssr: 'src/entry-server.tsx',
            outDir: 'dist-ssr',
            minify: false,
        },
        ssr: {
            noExternal: true,
        }
    });

    const ssrEntryPath = path.resolve(__dirname, '../dist-ssr/entry-server.js');
    const { render } = await import(pathToFileURL(ssrEntryPath).href);

    // 2. Read client built index.html template
    const templatePath = path.resolve(__dirname, '../dist/index.html');
    if (!fs.existsSync(templatePath)) {
        throw new Error('dist/index.html not found! Run vite build first.');
    }
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    // 3. Fetch data from Sanity for fallbacks
    console.log('📡 Fetching content from Sanity CMS...');
    let tours = [], blogPosts = [], destinationCategories = [], destinationPosts = [], accommodations = [], themedPackages = [], heroSlides = [], partners = [], hotDeals = [], popupOffer = null, fleet = [], galleryImages = [];
    try {
        [tours, blogPosts, destinationCategories, destinationPosts, accommodations, themedPackages, heroSlides, partners, hotDeals, popupOffer, fleet, galleryImages] = await Promise.all([
            client.fetch(`*[_type == "tour"] | order(_createdAt desc) { _id, title, slug, duration, groupSize, price, featured, rating, reviews, "images": images[]{ url, alt }, "destination": destination->{ _id, name, slug }, description, itinerary }`),
            client.fetch(`*[_type == "blogPost"] | order(publishedAt desc) { _id, title, slug, excerpt, publishedAt, author, category, readTime, "featuredImage": featuredImage{ url, alt }, content }`),
            client.fetch(`*[_type == "destinationCategory"] | order(isFeatured desc, name asc) { _id, name, "slug": slug.current, description, isFeatured, "image": { "url": coalesce(imageUrl, image.asset->url) } }`),
            client.fetch(`*[_type == "destinationPost"] | order(title asc) { _id, title, "slug": slug.current, excerpt, "image": { "url": coalesce(imageUrl, image.asset->url) }, tourCount, content }`),
            client.fetch(`*[_type == "accommodation"] | order(name asc) { _id, name, type, location, pricePerNight, rating, "image": image{ url, alt }, description, amenities[]{ name, image{ url, alt } } }`),
            client.fetch(`*[_type == "themedPackage"] | order(_createdAt desc) { title, slug, category, "heroImage": heroImage{ url, alt }, description, content }`),
            client.fetch(`*[_type == "heroSlide"] | order(order asc, _createdAt desc) { _id, title, subtitle, image, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, order }`),
            client.fetch(`*[_type == "partner"] | order(order asc, _createdAt desc) { _id, name, logo, website, order }`),
            client.fetch(`*[_type == "hotDeal" && isActive == true] | order(_createdAt desc) { _id, title, whatsappNumber, whatsappMessage, dealExpiry, tag, "image": image{ url, alt } }`),
            client.fetch(`*[_type == "popupOffer" && isActive == true] | order(_createdAt desc)[0] { _id, title, description, "image": image { asset->, url, alt }, ctaText, ctaLink, isActive }`),
            client.fetch(`*[_type == "fleetVehicle"] | order(order asc, _createdAt desc) { _id, name, imageUrl, order }`),
            client.fetch(`*[_type == "galleryImage"] | order(order asc, _createdAt desc) { _id, title, location, category, imageUrl, order }`),
        ]);
    } catch (err) {
        console.warn('Warning fetching Sanity data during prerender:', err.message);
    }

    // Sort destinationCategories to put featured on top
    const sortedCategories = (destinationCategories || []).sort((a, b) => {
        const aFeat = a.isFeatured ? 1 : 0;
        const bFeat = b.isFeatured ? 1 : 0;
        if (bFeat !== aFeat) return bFeat - aFeat;
        return (a.name || '').localeCompare(b.name || '');
    });

    // Prepare global SWR fallback dictionary
    const globalFallback = {
        'tours': { data: tours },
        'blog': { data: blogPosts },
        'destinationCategories': { data: sortedCategories },
        'heroSlides': heroSlides,
        'partners': partners,
        'hotDeals': { data: hotDeals },
        'popupOffer': popupOffer,
        'fleet': { data: fleet },
        'galleryImages': galleryImages
    };

    // Build routes list
    const routes = [
        { url: '/' },
        { url: '/tours' },
        { url: '/services' },
        { url: '/services/transport' },
        { url: '/services/hotels' },
        { url: '/services/hotel-booking' },
        { url: '/services/flights' },
        { url: '/services/airticketing' },
        { url: '/services/visa' },
        { url: '/services/custom-itineraries' },
        { url: '/contact' },
        { url: '/blog' },
        { url: '/quiz' },
        { url: '/company' },
        { url: '/gallery' },
        { url: '/about' },
        { url: '/calling' },
        { url: '/impact' },
        { url: '/faqs' },
        { url: '/testimonials' }
    ];

    // Static Accommodation Category routes
    const accommodationCategories = ['lodges', 'holiday-homes', 'town-hotels', 'luxury-camps', 'resort-hotels', 'bush-camps'];
    accommodationCategories.forEach(type => {
        routes.push({
            url: `/accommodation/${type}`,
            fallback: { [`accommodations-${type}`]: { data: accommodations.filter(a => a.type === type) } }
        });
    });

    // Static Themed Package routes from header navigation
    const standardPackageCategories = ['wildlife', 'climbing', 'cruise', 'adventure', 'pilgrimages', 'corporate'];
    standardPackageCategories.forEach(cat => {
        const pkg = themedPackages.find(p => p.category === cat);
        routes.push({
            url: `/packages/${cat}`,
            fallback: {
                [`themed-package-${cat}`]: { data: pkg || null },
                [`packages-${cat}`]: { data: [] }
            }
        });
    });

    // Dynamic tour routes
    tours.forEach(t => {
        routes.push({
            url: `/tours/${t._id}`,
            fallback: { [`tour-${t._id}`]: { data: t } }
        });
    });

    // Dynamic blog routes
    blogPosts.forEach(b => {
        routes.push({
            url: `/blog/${b._id}`,
            fallback: { [`blog-${b._id}`]: { data: b } }
        });
    });

    // Dynamic region routes
    destinationCategories.forEach(c => {
        if (c.slug) {
            routes.push({
                url: `/regions/${c.slug}`,
                fallback: {
                    [`region-category-${c.slug}`]: { data: c },
                    [`region-posts-${c.slug}`]: { data: destinationPosts.filter(p => p.category?.slug?.current === c.slug || p.category === c.slug) }
                }
            });
        }
    });

    // Dynamic destination routes
    destinationPosts.forEach(d => {
        if (d.slug) {
            routes.push({
                url: `/destinations/${d.slug}`,
                fallback: {
                    [`destination-post-${d.slug}`]: { data: d }
                }
            });
        }
    });

    // Dynamic accommodation view routes
    accommodations.forEach(a => {
        routes.push({
            url: `/accommodation/view/${a._id}`,
            fallback: { [`accommodation-${a._id}`]: { data: a } }
        });
    });

    // Dynamic themed package routes (for any extra categories from Sanity)
    themedPackages.forEach(p => {
        if (p.category && !standardPackageCategories.includes(p.category)) {
            routes.push({
                url: `/packages/${p.category}`,
                fallback: {
                    [`themed-package-${p.category}`]: { data: p },
                    [`packages-${p.category}`]: { data: [] }
                }
            });
        }
    });

    console.log(`⚡ Pre-rendering ${routes.length} pages to HTML...`);

    let renderedCount = 0;
    for (const r of routes) {
        const routeFallback = { ...globalFallback, ...(r.fallback || {}) };
        try {
            const { html, helmet } = render(r.url, routeFallback);

            const helmetHead = `
                ${helmet?.title?.toString() || ''}
                ${helmet?.meta?.toString() || ''}
                ${helmet?.link?.toString() || ''}
                ${helmet?.script?.toString() || ''}
            `;

            // Clean existing title tags from template
            let finalHtml = templateHtml.replace(/<title[\s\S]*?<\/title>/gi, '');
            finalHtml = finalHtml.replace('</head>', `${helmetHead}\n</head>`);
            finalHtml = finalHtml.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${html}</div>`);

            // Output path setup
            const targetDir = r.url === '/'
                ? path.resolve(__dirname, '../dist')
                : path.resolve(__dirname, `../dist${r.url}`);

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const targetFilePath = r.url === '/'
                ? path.join(targetDir, 'index.html')
                : path.join(targetDir, 'index.html');

            fs.writeFileSync(targetFilePath, finalHtml, 'utf8');
            renderedCount++;
        } catch (err) {
            console.error(`Error rendering route ${r.url}:`, err.message);
        }
    }

    // Clean up temporary dist-ssr directory
    const ssrDir = path.resolve(__dirname, '../dist-ssr');
    if (fs.existsSync(ssrDir)) {
        fs.rmSync(ssrDir, { recursive: true, force: true });
    }

    console.log(`🎉 SSG pre-rendering completed successfully! Pre-rendered ${renderedCount} pages.`);
}

runPrerender().catch(err => {
    console.error('Fatal error during pre-rendering:', err);
    process.exit(1);
});

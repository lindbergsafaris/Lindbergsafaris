import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'tdpau1kt',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-01-01',
});

function countWords(text) {
    if (!text) return 0;
    if (typeof text !== 'string') {
        // PortableText array or objects
        if (Array.isArray(text)) {
            let str = '';
            for (const block of text) {
                if (block?.children) {
                    for (const child of block.children) {
                        if (child?.text) str += ' ' + child.text;
                    }
                }
            }
            return countWords(str);
        }
        return 0;
    }
    return text.trim().split(/\s+/).filter(Boolean).length;
}

async function run() {
    console.log('🔍 Scanning Sanity CMS records for thin content (< 150 words)...\n');

    const [tours, posts, dests, accs, cats, pkgs] = await Promise.all([
        client.fetch('*[_type == "tour"]{ _id, title, "slug": slug.current, description, itinerary }'),
        client.fetch('*[_type == "blogPost"]{ _id, title, "slug": slug.current, excerpt, content }'),
        client.fetch('*[_type == "destinationPost"]{ _id, title, "slug": slug.current, excerpt, content, description }'),
        client.fetch('*[_type == "accommodation"]{ _id, name, type, description }'),
        client.fetch('*[_type == "destinationCategory"]{ _id, name, "slug": slug.current, description }'),
        client.fetch('*[_type == "themedPackage"]{ _id, title, category, description, content }'),
    ]);

    const thinRecords = [];

    // Tours
    for (const t of tours) {
        const descWords = countWords(t.description);
        const itinWords = countWords(t.itinerary);
        const totalWords = descWords + itinWords;
        if (totalWords < 150) {
            thinRecords.push({
                type: 'tour',
                id: t._id,
                title: t.title,
                field: 'description + itinerary',
                words: totalWords,
                url: `/tours/${t.slug || t._id}`
            });
        }
    }

    // Blog
    for (const b of posts) {
        const excerptWords = countWords(b.excerpt);
        const contentWords = countWords(b.content);
        const totalWords = excerptWords + contentWords;
        if (totalWords < 150) {
            thinRecords.push({
                type: 'blogPost',
                id: b._id,
                title: b.title,
                field: 'content',
                words: totalWords,
                url: `/blog/${b.slug || b._id}`
            });
        }
    }

    // Destinations
    for (const d of dests) {
        const descWords = countWords(d.description || d.excerpt);
        const contentWords = countWords(d.content);
        const totalWords = descWords + contentWords;
        if (totalWords < 150) {
            thinRecords.push({
                type: 'destinationPost',
                id: d._id,
                title: d.title,
                field: 'description + content',
                words: totalWords,
                url: `/destinations/${d.slug || d._id}`
            });
        }
    }

    // Accommodations
    for (const a of accs) {
        const words = countWords(a.description);
        if (words < 150) {
            thinRecords.push({
                type: 'accommodation',
                id: a._id,
                title: a.name,
                field: 'description',
                words: words,
                url: `/accommodation/${a._id}`
            });
        }
    }

    // Destination Categories (Regions)
    for (const c of cats) {
        const words = countWords(c.description);
        if (words < 150) {
            thinRecords.push({
                type: 'destinationCategory',
                id: c._id,
                title: c.name,
                field: 'description',
                words: words,
                url: `/regions/${c.slug || c._id}`
            });
        }
    }

    // Themed Packages
    for (const p of pkgs) {
        const descWords = countWords(p.description);
        const contentWords = countWords(p.content);
        const totalWords = descWords + contentWords;
        if (totalWords < 150) {
            thinRecords.push({
                type: 'themedPackage',
                id: p._id,
                title: p.title || p.category,
                field: 'description + content',
                words: totalWords,
                url: `/packages/${p.category}`
            });
        }
    }

    console.log(`Found ${thinRecords.length} records with thin content (< 150 words):`);
    console.table(thinRecords);

    return thinRecords;
}

run();

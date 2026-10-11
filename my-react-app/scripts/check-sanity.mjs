import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'tdpau1kt',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
});

async function run() {
    const [tours, blogs, dests, accs, themed] = await Promise.all([
        client.fetch(`*[_type == "tour"]{ _id, title, slug }`),
        client.fetch(`*[_type == "blogPost"]{ _id, title, slug }`),
        client.fetch(`*[_type == "destinationPost"]{ _id, title, slug, "slugCurrent": slug.current }`),
        client.fetch(`*[_type == "accommodation"]{ _id, name, type, "slug": slug.current }`),
        client.fetch(`*[_type == "themedPackage"]{ _id, title, slug, category }`),
    ]);

    console.log('--- TOURS ---');
    console.log(tours.map(t => ({ id: t._id, title: t.title, slug: t.slug })));

    console.log('--- BLOGS ---');
    console.log(blogs.map(b => ({ id: b._id, title: b.title, slug: b.slug })));

    console.log('--- DESTINATIONS ---');
    console.log(dests.map(d => ({ id: d._id, title: d.title, slug: d.slug, slugCurrent: d.slugCurrent })));

    console.log('--- ACCOMMODATIONS (first 5) ---');
    console.log(accs.slice(0, 5).map(a => ({ id: a._id, name: a.name, type: a.type, slug: a.slug })));

    console.log('--- THEMED PACKAGES ---');
    console.log(themed.map(p => ({ id: p._id, title: p.title, slug: p.slug, category: p.category })));
}

run().catch(console.error);

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'tdpau1kt',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

async function run() {
  const [tours, posts, cats, dests, accs, pkgs] = await Promise.all([
    client.fetch('*[_type == "tour"]{ _id, title, "slug": slug.current, _updatedAt, description }'),
    client.fetch('*[_type == "blogPost"]{ _id, title, "slug": slug.current, _updatedAt, excerpt }'),
    client.fetch('*[_type == "destinationCategory"]{ _id, name, "slug": slug.current, _updatedAt, description }'),
    client.fetch('*[_type == "destinationPost"]{ _id, title, "slug": slug.current, _updatedAt, description, excerpt }'),
    client.fetch('*[_type == "accommodation"]{ _id, name, type, _updatedAt, description, location }'),
    client.fetch('*[_type == "themedPackage"]{ title, category, _updatedAt, description }'),
  ]);

  console.log('--- TOURS ---', tours.length);
  console.log(tours.map(t => ({ id: t._id, title: t.title, slug: t.slug })));

  console.log('--- BLOG POSTS ---', posts.length);
  console.log(posts.map(p => ({ id: p._id, title: p.title, slug: p.slug })));

  console.log('--- REGIONS ---', cats.length);
  console.log(cats.map(c => ({ name: c.name, slug: c.slug })));

  console.log('--- DESTINATIONS ---', dests.length);
  console.log(dests.map(d => ({ title: d.title, slug: d.slug })));

  console.log('--- ACCOMMODATIONS ---', accs.length);
  console.log(accs.map(a => ({ name: a.name, type: a.type })));

  console.log('--- PACKAGES ---', pkgs.length);
  console.log(pkgs.map(p => ({ title: p.title, category: p.category })));
}

run();

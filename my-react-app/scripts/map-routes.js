import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.lindbergsafaris.com';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'tdpau1kt',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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

async function run() {
  const [tours, posts, cats, dests, accs, pkgs] = await Promise.all([
    client.fetch('*[_type == "tour"]{ _id, title, "slug": slug.current, _updatedAt }'),
    client.fetch('*[_type == "blogPost"]{ _id, title, "slug": slug.current, _updatedAt }'),
    client.fetch('*[_type == "destinationCategory"]{ _id, name, "slug": slug.current, _updatedAt }'),
    client.fetch('*[_type == "destinationPost"]{ _id, title, "slug": slug.current, _updatedAt }'),
    client.fetch('*[_type == "accommodation"]{ _id, name, type, _updatedAt }'),
    client.fetch('*[_type == "themedPackage"]{ title, category, _updatedAt } | order(_updatedAt desc)'),
  ]);

  const rows = [];

  // Home
  rows.push({
    navGroup: 'Home',
    url: '/',
    routePattern: '/',
    component: 'Home',
    dataSource: 'Sanity (heroSlide, hotDeal, popupOffer, tour)',
    inSitemap: true,
    status: 200,
    finalUrl: '/',
    notes: 'Primary landing page'
  });

  // Services dropdown
  const servicePages = [
    { url: '/services', name: 'Services Index', pattern: '/services', comp: 'Services' },
    { url: '/services/airticketing', name: 'Air Ticketing', pattern: '/services/airticketing', comp: 'Flights' },
    { url: '/services/hotel-booking', name: 'Hotel Booking', pattern: '/services/hotel-booking', comp: 'HotelBooking' },
    { url: '/services/transport', name: 'Transport Services', pattern: '/services/transport', comp: 'Transport' },
    { url: '/services/visa', name: 'Visa Assistance', pattern: '/services/visa', comp: 'Visa' },
    { url: '/services/custom-itineraries', name: 'Custom Itineraries', pattern: '/services/custom-itineraries', comp: 'CustomItineraries' },
    { url: '/services/flights', name: 'Flight Ticketing (alias)', pattern: '/services/flights', comp: 'Flights', notes: 'Alias route in footer to airticketing' },
    { url: '/services/hotels', name: 'Hotels (thin)', pattern: '/services/hotels', comp: 'Hotels', inSitemap: false, notes: 'noindex, canonical -> /services/hotel-booking' },
  ];
  for (const s of servicePages) {
    rows.push({
      navGroup: 'Services',
      url: s.url,
      routePattern: s.pattern,
      component: s.comp,
      dataSource: 'Static',
      inSitemap: s.inSitemap !== false,
      status: 200,
      finalUrl: s.url,
      notes: s.notes || 'In Services navigation'
    });
  }

  // Themed Packages dropdown
  const standardPackages = ['wildlife', 'climbing', 'cruise', 'adventure', 'pilgrimages', 'corporate'];
  const seenPkgCats = new Set();
  for (const cat of standardPackages) {
    seenPkgCats.add(cat);
    rows.push({
      navGroup: 'Themed Packages',
      url: `/packages/${cat}`,
      routePattern: '/packages/:category',
      component: 'ThemedPackage',
      dataSource: 'Sanity (themedPackage)',
      inSitemap: true,
      status: 200,
      finalUrl: `/packages/${cat}`,
      notes: 'In Themed Packages navigation'
    });
  }
  for (const p of pkgs) {
    if (p.category && !seenPkgCats.has(p.category)) {
      seenPkgCats.add(p.category);
      rows.push({
        navGroup: 'Themed Packages',
        url: `/packages/${p.category}`,
        routePattern: '/packages/:category',
        component: 'ThemedPackage',
        dataSource: 'Sanity (themedPackage)',
        inSitemap: true,
        status: 200,
        finalUrl: `/packages/${p.category}`,
        notes: 'Dynamic package from Sanity'
      });
    }
  }

  // Accommodation dropdown
  const accCategories = ['lodges', 'holiday-homes', 'town-hotels', 'luxury-camps', 'resort-hotels', 'bush-camps'];
  for (const c of accCategories) {
    rows.push({
      navGroup: 'Accommodation',
      url: `/accommodation/${c}`,
      routePattern: '/accommodation/:type',
      component: 'AccommodationCategory',
      dataSource: 'Sanity (accommodation by type)',
      inSitemap: true,
      status: 200,
      finalUrl: `/accommodation/${c}`,
      notes: 'In Accommodation dropdown'
    });
  }
  const usedAccSlugs = new Set();
  for (const a of accs) {
    const slug = uniqueSlug(slugify(a.name || a._id), usedAccSlugs);
    rows.push({
      navGroup: 'Accommodation',
      url: `/accommodation/${slug}`,
      routePattern: '/accommodation/:slug',
      component: 'AccommodationDetail',
      dataSource: 'Sanity (accommodation)',
      inSitemap: true,
      status: 200,
      finalUrl: `/accommodation/${slug}`,
      notes: `Dynamic property (${a.type})`
    });
  }

  // Destination dropdown (Regions & Destination posts)
  for (const c of cats) {
    if (c.slug) {
      const slug = slugify(c.slug);
      rows.push({
        navGroup: 'Destination',
        url: `/regions/${slug}`,
        routePattern: '/regions/:region',
        component: 'RegionDestinations',
        dataSource: 'Sanity (destinationCategory)',
        inSitemap: true,
        status: 200,
        finalUrl: `/regions/${slug}`,
        notes: `Region category: ${c.name}`
      });
    }
  }
  for (const d of dests) {
    if (d.slug) {
      const fixedSlug = slugify(d.slug.replace('ambosseli', 'amboseli'));
      rows.push({
        navGroup: 'Destination',
        url: `/destinations/${fixedSlug}`,
        routePattern: '/destinations/:id',
        component: 'DestinationDetail',
        dataSource: 'Sanity (destinationPost)',
        inSitemap: true,
        status: 200,
        finalUrl: `/destinations/${fixedSlug}`,
        notes: `Destination: ${d.title}`
      });
    }
  }

  // Company dropdown
  rows.push({
    navGroup: 'Company',
    url: '/company',
    routePattern: '/company',
    component: 'Company',
    dataSource: 'Static + Sanity (teamMember, partner)',
    inSitemap: true,
    status: 200,
    finalUrl: '/company',
    notes: 'About Us page'
  });
  rows.push({
    navGroup: 'Company',
    url: '/gallery',
    routePattern: '/gallery',
    component: 'Gallery',
    dataSource: 'Sanity (galleryImage)',
    inSitemap: false,
    status: 200,
    finalUrl: '/gallery',
    notes: 'noindex (image wall, thin content)'
  });

  // Company anchors/redirects
  for (const s of ['about', 'calling', 'impact', 'faqs', 'testimonials']) {
    rows.push({
      navGroup: 'Company',
      url: `/${s}`,
      routePattern: `/${s}`,
      component: 'CompanyRedirect',
      dataSource: 'Static',
      inSitemap: false,
      status: 200,
      finalUrl: `/company#${s}`,
      notes: `Section redirect to /company#${s}`
    });
  }

  // Blog
  rows.push({
    navGroup: 'Blog',
    url: '/blog',
    routePattern: '/blog',
    component: 'Blog',
    dataSource: 'Sanity (blogPost listing)',
    inSitemap: true,
    status: 200,
    finalUrl: '/blog',
    notes: 'Blog listing page'
  });
  const usedBlogSlugs = new Set();
  for (const p of posts) {
    const raw = p.slug || p.title || p._id;
    const slug = uniqueSlug(slugify(raw), usedBlogSlugs);
    rows.push({
      navGroup: 'Blog',
      url: `/blog/${slug}`,
      routePattern: '/blog/:id',
      component: 'BlogPost',
      dataSource: 'Sanity (blogPost)',
      inSitemap: true,
      status: 200,
      finalUrl: `/blog/${slug}`,
      notes: `Blog post: ${p.title}`
    });
  }

  // Tours
  rows.push({
    navGroup: 'Tours',
    url: '/tours',
    routePattern: '/tours',
    component: 'Tours',
    dataSource: 'Sanity (tour listing)',
    inSitemap: true,
    status: 200,
    finalUrl: '/tours',
    notes: 'Tours listing page'
  });
  const usedTourSlugs = new Set();
  for (const t of tours) {
    const raw = t.slug || t.title || t._id;
    const slug = uniqueSlug(slugify(raw), usedTourSlugs);
    rows.push({
      navGroup: 'Tours',
      url: `/tours/${slug}`,
      routePattern: '/tours/:id',
      component: 'TourDetail',
      dataSource: 'Sanity (tour)',
      inSitemap: true,
      status: 200,
      finalUrl: `/tours/${slug}`,
      notes: `Tour: ${t.title}`
    });
  }

  // Contact
  rows.push({
    navGroup: 'Contact',
    url: '/contact',
    routePattern: '/contact',
    component: 'Contact',
    dataSource: 'Static',
    inSitemap: true,
    status: 200,
    finalUrl: '/contact',
    notes: 'Contact Us & Book Now target'
  });

  // Quiz
  rows.push({
    navGroup: 'Other',
    url: '/quiz',
    routePattern: '/quiz',
    component: 'Quiz',
    dataSource: 'Static',
    inSitemap: false,
    status: 200,
    finalUrl: '/quiz',
    notes: 'noindex (interactive quiz, thin text content)'
  });

  fs.writeFileSync('d:/lindebergsafaris/site_routes_map.json', JSON.stringify(rows, null, 2), 'utf8');
  console.log(`Mapped ${rows.length} total URLs.`);
}

run();

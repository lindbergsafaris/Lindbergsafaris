import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import JsonLd from '@/components/JsonLd';
import { getBlogPosts } from '@/lib/data';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Safari Journal & Travel Guides',
  description: 'Read expert Kenya safari travel guides, wildlife photography tips, itinerary planning advice, and safari stories from Lindberg Safaris. Get inspired.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Safari Journal & Travel Guides | Lindberg Safaris',
    description: 'Read expert Kenya safari travel guides, wildlife photography tips, and safari stories from Lindberg Safaris.',
    url: `${SITE_URL}/blog`,
  },
  twitter: { card: 'summary_large_image' },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Lindberg Safaris Journal & Travel Blog',
    url: `${SITE_URL}/blog`,
    description: 'Expert safari travel guides, wildlife photography tips, and East Africa travel stories.',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug?.current || post._id}`,
      datePublished: post.publishedAt,
      image: post.featuredImage?.url,
    })),
  };

  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Blog', url: '/blog' },
  ]);

  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd schema={breadcrumbsSchema} />
      <div className="bg-primary text-white py-20">
        <Container>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Kenya Safari Journal &amp; Travel Blog</h1>
          <p className="text-lg text-gray-100 max-w-2xl">
            Stories, tips, and inspiration from the heart of Africa.
          </p>
        </Container>
      </div>

      <Section className="bg-white">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No blog posts found.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for new safari stories.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-8">
              {posts.map((post) => {
                const postSlug = post.slug?.current || post._id;
                const imageUrl = post.featuredImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                return (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(33.333%-2rem)]"
                  >
                    <div className="h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                          {post.category || 'General'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                      <h2 className="text-xl font-bold mb-3 line-clamp-2">
                        <Link href={`/blog/${postSlug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={16} />
                          {post.author || 'Lindberg Safaris'}
                        </div>
                        <Link
                          href={`/blog/${postSlug}`}
                          className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Read More <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

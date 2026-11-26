import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import JsonLd from '@/components/JsonLd';
import { getBlogPostBySlug, getBlogPostById, getAllBlogSlugs, getRedirectForPath } from '@/lib/data';
import { isUUID, slugify } from '@/lib/slugUtils';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  const cleanSlugs = Array.from(new Set(slugs.map((s) => slugify(s)).filter(Boolean)));
  return cleanSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isUUID(slug)) {
    const post = await getBlogPostById(slug);
    if (post?.slug?.current) {
      return {
        title: `${post.title} | Lindberg Safaris`,
        alternates: { canonical: `${SITE_URL}/blog/${slugify(post.slug.current)}` },
      };
    }
  }

  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Blog Post Not Found | Lindberg Safaris' };

  const cleanSlug = slugify(post.slug?.current || post.title || slug);
  const postImage = post.featuredImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801';
  const description = post.excerpt ? post.excerpt.slice(0, 155) : 'Read this article from Lindberg Safaris.';
  const postUrl = `${SITE_URL}/blog/${cleanSlug}`;

  return {
    title: `${post.title} | Lindberg Safaris`,
    description,
    alternates: { canonical: postUrl },
    openGraph: {
      title: `${post.title} | Lindberg Safaris`,
      description,
      url: postUrl,
      images: [{ url: postImage, width: 1200, height: 630, alt: post.title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Lindberg Safaris`,
      description,
      images: [postImage],
    },
  };
}

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getGoogleDriveEmbedUrl = (url: string) => {
  if (url.includes('drive.google.com')) {
    const id = url.match(/\/d\/(.+?)\//);
    if (id) return `https://drive.google.com/file/d/${id[1]}/preview`;
  }
  return url;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  if (isUUID(slug)) {
    const post = await getBlogPostById(slug);
    if (post?.slug?.current) {
      permanentRedirect(`/blog/${slugify(post.slug.current)}`);
    }
    const redir = await getRedirectForPath(`/blog/${slug}`);
    if (redir) permanentRedirect(redir.new_path);
    notFound();
  }

  // If dirty slug (contains spaces, uppercase or percent-encoded), 308 redirect to clean slug
  const decodedSlug = decodeURIComponent(slug);
  const cleanSlug = slugify(decodedSlug);
  if (slug !== cleanSlug && decodedSlug !== cleanSlug) {
    permanentRedirect(`/blog/${cleanSlug}`);
  }

  const post = await getBlogPostBySlug(slug);
  if (!post) {
    const redir =
      (await getRedirectForPath(`/blog/${slug}`)) ||
      (await getRedirectForPath(`/blog/${cleanSlug}`));
    if (redir) permanentRedirect(redir.new_path);
    notFound();
  }

  const postImage = post.featuredImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801';
  const canonicalUrl = `${SITE_URL}/blog/${cleanSlug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || `${post.title} by Lindberg Safaris`,
    image: [postImage],
    datePublished: post.publishedAt || new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    author: {
      '@type': 'Person',
      name: post.author || 'Lindberg Safaris',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lindberg Safaris',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${cleanSlug}` },
  ]);

  return (
    <>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbsSchema} />
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {post.featuredImage?.url && (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>
        )}

        <Container className="relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} /> Back to Journal
          </Link>

          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center gap-4 text-sm text-gray-200 mb-4">
              <span className="bg-white/10 text-white px-3 py-1 rounded-full font-medium backdrop-blur-sm border border-white/10">
                {post.category || 'General'}
              </span>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
              </div>
              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {post.readTime}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-t border-white/20 pt-8 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-gray-200 border border-white/10 overflow-hidden">
                  <User size={24} />
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">{post.author || 'Lindberg Safaris'}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">Safari Expert</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Section className="bg-white pt-16">
        <Container>
          <div className="max-w-[1100px] mx-auto">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-primary prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 transition-colors">
              {Array.isArray(post.content) ? (
                <PortableText
                  value={post.content}
                  components={{
                    types: {
                      externalImage: ({ value }) => (
                        <figure className="my-12 flex flex-col items-center">
                          <div className="w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={value.url}
                              alt={value.alt || ''}
                              className="w-full h-auto rounded-xl shadow-2xl"
                            />
                            {value.caption && (
                              <figcaption className="mt-4 text-center text-sm text-gray-500 italic">
                                {value.caption}
                              </figcaption>
                            )}
                          </div>
                        </figure>
                      ),
                      videoEmbed: ({ value }) => {
                        const youtubeId = getYoutubeId(value.url);
                        const driveUrl = getGoogleDriveEmbedUrl(value.url);

                        return (
                          <figure className="my-12">
                            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
                              {youtubeId ? (
                                <iframe
                                  src={`https://www.youtube.com/embed/${youtubeId}`}
                                  title="YouTube video player"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full"
                                />
                              ) : (
                                <iframe
                                  src={driveUrl}
                                  className="w-full h-full"
                                  allow="autoplay"
                                  allowFullScreen
                                />
                              )}
                            </div>
                            {value.caption && (
                              <figcaption className="mt-4 text-center text-sm text-gray-500 italic">
                                {value.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      },
                    },
                  }}
                />
              ) : post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="text-gray-600 italic">Full story coming soon.</p>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

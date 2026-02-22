import useSWR from 'swr';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, Share2, ArrowLeft } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import api from '@/lib/api';
import { BlogPost as BlogPostType } from '@/types';

// Helper to extract YouTube video ID
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper for Google Drive video embed
const getGoogleDriveEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
        const id = url.match(/\/d\/(.+?)\//);
        if (id) return `https://drive.google.com/file/d/${id[1]}/preview`;
    }
    return url;
};

const BlogPost = () => {
    const { id } = useParams();
    const { data: postData, error: postError } = useSWR<{ data: BlogPostType }>(id ? `blog-${id}` : null, () => api.blog.getById(id!));
    const post = postData?.data || null;
    const loading = !postData && !postError;
    const error = postError ? (postError as Error).message || 'Failed to load blog post' : null;

    if (loading) {
        return (
            <Layout>
                <Section>
                    <Container>
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-gray-600">Loading blog post...</p>
                        </div>
                    </Container>
                </Section>
            </Layout>
        );
    }

    if (error || !post) {
        return (
            <Layout>
                <Section>
                    <Container>
                        <div className="max-w-2xl mx-auto">
                            <Link to="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors">
                                <ArrowLeft size={20} /> Back to Journal
                            </Link>
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                                <p className="font-bold">Error loading blog post</p>
                                <p className="text-sm">{error || 'Blog post not found'}</p>
                            </div>
                        </div>
                    </Container>
                </Section>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Image */}
                {post.featuredImage?.url && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={post.featuredImage.url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                    </div>
                )}

                <Container className="relative z-10">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-200 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={20} /> Back to Journal
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 text-sm text-gray-200 mb-4">
                            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-medium backdrop-blur-sm border border-white/10">
                                {post.category || 'General'}
                            </span>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                {new Date(post.publishedAt).toLocaleDateString()}
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
                                    <div className="font-bold text-white mb-0.5">{post.author}</div>
                                    <div className="text-xs text-gray-300 uppercase tracking-wider">Safari Expert</div>
                                </div>
                            </div>
                            <button className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            <Section className="bg-primary pt-16">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-gray-100 prose-p:leading-relaxed prose-a:text-accent hover:prose-a:text-accent/80 transition-colors">
                            {Array.isArray(post.content) ? (
                                <PortableText
                                    value={post.content}
                                    components={{
                                        types: {
                                            externalImage: ({ value }) => (
                                                <figure className="my-12 flex flex-col items-center">
                                                    <div className="max-w-2xl w-full">
                                                        <img
                                                            src={value.url}
                                                            alt={value.alt || ''}
                                                            className="w-full h-auto rounded-xl shadow-2xl"
                                                        />
                                                        {value.caption && (
                                                            <figcaption className="mt-4 text-center text-sm text-gray-400 italic">
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
                                                            <figcaption className="mt-4 text-center text-sm text-gray-400 italic">
                                                                {value.caption}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                );
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            )}
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default BlogPost;

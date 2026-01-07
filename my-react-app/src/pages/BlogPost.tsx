import useSWR from 'swr';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, Share2, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import api from '@/lib/api';
import { BlogPost as BlogPostType } from '@/types';

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
            <div className="bg-primary py-12">
                <Container>
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-200 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={20} /> Back to Journal
                    </Link>

                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 text-sm text-gray-200 mb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{post.category || 'General'}</span>
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

                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 text-white leading-tight">{post.title}</h1>

                        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-200">
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{post.author}</div>
                                    <div className="text-xs text-gray-300">Safari Expert</div>
                                </div>
                            </div>
                            <button className="text-gray-300 hover:text-white transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            {post.featuredImage?.url && (
                <div className="relative h-[50vh] min-h-[400px]">
                    <img
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <Section className="bg-primary">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div
                            className="prose prose-lg prose-invert max-w-none whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default BlogPost;

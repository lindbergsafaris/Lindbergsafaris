import useSWR from 'swr';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { BlogPost } from '@/types';

const Blog = () => {
    const { data: postsData, error: postsError } = useSWR<{ data: BlogPost[] }>('blog', () => api.blog.getAll());
    const posts = postsData?.data || [];
    const loading = !postsData && !postsError;
    const error = postsError ? (postsError as Error).message || 'Failed to load blog posts' : null;

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Layout>
            <div className="bg-gray-900 text-white py-20">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Safari Journal</h1>
                    <p className="text-lg text-gray-300 max-w-2xl">
                        Stories, tips, and inspiration from the heart of Africa.
                    </p>
                </Container>
            </div>

            <Section>
                <Container>


                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                            <p className="font-bold">Error loading blog posts</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {!error && posts.length === 0 && (
                        <div className="text-center py-20 bg-secondary rounded-lg">
                            <p className="text-gray-600 text-lg">No blog posts found.</p>
                            <p className="text-gray-500 text-sm mt-2">Add blog posts in Sanity Studio.</p>
                        </div>
                    )}

                    {!error && posts.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <div key={post._id} className="bg-secondary-light rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                                alt={post.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{post.category || 'General'}</span>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(post.publishedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 line-clamp-2">
                                                <Link to={`/blog/${post._id}`} className="hover:text-primary transition-colors">
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User size={16} />
                                                    {post.author}
                                                </div>
                                                <Link to={`/blog/${post._id}`} className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                                    Read More <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <Button variant="outline">Load More Stories</Button>
                            </div>
                        </>
                    )}
                </Container>
            </Section>
        </Layout>
    );
};

export default Blog;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import TourCard from '@/components/tours/TourCard';
import api from '@/lib/api';
import { PortableText } from '@portabletext/react';

const ThemedPackage = () => {
    const { category } = useParams();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        window.scrollTo(0, 0);
    }, [category]);

    // Fetch the "About" content for this themed package category
    const { data: themedPackageData, error: themeError } = useSWR(
        category ? `themed-package-${category}` : null,
        () => api.themedPackages.getByCategory(category!)
    );

    // Fetch the actual tour packages for this category
    const { data: packagesData, error: packagesError } = useSWR(
        category ? `packages-${category}` : null,
        () => api.packages.getByCategory(category!)
    );

    const themedPackage = themedPackageData?.data;
    const packages = packagesData?.data || [];
    const loading = (!themedPackageData && !themeError) || (!packagesData && !packagesError);

    if (!mounted) return null;

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    // Fallback if no specific content is created yet in Sanity
    const title = themedPackage?.title || category?.replace('-', ' ') || 'Themed Package';
    const description = themedPackage?.description || 'Explore our curated packages.';
    const heroImage = themedPackage?.heroImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80';

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("${heroImage}")` }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 capitalize">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
                        {description}
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
                            Plan Your Trip
                        </Button>
                    </Link>
                </Container>
            </div>

            {/* Content Section */}
            <Section className="bg-white py-20">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Main Content */}
                        <div className="lg:w-2/3">
                            {themedPackage?.content && (
                                <div className="prose prose-lg text-gray-600 leading-relaxed mb-12">
                                    <PortableText value={themedPackage.content} />
                                </div>
                            )}

                            {/* Package List */}
                            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Available Packages</h3>
                            {packages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {packages.map((pkg: any) => (
                                        <TourCard
                                            key={pkg._id}
                                            id={pkg._id}
                                            title={pkg.title}
                                            image={pkg.image?.url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                            duration={pkg.duration}
                                            groupSize="Contact us"
                                            price={pkg.price}
                                            rating={0}
                                            reviews={0}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No specific packages listed for this category yet. Contact us for a custom itinerary!</p>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="bg-accent text-white p-8 rounded-xl text-center sticky top-24">
                                <h3 className="text-2xl font-serif font-bold mb-4">Ready to go?</h3>
                                <p className="mb-6 text-white/90">Contact us today to start planning your dream {title}.</p>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                        Get a Quote
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default ThemedPackage;

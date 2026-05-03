import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import TourCard from '@/components/tours/TourCard';
import api from '@/lib/api';
import { PortableText } from '@portabletext/react';
import { getWhatsAppLink } from '@/lib/utils';

const ThemedPackage = () => {
    const { t } = useTranslation(['common', 'home']);
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

    const { data: popupOffer } = useSWR('popupOffer', () => api.popup.getAll());

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
            <div className="relative min-h-[600px] flex items-center justify-center text-white pt-28 pb-16">
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
                                    <PortableText
                                        value={themedPackage.content}
                                        components={{
                                            types: {
                                                image: ({ value }: any) => {
                                                    if (!value?.url) return null;
                                                    return (
                                                        <div className="flex justify-center my-8">
                                                            <img
                                                                src={value.url}
                                                                alt={value.alt || 'Themed Package Image'}
                                                                className="w-3/5 h-auto rounded-lg shadow-md"
                                                            />
                                                        </div>
                                                    );
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Package List - Only show if there are actual packages to display */}
                            {packages.length > 0 && (
                                <>
                                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Available Packages</h3>
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
                                </>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 bg-primary rounded-3xl p-8 flex flex-col h-fit lg:h-auto gap-8">
                            <div className="sticky top-32 z-10 space-y-8">
                                <div className="bg-accent text-white p-8 rounded-2xl text-center shadow-xl">
                                    <h3 className="text-2xl font-serif font-bold mb-4">Ready to go?</h3>
                                    <p className="mb-6 text-white/90">Contact us today to start planning your dream {title}.</p>
                                    <Link to="/contact">
                                        <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                            Get a Quote
                                        </Button>
                                    </Link>
                                </div>

                                {/* Static Exclusive Offer Card */}
                                {popupOffer && popupOffer.image && (
                                    <div
                                        className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                                        onClick={() => {
                                            if (popupOffer.ctaLink) {
                                                window.location.href = popupOffer.ctaLink;
                                            } else {
                                                const message = `Hello Lindberg Safaris! I want to claim the exclusive offer: "${popupOffer.title}". Please provide more details.`;
                                                window.open(getWhatsAppLink(message), '_blank');
                                            }
                                        }}
                                    >
                                        <div className="relative">
                                            <img
                                                src={popupOffer.image.url}
                                                alt={popupOffer.title}
                                                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        </div>
                                        <div className="p-4 bg-white text-center border-t border-gray-100">
                                            <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] italic mb-1">
                                                {t('home:hotDeals.badge') || 'Limited Time Offer'}
                                            </p>
                                            <p className="text-gray-900 font-bold text-sm line-clamp-1">{popupOffer.title}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex justify-center flex-shrink-0">
                                <img
                                    src="/logo.png"
                                    alt="Lindberg Safaris"
                                    className="h-28 w-auto opacity-30 brightness-0 invert"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default ThemedPackage;

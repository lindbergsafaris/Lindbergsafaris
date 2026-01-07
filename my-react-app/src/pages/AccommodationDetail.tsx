import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Star, MapPin, Check, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { getWhatsAppLink } from '@/lib/utils';
import { Image, AccommodationSection, Accommodation } from '@/types';
import LoadingScreen from '@/components/ui/LoadingScreen';

const AccommodationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: accommodationData, error: accommodationError } = useSWR<{ data: Accommodation }>(id ? `accommodation-${id}` : null, () => api.accommodations.getById(id!));
    const accommodation = accommodationData?.data || null;
    const loading = !accommodationData && !accommodationError;
    const error = accommodationError ? (accommodationError as Error).message || 'Failed to load accommodation details.' : null;

    if (loading) return <LoadingScreen />;

    if (error || !accommodation) {
        return (
            <Layout>
                <Container className="py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Accommodation Not Found</h2>
                    <p className="text-gray-600 mb-8">{error || "The accommodation you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={accommodation.image?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                        alt={accommodation.name}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <Container className="relative h-full flex flex-col justify-end pb-16 text-white">
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/20 w-fit mb-6 pl-0 hover:pl-4 transition-all"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary-light mb-2">
                                <MapPin size={18} />
                                <span>{accommodation.location}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{accommodation.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <Star size={16} className="text-accent fill-accent" />
                                    <span className="font-bold">{accommodation.rating || 5}.0</span>
                                </div>
                                <span className="text-gray-300 capitalize">{accommodation.type?.replace('-', ' ')}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="text-right">
                                <span className="text-sm text-gray-300 block">Starting from</span>
                                <span className="text-3xl font-bold text-primary">KSH {accommodation.pricePerNight || accommodation.priceRange || 'On Request'}</span>
                                <span className="text-sm text-gray-300"> / night</span>
                            </div>
                            <Button
                                size="lg"
                                onClick={() => window.open(getWhatsAppLink(`I am interested in booking ${accommodation.name} in ${accommodation.location}`), '_blank')}
                            >
                                Book Now
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <h2 className="text-3xl font-serif font-bold mb-6 text-white">About this Place</h2>
                                <div className="prose prose-lg text-gray-100 leading-relaxed">
                                    {accommodation.description ? (
                                        <p>{accommodation.description}</p>
                                    ) : (
                                        <p>Experience the ultimate in comfort and style at {accommodation.name}. Nestled in the heart of {accommodation.location}, this accommodation offers a perfect blend of modern amenities and authentic African charm.</p>
                                    )}
                                </div>
                            </div>

                            {/* Gallery (if available) */}
                            {accommodation.gallery && accommodation.gallery.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-serif font-bold mb-6 text-white">Gallery</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {accommodation.gallery.map((img: Image, idx: number) => (
                                            <div key={idx} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <img src={img.url} alt={img.alt || `Gallery image ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Amenities (Mock if not in schema yet) */}
                            <div>
                                <h3 className="text-2xl font-serif font-bold mb-6 text-white">Amenities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {accommodation.amenities ? (
                                        accommodation.amenities.map((amenity: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-100">
                                                <div className="bg-primary/10 p-1 rounded-full text-primary">
                                                    <Check size={14} />
                                                </div>
                                                <span>{amenity}</span>
                                            </div>
                                        ))
                                    ) : (
                                        // Default amenities if none provided
                                        ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Bar/Lounge', 'Room Service', 'Airport Shuttle', 'Air Conditioning', 'Laundry Service'].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-100">
                                                <div className="bg-primary/10 p-1 rounded-full text-primary">
                                                    <Check size={14} />
                                                </div>
                                                <span>{item}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* Sections (Sub-pages) */}
                            {accommodation.sections && accommodation.sections.length > 0 && (
                                <div className="space-y-12">
                                    {accommodation.sections.map((section: AccommodationSection, idx: number) => (
                                        <div key={idx} className="border-t border-gray-100 pt-8">
                                            <h3 className="text-2xl font-serif font-bold mb-4 text-white">{section.title}</h3>
                                            {section.content && (
                                                <div className="prose prose-lg text-gray-100 leading-relaxed mb-6">
                                                    <p>{section.content}</p>
                                                </div>
                                            )}
                                            {section.images && section.images.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {section.images.map((img: Image, imgIdx: number) => (
                                                        <div key={imgIdx} className="rounded-lg overflow-hidden h-64">
                                                            <img src={img.url} alt={img.alt || section.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-secondary p-8 rounded-xl sticky top-24 border border-gray-100">
                                <h3 className="text-xl font-bold mb-6 text-gray-900">Book Your Stay</h3>
                                <p className="text-gray-600 mb-8 text-sm">
                                    Contact us directly to check availability and get the best rates for your dates.
                                </p>
                                <Button
                                    className="w-full mb-4"
                                    onClick={() => window.open(getWhatsAppLink(`I am interested in booking ${accommodation.name} in ${accommodation.location}`), '_blank')}
                                >
                                    Book via WhatsApp
                                </Button>
                                <div className="text-center">
                                    <span className="text-xs text-gray-500">Instant confirmation & support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default AccommodationDetail;

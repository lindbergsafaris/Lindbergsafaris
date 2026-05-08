import { useState } from 'react';
import useSWR from 'swr';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import { Map, X, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { GalleryImage } from '@/types';

// Simple Section component
const Section = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
        {children}
    </section>
);

// Fallback images (shown when no Sanity documents exist yet)
const fallbackItems: GalleryImage[] = [
    {
        _id: 'fallback-1',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824821/WhatsApp_Image_2026-02-10_at_17.17.30_smziyr.jpg",
        category: 'wildlife',
        title: "Elephant Grazing",
        location: "Maasai Mara, Kenya"
    },
    {
        _id: 'fallback-2',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824816/WhatsApp_Image_2026-02-10_at_17.18.58_ogv7ye.jpg",
        category: 'wildlife',
        title: "Rhinos Grazing",
        location: "Maasai Mara, Kenya"
    },
    {
        _id: 'fallback-3',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824815/WhatsApp_Image_2026-02-10_at_17.17.30_2_lzinpl.jpg",
        category: 'wildlife',
        title: "Lions Resting",
        location: "Amboseli, Kenya"
    },
    {
        _id: 'fallback-4',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824815/WhatsApp_Image_2026-02-10_at_17.17.30_1_pxtrg4.jpg",
        category: 'wildlife',
        title: "Elephants Herd",
        location: "Kenya"
    },
    {
        _id: 'fallback-5',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824815/WhatsApp_Image_2026-02-10_at_17.18.58_3_a3h9sb.jpg",
        category: 'wildlife',
        title: "Elephants Migrating",
        location: "Maasai Mara, Kenya"
    },
    {
        _id: 'fallback-6',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824814/WhatsApp_Image_2026-02-10_at_17.18.58_2_qyeeay.jpg",
        category: 'wildlife',
        title: "Antelopes",
        location: "Kenya"
    },
    {
        _id: 'fallback-7',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824813/WhatsApp_Image_2026-02-10_at_17.18.26_2_ire2q6.jpg",
        category: 'wildlife',
        title: "Antelope",
        location: "Maasai Mara, Kenya"
    },
    {
        _id: 'fallback-8',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.17.31_ntfymv.jpg",
        category: 'wildlife',
        title: "Majestic Rhino",
        location: "Kenya"
    },
    {
        _id: 'fallback-9',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.18.58_1_hfgpip.jpg",
        category: 'wildlife',
        title: "Antelope",
        location: "Maasai Mara, Kenya"
    },
    {
        _id: 'fallback-10',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.18.26_3_tnwxox.jpg",
        category: 'wildlife',
        title: "Safari Vehicle in the Wild",
        location: "Kenya"
    },
    {
        _id: 'fallback-11',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824814/WhatsApp_Image_2026-02-10_at_17.18.25_zvduyr.jpg",
        category: 'tours',
        title: "Diani",
        location: "Kenya"
    },
    {
        _id: 'fallback-12',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770892042/vehicle7_vomea0.jpg",
        category: 'tours',
        title: "Premium Tour Transport",
        location: "Kenya"
    },
    {
        _id: 'fallback-13',
        imageUrl: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824814/WhatsApp_Image_2026-02-10_at_17.18.26_1_di3ojf.jpg",
        category: 'tours',
        title: "Malindi",
        location: "Nairobi, Kenya"
    },
    {
        _id: 'fallback-14',
        imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: 'scenery',
        title: "Savannah Sunrise",
        location: "Serengeti, Tanzania"
    },
    {
        _id: 'fallback-15',
        imageUrl: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: 'scenery',
        title: "Mount Kilimanjaro",
        location: "Tanzania"
    }
];

// Skeleton card shown while fetching
const SkeletonCard = () => (
    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 animate-pulse" />
);

const Gallery = () => {
    const [filter, setFilter] = useState<'all' | 'wildlife' | 'tours' | 'scenery'>('all');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    // Fetch from Sanity; fall back to hardcoded items if empty
    const { data: galleryData, isLoading } = useSWR('galleryImages', () =>
        api.gallery.getAll().then(res => res.data)
    );
    const galleryItems: GalleryImage[] = galleryData && galleryData.length > 0 ? galleryData : fallbackItems;

    const filteredItems = filter === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === filter);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Our Gallery</h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide">Capturing moments in the wild</p>
                </Container>
            </div>

            <Section>
                <Container>
                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {(['all', 'wildlife', 'tours', 'scenery'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "px-6 py-2 rounded-full capitalize transition-all",
                                    filter === cat
                                        ? "bg-primary text-white shadow-md relative z-10"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all"
                                    onClick={() => setSelectedImage(item)}
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                                        <h3 className="text-white font-bold text-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                                        <div className="flex items-center gap-1 text-gray-200 text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            <Map size={14} />
                                            <span>{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && filteredItems.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <Camera size={48} className="mx-auto mb-4 opacity-40" />
                            <p className="text-lg">No images in this category yet.</p>
                        </div>
                    )}
                </Container>
            </Section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[101]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="relative max-w-5xl max-h-[90vh] w-full bg-white rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="md:w-3/4 bg-black flex items-center justify-center h-[50vh] md:h-[80vh]">
                            <img
                                src={selectedImage.imageUrl}
                                alt={selectedImage.title}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <div className="md:w-1/4 p-6 flex flex-col justify-center bg-white">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit mb-3 uppercase tracking-wider">
                                {selectedImage.category}
                            </span>
                            <h2 className="text-2xl font-serif font-bold mb-2 text-gray-900">{selectedImage.title}</h2>
                            <div className="flex items-center gap-2 text-gray-600 mb-6">
                                <Map size={18} className="text-primary" />
                                <span>{selectedImage.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-auto pt-6 border-t border-gray-100">
                                <Camera size={16} />
                                <span>Lindberg Safaris</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Gallery;

'use client';

import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GalleryImage } from '@/types';

interface GalleryClientViewProps {
  initialImages: GalleryImage[];
}

const GalleryClientView = ({ initialImages }: GalleryClientViewProps) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'wildlife' | 'tours' | 'scenery'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'tours', label: 'Safari Tours' },
    { id: 'scenery', label: 'Landscapes & Lodges' },
  ];

  const filteredImages =
    activeCategory === 'all'
      ? initialImages
      : initialImages.filter((img) => img.category === activeCategory);

  return (
    <>
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
              activeCategory === cat.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-secondary text-gray-700 hover:bg-secondary-dark'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image._id}
            onClick={() => setSelectedImage(image)}
            className="group relative h-72 rounded-xl overflow-hidden shadow-md cursor-pointer bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <h3 className="font-serif font-bold text-lg mb-1">{image.title}</h3>
              {image.location && (
                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <MapPin size={12} className="text-accent" />
                  <span>{image.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Close lightbox"
          >
            <X size={36} />
          </button>

          <div
            className="relative max-w-4xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center text-white">
              <h3 className="text-2xl font-serif font-bold mb-1">{selectedImage.title}</h3>
              {selectedImage.location && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-gray-300">
                  <MapPin size={16} className="text-accent" />
                  <span>{selectedImage.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryClientView;

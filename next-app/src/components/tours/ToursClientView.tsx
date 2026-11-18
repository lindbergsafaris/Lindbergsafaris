'use client';

import TourCard from '@/components/tours/TourCard';
import TourFilter from '@/components/tours/TourFilter';
import { Tour } from '@/types';

interface ToursClientViewProps {
  initialTours: Tour[];
}

const ToursClientView = ({ initialTours }: ToursClientViewProps) => {
  const tours = initialTours;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:w-1/4">
        <TourFilter />
      </aside>

      {/* Tours Grid */}
      <div className="lg:w-3/4">
        {tours.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No tours found.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for new safari packages.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-100">
                Showing <span className="font-bold">{tours.length}</span> {tours.length === 1 ? 'tour' : 'tours'}
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              {tours.map((tour) => (
                <div key={tour._id} className="flex-grow basis-full md:basis-[calc(50%-2rem)]">
                  <TourCard
                    id={tour.slug?.current || tour._id}
                    title={tour.title}
                    image={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    duration={tour.duration}
                    groupSize={tour.groupSize || 'Contact us'}
                    price={tour.price}
                    rating={tour.rating || 0}
                    reviews={tour.reviews || 0}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ToursClientView;

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayProps {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
}

const ItineraryDay: React.FC<DayProps> = ({ day, title, description, accommodation, meals }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            {day}
          </span>
          <h4 className="font-bold text-gray-900">{title}</h4>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
      </button>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 border-t border-gray-200">
          <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
            {accommodation && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span className="font-medium">Accommodation:</span> {accommodation}
              </div>
            )}
            {meals && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Meals:</span> {meals}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TourItineraryProps {
  days: DayProps[];
}

const TourItinerary: React.FC<TourItineraryProps> = ({ days }) => {
  if (!days || days.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-serif font-bold mb-6">Daily Itinerary</h3>
      <div>
        {days.map((day) => (
          <ItineraryDay key={day.day} {...day} />
        ))}
      </div>
    </div>
  );
};

export default TourItinerary;

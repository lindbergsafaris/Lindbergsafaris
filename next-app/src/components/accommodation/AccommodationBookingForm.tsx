'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createBookingMessage } from '@/lib/bookingUtils';

interface AccommodationBookingFormProps {
  accommodationName: string;
  accommodationLocation?: string;
}

const AccommodationBookingForm = ({
  accommodationName,
  accommodationLocation,
}: AccommodationBookingFormProps) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [nights, setNights] = useState(1);
  const [guestCount, setGuestCount] = useState(1);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappLink = createBookingMessage({
      type: 'Accommodation',
      title: accommodationName,
      date: checkInDate,
      guests: guestCount,
      duration: `${nights} Night${nights > 1 ? 's' : ''}`,
      link: typeof window !== 'undefined' ? window.location.href : '',
      additionalInfo: `Location: ${accommodationLocation || 'East Africa'}`,
    });

    window.open(whatsappLink, '_blank');
  };

  return (
    <div
      id="booking-form"
      className="bg-secondary-light p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24"
    >
      <h3 className="text-xl font-serif font-bold mb-6">Book Your Stay</h3>
      <form className="space-y-4" onSubmit={handleBooking}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nights</label>
            <input
              type="number"
              min="1"
              max="30"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
              value={nights}
              onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
              <option value="11">10+ Guests</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Button type="submit" className="w-full">
            Inquire via WhatsApp
          </Button>
          <p className="text-xs text-center text-gray-500 mt-3">
            Best rate guarantee with personalized safari service
          </p>
        </div>
      </form>
    </div>
  );
};

export default AccommodationBookingForm;

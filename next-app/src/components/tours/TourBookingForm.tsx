'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createBookingMessage } from '@/lib/bookingUtils';

interface TourBookingFormProps {
  tourTitle: string;
  tourPrice: number | string;
  tourDuration: string;
}

const TourBookingForm = ({ tourTitle, tourPrice, tourDuration }: TourBookingFormProps) => {
  const [guestCount, setGuestCount] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  const priceValue = typeof tourPrice === 'number' ? tourPrice : parseInt(String(tourPrice).replace(/[^0-9]/g, '') || '0');
  const totalPrice = priceValue * guestCount;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappLink = createBookingMessage({
      type: 'Tour',
      title: tourTitle,
      date: travelDate,
      guests: guestCount,
      duration: tourDuration,
      pricePerPerson: tourPrice,
      totalPrice: totalPrice,
      link: typeof window !== 'undefined' ? window.location.href : '',
    });

    window.open(whatsappLink, '_blank');
  };

  return (
    <div id="booking-form" className="bg-secondary-light p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <h3 className="text-xl font-serif font-bold mb-6">Book Your Adventure</h3>
      <form className="space-y-4" onSubmit={handleBooking}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
            ))}
            <option value="11">10+ People</option>
          </select>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Base Price</span>
            <span className="font-medium">KSH {tourPrice}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary mt-4 mb-6">
            <span>Total</span>
            <span>KSH {totalPrice}</span>
          </div>
          <Button type="submit" className="w-full">Proceed to Booking</Button>
          <p className="text-xs text-center text-gray-500 mt-3">No payment required today</p>
        </div>
      </form>
    </div>
  );
};

export default TourBookingForm;

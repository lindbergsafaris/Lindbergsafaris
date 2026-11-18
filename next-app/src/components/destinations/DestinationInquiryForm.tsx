'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createBookingMessage } from '@/lib/bookingUtils';

interface DestinationInquiryFormProps {
  destinationName: string;
}

const DestinationInquiryForm = ({ destinationName }: DestinationInquiryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    date: '',
    guests: '2',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappLink = createBookingMessage({
      type: 'Destination',
      title: destinationName,
      date: formData.date,
      guests: parseInt(formData.guests),
      link: typeof window !== 'undefined' ? window.location.href : '',
      additionalInfo: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
    });

    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl border border-white/20 sticky top-24">
      <h3 className="text-xl font-serif font-bold mb-2 text-white">Plan Your Trip</h3>
      <p className="text-sm text-gray-200 mb-6">
        Interested in {destinationName}? Send us an inquiry and we&apos;ll help you plan the perfect safari.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
            placeholder="john@example.com"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-200 mb-1">Travel Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-200 mb-1">Guests</label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num} className="text-black">{num}</option>
              ))}
              <option value="11" className="text-black">10+</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none resize-none"
            placeholder={`I'm interested in visiting ${destinationName}...`}
          />
        </div>
        <Button type="submit" className="w-full flex items-center justify-center gap-2">
          <Send size={18} />
          Send Inquiry via WhatsApp
        </Button>
      </form>
    </div>
  );
};

export default DestinationInquiryForm;

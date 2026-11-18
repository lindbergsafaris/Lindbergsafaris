'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/utils';
import { HotDeal } from '@/types';

interface HotDealsSectionProps {
  deals: HotDeal[];
}

const HotDealsSection = ({ deals }: HotDealsSectionProps) => {
  const [selectedDeal, setSelectedDeal] = useState<HotDeal | null>(null);

  // Client-side expiry filtering ensures stale cached pages never display expired deals
  const activeDeals = useMemo(() => {
    const now = new Date();
    return (deals || []).filter((deal) => {
      if (!deal.dealExpiry) return true;
      return new Date(deal.dealExpiry) > now;
    });
  }, [deals]);

  if (activeDeals.length === 0) return null;

  return (
    <>
      {/* Lightbox Modal */}
      {selectedDeal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedDeal(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDeal(null);
            }}
          >
            <X size={40} />
          </button>

          <div
            className="relative max-w-3xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedDeal.image?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt={selectedDeal.title}
              className="max-h-[65vh] w-auto mx-auto object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center text-white">
              <h3 className="text-xl md:text-3xl font-serif font-bold mb-2">{selectedDeal.title}</h3>
              {selectedDeal.tag && (
                <span className="bg-red-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  {selectedDeal.tag}
                </span>
              )}
            </div>
            <Button
              size="lg"
              className="mt-4 bg-white text-primary hover:bg-primary hover:text-white border-none rounded-full px-12"
              onClick={() => window.open(getWhatsAppLink(selectedDeal.whatsappMessage || `I am interested in the ${selectedDeal.title} offer`, selectedDeal.whatsappNumber), '_blank')}
            >
              Inquire About Deal
            </Button>
          </div>
        </div>
      )}

      {/* Deals Grid */}
      <div className="flex flex-wrap gap-8">
        {activeDeals.map((deal) => {
          const isExpired = deal.dealExpiry ? new Date(deal.dealExpiry) < new Date() : false;
          return (
            <div
              key={deal._id}
              className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl group flex flex-grow flex-col justify-end cursor-pointer basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(33.333%-2rem)]"
              onClick={() => setSelectedDeal(deal)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url("${deal.image?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                {deal.tag && (
                  <div className="bg-red-600 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full shadow-lg">
                    {deal.tag}
                  </div>
                )}
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${isExpired ? 'bg-black/50 text-white' : 'bg-white/20 text-white border border-white/30'}`}>
                  {isExpired ? 'Expired' : 'Live Deal'}
                </div>
              </div>

              <div className="relative p-6 z-10 text-white">
                {!isExpired && deal.dealExpiry && (
                  <div className="flex items-center gap-2 mb-4 text-white/80 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Ends {new Date(deal.dealExpiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                )}
                <Button
                  size="lg"
                  className={`w-full font-bold uppercase tracking-widest shadow-xl transition-all duration-300 ${isExpired
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-white text-primary hover:bg-primary hover:text-white border-none scale-100 active:scale-95'
                    }`}
                  disabled={isExpired}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(getWhatsAppLink(deal.whatsappMessage || `I am interested in the ${deal.title} offer`, deal.whatsappNumber), '_blank');
                  }}
                >
                  {isExpired ? 'Offer Ended' : 'Inquire About Deal'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HotDealsSection;

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { PopupOffer as PopupOfferType } from '@/types';

interface PopupOfferProps {
  initialOffer?: PopupOfferType | null;
}

const PopupOffer = ({ initialOffer }: PopupOfferProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [offer, setOffer] = useState<PopupOfferType | null>(null);

  useEffect(() => {
    if (!initialOffer) return;

    try {
      const now = new Date();
      const starts = initialOffer.startDate ? new Date(initialOffer.startDate) : null;
      const ends = initialOffer.endDate ? new Date(initialOffer.endDate) : null;

      const isLive = (!starts || now >= starts) && (!ends || now <= ends);
      if (!isLive) return;

      if (typeof window !== 'undefined' && window.sessionStorage) {
        const seenOffer = sessionStorage.getItem(`seen_offer_${initialOffer._id}`);
        if (!seenOffer) {
          setOffer(initialOffer);
          const timer = setTimeout(() => setIsOpen(true), 2000);
          return () => clearTimeout(timer);
        }
      }
    } catch (_err) {
      // Ignore storage errors on client
    }
  }, [initialOffer]);

  const handleClose = () => {
    setIsOpen(false);
    if (offer && typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(`seen_offer_${offer._id}`, 'true');
      } catch (_err) {
        // Ignore storage errors
      }
    }
  };

  const handleClaim = () => {
    if (!offer) return;

    if (offer.ctaLink) {
      window.location.href = offer.ctaLink;
    } else {
      const message = `Hello Lindberg Safaris! I want to claim the exclusive offer: "${offer.title}". Please provide more details.`;
      window.open(getWhatsAppLink(message), '_blank');
    }
    handleClose();
  };

  if (!offer || !isOpen || !offer.image?.url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close offer"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="relative group cursor-pointer" onClick={handleClaim}>
          <img
            src={offer.image.url}
            alt={offer.title}
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <span className="bg-white/90 text-primary px-6 py-2 rounded-full font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
              Claim Offer Now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupOffer;

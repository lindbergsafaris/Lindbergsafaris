import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { getWhatsAppLink } from '@/lib/utils';
import { PopupOffer as PopupOfferType } from '@/types';

const PopupOffer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [offer, setOffer] = useState<PopupOfferType | null>(null);

    const { data: activeOffer } = useSWR('popupOffer', () => api.popup.getAll());

    useEffect(() => {
        if (activeOffer) {
            // Check if already seen in this session
            const seenOffer = sessionStorage.getItem(`seen_offer_${activeOffer._id}`);
            if (!seenOffer) {
                setOffer(activeOffer);
                // Small delay before showing
                setTimeout(() => setIsOpen(true), 2000);
            }
        }
    }, [activeOffer]);

    const handleClose = () => {
        setIsOpen(false);
        if (offer) {
            sessionStorage.setItem(`seen_offer_${offer._id}`, 'true');
        }
    };

    const handleClaim = () => {
        if (!offer) return;

        if (offer.ctaLink) {
            window.location.href = offer.ctaLink;
        } else {
            // Default to WhatsApp
            const message = `Hello! I would like to claim the "${offer.title}" offer.`;
            window.open(getWhatsAppLink(message), '_blank');
        }
        handleClose();
    };

    if (!offer || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                {offer.image && (
                    <div className="h-48 w-full relative">
                        <img
                            src={offer.image.url}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-6 text-white">
                            <h3 className="text-2xl font-bold font-serif">{offer.title}</h3>
                        </div>
                    </div>
                )}

                <div className="p-6 text-center">
                    {!offer.image && <h3 className="text-2xl font-bold font-serif mb-2 text-gray-900">{offer.title}</h3>}

                    {offer.description && (
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {offer.description}
                        </p>
                    )}

                    <Button onClick={handleClaim} className="w-full py-3 text-lg shadow-lg shadow-primary/20">
                        {offer.ctaText || 'Claim Offer'}
                    </Button>

                    <button
                        onClick={handleClose}
                        className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
                    >
                        No thanks, maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupOffer;

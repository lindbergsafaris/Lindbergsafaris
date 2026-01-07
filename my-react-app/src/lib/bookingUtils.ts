import { getWhatsAppLink } from './utils';

interface BookingDetails {
    type: 'Tour' | 'Accommodation' | 'Destination' | 'Custom';
    title: string;
    date?: string;
    guests?: number;
    duration?: string; // e.g., "5 Days" or "3 Nights"
    pricePerPerson?: number | string;
    totalPrice?: number | string;
    link: string;
    additionalInfo?: string;
}

export const createBookingMessage = (details: BookingDetails): string => {
    const {
        type,
        title,
        date,
        guests,
        duration,
        pricePerPerson,
        totalPrice,
        link,
        additionalInfo
    } = details;

    let message = `*New Booking Request*\n`;
    message += `----------------\n`;
    message += `*Type:* ${type}\n`;
    message += `*Package:* ${title}\n`;

    if (date) message += `*Date:* ${date}\n`;
    if (guests) message += `*Guests:* ${guests}\n`;
    if (duration) message += `*Duration:* ${duration}\n`;

    message += `----------------\n`;

    if (pricePerPerson) message += `*Price per Person:* KSH ${pricePerPerson}\n`;
    if (totalPrice) message += `*Total Estimated Cost:* KSH ${totalPrice}\n`;

    message += `----------------\n`;
    message += `*Link:* ${link}\n`;

    if (additionalInfo) {
        message += `\n*Additional Info:*\n${additionalInfo}`;
    }

    return getWhatsAppLink(message);
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Replace with actual company phone number
export const COMPANY_PHONE = "254743377948";

export function getWhatsAppLink(message: string, phone: string = COMPANY_PHONE) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


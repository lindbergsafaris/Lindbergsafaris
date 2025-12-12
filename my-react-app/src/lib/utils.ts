import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Replace with actual company phone number
export const COMPANY_PHONE = "254743377948";

export function getWhatsAppLink(message: string) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${COMPANY_PHONE}?text=${encodedMessage}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

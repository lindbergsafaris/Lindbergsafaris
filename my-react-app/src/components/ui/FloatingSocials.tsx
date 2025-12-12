import { Facebook, Instagram } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

const FloatingSocials = () => {
    const socialLinks = [
        {
            name: 'Facebook',
            icon: <Facebook size={24} />,
            url: 'https://facebook.com', // Replace with actual link
            color: 'bg-[#1877F2]',
            hoverColor: 'hover:bg-[#1877F2]/90'
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                </svg>
            ),
            url: getWhatsAppLink("Hello, I'm interested in your safaris."),
            color: 'bg-[#25D366]',
            hoverColor: 'hover:bg-[#25D366]/90'
        },
        {
            name: 'Instagram',
            icon: <Instagram size={24} />,
            url: 'https://instagram.com', // Replace with actual link
            color: 'bg-[#E4405F]',
            hoverColor: 'hover:bg-[#E4405F]/90'
        },
        {
            name: 'TikTok',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            ),
            url: 'https://tiktok.com', // Replace with actual link
            color: 'bg-[#000000]',
            hoverColor: 'hover:bg-[#000000]/90'
        }
    ];

    return (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
            {socialLinks.map((social) => (
                <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 text-white transition-all duration-300 transform hover:translate-x-1 hover:scale-110 shadow-lg rounded-r-md ${social.color} ${social.hoverColor}`}
                    aria-label={social.name}
                >
                    {social.icon}
                </a>
            ))}
        </div>
    );
};

export default FloatingSocials;

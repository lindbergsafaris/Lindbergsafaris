import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MainWrapper from '@/components/layout/MainWrapper';
import FloatingSocials from '@/components/ui/FloatingSocials';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import { SITE_URL, SITE_NAME } from '@/lib/siteConfig';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Kenya Safaris & East Africa Tours | Lindberg Safaris',
  description:
    'Tailor-made luxury safaris, wildlife adventures, and holiday packages in Kenya, Tanzania, Uganda & Rwanda. Book your East Africa dream trip with Lindberg Safaris.',
  keywords: [
    'Kenya safari',
    'East Africa safaris',
    'Masai Mara tour',
    'luxury safari Kenya',
    'Lindberg Safaris',
    'African wildlife safaris',
    'Kenya holiday packages',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Kenya Safaris & East Africa Tours | Lindberg Safaris',
    description:
      'Tailor-made luxury safaris, wildlife adventures, and holiday packages in Kenya, Tanzania, Uganda & Rwanda.',
    images: [
      {
        url: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel_nprg6k.jpg',
        width: 1200,
        height: 630,
        alt: 'Lindberg Safaris - East Africa Adventures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LindbergSafaris',
    creator: '@LindbergSafaris',
    title: 'Kenya Safaris & East Africa Tours | Lindberg Safaris',
    description:
      'Tailor-made luxury safaris, wildlife adventures, and holiday packages in Kenya, Tanzania, Uganda & Rwanda.',
    images: ['https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel_nprg6k.jpg'],
  },
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1514671186970432';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <MetaPixelTracker />
        <Header />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
        <FloatingSocials />
      </body>
    </html>
  );
}

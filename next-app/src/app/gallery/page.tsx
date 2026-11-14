import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GalleryClientView from '@/components/gallery/GalleryClientView';
import { getGalleryImages } from '@/lib/data';
import { SITE_URL } from '@/lib/siteConfig';
import { GalleryImage } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Safari Gallery',
  description: 'Explore stunning wildlife photography, luxury camps, and scenic East African safari moments captured by Lindberg Safaris.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/gallery` },
};

const fallbackItems: GalleryImage[] = [
  { _id: 'fallback-1', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824821/WhatsApp_Image_2026-02-10_at_17.17.30_smziyr.jpg', category: 'wildlife', title: 'Elephant Grazing', location: 'Maasai Mara, Kenya' },
  { _id: 'fallback-2', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824816/WhatsApp_Image_2026-02-10_at_17.18.58_ogv7ye.jpg', category: 'wildlife', title: 'Rhinos Grazing', location: 'Maasai Mara, Kenya' },
  { _id: 'fallback-3', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824815/WhatsApp_Image_2026-02-10_at_17.17.30_2_lzinpl.jpg', category: 'wildlife', title: 'Lions Resting', location: 'Amboseli, Kenya' },
  { _id: 'fallback-4', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824815/WhatsApp_Image_2026-02-10_at_17.17.30_1_pxtrg4.jpg', category: 'wildlife', title: 'Elephants Herd', location: 'Kenya' },
  { _id: 'fallback-5', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824815/WhatsApp_Image_2026-02-10_at_17.18.58_3_a3h9sb.jpg', category: 'wildlife', title: 'Elephants Migrating', location: 'Maasai Mara, Kenya' },
  { _id: 'fallback-6', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824814/WhatsApp_Image_2026-02-10_at_17.18.58_2_qyeeay.jpg', category: 'wildlife', title: 'Antelopes', location: 'Kenya' },
  { _id: 'fallback-7', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824813/WhatsApp_Image_2026-02-10_at_17.18.26_2_ire2q6.jpg', category: 'wildlife', title: 'Antelope', location: 'Maasai Mara, Kenya' },
  { _id: 'fallback-8', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.17.31_ntfymv.jpg', category: 'wildlife', title: 'Majestic Rhino', location: 'Kenya' },
  { _id: 'fallback-9', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.18.58_1_hfgpip.jpg', category: 'wildlife', title: 'Antelope', location: 'Maasai Mara, Kenya' },
  { _id: 'fallback-10', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.18.26_3_tnwxox.jpg', category: 'wildlife', title: 'Safari Vehicle in the Wild', location: 'Kenya' },
  { _id: 'fallback-11', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824814/WhatsApp_Image_2026-02-10_at_17.18.25_zvduyr.jpg', category: 'tours', title: 'Diani Beach Safari', location: 'Kenya' },
  { _id: 'fallback-12', imageUrl: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770892042/vehicle7_vomea0.jpg', category: 'tours', title: 'Safari Cruiser', location: 'Kenya' },
];

export default async function GalleryPage() {
  const sanityImages = await getGalleryImages();
  const images = sanityImages && sanityImages.length > 0 ? sanityImages : fallbackItems;

  return (
    <>
      <div className="bg-primary text-white py-20">
        <Container>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Safari Visual Moments &amp; Gallery</h1>
          <p className="text-lg text-gray-100 max-w-2xl">
            A glimpse into the magical experiences awaiting you in East Africa.
          </p>
        </Container>
      </div>

      <Section className="bg-white">
        <Container>
          <GalleryClientView initialImages={images} />
        </Container>
      </Section>
    </>
  );
}

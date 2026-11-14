import { notFound, permanentRedirect } from 'next/navigation';
import { getAccommodationById } from '@/lib/data';
import { slugify } from '@/lib/slugUtils';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccommodationLegacyViewPage({ params }: PageProps) {
  const { id } = await params;
  const acc = await getAccommodationById(id);

  if (acc && acc.name) {
    permanentRedirect(`/accommodation/${slugify(acc.name)}`);
  }

  notFound();
}

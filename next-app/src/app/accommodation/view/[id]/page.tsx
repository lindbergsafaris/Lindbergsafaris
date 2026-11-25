import { notFound, permanentRedirect } from 'next/navigation';
import { getAccommodationById, getRedirectForPath } from '@/lib/data';
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

  const redir = await getRedirectForPath(`/accommodation/view/${id}`);
  if (redir) permanentRedirect(redir.new_path);

  notFound();
}

import { notFound } from 'next/navigation';
import { requireCmsSession } from '@/lib/supabase/auth';
import { getContentTypeConfig } from '@/lib/cms/registry';
import GenericFormView from '@/components/admin/GenericFormView';

export const dynamic = 'force-dynamic';

export default async function AdminContentCreatePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = getContentTypeConfig(type);
  if (!config) notFound();

  const { profile } = await requireCmsSession();

  return <GenericFormView config={config} role={profile.role} mode="create" />;
}

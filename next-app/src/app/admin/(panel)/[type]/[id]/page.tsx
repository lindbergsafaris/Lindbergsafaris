import { notFound } from 'next/navigation';
import { requireCmsSession } from '@/lib/supabase/auth';
import { getContentTypeConfig } from '@/lib/cms/registry';
import GenericFormView from '@/components/admin/GenericFormView';

export const dynamic = 'force-dynamic';

export default async function AdminContentEditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const config = getContentTypeConfig(type);
  if (!config) notFound();

  const { supabase, profile } = await requireCmsSession();

  const { data, error } = await supabase
    .from(config.tableName)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <GenericFormView
      config={config}
      role={profile.role}
      mode="edit"
      initialData={data as Record<string, unknown>}
    />
  );
}

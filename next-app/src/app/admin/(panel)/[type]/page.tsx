import { notFound } from 'next/navigation';
import { requireCmsSession } from '@/lib/supabase/auth';
import { getContentTypeConfig } from '@/lib/cms/registry';
import GenericListView from '@/components/admin/GenericListView';

export const dynamic = 'force-dynamic';

export default async function AdminContentListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = getContentTypeConfig(type);
  if (!config) notFound();

  const { supabase, profile } = await requireCmsSession();

  const { data, count } = await supabase
    .from(config.tableName)
    .select('*', { count: 'exact' })
    .order(config.listView.defaultSort.field, {
      ascending: config.listView.defaultSort.direction === 'asc',
    })
    .range(0, 19);

  return (
    <GenericListView
      config={config}
      role={profile.role}
      initialItems={(data ?? []) as Record<string, unknown>[]}
      initialTotal={count ?? 0}
    />
  );
}

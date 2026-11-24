import Link from 'next/link';
import { requireCmsSession } from '@/lib/supabase/auth';
import { CONTENT_TYPE_CONFIGS } from '@/lib/cms/registry';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { Clock, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface TypeCounts {
  slug: string;
  plural: string;
  singular: string;
  icon: string;
  hasStatusWorkflow: boolean;
  published: number;
  draft: number;
  archived: number;
  total: number;
}

interface RecentItem {
  id: string;
  typeSlug: string;
  typeSingular: string;
  label: string;
  status: string | null;
  updated_at: string;
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireCmsSession();

  const countsPromises = CONTENT_TYPE_CONFIGS.map(async (cfg): Promise<TypeCounts> => {
    const hasWorkflow = cfg.hasStatusWorkflow !== false;
    if (!hasWorkflow) {
      const { count } = await supabase
        .from(cfg.tableName)
        .select('id', { count: 'exact', head: true });
      const total = count ?? 0;
      return {
        slug: cfg.slug,
        plural: cfg.plural,
        singular: cfg.singular,
        icon: cfg.icon,
        hasStatusWorkflow: false,
        published: total,
        draft: 0,
        archived: 0,
        total,
      };
    }

    const [pubRes, draftRes, archRes] = await Promise.all([
      supabase.from(cfg.tableName).select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from(cfg.tableName).select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from(cfg.tableName).select('id', { count: 'exact', head: true }).eq('status', 'archived'),
    ]);

    const published = pubRes.count ?? 0;
    const draft = draftRes.count ?? 0;
    const archived = archRes.count ?? 0;

    return {
      slug: cfg.slug,
      plural: cfg.plural,
      singular: cfg.singular,
      icon: cfg.icon,
      hasStatusWorkflow: true,
      published,
      draft,
      archived,
      total: published + draft + archived,
    };
  });

  const recentPromises = CONTENT_TYPE_CONFIGS.map(async (cfg): Promise<RecentItem[]> => {
    const cols = ['id', cfg.primaryLabelField, 'updated_at'];
    if (cfg.hasStatusWorkflow !== false) cols.push('status');

    const { data } = await supabase
      .from(cfg.tableName)
      .select(cols.join(', '))
      .order('updated_at', { ascending: false })
      .limit(5);

    const rows = ((data ?? []) as unknown) as Array<Record<string, unknown>>;
    return rows.map((r) => ({
      id: String(r.id),
      typeSlug: cfg.slug,
      typeSingular: cfg.singular,
      label: String(r[cfg.primaryLabelField] || r.id),
      status: cfg.hasStatusWorkflow !== false ? String(r.status || 'draft') : null,
      updated_at: String(r.updated_at || ''),
    }));
  });

  const [typeCounts, recentNested] = await Promise.all([
    Promise.all(countsPromises),
    Promise.all(recentPromises),
  ]);

  const recentItems = recentNested
    .flat()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-stone-600 mt-1">
          Overview of content stored in Supabase Postgres.
        </p>
      </div>

      {/* Content Type Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {typeCounts.map((item) => (
          <div
            key={item.slug}
            className="bg-surface rounded-lg border border-stone-200 p-5 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary text-primary-dark flex items-center justify-center">
                  <AdminIcon name={item.icon} className="w-5 h-5" />
                </div>
                <div>
                  <Link
                    href={`/admin/${item.slug}`}
                    className="font-serif font-bold text-base text-gray-900 hover:text-primary"
                  >
                    {item.plural}
                  </Link>
                  <p className="text-xs text-stone-500">{item.total} total</p>
                </div>
              </div>
              <Link
                href={`/admin/${item.slug}/new`}
                className="p-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-primary"
                title={`New ${item.singular}`}
              >
                <Plus className="w-4 h-4" />
              </Link>
            </div>

            {item.hasStatusWorkflow ? (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
                <div className="rounded bg-emerald-50 py-1.5">
                  <p className="text-base font-bold text-emerald-800">{item.published}</p>
                  <p className="text-[11px] text-emerald-700">Published</p>
                </div>
                <div className="rounded bg-amber-50 py-1.5">
                  <p className="text-base font-bold text-amber-800">{item.draft}</p>
                  <p className="text-[11px] text-amber-700">Draft</p>
                </div>
                <div className="rounded bg-stone-100 py-1.5">
                  <p className="text-base font-bold text-stone-700">{item.archived}</p>
                  <p className="text-[11px] text-stone-600">Archived</p>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
                Active entries: <strong>{item.total}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 5 Most Recently Updated */}
      <div className="bg-surface rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-serif font-bold text-lg text-gray-900">
            Recently Updated
          </h2>
        </div>
        {recentItems.length === 0 ? (
          <div className="p-6 text-sm text-stone-500 text-center">
            No recently updated items yet.
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {recentItems.map((item) => (
              <li key={`${item.typeSlug}-${item.id}`}>
                <Link
                  href={`/admin/${item.typeSlug}/${item.id}`}
                  className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.label}
                    </p>
                    <p className="text-xs text-stone-500">
                      {item.typeSingular} • Updated{' '}
                      {new Date(item.updated_at).toLocaleString()}
                    </p>
                  </div>
                  {item.status && (
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

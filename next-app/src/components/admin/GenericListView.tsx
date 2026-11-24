'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { ContentTypeConfig, ListColumnConfig } from '@/lib/cms/types';
import type { CmsRole } from '@/lib/supabase/auth';

interface GenericListViewProps {
  config: ContentTypeConfig;
  role: CmsRole;
  initialItems: Record<string, unknown>[];
  initialTotal: number;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-amber-100 text-amber-800 border-amber-200',
    archived: 'bg-stone-200 text-stone-700 border-stone-300',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
        styles[status] || 'bg-stone-100 text-stone-700 border-stone-200'
      }`}
    >
      {status}
    </span>
  );
}

function extractThumbUrl(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return extractThumbUrl(val[0]);
  }
  if (typeof val === 'object' && 'url' in val) {
    const url = (val as { url?: unknown }).url;
    return typeof url === 'string' && url.trim() ? url : null;
  }
  return null;
}

export default function GenericListView({
  config,
  role,
  initialItems,
  initialTotal,
}: GenericListViewProps) {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, unknown>[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facetFilters, setFacetFilters] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState(config.listView.defaultSort.field);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(config.listView.defaultSort.direction);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [didMount, setDidMount] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sort: sortField,
        dir: sortDir,
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search.trim()) params.set('search', search.trim());
      if (config.hasStatusWorkflow !== false && statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      for (const [k, v] of Object.entries(facetFilters)) {
        if (v && v !== 'all') params.set(`filter_${k}`, v);
      }

      const res = await fetch(`/api/admin/content/${config.slug}?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load items');
      }
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [config.slug, config.hasStatusWorkflow, search, statusFilter, facetFilters, sortField, sortDir, page]);

  useEffect(() => {
    if (!didMount) {
      setDidMount(true);
      return;
    }
    const timer = setTimeout(() => {
      fetchItems();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchItems, didMount]);

  const toggleSort = (field: string) => {
    setPage(1);
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${config.slug}/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Delete failed');
      }
      setDeleteTarget(null);
      await fetchItems();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (row: Record<string, unknown>) => {
    const id = String(row.id);
    setDuplicatingId(id);
    setError(null);
    try {
      const copy: Record<string, unknown> = { ...row };
      delete copy.id;
      delete copy.created_at;
      delete copy.updated_at;
      delete copy.legacy_sanity_id;
      if (typeof copy.title === 'string') {
        copy.title = `${copy.title} (Copy)`;
      } else if (typeof copy.name === 'string') {
        copy.name = `${copy.name} (Copy)`;
      }
      if (config.hasStatusWorkflow !== false) {
        copy.status = 'draft';
        copy.published_at = null;
      }

      const res = await fetch(`/api/admin/content/${config.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not duplicate record');
      await fetchItems();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not duplicate record');
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleReorder = async (row: Record<string, unknown>, delta: -1 | 1) => {
    if (!config.displayOrderField) return;
    const field = config.displayOrderField;
    const current = Number(row[field] ?? 0);
    const nextOrder = Math.max(0, current + delta);
    try {
      const payload = { ...row, [field]: nextOrder };
      const res = await fetch(`/api/admin/content/${config.slug}/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) await fetchItems();
    } catch {
      // ignore
    }
  };

  const renderCell = (col: ListColumnConfig, row: Record<string, unknown>) => {
    const val = row[col.field];

    switch (col.type) {
      case 'image': {
        const url = extractThumbUrl(val);
        return url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="w-11 h-9 rounded object-cover border border-stone-200 bg-stone-100"
          />
        ) : (
          <div className="w-11 h-9 rounded border border-stone-200 bg-stone-100 flex items-center justify-center text-stone-400">
            <ImageIcon className="w-4 h-4" />
          </div>
        );
      }

      case 'badge':
        return <StatusBadge status={String(val || 'draft')} />;

      case 'boolean':
        return val ? (
          <span className="inline-flex px-2 py-0.5 rounded bg-primary/15 text-primary-dark text-xs font-medium">
            Yes
          </span>
        ) : (
          <span className="text-xs text-stone-400">No</span>
        );

      case 'currency': {
        const amount = Number(val);
        if (Number.isNaN(amount)) return '—';
        const code = col.currencyField ? String(row[col.currencyField] || 'KES') : 'KES';
        return `${code} ${amount.toLocaleString()}`;
      }

      case 'date': {
        if (!val || typeof val !== 'string') return '—';
        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
      }

      case 'expiry': {
        if (!val || typeof val !== 'string') return '—';
        const d = new Date(val);
        if (Number.isNaN(d.getTime())) return '—';
        const expired = d.getTime() < Date.now();
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-700">{d.toLocaleDateString()}</span>
            {expired && (
              <span className="inline-flex px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-[10px] font-semibold uppercase">
                Expired
              </span>
            )}
          </div>
        );
      }

      default: {
        const str = val === null || val === undefined || val === '' ? '—' : String(val);
        return <span className="line-clamp-2">{str}</span>;
      }
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">{config.plural}</h1>
          {config.description && (
            <p className="text-sm text-stone-600 mt-0.5">{config.description}</p>
          )}
        </div>
        <Link
          href={`/admin/${config.slug}/new`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          New {config.singular}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-lg border border-stone-200 p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder={`Search ${config.plural.toLowerCase()}...`}
            className="w-full rounded-md border border-stone-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {config.hasStatusWorkflow !== false && (
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              aria-label="Filter by status"
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          )}

          {config.listView.filters.map((f) => (
            <select
              key={f.field}
              value={facetFilters[f.field] || 'all'}
              onChange={(e) => {
                setPage(1);
                setFacetFilters((prev) => ({ ...prev, [f.field]: e.target.value }));
              }}
              aria-label={f.label}
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All {f.label}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface rounded-lg border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                {config.listView.columns.map((col) => (
                  <th
                    key={col.field}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600 whitespace-nowrap"
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.field)}
                        className="inline-flex items-center gap-1 hover:text-primary"
                      >
                        <span>{col.label}</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                {config.displayOrderField && (
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Order
                  </th>
                )}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {loading && items.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.listView.columns.length + 2}
                    className="px-4 py-12 text-center text-stone-500"
                  >
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading {config.plural.toLowerCase()}...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.listView.columns.length + 2}
                    className="px-4 py-12 text-center text-stone-500"
                  >
                    No {config.plural.toLowerCase()} found.
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const id = String(row.id);
                  const isPastExpiry =
                    config.expiryField &&
                    typeof row[config.expiryField] === 'string' &&
                    new Date(String(row[config.expiryField])).getTime() < Date.now();

                  return (
                    <tr key={id} className="hover:bg-stone-50/70 transition-colors">
                      {config.listView.columns.map((col, idx) => (
                        <td
                          key={col.field}
                          className="px-4 py-3 text-gray-800 align-middle"
                        >
                          <div className="flex items-center gap-2">
                            {renderCell(col, row)}
                            {idx === 1 &&
                              config.expiryField &&
                              col.type !== 'expiry' &&
                              isPastExpiry && (
                                <span className="inline-flex px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-[10px] font-semibold uppercase">
                                  Expired
                                </span>
                              )}
                          </div>
                        </td>
                      ))}

                      {config.displayOrderField && (
                        <td className="px-4 py-3 align-middle whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <span className="w-6 text-center text-xs font-mono">
                              {String(row[config.displayOrderField] ?? 0)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleReorder(row, -1)}
                              className="p-1 rounded border border-stone-200 hover:bg-stone-100"
                              title="Decrease order"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReorder(row, 1)}
                              className="p-1 rounded border border-stone-200 hover:bg-stone-100"
                              title="Increase order"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      )}

                      <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/${config.slug}/${id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </Link>

                          {config.supportsDuplicate && (
                            <button
                              type="button"
                              onClick={() => handleDuplicate(row)}
                              disabled={duplicatingId === id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                              title="Duplicate as draft"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Duplicate
                            </button>
                          )}

                          {role === 'admin' && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-600">
          <span>
            Showing {items.length} of {total} record(s)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal (Admin only) */}
      {deleteTarget && role === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              Delete {config.singular}?
            </h2>
            <p className="text-sm text-stone-600">
              Are you sure you want to permanently delete{' '}
              <strong>
                {String(
                  deleteTarget[config.primaryLabelField] || deleteTarget.id
                )}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-md border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

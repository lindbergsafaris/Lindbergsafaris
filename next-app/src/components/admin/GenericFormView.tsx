'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Loader2, Save, Trash2 } from 'lucide-react';
import type { ContentTypeConfig } from '@/lib/cms/types';
import { buildDefaultValues, buildZodSchema } from '@/lib/cms/validation';
import type { CmsRole } from '@/lib/supabase/auth';
import FieldRenderer from './FieldRenderer';

interface GenericFormViewProps {
  config: ContentTypeConfig;
  role: CmsRole;
  mode: 'create' | 'edit';
  initialData?: Record<string, unknown>;
}

export default function GenericFormView({
  config,
  role,
  mode,
  initialData,
}: GenericFormViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(config.form.tabs[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const schema = useMemo(() => buildZodSchema(config), [config]);
  const defaults = useMemo(() => {
    const base = buildDefaultValues(config);
    if (!initialData) return base;
    return { ...base, ...initialData };
  }, [config, initialData]);

  const methods = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { isDirty, errors },
  } = methods;

  // Warn user about unsaved changes on tab close / reload
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const recordId = initialData?.id ? String(initialData.id) : undefined;
  const labelTitle =
    mode === 'create'
      ? `New ${config.singular}`
      : String(initialData?.[config.primaryLabelField] || `Edit ${config.singular}`);

  const onSubmit = async (values: Record<string, unknown>) => {
    setSaving(true);
    setServerError(null);
    setSaveSuccess(null);

    try {
      const endpoint =
        mode === 'create'
          ? `/api/admin/content/${config.slug}`
          : `/api/admin/content/${config.slug}/${recordId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save changes');
      }

      methods.reset(data.item);
      setSaveSuccess('Saved successfully.');

      if (mode === 'create' && data.item?.id) {
        router.push(`/admin/${config.slug}/${data.item.id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId || role !== 'admin') return;
    setDeleting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/admin/content/${config.slug}/${recordId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      router.push(`/admin/${config.slug}`);
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Delete failed');
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  // Count errors per tab so user can spot validation errors on inactive tabs
  const tabErrorCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tab of config.form.tabs) {
      let c = 0;
      for (const f of tab.fields) {
        if (errors[f.name]) c++;
      }
      counts.set(tab.id, c);
    }
    return counts;
  }, [config.form.tabs, errors]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <Link
              href={`/admin/${config.slug}`}
              onClick={(e) => {
                if (isDirty && !window.confirm('You have unsaved changes. Leave anyway?')) {
                  e.preventDefault();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-primary"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {config.plural}
            </Link>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {labelTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'edit' && role === 'admin' && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving...' : mode === 'create' ? `Create ${config.singular}` : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {serverError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {saveSuccess && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Please fix the highlighted validation errors before saving.
          </div>
        )}

        {/* Tabs */}
        <div className="bg-surface rounded-lg border border-stone-200 shadow-sm overflow-hidden">
          {config.form.tabs.length > 1 && (
            <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50 px-4">
              {config.form.tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                const errCount = tabErrorCounts.get(tab.id) ?? 0;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'border-primary text-primary-dark bg-surface'
                        : 'border-transparent text-stone-600 hover:text-gray-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {errCount > 0 && (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        {errCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Panels — keep all mounted or render active tab cleanly */}
          <div className="p-5 sm:p-6 space-y-5">
            {config.form.tabs.map((tab) => (
              <div
                key={tab.id}
                className={tab.id === activeTab ? 'space-y-5' : 'hidden'}
              >
                {tab.fields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    contentTypeSlug={config.slug}
                    recordId={recordId}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Delete confirm modal */}
      {confirmDelete && role === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              Delete {config.singular}?
            </h2>
            <p className="text-sm text-stone-600">
              This will permanently delete <strong>{labelTitle}</strong>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
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
    </FormProvider>
  );
}

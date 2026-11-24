'use client';

import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import type { FieldConfig, RelationFieldConfig, RepeaterFieldConfig, SlugFieldConfig } from '@/lib/cms/types';
import { slugify } from '@/lib/slugUtils';
import type { CmsImageMeta } from '@/lib/cloudinary';
import ImageField from './ImageField';
import GalleryField from './GalleryField';
import TiptapEditor from './TiptapEditor';

function getErrorAtPath(errors: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let curr: unknown = errors;
  for (const part of parts) {
    if (!curr || typeof curr !== 'object') return undefined;
    curr = (curr as Record<string, unknown>)[part];
  }
  if (curr && typeof curr === 'object' && 'message' in curr) {
    return String((curr as { message?: string }).message || '');
  }
  return undefined;
}

function toDatetimeLocalValue(iso: unknown): string {
  if (!iso || typeof iso !== 'string') return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function SlugFieldControl({
  field,
  namePrefix,
  contentTypeSlug,
  recordId,
}: {
  field: SlugFieldConfig;
  namePrefix?: string;
  contentTypeSlug: string;
  recordId?: string;
}) {
  const fullName = namePrefix ? `${namePrefix}.${field.name}` : field.name;
  const sourceFullName = namePrefix ? `${namePrefix}.${field.sourceField}` : field.sourceField;

  const { register, setValue, formState } = useFormContext();
  const slugVal = useWatch({ name: fullName }) as string | undefined;
  const sourceVal = useWatch({ name: sourceFullName }) as string | undefined;

  const [autoSync, setAutoSync] = useState(!recordId);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoSync) return;
    if (typeof sourceVal === 'string' && sourceVal.trim()) {
      const next = slugify(sourceVal);
      setValue(fullName, next, { shouldDirty: Boolean(recordId) });
    }
  }, [autoSync, sourceVal, fullName, setValue, recordId]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const val = (slugVal || '').trim();
    if (!val) {
      setAvailable(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const params = new URLSearchParams({
          type: contentTypeSlug,
          slug: val,
          field: field.name,
        });
        if (recordId) params.set('excludeId', recordId);
        const res = await fetch(`/api/admin/slug-check?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setAvailable(Boolean(data.available));
        }
      } finally {
        setChecking(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [slugVal, contentTypeSlug, field.name, recordId]);

  const errorMsg = getErrorAtPath(formState.errors as Record<string, unknown>, fullName);
  const registered = register(fullName);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <input
          type="text"
          {...registered}
          onChange={(e) => {
            setAutoSync(false);
            registered.onChange(e);
          }}
          placeholder="auto-generated-slug"
          className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={() => {
            const generated = slugify(String(sourceVal || ''));
            setValue(fullName, generated, { shouldDirty: true, shouldValidate: true });
          }}
          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md border border-stone-300 bg-stone-50 text-xs font-medium text-stone-700 hover:bg-stone-100"
          title="Regenerate slug from source field"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Generate
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-stone-500">
          Public URL:{' '}
          <code className="font-mono text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
            {field.publicPathPrefix || '/'}
            {slugVal || '...'}
          </code>
        </span>

        {checking ? (
          <span className="inline-flex items-center gap-1 text-stone-500">
            <Loader2 className="w-3 h-3 animate-spin" /> Checking...
          </span>
        ) : available === true ? (
          <span className="inline-flex items-center gap-1 text-primary-dark font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Unique slug
          </span>
        ) : available === false ? (
          <span className="inline-flex items-center gap-1 text-red-600 font-medium">
            <XCircle className="w-3.5 h-3.5" /> Slug already in use
          </span>
        ) : null}
      </div>

      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
    </div>
  );
}

function TagsFieldControl({
  name,
  placeholder,
}: {
  name: string;
  placeholder?: string;
}) {
  const { control } = useFormContext();
  const [draft, setDraft] = useState('');

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const items: string[] = Array.isArray(value) ? value : [];

        const addTag = (raw: string) => {
          const clean = raw.trim();
          if (!clean) return;
          if (!items.includes(clean)) {
            onChange([...items, clean]);
          }
          setDraft('');
        };

        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag(draft);
                  }
                }}
                placeholder={placeholder || 'Type item and press Enter'}
                className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => addTag(draft)}
                className="px-3 py-2 rounded-md border border-stone-300 bg-stone-50 text-xs font-medium text-stone-700 hover:bg-stone-100"
              >
                Add
              </button>
            </div>

            {items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {items.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-primary-dark text-xs font-medium"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...items];
                        copy.splice(i, 1);
                        onChange(copy);
                      }}
                      className="hover:text-red-600"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {error?.message && <p className="text-xs text-red-600">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}

function RelationFieldControl({
  field,
  fullName,
}: {
  field: RelationFieldConfig;
  fullName: string;
}) {
  const { control } = useFormContext();
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          labelField: field.labelField,
          valueField: field.valueField,
          q: search,
        });
        const res = await fetch(
          `/api/admin/relations/${encodeURIComponent(field.targetTable)}?${params.toString()}`
        );
        if (res.ok && active) {
          const data = await res.json();
          setOptions(Array.isArray(data.options) ? data.options : []);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [field.targetTable, field.labelField, field.valueField, search]);

  return (
    <Controller
      control={control}
      name={fullName}
      render={({ field: rhfField, fieldState: { error } }) => (
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${field.label.toLowerCase()}...`}
              className="w-full rounded-md border border-stone-300 bg-white pl-8 pr-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={typeof rhfField.value === 'string' ? rhfField.value : ''}
            onChange={(e) => rhfField.onChange(e.target.value || null)}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">{loading ? 'Loading...' : `Select ${field.label}`}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error?.message && <p className="text-xs text-red-600">{error.message}</p>}
        </div>
      )}
    />
  );
}

function RepeaterFieldControl({
  field,
  fullName,
  contentTypeSlug,
  recordId,
}: {
  field: RepeaterFieldConfig;
  fullName: string;
  contentTypeSlug: string;
  recordId?: string;
}) {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: fullName,
  });

  const buildEmptyItem = () => {
    const obj: Record<string, unknown> = {};
    for (const sub of field.subfields) {
      if (sub.defaultValue !== undefined) {
        obj[sub.name] = sub.defaultValue;
      } else if (sub.type === 'number') {
        obj[sub.name] = sub.name === 'day' ? fields.length + 1 : null;
      } else if (sub.type === 'boolean') {
        obj[sub.name] = false;
      } else if (sub.type === 'gallery' || sub.type === 'tags' || sub.type === 'repeater') {
        obj[sub.name] = [];
      } else if (sub.type === 'image') {
        obj[sub.name] = null;
      } else {
        obj[sub.name] = '';
      }
    }
    return obj;
  };

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-5 text-center text-sm text-stone-500">
          No {field.label.toLowerCase()} added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-lg border border-stone-200 bg-stone-50/70 p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">
                  {field.itemLabel || 'Item'} #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => idx > 0 && move(idx, idx - 1)}
                    disabled={idx === 0}
                    className="p-1 rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => idx < fields.length - 1 && move(idx, idx + 1)}
                    disabled={idx === fields.length - 1}
                    className="p-1 rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="p-1 rounded border border-red-200 bg-white text-red-600 hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {field.subfields.map((sub) => (
                  <FieldRenderer
                    key={sub.name}
                    field={sub}
                    namePrefix={`${fullName}.${idx}`}
                    contentTypeSlug={contentTypeSlug}
                    recordId={recordId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => append(buildEmptyItem())}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-stone-300 bg-surface text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        <Plus className="w-4 h-4 text-primary" />
        Add {field.itemLabel || 'Item'}
      </button>
    </div>
  );
}

export default function FieldRenderer({
  field,
  namePrefix,
  contentTypeSlug,
  recordId,
}: {
  field: FieldConfig;
  namePrefix?: string;
  contentTypeSlug: string;
  recordId?: string;
}) {
  const fullName = namePrefix ? `${namePrefix}.${field.name}` : field.name;
  const { register, control, formState } = useFormContext();
  const errorMsg = getErrorAtPath(formState.errors as Record<string, unknown>, fullName);

  const labelEl = field.type !== 'boolean' && (
    <label className="block text-sm font-medium text-gray-800 mb-1">
      {field.label}
      {field.required && <span className="text-red-600 ml-1">*</span>}
    </label>
  );

  const descEl = field.description && (
    <p className="text-xs text-stone-500 mt-1">{field.description}</p>
  );

  switch (field.type) {
    case 'text':
      return (
        <div>
          {labelEl}
          <input
            type="text"
            {...register(fullName)}
            placeholder={field.placeholder}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {descEl}
          {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div>
          {labelEl}
          <textarea
            rows={4}
            {...register(fullName)}
            placeholder={field.placeholder}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {descEl}
          {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
        </div>
      );

    case 'number':
      return (
        <div>
          {labelEl}
          <Controller
            control={control}
            name={fullName}
            render={({ field: rhfField }) => (
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 'any'}
                value={rhfField.value === null || rhfField.value === undefined ? '' : String(rhfField.value)}
                onChange={(e) => {
                  const v = e.target.value;
                  rhfField.onChange(v === '' ? null : Number(v));
                }}
                placeholder={field.placeholder}
                className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}
          />
          {descEl}
          {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
        </div>
      );

    case 'slug':
      return (
        <div>
          {labelEl}
          <SlugFieldControl
            field={field}
            namePrefix={namePrefix}
            contentTypeSlug={contentTypeSlug}
            recordId={recordId}
          />
          {descEl}
        </div>
      );

    case 'select':
      return (
        <div>
          {labelEl}
          <Controller
            control={control}
            name={fullName}
            render={({ field: rhfField }) => (
              <select
                value={typeof rhfField.value === 'string' ? rhfField.value : ''}
                onChange={(e) => rhfField.onChange(e.target.value)}
                className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {!field.required && <option value="">— None —</option>}
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
          {descEl}
          {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
        </div>
      );

    case 'boolean':
      return (
        <div className="pt-1">
          <Controller
            control={control}
            name={fullName}
            render={({ field: rhfField }) => (
              <label className="inline-flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(rhfField.value)}
                  onChange={(e) => rhfField.onChange(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-800">{field.label}</span>
              </label>
            )}
          />
          {descEl}
          {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
        </div>
      );

    case 'datetime':
      return (
        <div>
          {labelEl}
          <Controller
            control={control}
            name={fullName}
            render={({ field: rhfField }) => (
              <input
                type="datetime-local"
                value={toDatetimeLocalValue(rhfField.value)}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (!raw) {
                    rhfField.onChange(null);
                    return;
                  }
                  const d = new Date(raw);
                  rhfField.onChange(Number.isNaN(d.getTime()) ? null : d.toISOString());
                }}
                className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}
          />
          {descEl}
          {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
        </div>
      );

    case 'tags':
      return (
        <div>
          {labelEl}
          <TagsFieldControl name={fullName} placeholder={field.placeholder} />
          {descEl}
        </div>
      );

    case 'relation':
      return (
        <div>
          {labelEl}
          <RelationFieldControl field={field} fullName={fullName} />
          {descEl}
        </div>
      );

    case 'image':
      return (
        <div>
          <Controller
            control={control}
            name={fullName}
            render={({ field: rhfField }) => (
              <ImageField
                label={field.label}
                required={field.required}
                value={rhfField.value as CmsImageMeta | null | undefined}
                onChange={(next) => rhfField.onChange(next)}
                error={errorMsg}
              />
            )}
          />
          {descEl}
        </div>
      );

    case 'gallery':
      return (
        <div>
          {labelEl}
          <Controller
            control={control}
            name={fullName}
            render={({ field: rhfField }) => (
              <GalleryField
                value={rhfField.value as CmsImageMeta[] | undefined}
                onChange={(next) => rhfField.onChange(next)}
                error={errorMsg}
              />
            )}
          />
          {descEl}
        </div>
      );

    case 'rich-text':
      return (
        <div>
          {labelEl}
          <Controller
            control={control}
            name={fullName}
            render={({ field: rhfField }) => (
              <TiptapEditor
                value={rhfField.value as Record<string, unknown> | null | undefined}
                onChange={(next) => rhfField.onChange(next)}
                error={errorMsg}
              />
            )}
          />
          {descEl}
        </div>
      );

    case 'repeater':
      return (
        <div>
          {labelEl}
          <RepeaterFieldControl
            field={field}
            fullName={fullName}
            contentTypeSlug={contentTypeSlug}
            recordId={recordId}
          />
          {descEl}
          {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
        </div>
      );

    default:
      return null;
  }
}

'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { CmsImageMeta } from '@/lib/cloudinary';
import ImageField from './ImageField';

interface GalleryFieldProps {
  value: CmsImageMeta[] | undefined;
  onChange: (value: CmsImageMeta[]) => void;
  error?: string;
}

export default function GalleryField({ value, onChange, error }: GalleryFieldProps) {
  const items = Array.isArray(value) ? value : [];

  const updateAt = (index: number, next: CmsImageMeta | null) => {
    const copy = [...items];
    if (!next) {
      copy.splice(index, 1);
    } else {
      copy[index] = next;
    }
    onChange(copy);
  };

  const addEmpty = () => {
    onChange([...items, { public_id: '', url: '', alt: '' }]);
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
          No gallery images added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-stone-500">
                  Image #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="p-1 rounded border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...items];
                      copy.splice(idx, 1);
                      onChange(copy);
                    }}
                    className="p-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <ImageField
                value={item}
                onChange={(next) => updateAt(idx, next)}
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addEmpty}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-stone-300 bg-surface text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        <Plus className="w-4 h-4 text-primary" />
        Add Image
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

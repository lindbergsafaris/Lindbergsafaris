'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Loader2, Trash2, Upload, Link2 } from 'lucide-react';
import {
  buildImageMetaFromUrl,
  parseCloudinaryPublicId,
  type CmsImageMeta,
} from '@/lib/cloudinary';

let cachedUploadCapPromise: Promise<{ uploadEnabled: boolean; cloudName: string | null }> | null =
  null;

export function getCloudinaryUploadCapability() {
  if (!cachedUploadCapPromise) {
    cachedUploadCapPromise = fetch('/api/admin/cloudinary-sign')
      .then((res) => (res.ok ? res.json() : { uploadEnabled: false, cloudName: null }))
      .catch(() => ({ uploadEnabled: false, cloudName: null }));
  }
  return cachedUploadCapPromise;
}

interface ImageFieldProps {
  value: CmsImageMeta | null | undefined;
  onChange: (value: CmsImageMeta | null) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

export default function ImageField({
  value,
  onChange,
  label,
  required,
  error,
}: ImageFieldProps) {
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value?.url ?? '');
  const [altInput, setAltInput] = useState(value?.alt ?? '');

  useEffect(() => {
    setUrlInput(value?.url ?? '');
    setAltInput(value?.alt ?? '');
  }, [value?.url, value?.alt]);

  useEffect(() => {
    let active = true;
    getCloudinaryUploadCapability().then((cap) => {
      if (active) setUploadEnabled(cap.uploadEnabled);
    });
    return () => {
      active = false;
    };
  }, []);

  const commitValue = (nextUrl: string, nextAlt: string, dims?: { width?: number; height?: number }) => {
    const trimmedUrl = nextUrl.trim();
    if (!trimmedUrl) {
      onChange(null);
      return;
    }
    const meta = buildImageMetaFromUrl(trimmedUrl, nextAlt, {
      width: dims?.width ?? value?.width,
      height: dims?.height ?? value?.height,
    });
    onChange(meta);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const signRes = await fetch('/api/admin/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'lindberg-safaris' }),
      });
      const signData = await signRes.json();
      if (!signRes.ok) {
        throw new Error(signData.error || 'Could not sign Cloudinary upload');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', String(signData.timestamp));
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const uploaded = await uploadRes.json();
      if (!uploadRes.ok || !uploaded.secure_url) {
        throw new Error(uploaded?.error?.message || 'Cloudinary upload failed');
      }

      const nextAlt = altInput.trim() || file.name.replace(/\.[^.]+$/, '');
      setUrlInput(uploaded.secure_url);
      setAltInput(nextAlt);
      onChange({
        public_id: uploaded.public_id || parseCloudinaryPublicId(uploaded.secure_url),
        url: uploaded.secure_url,
        alt: nextAlt,
        width: typeof uploaded.width === 'number' ? uploaded.width : undefined,
        height: typeof uploaded.height === 'number' ? uploaded.height : undefined,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const currentUrl = value?.url || urlInput.trim();
  const parsedPublicId = currentUrl ? parseCloudinaryPublicId(currentUrl) || value?.public_id || '' : '';

  return (
    <div className="rounded-lg border border-stone-200 bg-surface p-4 space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </span>
          {value?.url && (
            <button
              type="button"
              onClick={() => {
                setUrlInput('');
                setAltInput('');
                onChange(null);
              }}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove image
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 items-start">
        {/* Preview */}
        <div className="w-full md:w-40 h-28 rounded-md border border-stone-200 bg-stone-100 overflow-hidden flex items-center justify-center">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt={altInput || 'Preview'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-stone-400 p-2">
              <ImageIcon className="w-6 h-6 mx-auto mb-1" />
              <span className="text-[11px]">No image</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3 min-w-0">
          {uploadEnabled && (
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium cursor-pointer hover:bg-primary-light">
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{uploading ? 'Uploading...' : 'Upload to Cloudinary'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-stone-500">or paste a URL below</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              Cloudinary Image URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                const next = e.target.value;
                setUrlInput(next);
                commitValue(next, altInput);
              }}
              placeholder="https://res.cloudinary.com/dbqdpitah/image/upload/..."
              className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Alt Text {Boolean(currentUrl) && <span className="text-red-600">*</span>}
            </label>
            <input
              type="text"
              value={altInput}
              onChange={(e) => {
                const next = e.target.value;
                setAltInput(next);
                if (urlInput.trim()) {
                  commitValue(urlInput, next);
                }
              }}
              placeholder="Describe the image for accessibility & SEO"
              className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {parsedPublicId && (
            <p className="text-[11px] text-stone-500 truncate">
              <span className="font-medium">public_id:</span>{' '}
              <code className="font-mono">{parsedPublicId}</code>
              {value?.width && value?.height ? ` (${value.width}×${value.height})` : ''}
            </p>
          )}
        </div>
      </div>

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

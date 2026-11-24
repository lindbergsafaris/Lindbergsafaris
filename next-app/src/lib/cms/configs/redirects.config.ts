import { z } from 'zod';
import type { ContentTypeConfig } from '../types';

export const redirectsConfig: ContentTypeConfig = {
  slug: 'redirects',
  tableName: 'redirects',
  singular: 'Redirect',
  plural: 'Redirects',
  description: '301/302 URL redirects preserving SEO across legacy URLs and slug changes.',
  icon: 'ArrowRightLeft',
  revalidateTags: ['redirects'],
  primaryLabelField: 'old_path',
  hasStatusWorkflow: false,
  listView: {
    columns: [
      { field: 'old_path', label: 'Old Path', type: 'text', sortable: true },
      { field: 'new_path', label: 'New Path', type: 'text', sortable: true },
      { field: 'status_code', label: 'Code', type: 'text', sortable: true },
      { field: 'updated_at', label: 'Updated', type: 'date', sortable: true },
    ],
    searchFields: ['old_path', 'new_path'],
    filters: [
      {
        field: 'status_code',
        label: 'Code',
        options: [
          { label: '301 (Permanent)', value: '301' },
          { label: '302 (Temporary)', value: '302' },
          { label: '307 (Temp Preserve Method)', value: '307' },
          { label: '308 (Perm Preserve Method)', value: '308' },
        ],
      },
    ],
    defaultSort: { field: 'updated_at', direction: 'desc' },
  },
  form: {
    tabs: [
      {
        id: 'redirect',
        label: 'Redirect Rule',
        fields: [
          {
            name: 'old_path',
            label: 'Old Path',
            type: 'text',
            required: true,
            placeholder: '/tours/old-slug',
            pattern: /^\/.+/,
            patternMessage: 'Old path must start with "/"',
          },
          {
            name: 'new_path',
            label: 'New Path',
            type: 'text',
            required: true,
            placeholder: '/tours/new-slug',
            pattern: /^(\/|https?:\/\/).+/,
            patternMessage: 'New path must start with "/" or http(s)://',
          },
          {
            name: 'status_code',
            label: 'HTTP Status Code',
            type: 'select',
            required: true,
            defaultValue: 301,
            validation: z
              .union([z.number(), z.string()])
              .transform((v) => Number(v))
              .refine((n) => [301, 302, 307, 308].includes(n), 'Status code must be 301, 302, 307, or 308'),
            options: [
              { label: '301 (Moved Permanently)', value: '301' },
              { label: '302 (Found / Temporary)', value: '302' },
              { label: '307 (Temporary Redirect)', value: '307' },
              { label: '308 (Permanent Redirect)', value: '308' },
            ],
          },
        ],
      },
    ],
  },
};

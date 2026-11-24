import type { ContentTypeConfig } from '../types';

export const partnersConfig: ContentTypeConfig = {
  slug: 'partners',
  tableName: 'partners',
  singular: 'Partner',
  plural: 'Partners',
  description: 'Affiliates, tourism boards, and accreditation logos.',
  icon: 'Handshake',
  revalidateTags: ['partner'],
  primaryLabelField: 'name',
  hasStatusWorkflow: true,
  displayOrderField: 'display_order',
  listView: {
    columns: [
      { field: 'logo', label: 'Logo', type: 'image' },
      { field: 'name', label: 'Partner Name', type: 'text', sortable: true },
      { field: 'website', label: 'Website', type: 'text' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['name', 'website'],
    filters: [],
    defaultSort: { field: 'display_order', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'partner',
        label: 'Partner Details',
        fields: [
          { name: 'name', label: 'Partner Name', type: 'text', required: true },
          { name: 'logo', label: 'Logo', type: 'image', required: true },
          { name: 'website', label: 'Website URL', type: 'text', placeholder: 'https://...' },
          { name: 'display_order', label: 'Display Order', type: 'number', min: 0, step: 1, defaultValue: 0 },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            defaultValue: 'published',
            options: [
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' },
            ],
          },
          { name: 'published_at', label: 'Published At', type: 'datetime' },
        ],
      },
    ],
  },
};

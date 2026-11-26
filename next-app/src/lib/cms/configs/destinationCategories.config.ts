import type { ContentTypeConfig } from '../types';

export const destinationCategoriesConfig: ContentTypeConfig = {
  slug: 'destination-categories',
  tableName: 'destination_categories',
  singular: 'Destination Region',
  plural: 'Destination Regions',
  description: 'Geographic regions grouping destination guides.',
  icon: 'Globe',
  revalidateTags: ['destinationCategory'],
  primaryLabelField: 'name',
  publicPathPrefix: '/regions/',
  slugField: 'slug',
  hasStatusWorkflow: true,
  displayOrderField: 'display_order',
  listView: {
    columns: [
      { field: 'image', label: 'Image', type: 'image' },
      { field: 'name', label: 'Name', type: 'text', sortable: true },
      { field: 'slug', label: 'Slug', type: 'text' },
      { field: 'is_featured', label: 'Featured', type: 'boolean' },
      { field: 'display_order', label: 'Display order', type: 'text', sortable: true },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['name', 'slug'],
    filters: [],
    defaultSort: { field: 'display_order', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'region',
        label: 'Region Details',
        fields: [
          { name: 'name', label: 'Region Name', type: 'text', required: true },
          {
            name: 'slug',
            label: 'URL Slug',
            type: 'slug',
            sourceField: 'name',
            publicPathPrefix: '/regions/',
            required: true,
          },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'image', label: 'Region Image', type: 'image' },
          { name: 'is_featured', label: 'Featured Region', type: 'boolean', defaultValue: false },
          { name: 'display_order', label: 'Display order', type: 'number', min: 0, step: 1, defaultValue: 0 },
        ],
      },
      {
        id: 'publishing',
        label: 'Publishing',
        fields: [
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            defaultValue: 'draft',
            options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' },
              { label: 'Archived', value: 'archived' },
            ],
          },
          { name: 'published_at', label: 'Published At', type: 'datetime' },
        ],
      },
    ],
  },
};

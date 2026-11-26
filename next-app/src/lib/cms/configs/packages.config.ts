import type { ContentTypeConfig } from '../types';

export const packagesConfig: ContentTypeConfig = {
  slug: 'packages',
  tableName: 'packages',
  singular: 'Package',
  plural: 'Packages',
  description: 'Individual packages displayed inside themed category landing pages.',
  icon: 'Package',
  revalidateTags: ['package'],
  primaryLabelField: 'title',
  slugField: 'slug',
  hasStatusWorkflow: true,
  displayOrderField: 'display_order',
  listView: {
    columns: [
      { field: 'image', label: 'Image', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'category', label: 'Category', type: 'text', sortable: true },
      { field: 'duration', label: 'Duration', type: 'text' },
      { field: 'price', label: 'Price', type: 'currency', currencyField: 'currency', sortable: true },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['title', 'category', 'slug'],
    filters: [
      {
        field: 'category',
        label: 'Category',
        options: [
          { label: 'Wildlife', value: 'wildlife' },
          { label: 'Climbing', value: 'climbing' },
          { label: 'Cruise', value: 'cruise' },
          { label: 'Adventure', value: 'adventure' },
          { label: 'Pilgrimages', value: 'pilgrimages' },
          { label: 'Corporate', value: 'corporate' },
        ],
      },
    ],
    defaultSort: { field: 'display_order', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'package',
        label: 'Package Details',
        fields: [
          { name: 'title', label: 'Package Title', type: 'text', required: true },
          {
            name: 'slug',
            label: 'URL Slug',
            type: 'slug',
            sourceField: 'title',
            publicPathPrefix: '/packages/',
            required: true,
          },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            options: [
              { label: 'Wildlife', value: 'wildlife' },
              { label: 'Climbing', value: 'climbing' },
              { label: 'Cruise', value: 'cruise' },
              { label: 'Adventure', value: 'adventure' },
              { label: 'Pilgrimages', value: 'pilgrimages' },
              { label: 'Corporate', value: 'corporate' },
            ],
          },
          {
            name: 'themed_package_id',
            label: 'Parent Themed Package (optional)',
            type: 'relation',
            targetTable: 'themed_packages',
            labelField: 'title',
            valueField: 'id',
          },
          { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 4 Days / 3 Nights' },
          { name: 'price', label: 'Price', type: 'number', min: 0, step: 1 },
          {
            name: 'currency',
            label: 'Currency',
            type: 'select',
            required: true,
            defaultValue: 'KES',
            options: [
              { label: 'KES', value: 'KES' },
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
            ],
          },
          { name: 'image', label: 'Package Image', type: 'image' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'display_order', label: 'Display Order', type: 'number', min: 0, step: 1, defaultValue: 0 },
        ],
      },
      {
        id: 'seo',
        label: 'SEO',
        fields: [
          { name: 'seo_title', label: 'SEO Title', type: 'text' },
          { name: 'seo_description', label: 'SEO Description', type: 'textarea' },
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

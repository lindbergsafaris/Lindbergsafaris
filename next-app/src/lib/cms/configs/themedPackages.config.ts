import type { ContentTypeConfig } from '../types';

export const themedPackagesConfig: ContentTypeConfig = {
  slug: 'themed-packages',
  tableName: 'themed_packages',
  singular: 'Themed Package',
  plural: 'Themed Packages',
  description: 'Category landing pages for Wildlife, Climbing, Cruise, Adventure, Pilgrimages & Corporate.',
  icon: 'Layers',
  revalidateTags: ['themedPackage'],
  primaryLabelField: 'title',
  publicPathPrefix: '/packages/',
  slugField: 'slug',
  hasStatusWorkflow: true,
  listView: {
    columns: [
      { field: 'hero_image', label: 'Image', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'category', label: 'Category', type: 'text', sortable: true },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
      { field: 'updated_at', label: 'Updated', type: 'date', sortable: true },
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
    defaultSort: { field: 'category', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'landing',
        label: 'Landing Page',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
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
            label: 'Theme Category',
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
          { name: 'hero_image', label: 'Hero Image', type: 'image', required: true },
          { name: 'description', label: 'Short Intro Description', type: 'textarea', required: true },
          { name: 'content', label: 'Detailed Content', type: 'rich-text' },
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

import type { ContentTypeConfig } from '../types';

export const destinationPostsConfig: ContentTypeConfig = {
  slug: 'destination-posts',
  tableName: 'destination_posts',
  singular: 'Destination Guide',
  plural: 'Destination Guides',
  description: 'Park, country, and regional travel guides.',
  icon: 'MapPin',
  revalidateTags: ['destinationPost'],
  primaryLabelField: 'title',
  publicPathPrefix: '/destinations/',
  slugField: 'slug',
  hasStatusWorkflow: true,
  listView: {
    columns: [
      { field: 'image', label: 'Image', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'slug', label: 'Slug', type: 'text' },
      { field: 'tour_count', label: 'Tours', type: 'text', sortable: true },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
      { field: 'updated_at', label: 'Updated', type: 'date', sortable: true },
    ],
    searchFields: ['title', 'slug'],
    filters: [],
    defaultSort: { field: 'title', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'guide',
        label: 'Destination Guide',
        fields: [
          { name: 'title', label: 'Destination Title', type: 'text', required: true },
          {
            name: 'slug',
            label: 'URL Slug',
            type: 'slug',
            sourceField: 'title',
            publicPathPrefix: '/destinations/',
            required: true,
          },
          {
            name: 'category_id',
            label: 'Region / Category',
            type: 'relation',
            targetTable: 'destination_categories',
            labelField: 'name',
            valueField: 'id',
            required: true,
          },
          { name: 'tour_count', label: 'Tour Count', type: 'number', min: 0, step: 1, defaultValue: 0 },
          { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { name: 'image', label: 'Destination Image', type: 'image' },
          { name: 'content', label: 'Guide Content', type: 'rich-text' },
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

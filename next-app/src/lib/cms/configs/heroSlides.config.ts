import type { ContentTypeConfig } from '../types';

export const heroSlidesConfig: ContentTypeConfig = {
  slug: 'hero-slides',
  tableName: 'hero_slides',
  singular: 'Hero Slide',
  plural: 'Hero Slides',
  description: 'Homepage hero carousel slides and CTAs.',
  icon: 'Presentation',
  revalidateTags: ['heroSlide'],
  primaryLabelField: 'title',
  hasStatusWorkflow: true,
  displayOrderField: 'display_order',
  listView: {
    columns: [
      { field: 'image', label: 'Slide', type: 'image' },
      { field: 'title', label: 'Headline', type: 'text', sortable: true },
      { field: 'subtitle', label: 'Subtitle', type: 'text' },
      { field: 'is_active', label: 'Active', type: 'boolean' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['title', 'subtitle'],
    filters: [],
    defaultSort: { field: 'display_order', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'slide',
        label: 'Slide Details',
        fields: [
          { name: 'title', label: 'Headline', type: 'text', required: true },
          { name: 'subtitle', label: 'Subtitle', type: 'text' },
          { name: 'image', label: 'Background Image', type: 'image', required: true },
          { name: 'primary_button_text', label: 'Primary Button Text', type: 'text' },
          { name: 'primary_button_link', label: 'Primary Button Link', type: 'text', placeholder: '/contact' },
          { name: 'secondary_button_text', label: 'Secondary Button Text', type: 'text' },
          { name: 'secondary_button_link', label: 'Secondary Button Link', type: 'text', placeholder: '/tours' },
          { name: 'is_active', label: 'Is Active', type: 'boolean', defaultValue: true },
          { name: 'display_order', label: 'Display Order', type: 'number', min: 0, step: 1, defaultValue: 0 },
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

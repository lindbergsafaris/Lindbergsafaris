import type { ContentTypeConfig } from '../types';

export const galleryImagesConfig: ContentTypeConfig = {
  slug: 'gallery-images',
  tableName: 'gallery_images',
  singular: 'Gallery Image',
  plural: 'Gallery Images',
  description: 'Photo showcase across wildlife, scenery, tours, accommodations, and adventures.',
  icon: 'Image',
  revalidateTags: ['galleryImage'],
  primaryLabelField: 'title',
  hasStatusWorkflow: true,
  displayOrderField: 'display_order',
  listView: {
    columns: [
      { field: 'image', label: 'Preview', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'category', label: 'Category', type: 'text', sortable: true },
      { field: 'location', label: 'Location', type: 'text' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['title', 'location', 'category'],
    filters: [
      {
        field: 'category',
        label: 'Category',
        options: [
          { label: 'Wildlife', value: 'wildlife' },
          { label: 'Scenery', value: 'scenery' },
          { label: 'Tours', value: 'tours' },
          { label: 'Accommodations', value: 'accommodations' },
          { label: 'Adventures', value: 'adventures' },
        ],
      },
    ],
    defaultSort: { field: 'display_order', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'photo',
        label: 'Gallery Item',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'text' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            options: [
              { label: 'Wildlife', value: 'wildlife' },
              { label: 'Scenery', value: 'scenery' },
              { label: 'Tours', value: 'tours' },
              { label: 'Accommodations', value: 'accommodations' },
              { label: 'Adventures', value: 'adventures' },
            ],
          },
          { name: 'image', label: 'Image', type: 'image', required: true },
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

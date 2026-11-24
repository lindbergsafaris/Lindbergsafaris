import type { ContentTypeConfig } from '../types';

export const accommodationsConfig: ContentTypeConfig = {
  slug: 'accommodations',
  tableName: 'accommodations',
  singular: 'Accommodation',
  plural: 'Accommodations',
  description: 'Partner lodges, luxury camps, bush camps, and hotels.',
  icon: 'BedDouble',
  revalidateTags: ['accommodation'],
  primaryLabelField: 'name',
  publicPathPrefix: '/accommodation/',
  slugField: 'slug',
  hasStatusWorkflow: true,
  listView: {
    columns: [
      { field: 'image', label: 'Image', type: 'image' },
      { field: 'name', label: 'Name', type: 'text', sortable: true },
      { field: 'type', label: 'Type', type: 'text', sortable: true },
      { field: 'location', label: 'Location', type: 'text', sortable: true },
      { field: 'rating', label: 'Rating', type: 'text' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
      { field: 'updated_at', label: 'Updated', type: 'date', sortable: true },
    ],
    searchFields: ['name', 'location', 'slug', 'type'],
    filters: [
      {
        field: 'type',
        label: 'Property Type',
        options: [
          { label: 'Lodges', value: 'lodges' },
          { label: 'Holiday Homes', value: 'holiday-homes' },
          { label: 'Town Hotels', value: 'town-hotels' },
          { label: 'Luxury Camps', value: 'luxury-camps' },
          { label: 'Resort Hotels', value: 'resort-hotels' },
          { label: 'Bush Camps', value: 'bush-camps' },
        ],
      },
    ],
    defaultSort: { field: 'name', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'details',
        label: 'Details',
        fields: [
          { name: 'name', label: 'Property Name', type: 'text', required: true },
          {
            name: 'slug',
            label: 'URL Slug',
            type: 'slug',
            sourceField: 'name',
            publicPathPrefix: '/accommodation/',
            required: true,
          },
          {
            name: 'type',
            label: 'Accommodation Type',
            type: 'select',
            required: true,
            options: [
              { label: 'Lodges', value: 'lodges' },
              { label: 'Holiday Homes', value: 'holiday-homes' },
              { label: 'Town Hotels', value: 'town-hotels' },
              { label: 'Luxury Camps', value: 'luxury-camps' },
              { label: 'Resort Hotels', value: 'resort-hotels' },
              { label: 'Bush Camps', value: 'bush-camps' },
            ],
          },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Maasai Mara, Laikipia' },
          { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, step: 0.1 },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'image', label: 'Cover Image', type: 'image' },
        ],
      },
      {
        id: 'amenities',
        label: 'Amenities & Sections',
        fields: [
          {
            name: 'amenities',
            label: 'Amenities',
            type: 'repeater',
            itemLabel: 'Amenity',
            subfields: [
              { name: 'name', label: 'Amenity Name', type: 'text', required: true, placeholder: 'e.g. Swimming pool' },
              { name: 'image', label: 'Amenity Photo (optional)', type: 'image' },
            ],
          },
          {
            name: 'sections',
            label: 'Property Sections',
            type: 'repeater',
            itemLabel: 'Section',
            subfields: [
              { name: 'title', label: 'Section Title', type: 'text', required: true },
              { name: 'content', label: 'Section Content', type: 'textarea' },
              { name: 'images', label: 'Section Images', type: 'gallery' },
            ],
          },
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

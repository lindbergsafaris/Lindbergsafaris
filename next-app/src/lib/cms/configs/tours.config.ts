import type { ContentTypeConfig } from '../types';

export const toursConfig: ContentTypeConfig = {
  slug: 'tours',
  tableName: 'tours',
  singular: 'Tour',
  plural: 'Tours',
  description: 'Guided safari & holiday itineraries with day-by-day plans.',
  icon: 'Compass',
  revalidateTags: ['tour'],
  primaryLabelField: 'title',
  publicPathPrefix: '/tours/',
  slugField: 'slug',
  hasStatusWorkflow: true,
  listView: {
    columns: [
      { field: 'images', label: 'Image', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'location', label: 'Location', type: 'text', sortable: true },
      { field: 'duration', label: 'Duration', type: 'text' },
      { field: 'price', label: 'Price', type: 'currency', currencyField: 'currency', sortable: true },
      { field: 'featured', label: 'Featured', type: 'boolean' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
      { field: 'updated_at', label: 'Updated', type: 'date', sortable: true },
    ],
    searchFields: ['title', 'location', 'slug'],
    filters: [
      {
        field: 'difficulty',
        label: 'Difficulty',
        options: [
          { label: 'Easy', value: 'easy' },
          { label: 'Moderate', value: 'moderate' },
          { label: 'Challenging', value: 'challenging' },
        ],
      },
      {
        field: 'currency',
        label: 'Currency',
        options: [
          { label: 'KES', value: 'KES' },
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
        ],
      },
    ],
    defaultSort: { field: 'updated_at', direction: 'desc' },
  },
  form: {
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        fields: [
          { name: 'title', label: 'Tour Title', type: 'text', required: true, placeholder: 'e.g. 5 Days Maasai Mara Safari' },
          {
            name: 'slug',
            label: 'URL Slug',
            type: 'slug',
            sourceField: 'title',
            publicPathPrefix: '/tours/',
            required: true,
          },
          { name: 'location', label: 'Location', type: 'text', required: true, placeholder: 'e.g. Maasai Mara, Kenya' },
          { name: 'duration', label: 'Duration', type: 'text', required: true, placeholder: 'e.g. 3 Nights PPS or 8 Days/7 Nights' },
          { name: 'group_size', label: 'Group Size', type: 'text', placeholder: 'e.g. min 2 people' },
          {
            name: 'difficulty',
            label: 'Difficulty',
            type: 'select',
            options: [
              { label: 'Easy', value: 'easy' },
              { label: 'Moderate', value: 'moderate' },
              { label: 'Challenging', value: 'challenging' },
            ],
          },
          { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: 1 },
          {
            name: 'currency',
            label: 'Currency',
            type: 'select',
            required: true,
            defaultValue: 'KES',
            options: [
              { label: 'KES (Kenyan Shilling)', value: 'KES' },
              { label: 'USD (US Dollar)', value: 'USD' },
              { label: 'EUR (Euro)', value: 'EUR' },
            ],
          },
          { name: 'rating', label: 'Rating (0-5)', type: 'number', min: 0, max: 5, step: 0.1 },
          { name: 'reviews', label: 'Reviews Count', type: 'number', min: 0, step: 1, defaultValue: 0 },
          { name: 'featured', label: 'Feature on Homepage', type: 'boolean', defaultValue: false },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
        ],
      },
      {
        id: 'media',
        label: 'Media & Highlights',
        fields: [
          { name: 'images', label: 'Tour Gallery', type: 'gallery', description: 'First image is used as the tour cover photo.' },
          { name: 'highlights', label: 'Highlights', type: 'tags', placeholder: 'Add highlight and press Enter' },
          { name: 'included', label: 'Included', type: 'tags', placeholder: 'Add inclusion and press Enter' },
          { name: 'excluded', label: 'Excluded', type: 'tags', placeholder: 'Add exclusion and press Enter' },
        ],
      },
      {
        id: 'itinerary',
        label: 'Itinerary',
        fields: [
          {
            name: 'itinerary',
            label: 'Day-by-Day Itinerary',
            type: 'repeater',
            itemLabel: 'Day',
            subfields: [
              { name: 'day', label: 'Day Number', type: 'number', required: true, min: 1, step: 1 },
              { name: 'title', label: 'Day Title', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea', required: true },
              { name: 'accommodation', label: 'Accommodation', type: 'text', placeholder: 'Lodge or camp name' },
              { name: 'meals', label: 'Meals', type: 'text', placeholder: 'e.g. Full Board' },
            ],
          },
        ],
      },
      {
        id: 'seo',
        label: 'SEO',
        fields: [
          { name: 'seo_title', label: 'SEO Title', type: 'text', placeholder: 'Optional override for <title>' },
          { name: 'seo_description', label: 'SEO Description', type: 'textarea', placeholder: 'Optional meta description' },
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
          { name: 'published_at', label: 'Published At', type: 'datetime', description: 'Automatically set to now when published if blank.' },
        ],
      },
    ],
  },
};

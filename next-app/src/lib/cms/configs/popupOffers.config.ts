import type { ContentTypeConfig } from '../types';

export const popupOffersConfig: ContentTypeConfig = {
  slug: 'popup-offers',
  tableName: 'popup_offers',
  singular: 'Popup Offer',
  plural: 'Popup Offers',
  description: 'Promotional modal overlays shown to website visitors.',
  icon: 'Sparkles',
  revalidateTags: ['popupOffer'],
  primaryLabelField: 'title',
  hasStatusWorkflow: true,
  expiryField: 'end_date',
  supportsDuplicate: true,
  listView: {
    columns: [
      { field: 'image', label: 'Image', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'cta_text', label: 'CTA Text', type: 'text' },
      { field: 'end_date', label: 'End Date', type: 'expiry', sortable: true },
      { field: 'is_active', label: 'Active', type: 'boolean' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['title', 'description', 'cta_text'],
    filters: [],
    defaultSort: { field: 'updated_at', direction: 'desc' },
  },
  form: {
    tabs: [
      {
        id: 'offer',
        label: 'Offer Details',
        fields: [
          { name: 'title', label: 'Modal Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'image', label: 'Banner Image', type: 'image' },
          { name: 'cta_text', label: 'CTA Button Text', type: 'text', required: true, defaultValue: 'Claim Offer' },
          { name: 'cta_link', label: 'CTA Button Link', type: 'text', required: true, defaultValue: '/contact' },
          { name: 'is_active', label: 'Is Active', type: 'boolean', defaultValue: true },
          { name: 'start_date', label: 'Start Date/Time', type: 'datetime' },
          { name: 'end_date', label: 'End Date/Time', type: 'datetime' },
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

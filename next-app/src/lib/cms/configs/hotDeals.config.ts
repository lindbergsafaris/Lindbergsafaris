import type { ContentTypeConfig } from '../types';

export const hotDealsConfig: ContentTypeConfig = {
  slug: 'hot-deals',
  tableName: 'hot_deals',
  singular: 'Hot Deal',
  plural: 'Hot Deals',
  description: 'Time-sensitive WhatsApp promotional offers.',
  icon: 'Flame',
  revalidateTags: ['hotDeal'],
  primaryLabelField: 'title',
  hasStatusWorkflow: true,
  expiryField: 'deal_expiry',
  supportsDuplicate: true,
  listView: {
    columns: [
      { field: 'image', label: 'Image', type: 'image' },
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'tag', label: 'Tag', type: 'text' },
      { field: 'deal_expiry', label: 'Expires', type: 'expiry', sortable: true },
      { field: 'is_active', label: 'Active', type: 'boolean' },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['title', 'tag', 'whatsapp_number'],
    filters: [],
    defaultSort: { field: 'deal_expiry', direction: 'desc' },
  },
  form: {
    tabs: [
      {
        id: 'deal',
        label: 'Deal Details',
        fields: [
          { name: 'title', label: 'Deal Title', type: 'text', required: true },
          { name: 'tag', label: 'Badge Tag', type: 'text', required: true, defaultValue: 'ON SALE' },
          { name: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', required: true, defaultValue: '+254743377948' },
          { name: 'whatsapp_message', label: 'Pre-filled WhatsApp Message', type: 'textarea' },
          { name: 'deal_expiry', label: 'Deal Expiry Date/Time', type: 'datetime', required: true },
          { name: 'is_active', label: 'Is Active', type: 'boolean', defaultValue: true },
          { name: 'image', label: 'Deal Image', type: 'image', required: true },
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

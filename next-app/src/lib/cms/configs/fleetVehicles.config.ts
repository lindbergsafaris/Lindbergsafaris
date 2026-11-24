import type { ContentTypeConfig } from '../types';

export const fleetVehiclesConfig: ContentTypeConfig = {
  slug: 'fleet-vehicles',
  tableName: 'fleet_vehicles',
  singular: 'Fleet Vehicle',
  plural: 'Fleet Vehicles',
  description: 'Safari Land Cruisers, tour vans, and transport vehicles.',
  icon: 'Car',
  revalidateTags: ['fleetVehicle'],
  primaryLabelField: 'name',
  hasStatusWorkflow: true,
  displayOrderField: 'display_order',
  listView: {
    columns: [
      { field: 'image', label: 'Image', type: 'image' },
      { field: 'name', label: 'Vehicle Name', type: 'text', sortable: true },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
      { field: 'updated_at', label: 'Updated', type: 'date', sortable: true },
    ],
    searchFields: ['name'],
    filters: [],
    defaultSort: { field: 'display_order', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'vehicle',
        label: 'Vehicle Details',
        fields: [
          { name: 'name', label: 'Vehicle Name', type: 'text', required: true },
          { name: 'image', label: 'Vehicle Photo', type: 'image', required: true },
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

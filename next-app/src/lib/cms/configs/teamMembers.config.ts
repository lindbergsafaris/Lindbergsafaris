import type { ContentTypeConfig } from '../types';

export const teamMembersConfig: ContentTypeConfig = {
  slug: 'team-members',
  tableName: 'team_members',
  singular: 'Team Member',
  plural: 'Team Members',
  description: 'Company leadership and tour consultants.',
  icon: 'Users',
  revalidateTags: ['teamMember'],
  primaryLabelField: 'name',
  hasStatusWorkflow: true,
  displayOrderField: 'display_order',
  listView: {
    columns: [
      { field: 'image', label: 'Photo', type: 'image' },
      { field: 'name', label: 'Name', type: 'text', sortable: true },
      { field: 'role', label: 'Role', type: 'text', sortable: true },
      { field: 'status', label: 'Status', type: 'badge', sortable: true },
    ],
    searchFields: ['name', 'role'],
    filters: [],
    defaultSort: { field: 'display_order', direction: 'asc' },
  },
  form: {
    tabs: [
      {
        id: 'member',
        label: 'Team Member',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'role', label: 'Job Title / Role', type: 'text', required: true },
          { name: 'image', label: 'Photo', type: 'image' },
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

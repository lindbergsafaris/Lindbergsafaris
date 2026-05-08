import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the service (e.g. "Transport Services")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on the service card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Choose an icon to represent this service',
      options: {
        list: [
          { title: 'Car (Transport)', value: 'Car' },
          { title: 'Hotel (Accommodation)', value: 'Hotel' },
          { title: 'Plane (Flights / Ticketing)', value: 'Plane' },
          { title: 'Compass (Safaris / Itineraries)', value: 'Compass' },
          { title: 'Map (Destinations)', value: 'Map' },
          { title: 'Shield (Insurance / Visa)', value: 'Shield' },
          { title: 'Users (Group Travel)', value: 'Users' },
          { title: 'Heart (Honeymoon / Wellness)', value: 'Heart' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'slug',
      title: 'Detail Page Link',
      type: 'string',
      description: 'Route this card links to (e.g. "/services/transport"). Leave empty to use the default Inquire Now → /contact link.',
      placeholder: '/services/transport',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points shown on the service card (optional)',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order — smaller numbers appear first',
      initialValue: 99,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide this service from the website without deleting it',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active === false ? '⏸ ' : ''}${title}`,
        subtitle: subtitle || '→ /contact (default)',
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})

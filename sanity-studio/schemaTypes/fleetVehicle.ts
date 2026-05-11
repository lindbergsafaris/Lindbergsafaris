import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'fleetVehicle',
  title: 'Fleet Vehicle',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Vehicle Name',
      type: 'string',
      description: 'Internal reference name (e.g. "Land Cruiser 1")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageUrl',
      title: 'Vehicle Image URL (Cloudinary)',
      type: 'url',
      description: 'Paste the full Cloudinary image URL here',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})

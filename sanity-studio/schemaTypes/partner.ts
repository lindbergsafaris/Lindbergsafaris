import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo URL (Cloudinary)',
      type: 'url',
      description: 'Paste the Cloudinary logo URL here',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Optional website link for the partner',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order of the partner (smaller numbers come first)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
    prepare({ title }) {
      return {
        title: title,
      }
    },
  },
})

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Caption shown in the lightbox (e.g. "Lion Resting")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where the photo was taken (e.g. "Maasai Mara, Kenya")',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Tours', value: 'tours' },
          { title: 'Scenery', value: 'scenery' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (Cloudinary)',
      type: 'url',
      description: 'Paste the full Cloudinary image URL here',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order — smaller numbers appear first',
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      category: 'category',
    },
    prepare({ title, subtitle, category }) {
      return {
        title: title,
        subtitle: `${category ? `[${category}] ` : ''}${subtitle || ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
})

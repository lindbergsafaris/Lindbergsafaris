export default {
    name: 'destinationPost',
    title: 'Destination Post',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
        },
        {
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'destinationCategory' }],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Featured Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'imageUrl',
            title: 'External Image URL',
            type: 'url',
            description: 'Optional: Use this for Cloudinary or external images if not uploading directly.',
        },
        {
            name: 'tourCount',
            title: 'Tour Count',
            type: 'number',
            description: 'Optional: Display a number of tours available for this destination.',
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category.name',
            media: 'image',
        },
    },
}

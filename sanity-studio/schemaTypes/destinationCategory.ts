export default {
    name: 'destinationCategory',
    title: 'Destination Category',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'image',
            title: 'Hero Image',
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
            name: 'isFeatured',
            title: 'Featured (Bold & Top)',
            type: 'boolean',
            description: 'If checked, this category will appear bold and at the top of destination lists.',
            initialValue: false,
        },
    ],
}

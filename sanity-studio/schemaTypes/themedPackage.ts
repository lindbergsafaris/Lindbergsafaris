export default {
    name: 'themedPackage',
    title: 'Themed Package',
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
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Wildlife Safaris', value: 'wildlife' },
                    { title: 'Mountain Climbing', value: 'climbing' },
                    { title: 'Cruise Holiday', value: 'cruise' },
                    { title: 'Adventure Packages', value: 'adventure' },
                    { title: 'Pilgrimages', value: 'pilgrimages' },
                    { title: 'Educational & Corporate Trips', value: 'corporate' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'heroImage',
            title: 'Hero Image',
            type: 'object',
            fields: [
                {
                    name: 'url',
                    title: 'Image URL',
                    type: 'url',
                    description: 'Cloudinary image URL',
                },
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                },
            ],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Short Description',
            type: 'text',
            rows: 3,
            description: 'Introductory text for the package page',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Rich text content for the body of the page'
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category',
        },
    },
}

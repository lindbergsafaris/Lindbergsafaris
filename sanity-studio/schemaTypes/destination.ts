export default {
    name: 'destination',
    title: 'Destination',
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
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
            description: 'Short catchy phrase',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
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
        },
        {
            name: 'cardImage',
            title: 'Card Image',
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
        },
        {
            name: 'highlights',
            title: 'Highlights',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'bestTimeToVisit',
            title: 'Best Time to Visit',
            type: 'string',
        },
        {
            name: 'visaInfo',
            title: 'Visa Information',
            type: 'text',
        },
        {
            name: 'currency',
            title: 'Currency',
            type: 'string',
        },
        {
            name: 'language',
            title: 'Language',
            type: 'string',
        },
        {
            name: 'tourCount',
            title: 'Number of Tours',
            type: 'number',
            description: 'Number of tours available for this destination',
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'tagline',
        },
    },
}

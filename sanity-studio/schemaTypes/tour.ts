export default {
    name: 'tour',
    title: 'Tour',
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
            name: 'location',
            title: 'Location',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'duration',
            title: 'Duration',
            type: 'string',
            description: 'e.g., "7 Days / 6 Nights"',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'groupSize',
            title: 'Group Size',
            type: 'string',
            description: 'e.g., "Max 6 People"',
        },
        {
            name: 'difficulty',
            title: 'Difficulty',
            type: 'string',
            options: {
                list: [
                    { title: 'Easy', value: 'easy' },
                    { title: 'Moderate', value: 'moderate' },
                    { title: 'Challenging', value: 'challenging' },
                ],
            },
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
            description: 'Price in USD',
            validation: (Rule: any) => Rule.required().positive(),
        },
        {
            name: 'rating',
            title: 'Rating',
            type: 'number',
            validation: (Rule: any) => Rule.min(0).max(5),
        },
        {
            name: 'reviews',
            title: 'Number of Reviews',
            type: 'number',
            validation: (Rule: any) => Rule.min(0),
        },
        {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
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
            ],
        },
        {
            name: 'highlights',
            title: 'Highlights',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'itinerary',
            title: 'Itinerary',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'day',
                            title: 'Day',
                            type: 'number',
                        },
                        {
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                        },
                        {
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                        },
                        {
                            name: 'accommodation',
                            title: 'Accommodation',
                            type: 'string',
                        },
                        {
                            name: 'meals',
                            title: 'Meals',
                            type: 'string',
                        },
                    ],
                },
            ],
        },
        {
            name: 'included',
            title: "What's Included",
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'excluded',
            title: "What's Excluded",
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'featured',
            title: 'Featured Tour',
            type: 'boolean',
            description: 'Show on homepage',
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'location',
        },
    },
}

export default {
    name: 'accommodation',
    title: 'Accommodation',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Lodge', value: 'lodges' },
                    { title: 'Holiday Home', value: 'holiday-homes' },
                    { title: 'Town Hotel', value: 'town-hotels' },
                    { title: 'Luxury Camp', value: 'luxury-camps' },
                    { title: 'Resort Hotel', value: 'resort-hotels' },
                    { title: 'Bush Camp', value: 'bush-camps' },
                ],
            },
        },
        {
            name: 'location',
            title: 'Location',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'image',
            title: 'Main Image',
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
            name: 'rating',
            title: 'Rating (1-5)',
            type: 'number',
            validation: (Rule: any) => Rule.min(1).max(5),
        },
        {
            name: 'pricePerNight',
            title: 'Price Per Night',
            type: 'string',
            description: 'e.g., "20000" or "15000 - 25000"',
        },
        {
            name: 'amenities',
            title: 'Amenities',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of amenities (e.g., Wi-Fi, Pool, Restaurant)',
        },
        {
            name: 'gallery',
            title: 'Gallery',
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
            name: 'sections',
            title: 'Sections (Sub-pages)',
            type: 'array',
            description: 'Detailed sections for this accommodation',
            of: [
                {
                    type: 'object',
                    title: 'Section',
                    fields: [
                        {
                            name: 'title',
                            title: 'Section Title',
                            type: 'string',
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'content',
                            title: 'Content',
                            type: 'text',
                            rows: 5,
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
                    ],
                },
            ],
        },
    ],
}

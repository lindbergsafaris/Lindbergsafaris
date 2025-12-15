const accommodation = {
    name: 'accommodation',
    title: 'Accommodation',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Safari Lodges', value: 'lodges' },
                    { title: 'Holiday Homes', value: 'holiday-homes' },
                    { title: 'Town Hotels', value: 'town-hotels' },
                    { title: 'Luxury Tented Camps', value: 'luxury-camps' },
                    { title: 'Resort Hotels', value: 'resort-hotels' },
                    { title: 'Bush Camps', value: 'bush-camps' }
                ]
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'location',
            title: 'Location',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'pricePerNight',
            title: 'Price Per Night',
            type: 'string',
            description: 'e.g. "20000" or "15000 - 25000"',
            validation: Rule => Rule.required()
        },
        {
            name: 'rating',
            title: 'Rating',
            type: 'number',
            validation: Rule => Rule.min(1).max(5)
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
            name: 'description',
            title: 'Description',
            type: 'text'
        },
        {
            name: 'amenities',
            title: 'Amenities',
            type: 'array',
            of: [{ type: 'string' }]
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
            of: [
                {
                    type: 'object',
                    title: 'Section',
                    fields: [
                        {
                            name: 'title',
                            title: 'Section Title',
                            type: 'string',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'content',
                            title: 'Content',
                            type: 'text',
                            rows: 5
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
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

export default accommodation;

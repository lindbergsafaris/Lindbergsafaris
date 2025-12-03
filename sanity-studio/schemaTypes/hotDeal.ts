export default {
    name: 'hotDeal',
    title: 'Hot Deal',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
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
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'originalPrice',
            title: 'Original Price',
            type: 'number',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'tag',
            title: 'Tag',
            type: 'string',
            description: 'e.g., "Limited Time", "Best Seller"',
        },
        {
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
            initialValue: true,
        },
    ],
}

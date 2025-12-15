const hotDeal = {
    name: 'hotDeal',
    title: 'Hot Deal',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required()
        },
        {
            name: 'price',
            title: 'Price',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'originalPrice',
            title: 'Original Price',
            type: 'string'
        },
        {
            name: 'tag',
            title: 'Tag',
            type: 'string',
            description: 'e.g. "Limited Offer", "Best Value"'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'object',
            fields: [
                {
                    name: 'url',
                    title: 'Image URL',
                    type: 'url',
                    description: 'Cloudinary image URL',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string'
                }
            ],
            validation: Rule => Rule.required()
        },
        {
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
            initialValue: true
        }
    ]
}

export default hotDeal;

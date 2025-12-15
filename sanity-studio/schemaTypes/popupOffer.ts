export default {
    name: 'popupOffer',
    title: 'Pop-up Offer',
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
                },
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                },
            ],
        },
        {
            name: 'ctaText',
            title: 'CTA Text',
            type: 'string',
            initialValue: 'Claim Offer',
        },
        {
            name: 'ctaLink',
            title: 'CTA Link',
            type: 'string',
            description: 'Optional link to redirect to (e.g., /tours/safari-1)',
        },
        {
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
            initialValue: true,
        },
        {
            name: 'startDate',
            title: 'Start Date',
            type: 'datetime',
        },
        {
            name: 'endDate',
            title: 'End Date',
            type: 'datetime',
        },
    ],
}

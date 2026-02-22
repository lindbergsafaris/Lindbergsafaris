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
            name: 'image',
            title: 'Image',
            type: 'object',
            fields: [
                {
                    name: 'url',
                    title: 'Image URL',
                    type: 'url',
                    description: 'Cloudinary image URL',
                    validation: (Rule: any) => Rule.required(),
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
            name: 'whatsappNumber',
            title: 'WhatsApp Number',
            type: 'string',
            description: 'Phone number with country code (e.g. +254700000000). Used for the "Inquire More" button.',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'whatsappMessage',
            title: 'WhatsApp Pre-filled Message',
            type: 'string',
            description: 'Optional pre-filled message when user clicks "Inquire More".',
            initialValue: 'Hello, I am interested in this hot deal. Please share more details.',
        },
        {
            name: 'dealExpiry',
            title: 'Deal Expiry Date & Time',
            type: 'datetime',
            description: 'Set the deadline for this deal. A countdown or expiry notice will be shown.',
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

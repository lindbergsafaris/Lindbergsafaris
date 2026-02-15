export default {
    name: 'teamMember',
    title: 'Team Member',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'role',
            title: 'Role',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            fields: [
                {
                    name: 'url',
                    title: 'Image URL',
                    type: 'url',
                    description: 'Cloudinary image URL (optional, if not uploading directly)',
                },
                {
                    type: 'text',
                    name: 'alt',
                    title: 'Alternative text',
                    options: { isHighlighted: true }
                }
            ],
            options: {
                hotspot: true,
            },
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first',
            initialValue: 0,
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'role',
            media: 'image',
        },
    },
}

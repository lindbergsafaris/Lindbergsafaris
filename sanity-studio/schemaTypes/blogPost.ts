export default {
    name: 'blogPost',
    title: 'Blog Post',
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
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            description: 'Short summary for listing pages',
            validation: (Rule: any) => Rule.required().max(200),
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'object',
                    name: 'externalImage',
                    title: 'External Image',
                    fields: [
                        {
                            name: 'url',
                            title: 'Image URL',
                            type: 'url',
                            description: 'Paste the Cloudinary (or other) image URL here.',
                        },
                        {
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                            description: 'Alternative text for accessibility.',
                        },
                        {
                            name: 'caption',
                            title: 'Caption',
                            type: 'string',
                            description: 'Optional caption for the image.',
                        }
                    ],
                    preview: {
                        select: {
                            imageUrl: 'url',
                            title: 'alt'
                        },
                        prepare({ imageUrl, title }: any) {
                            return {
                                title: title || 'External Image',
                                subtitle: imageUrl,
                            }
                        }
                    }
                },
                {
                    type: 'object',
                    name: 'videoEmbed',
                    title: 'Video Embed',
                    fields: [
                        {
                            name: 'url',
                            title: 'Video URL',
                            type: 'url',
                            description: 'YouTube, Vimeo, or Google Drive share link',
                        },
                        {
                            name: 'caption',
                            title: 'Caption',
                            type: 'string',
                        }
                    ],
                    preview: {
                        select: {
                            url: 'url',
                        },
                        prepare({ url }: any) {
                            return {
                                title: 'Video Embed',
                                subtitle: url,
                            }
                        }
                    }
                }
            ],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'featuredImage',
            title: 'Featured Image',
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
            name: 'author',
            title: 'Author',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Wildlife', value: 'wildlife' },
                    { title: 'Travel Tips', value: 'travel-tips' },
                    { title: 'Accommodation', value: 'accommodation' },
                    { title: 'Destinations', value: 'destinations' },
                    { title: 'Culture', value: 'culture' },
                ],
            },
        },
        {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'readTime',
            title: 'Read Time',
            type: 'string',
            description: 'e.g., "5 min read"',
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'author',
        },
    },
}

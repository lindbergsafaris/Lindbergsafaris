export default {
    name: 'package',
    title: 'Themed Package',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Wildlife Safari', value: 'wildlife' },
                    { title: 'Mountain Climbing', value: 'climbing' },
                    { title: 'Cruise Holiday', value: 'cruise' },
                    { title: 'Adventure Package', value: 'adventure' },
                    { title: 'Pilgrimage', value: 'pilgrimages' },
                    { title: 'Educational & Corporate', value: 'corporate' },
                ],
            },
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'price',
            title: 'Starting Price',
            type: 'number',
        },
        {
            name: 'duration',
            title: 'Duration (Days)',
            type: 'string',
        },
    ],
}

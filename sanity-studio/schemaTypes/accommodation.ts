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
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
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
            type: 'number',
        },
    ],
}

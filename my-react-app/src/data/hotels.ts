export interface Hotel {
    id: string;
    name: string;
    location: string;
    description: string;
    image: string;
    features: string[];
    priceRange: string;
}

export const hotels: Hotel[] = [
    {
        id: '1',
        name: 'The Giraffe Manor',
        location: 'Nairobi, Kenya',
        description: `Experience the extraordinary at Giraffe Manor, an exclusive boutique hotel set in 12 acres of private land within 140 acres of indigenous forest in the Langata suburb of Nairobi. As one of Nairobi's most iconic buildings, Giraffe Manor appeals to visitors from all over the world who flock here to experience the bucket-list breakfast with the resident Rothschild's giraffes.
        
        The manor dates back to the 1930s and has maintained all the charm of that era. It offers a uniquely intimate experience, with just 12 rooms, each with its own distinct personality and elegant furnishings. Guests can enjoy full-board accommodation, including all meals and house drinks, as well as chauffeured vehicles for sightseeing.`,
        image: 'https://images.unsplash.com/photo-1544985360-15f59048032b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        features: ['Breakfast with Giraffes', 'Historic Manor House', 'Fine Dining', 'Private Forest Sanctuary', 'Spa Treatments'],
        priceRange: '$$$$$'
    },
    {
        id: '2',
        name: 'Mahali Mzuri',
        location: 'Masai Mara, Kenya',
        description: `Mahali Mzuri is Sir Richard Branson's 12-tented luxury safari camp in the Kenyan Bush. Located in the Olare Motorogi Conservancy in the wider ecosystem of the Maasai Mara, Mahali Mzuri offers you a front-row seat to the Great Migration.
        
        The camp is designed to be your home away from home, with a relaxed atmosphere and a team dedicated to making your stay as special as possible. Each tent is a spacious suite with a private deck, offering uninterrupted views of the African bush. You can expect exceptional game viewing, gourmet meals, and the ultimate in comfort and style.`,
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        features: ['Luxury Tented Suites', 'Infinity Pool', 'Game Drives', 'Guided Bush Walks', 'All-Inclusive'],
        priceRange: '$$$$$'
    },
    {
        id: '3',
        name: 'Hemingways Watamu',
        location: 'Watamu, Kenya',
        description: `Hemingways Watamu is an iconic tropical paradise on the Kenyan coast sitting right in the middle of the pristine Watamu Marine National Park. The hotel offers a relaxed luxury atmosphere with stunning ocean views from every room.
        
        With its white sandy beaches and turquoise waters, it is the perfect place to unwind after a safari. The hotel features a world-class spa, two swimming pools, and a variety of water sports. The dining experience is equally impressive, with fresh seafood and international cuisine served in a beautiful setting.`,
        image: 'https://images.unsplash.com/photo-1571896349842-68c2531b2602?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        features: ['Ocean View Rooms', 'Marine Park Access', 'Luxury Spa', 'Deep Sea Fishing', 'Fine Dining'],
        priceRange: '$$$$'
    },
    {
        id: '4',
        name: 'Segera Retreat',
        location: 'Laikipia Plateau, Kenya',
        description: `Segera Retreat is a lifestyle destination that offers a unique and holistic approach to safari. Located on the Laikipia Plateau, Segera is a sanctuary for wildlife and a haven for art and culture.
        
        The retreat consists of six timber and thatch villas, raised above a profusion of botanical life. The interiors are a blend of contemporary design and African art, creating a space that is both stylish and comfortable. Guests can enjoy a range of activities, from game drives and bush walks to art tours and wellness treatments.`,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        features: ['Private Villas', 'Art Collection', 'Wellness Center', 'Conservation Activities', 'Helicopter Safaris'],
        priceRange: '$$$$$'
    }
];

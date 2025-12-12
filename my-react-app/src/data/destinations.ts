export interface PlaceToVisit {
    title: string;
    description: string;
    image: string;
}

export interface DestinationData {
    id: string;
    name: string;
    tagline: string;
    description: string;
    heroImage: string;
    highlights: string[];
    practicalInfo: {
        bestTime: string;
        visaInfo: string;
        currency: string;
        language: string;
    };
    placesToVisit: PlaceToVisit[];
}

export const destinationsData: Record<string, DestinationData> = {
    'east-africa': {
        id: 'east-africa',
        name: 'East Africa',
        tagline: 'The Cradle of Safari',
        description: 'East Africa is the quintessential safari destination, home to the Great Migration, the Big Five, and diverse landscapes ranging from savannahs to snow-capped mountains. Explore the vast plains of the Serengeti and Masai Mara, track gorillas in the misty forests of Uganda and Rwanda, or relax on the pristine beaches of Zanzibar.',
        heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'Great Wildebeest Migration',
            'Gorilla Trekking in Bwindi & Volcanoes NP',
            'Mount Kilimanjaro Climbing',
            'Zanzibar Beach Holidays',
            'Ngorongoro Crater'
        ],
        practicalInfo: {
            bestTime: 'June to October (Dry Season)',
            visaInfo: 'East Africa Tourist Visa available',
            currency: 'KES, TZS, UGX, RWF (USD widely accepted)',
            language: 'Swahili, English'
        },
        placesToVisit: [
            {
                title: 'Masai Mara National Reserve, Kenya',
                description: 'World-renowned for its exceptional populations of lions, leopards, cheetahs, and elephants, and the annual migration of wildebeest, zebras, and Thomson\'s gazelles.',
                image: 'https://images.unsplash.com/photo-1534759846116-5799c33ce22a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Serengeti National Park, Tanzania',
                description: 'A vast ecosystem in east-central Africa. It spans 12,000 square miles giving rise to the Great Migration, one of the Seven Natural Wonders of Africa.',
                image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Bwindi Impenetrable Forest, Uganda',
                description: 'Home to almost half of the world\'s mountain gorilla population. This primeval forest offers a unique and challenging trekking experience.',
                image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    'dubai': {
        id: 'dubai',
        name: 'Dubai',
        tagline: 'The City of Gold',
        description: 'Dubai is a city of superlatives, where traditional Arabian culture meets futuristic innovation. From the world\'s tallest building to man-made islands, luxury shopping, and desert adventures, Dubai offers an unforgettable experience.',
        heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'Burj Khalifa',
            'The Dubai Mall',
            'Palm Jumeirah',
            'Desert Safari',
            'Dubai Marina'
        ],
        practicalInfo: {
            bestTime: 'November to March',
            visaInfo: 'Visa on arrival for many nationalities',
            currency: 'UAE Dirham (AED)',
            language: 'Arabic, English'
        },
        placesToVisit: [
            {
                title: 'Burj Khalifa',
                description: 'The world\'s tallest building, offering breathtaking views of the city and beyond from its observation decks.',
                image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'The Dubai Fountain',
                description: 'A captivating water, music, and light spectacle in Downtown Dubai. It is the world\'s largest choreographed fountain system.',
                image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Dubai Miracle Garden',
                description: 'The world\'s largest natural flower garden, featuring over 50 million flowers and 250 million plants.',
                image: 'https://images.unsplash.com/photo-1597211684627-d87802305f2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    'italy': {
        id: 'italy',
        name: 'Italy',
        tagline: 'La Dolce Vita',
        description: 'Italy is a country of diverse beauty, from the rolling hills of Tuscany to the ancient ruins of Rome and the romantic canals of Venice. Enjoy world-class cuisine, art, and history.',
        heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'Colosseum & Roman Forum',
            'Venice Canals',
            'Florence Cathedral',
            'Amalfi Coast',
            'Cinque Terre'
        ],
        practicalInfo: {
            bestTime: 'April to June, September to October',
            visaInfo: 'Schengen Visa',
            currency: 'Euro (EUR)',
            language: 'Italian'
        },
        placesToVisit: [
            {
                title: 'Rome',
                description: 'The Eternal City, home to the Colosseum, Vatican City, and the Trevi Fountain. A living museum of history.',
                image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Venice',
                description: 'Built on more than 100 small islands in a lagoon in the Adriatic Sea. It has no roads, just canals – including the Grand Canal thoroughfare.',
                image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Florence',
                description: 'The cradle of the Renaissance, famous for its art and architecture, including the Duomo and Michelangelo\'s David.',
                image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    'west-africa': {
        id: 'west-africa',
        name: 'West Africa',
        tagline: 'Culture, History, and Vibrant Life',
        description: 'West Africa offers a rich tapestry of history, culture, and music. From the bustling markets of Lagos and Accra to the serene beaches of Sierra Leone and the historic slave forts of Ghana.',
        heroImage: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'Cape Coast Castle, Ghana',
            'Goree Island, Senegal',
            'Mole National Park',
            'Lekki Conservation Centre',
            'Ganvie Lake Village'
        ],
        practicalInfo: {
            bestTime: 'November to March',
            visaInfo: 'ECOWAS visa or individual country visas',
            currency: 'XOF, GHS, NGN',
            language: 'English, French, Portuguese'
        },
        placesToVisit: [
            {
                title: 'Accra, Ghana',
                description: 'A vibrant city known for its colorful markets, historic forts, and lively beaches like Labadi Beach.',
                image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Dakar, Senegal',
                description: 'The westernmost city on the African mainland, famous for its musical culture and the historic Goree Island.',
                image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    'south-africa': {
        id: 'south-africa',
        name: 'South Africa',
        tagline: 'A World in One Country',
        description: 'South Africa is famous for its varied topography, great natural beauty, and cultural diversity. From the vineyards of the Cape Winelands to the cliffs of the Cape of Good Hope and the savannah of Kruger National Park.',
        heroImage: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'Kruger National Park',
            'Table Mountain',
            'Cape Winelands',
            'Garden Route',
            'Robben Island'
        ],
        practicalInfo: {
            bestTime: 'May to September (Safari), November to March (Cape Town)',
            visaInfo: 'Visa free for many nationalities',
            currency: 'South African Rand (ZAR)',
            language: '11 Official Languages including English'
        },
        placesToVisit: [
            {
                title: 'Cape Town',
                description: 'The Mother City, known for its harbor, natural setting in the Cape Floristic Region, and landmarks such as Table Mountain and Cape Point.',
                image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Kruger National Park',
                description: 'One of Africa\'s largest game reserves. Its high density of wild animals includes the Big 5: lions, leopards, rhinos, elephants and buffalos.',
                image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    'qatar': {
        id: 'qatar',
        name: 'Qatar',
        tagline: 'Where Tradition Meets Modernity',
        description: 'Qatar is a peninsula Arab country whose terrain comprises arid desert and a long Persian (Arab) Gulf shoreline of beaches and dunes. Also on the coast is the capital, Doha, known for its futuristic skyscrapers and other ultramodern architecture.',
        heroImage: 'https://images.unsplash.com/photo-1595842873736-231968393522?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'Souq Waqif',
            'Museum of Islamic Art',
            'The Pearl-Qatar',
            'Katara Cultural Village',
            'Inland Sea'
        ],
        practicalInfo: {
            bestTime: 'November to April',
            visaInfo: 'Visa on arrival for many nationalities',
            currency: 'Qatari Riyal (QAR)',
            language: 'Arabic, English'
        },
        placesToVisit: [
            {
                title: 'Doha',
                description: 'The capital city, home to the Museum of Islamic Art, Souq Waqif, and the stunning Corniche waterfront promenade.',
                image: 'https://images.unsplash.com/photo-1595842873736-231968393522?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'The Pearl-Qatar',
                description: 'A man-made island featuring Mediterranean-style yacht-lined marinas, residential towers, villas, and hotels.',
                image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    'spain': {
        id: 'spain',
        name: 'Spain',
        tagline: 'Passion in Every Corner',
        description: 'Spain is a country on Europe’s Iberian Peninsula, includes 17 autonomous regions with diverse geography and cultures. Capital city Madrid is home to the Royal Palace and Prado museum.',
        heroImage: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'Sagrada Familia',
            'Alhambra',
            'Park Güell',
            'Ibiza',
            'Prado Museum'
        ],
        practicalInfo: {
            bestTime: 'April to June, September to October',
            visaInfo: 'Schengen Visa',
            currency: 'Euro (EUR)',
            language: 'Spanish'
        },
        placesToVisit: [
            {
                title: 'Barcelona',
                description: 'The cosmopolitan capital of Spain’s Catalonia region, known for its art and architecture, particularly the fantastical Sagrada Família church.',
                image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Madrid',
                description: 'The capital, known for its elegant boulevards and expansive, manicured parks such as the Buen Retiro.',
                image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    },
    'uk': {
        id: 'uk',
        name: 'United Kingdom',
        tagline: 'Great Britain & Northern Ireland',
        description: 'The United Kingdom, made up of England, Scotland, Wales and Northern Ireland, is an island nation in northwestern Europe. England – birthplace of Shakespeare and The Beatles – is home to the capital, London.',
        heroImage: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        highlights: [
            'London Eye',
            'Tower of London',
            'Edinburgh Castle',
            'Stonehenge',
            'Lake District'
        ],
        practicalInfo: {
            bestTime: 'May to September',
            visaInfo: 'Standard Visitor Visa',
            currency: 'Pound Sterling (GBP)',
            language: 'English'
        },
        placesToVisit: [
            {
                title: 'London',
                description: 'The capital of England and the United Kingdom, a 21st-century city with history stretching back to Roman times.',
                image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Edinburgh',
                description: 'Scotland\'s compact, hilly capital. It has a medieval Old Town and elegant Georgian New Town with gardens and neoclassical buildings.',
                image: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    }
};

export const regionData: Record<string, any> = {
    'africa': {
        id: 'africa',
        title: 'Africa',
        description: 'Experience the untamed beauty of the African continent.',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
        subDestinations: [
            { id: 'east-africa', name: 'East Africa', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 12 },
            { id: 'west-africa', name: 'West Africa', image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 5 },
            { id: 'south-africa', name: 'South Africa', image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 8 },
        ]
    },
    'middle-east': {
        id: 'middle-east',
        title: 'Middle East',
        description: 'Discover the rich history and modern marvels of the Middle East.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80',
        subDestinations: [
            { id: 'dubai', name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 15 },
            { id: 'qatar', name: 'Qatar', image: 'https://images.unsplash.com/photo-1595842873736-231968393522?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 6 },
        ]
    },
    'europe': {
        id: 'europe',
        title: 'Europe',
        description: 'Explore the diverse cultures and landscapes of Europe.',
        image: 'https://images.unsplash.com/photo-1471341971474-27c5b814c7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
        subDestinations: [
            { id: 'italy', name: 'Italy', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 10 },
            { id: 'spain', name: 'Spain', image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 8 },
            { id: 'uk', name: 'UK', image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tourCount: 7 },
        ]
    }
};

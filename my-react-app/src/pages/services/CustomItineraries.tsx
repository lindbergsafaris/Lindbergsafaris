import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomItineraries = () => {
    const itineraries = [
        {
            title: "Great Migration Safari – 3 Days / 2 Nights",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom3_djob7r.png",
            duration: "3 Days / 2 Nights",
            location: "Masai Mara National Reserve",
            dates: "July | August | September | October",
            description: "Begin your journey in Nairobi before heading to the legendary Masai Mara National Reserve, the stage for Africa’s greatest wildlife spectacle the Great Migration. With two game drives daily, you’ll witness vast herds of wildebeest and zebras sweeping across the savannah, while lions, leopards, elephants, rhinos, and buffalo the famed Big Five roam freely. Sunrise and sunset paint the plains in golden hues, creating unforgettable safari moments.",
            additionalInfo: "Stay in carefully selected safari lodges or camps that blend comfort with wilderness immersion. Your expert guides share insights into animal behavior, Mara ecology, and local Maasai culture, making every drive an enriching adventure.",
            highlights: [
                "Daily game drives at prime wildlife viewing times",
                "Chance to witness the dramatic wildebeest migration",
                "Spotting the Big Five in iconic African landscapes",
                "Small-group experiences for personalized safari moments"
            ]
        },
        {
            title: "10-Day Kenya Safari: Amboseli, Laikipia & Masai Mara",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom2_alilvz.png",
            duration: "10 Days / 9 Nights",
            location: "Amboseli, Laikipia & Masai Mara",
            description: "Begin your journey in Nairobi, where your safari host welcomes you and sets the stage for Kenya’s wild wonders. From here, head straight into the heart of the wilderness for a truly unforgettable adventure.",
            details: [
                "Travel to Amboseli National Park for two days of game drives beneath the towering snow-capped Kilimanjaro. Spot majestic elephant herds, lions, cheetahs, buffalo, and over 600 bird species as the golden savannah comes alive at sunrise and sunset. Every moment is a chance for thrilling wildlife encounters and unforgettable photographs.",
                "Next, explore Laikipia’s Loisaba Conservancy over two days of discovery. Rolling river valleys, open plains, and rich forests are home to the Big Five, endangered wild dogs, and an extraordinary variety of birds. Venture through the bush on game drives, horseback, or camel, and witness cutting-edge conservation efforts protecting Kenya’s wilderness.",
                "Finally, immerse yourself in the legendary Masai Mara for three days of extraordinary safari experiences. Witness iconic predator action, elephant herds, and vast herds of wildebeest and zebras during migration season. Expert Maasai guides reveal both epic wildlife moments and the Mara’s quieter, hidden corners."
            ],
            conclusion: "Conclude your adventure with a return to Nairobi, reflecting on ten days of sweeping landscapes, dramatic wildlife encounters, and the magic of Kenya at its most spectacular.",
            highlights: [
                "Experience three iconic safari regions in one journey: Amboseli, Laikipia, and the Masai Mara.",
                "Witness majestic elephants, the Big Five, and seasonal wildebeest migration in their natural habitats.",
                "Enjoy daily guided game drives, bush walks, horseback or camel safaris, and immersive wildlife encounters.",
                "Discover cutting-edge conservation efforts and meet the teams protecting Kenya’s wilderness.",
                "Capture breathtaking landscapes, from snow-capped Kilimanjaro to rolling Laikipia plains and acacia-dotted Mara savannahs.",
                "Small-group experiences ensure a personalized and unforgettable safari adventure."
            ]
        },
        {
            title: "Cultural Tour – Nairobi",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom4_y0h6wn.png",
            duration: "1 Day",
            location: "Nairobi",
            description: "Dive into the heart of Nairobi, Kenya’s lively capital, on a journey that blends heritage, modern life, and local experiences. Guided by Nairobi natives, explore historic landmarks, bustling markets, and green urban parks while discovering the city’s diverse communities and traditions.",
            additionalInfo: "Along the way, enjoy traditional Kenyan cuisine with a modern twist, paired with the colorful energy of matatu culture, where decorated minibuses, local music, and vibrant street art give Nairobi its unique rhythm. This relaxed yet immersive tour offers a true taste of Nairobi its people, its flavors, and its spirit.",
            highlights: [
                "Nairobi city landmarks: KICC, Kenyatta Avenue, and key historical sites.",
                "Local markets: The sights, sounds, and colors of Nairobi’s bustling bazaars.",
                "Artisan workshops: Traditional crafts and interactions with local artists.",
                "Cultural performances: Traditional music, dance, and ceremonies showcasing Kenya’s diverse communities.",
                "Neighborhood visits: Insight into daily life, customs, and local traditions.",
                "Kenyan cuisine experiences: Sample traditional dishes with a modern twist, showcasing local flavors in a contemporary way.",
                "Matatu culture: Experience Nairobi’s iconic minibuses, vibrant street art, and local music a true urban adventure.",
                "Urban nature: Explore Nairobi’s parks and green spaces blending city life with nature."
            ]
        },
        {
            title: "Bush to Beach Safari – 10 Days / 9 Nights",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005649/custom7_tcdgmc.png",
            duration: "10 Days / 9 Nights",
            location: "Nairobi, Lake Nakuru, Lake Naivasha, Masai Mara, Mombasa Coast",
            description: "Begin your adventure in Nairobi, Kenya’s vibrant capital, where your safari host welcomes you and sets the stage for an unforgettable journey. Explore the city’s rich culture and wildlife on a Nairobi city tour, visiting the David Sheldrick Wildlife Trust to see orphaned elephants, the Giraffe Centre to meet endangered Rothschild giraffes up close, and the Nairobi National Park, where wildlife roams against the backdrop of the city skyline.",
            details: [
                "Your safari then moves into the wild heart of Kenya. Visit Lake Nakuru, famed for its flamingos and diverse wildlife, and Lake Naivasha, where hippos, giraffes, and a variety of birdlife thrive. Spend days on thrilling game drives and boat rides, immersing yourself in the stunning landscapes of the Great Rift Valley.",
                "Next, experience the legendary Masai Mara, where sweeping acacia-dotted plains teem with wildlife. Spend three days on morning and afternoon game drives, witnessing lions, leopards, elephants, and, during migration season, vast herds of wildebeest and zebras crossing the plains a spectacle like no other.",
                "After your Mara adventure, return briefly to Nairobi before flying to the coast of Mombasa. Relax and unwind along the pristine beaches of Mombasa, Diani, or Watamu for three days of sun, sea, and sand, blending your bush safari with coastal serenity."
            ],
            conclusion: "Swim in turquoise waters, explore marine life, or simply soak up the tropical atmosphere before your journey back to Nairobi for departure, carrying memories of Kenya’s incredible wildlife, landscapes, and culture.",
            highlights: [
                "Nairobi city tour: Landmarks, parks, and cultural highlights.",
                "Lake Nakuru: Flamingos, rhinos, and a diverse array of wildlife.",
                "Lake Naivasha: Hippos, giraffes, and scenic boat rides.",
                "Masai Mara: Big Five, seasonal wildebeest migration, lions, leopards, elephants, and breathtaking savannah landscapes.",
                "Mombasa & Coastal Escapes: White sand beaches, turquoise waters, and marine life.",
                "Cultural experiences: Local communities, Maasai culture, and vibrant Kenyan traditions."
            ]
        },
        {
            title: "Honeymoon Safari – 4 Days / 3 Nights",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005641/custom8_v6wrjr.png",
            duration: "4 Days / 3 Nights",
            location: "Masai Mara",
            description: "Celebrate love in the heart of the Masai Mara, where endless golden plains and breathtaking sunsets create the perfect romantic backdrop. Over four days and three nights, enjoy intimate moments together in the wild, with optional morning and afternoon game drives to spot elephants, lions, giraffes, and more.",
            additionalInfo: "For a truly magical experience, rise early for a hot air balloon safari, drifting over the savannah as the sun illuminates the landscape, followed by a champagne breakfast in the bush. Unwind together in luxury and privacy, share quiet moments under the vast African skies, and toast to unforgettable memories amid the iconic beauty of the Mara.",
            conclusion: "Every detail of this honeymoon safari is designed for romance, adventure, and connection a once-in-a-lifetime escape for two."
        },
        {
            title: "Elephant Safari – Amboseli & Tsavo East",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005654/custom9_u9dqjn.png",
            duration: "4 Days / 3 Nights",
            location: "Amboseli & Tsavo East",
            description: "Embark on a 4-day wildlife adventure focused on Kenya’s gentle giants the elephants. Begin in Amboseli National Park, where vast savannahs unfold beneath the snow-capped Mount Kilimanjaro. Spend two days on game drives, watching majestic elephant herds move gracefully across the plains, while lions, giraffes, buffalo, and a rich variety of birds complete the iconic African scene.",
            additionalInfo: "Next, journey to Tsavo East, a stunning wilderness of red-earth landscapes and open plains, home to some of Kenya’s largest elephant populations. Explore the park on game drives through diverse habitats, spotting elephants in their natural environment and learning about local conservation efforts from your expert guides.",
            conclusion: "This safari is perfect for elephant lovers and wildlife enthusiasts, offering immersive encounters with these magnificent creatures while experiencing the beauty and diversity of Kenya’s premier national parks"
        },
        {
            title: "Coastal Escape – Diani",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005637/custom10_qs8apu.png",
            duration: "3 Days / 2 Nights",
            location: "Diani Beach",
            description: "Unwind on the white-sand beaches of Diani, where turquoise waters and swaying palms set the perfect backdrop. Enjoy dolphin-watching excursions or a sunset dhow cruise for unforgettable moments on the Indian Ocean.",
            additionalInfo: "Travel via flight or the scenic SGR rail/road route, combining convenience with adventure. Relax, explore marine life, and soak up the magic of Kenya’s coast."
        },
        {
            title: "Kenya Golf & Safari Adventure",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005634/custom11_jqqxb4.png",
            duration: "10 Days / 9 Nights",
            location: "Nairobi, Mount Kenya, Lake Naivasha, Masai Mara",
            description: "Experience the perfect blend of world-class golf and Kenya’s iconic wildlife on this unforgettable journey. Begin in Nairobi, where you visit the Giraffe Centre to meet endangered Rothschild giraffes up close. After your city introduction, unwind at the Windsor Golf & Country Club, teeing off on lush fairways or enjoying the lodge’s tranquil surroundings.",
            details: [
                "Venture into the Central Highlands to the legendary Mount Kenya Safari Club, where golf takes on a unique twist crossing the Equator mid-round while enjoying panoramic mountain views. The manicured fairways and serene water features make this a memorable golfing experience while providing a perfect setting to relax amidst nature.",
                "Continue to Lake Naivasha, set in the heart of the Great Rift Valley. Tee off on the scenic Lake Naivasha Golf Course, surrounded by beautiful landscapes and wildlife. Explore the lake on a boat ride, spotting hippos, exotic birds, and other aquatic wildlife. Take a walking safari on Crescent Island, encountering giraffes, zebras, impalas, and waterbucks in their natural habitat.",
                "The journey culminates in the legendary Masai Mara, where rolling plains and acacia trees are home to lions, elephants, leopards, buffalo, and rhinos. Enjoy morning and afternoon game drives, witnessing Africa’s Big Five and breathtaking wildlife scenes. Relax at your lodge, soak in the African landscapes, and let the rhythms of the bush create unforgettable memories."
            ],
            conclusion: "From the precision of a perfect putt to the thrill of spotting elephants and giraffes in the wild, this safari combines golfing excellence, immersive wildlife encounters, and luxury relaxation — perfect for adventure seekers and golf enthusiasts alike."
        },
        {
            title: "Ladies Safari & Coastal Escape",
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1772005655/custom12_mnbfij.png",
            duration: "8 Days",
            location: "Nairobi, Ol Pejeta, Lake Nakuru, Lake Naivasha, Masai Mara, Mombasa",
            description: "Celebrate friendship, freedom, and adventure on this unforgettable journey through Kenya’s most iconic destinations. Your experience begins in Nairobi, where you’ll meet rescued baby elephants at a renowned elephant orphanage and feed endangered Rothschild giraffes at a peaceful urban sanctuary, the perfect introduction to Kenya’s inspiring conservation efforts.",
            details: [
                "Travel north with a stop at the Equator before enjoying exciting game drives in one of Kenya’s leading conservancies. Visit a special chimpanzee sanctuary, home to rescued and rehabilitated chimps, and spot rhinos, elephants, lions, and other wildlife roaming freely across the plains.",
                "Continue to Lake Nakuru, famous for its flamingo-lined shores and thriving rhino population. Game drives here reveal black and white rhinos,  giraffes, lions, leopards, and abundant birdlife. Nearby Lake Naivasha offers an optional boat ride among hippos and colorful water birds in a serene lakeside setting.",
                "The adventure deepens in the legendary Masai Mara, where sweeping golden plains and acacia trees create the ultimate safari backdrop. Enjoy immersive game drives in search of the Big Five, alongside cheetahs, giraffes, zebras, and dramatic African sunsets.",
                "From the savannah, journey back to Nairobi and continue to the coast. Discover centuries of Swahili history during a city tour before unwinding on pristine white-sand beaches. Enjoy swimming, snorkeling, sailing, bird watching, and a magical sunset dhow cruise on the Indian Ocean."
            ],
            conclusion: "This Ladies Safari is a seamless blend of wildlife, culture, coastal serenity, and shared adventure designed for women seeking connection, exploration, and unforgettable memories together.",
            highlights: [
                "Nairobi – Up-close encounters with rescued baby elephants at the David Sheldrick Wildlife Trust and feeding endangered Rothschild giraffes at the Giraffe Centre",
                "Ol Pejeta Conservancy – Equator crossing experience, rhino sanctuary, Big Five sightings, and a visit to the Sweetwater’s Chimpanzee Sanctuary within Ol Pejeta Conservancy",
                "Lake Nakuru National Park – Flamingo-lined shores, black and white rhinos, Rothschild giraffes, lions, leopards, and diverse birdlife",
                "Lake Naivasha (Optional) – Scenic boat ride among hippos and water birds on Lake Naivasha",
                "Masai Mara National Reserve – Big Five game drives, sweeping savannah landscapes, golden sunsets, and abundant wildlife in one of Africa’s most iconic reserves",
                "Mombasa Coast – Historic exploration of Fort Jesus, white sandy beaches, Indian Ocean swimming, snorkeling, sailing, and a magical sunset dhow cruise",
                "Leisure & Relaxation – Luxury lodges, beachfront stays, hotel amenities, and time to unwind with your travel sisters"
            ]
        }
    ];

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom1_msrndf.png")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">CUSTOM ITINERARIES</h1>
                </Container>
            </div>

            <Section className="bg-white py-20">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Main Content */}
                        <div className="lg:w-2/3 space-y-20">
                            {itineraries.map((itinerary, index) => (
                                <div key={index} className="group">
                                    <div className="mb-6">
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 transition-colors group-hover:text-primary">
                                            {itinerary.title}
                                        </h2>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-primary" size={18} />
                                                <span className="font-semibold">{itinerary.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="text-primary" size={18} />
                                                <span>{itinerary.location}</span>
                                            </div>
                                            {itinerary.dates && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="text-primary" size={18} />
                                                    <span>Available: {itinerary.dates}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {itinerary.image && (
                                        <div className="relative mb-8 overflow-hidden rounded-2xl shadow-xl">
                                            <img
                                                src={itinerary.image}
                                                alt={itinerary.title}
                                                className="w-full h-auto max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none">
                                        <p className="mb-6">{itinerary.description}</p>

                                        {itinerary.additionalInfo && (
                                            <p className="mb-6">{itinerary.additionalInfo}</p>
                                        )}

                                        {itinerary.details && (
                                            <div className="space-y-4 mb-6">
                                                {itinerary.details.map((detail, idx) => (
                                                    <p key={idx}>{detail}</p>
                                                ))}
                                            </div>
                                        )}

                                        {itinerary.conclusion && (
                                            <p className="mb-8">{itinerary.conclusion}</p>
                                        )}

                                        {itinerary.highlights && (
                                            <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-100">
                                                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                                                    <span className="w-1.5 h-8 bg-primary rounded-full mr-2" />
                                                    {itinerary.highlights.length > 3 ? 'What You Will See & Experience' : 'Why Book This Safari'}
                                                </h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                                    {itinerary.highlights.map((highlight, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-gray-700 m-0">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                            <span className="text-base">{highlight}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="flex justify-start pt-4 border-t border-gray-100">
                                            <Link to="/contact">
                                                <Button size="lg" className="px-8 shadow-md hover:shadow-lg transition-all">
                                                    Book This Safari
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {index < itineraries.length - 1 && (
                                        <div className="mt-20 border-b border-gray-100" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-accent text-white p-10 rounded-2xl text-center shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />

                                    <h3 className="text-3xl font-serif font-bold mb-4 relative z-10">Ready to go?</h3>
                                    <p className="mb-8 text-white/90 text-lg relative z-10">
                                        Our travel experts are ready to craft your perfect journey.
                                    </p>
                                    <Link to="/contact" className="relative z-10">
                                        <Button variant="outline" className="w-full py-6 text-lg border-white text-white hover:bg-white hover:text-accent transition-all duration-300">
                                            Get a Quote
                                        </Button>
                                    </Link>
                                </div>

                                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                                    <h4 className="text-xl font-serif font-bold text-gray-900 mb-4 text-center">Why Lindberg?</h4>
                                    <ul className="space-y-4">
                                        {[
                                            "Expert local knowledge",
                                            "Personalized service",
                                            "Sustainable tourism focus",
                                            "Reliable ground transport"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default CustomItineraries;

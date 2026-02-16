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
            duration: "3 Days / 2 Nights",
            location: "Masai Mara National Reserve",
            dates: "July | August | September | October",
            description: "Begin your journey in Nairobi before heading to the legendary Masai Mara National Reserve, the stage for Africa's greatest wildlife spectacle the Great Migration. With two game drives daily, you'll witness vast herds of wildebeest and zebras sweeping across the savannah, while lions, leopards, elephants, rhinos, and buffalo the famed Big Five roam freely. Sunrise and sunset paint the plains in golden hues, creating unforgettable safari moments.",
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
            duration: "10 Days / 9 Nights",
            location: "Amboseli, Laikipia & Masai Mara",
            description: "Begin your journey in Nairobi, where your safari host welcomes you and sets the stage for Kenya's wild wonders. From here, head straight into the heart of the wilderness for a truly unforgettable adventure.",
            details: [
                "Travel to Amboseli National Park for two days of game drives beneath the towering snow-capped Kilimanjaro. Spot majestic elephant herds, lions, cheetahs, buffalo, and over 600 bird species as the golden savannah comes alive at sunrise and sunset.",
                "Next, explore Laikipia's Loisaba Conservancy over two days of discovery. Rolling river valleys, open plains, and rich forests are home to the Big Five, endangered wild dogs, and an extraordinary variety of birds. Venture through the bush on game drives, horseback, or camel, and witness cutting-edge conservation efforts protecting Kenya's wilderness.",
                "Finally, immerse yourself in the legendary Masai Mara for three days of extraordinary safari experiences. Witness iconic predator action, elephant herds, and vast herds of wildebeest and zebras during migration season. Expert Maasai guides reveal both epic wildlife moments and the Mara's quieter, hidden corners."
            ],
            conclusion: "Conclude your adventure with a return to Nairobi, reflecting on ten days of sweeping landscapes, dramatic wildlife encounters, and the magic of Kenya at its most spectacular.",
            highlights: [
                "Experience three iconic safari regions in one journey",
                "Witness majestic elephants, the Big Five, and seasonal wildebeest migration",
                "Enjoy daily guided game drives, bush walks, horseback or camel safaris",
                "Discover cutting-edge conservation efforts",
                "Capture breathtaking landscapes from Kilimanjaro to the Mara",
                "Small-group experiences ensure personalized safari adventure"
            ]
        },
        {
            title: "Cultural Tour – Nairobi",
            duration: "1 Day",
            location: "Nairobi",
            description: "Dive into the heart of Nairobi, Kenya's lively capital, on a journey that blends heritage, modern life, and local experiences. Guided by Nairobi natives, explore historic landmarks, bustling markets, and green urban parks while discovering the city's diverse communities and traditions.",
            additionalInfo: "Along the way, enjoy traditional Kenyan cuisine with a modern twist, paired with the colorful energy of matatu culture, where decorated minibuses, local music, and vibrant street art give Nairobi its unique rhythm. This relaxed yet immersive tour offers a true taste of Nairobi its people, its flavors, and its spirit.",
            highlights: [
                "Nairobi city landmarks: KICC, Kenyatta Avenue, and key historical sites",
                "Local markets: The sights, sounds, and colors of Nairobi's bustling bazaars",
                "Artisan workshops: Traditional crafts and interactions with local artists",
                "Cultural performances: Traditional music, dance, and ceremonies",
                "Neighborhood visits: Insight into daily life, customs, and local traditions",
                "Kenyan cuisine experiences: Sample traditional dishes with a modern twist",
                "Matatu culture: Experience Nairobi's iconic minibuses and vibrant street art",
                "Urban nature: Explore Nairobi's parks and green spaces"
            ]
        },
        {
            title: "Bush to Beach Safari – 10 Days / 9 Nights",
            duration: "10 Days / 9 Nights",
            location: "Nairobi, Lake Nakuru, Lake Naivasha, Masai Mara, Mombasa Coast",
            description: "Begin your adventure in Nairobi, Kenya's vibrant capital, where your safari host welcomes you and sets the stage for an unforgettable journey. Explore the city's rich culture and wildlife on a Nairobi city tour, visiting the David Sheldrick Wildlife Trust to see orphaned elephants, the Giraffe Centre to meet endangered Rothschild giraffes up close, and the Nairobi National Park, where wildlife roams against the backdrop of the city skyline.",
            details: [
                "Your safari then moves into the wild heart of Kenya. Visit Lake Nakuru, famed for its flamingos and diverse wildlife, and Lake Naivasha, where hippos, giraffes, and a variety of birdlife thrive. Spend days on thrilling game drives and boat rides, immersing yourself in the stunning landscapes of the Great Rift Valley.",
                "Next, experience the legendary Masai Mara, where sweeping acacia-dotted plains teem with wildlife. Spend three days on morning and afternoon game drives, witnessing lions, leopards, elephants, and, during migration season, vast herds of wildebeest and zebras crossing the plains a spectacle like no other.",
                "After your Mara adventure, return briefly to Nairobi before flying to the coast of Mombasa. Relax and unwind along the pristine beaches of Mombasa, Diani, or Watamu for three days of sun, sea, and sand, blending your bush safari with coastal serenity."
            ],
            conclusion: "Swim in turquoise waters, explore marine life, or simply soak up the tropical atmosphere before your journey back to Nairobi for departure, carrying memories of Kenya's incredible wildlife, landscapes, and culture.",
            highlights: [
                "Nairobi city tour: Landmarks, parks, and cultural highlights",
                "Lake Nakuru: Flamingos, rhinos, and diverse wildlife",
                "Lake Naivasha: Hippos, giraffes, and scenic boat rides",
                "Masai Mara: Big Five, seasonal wildebeest migration",
                "Mombasa & Coastal Escapes: White sand beaches and turquoise waters",
                "Cultural experiences: Local communities and vibrant Kenyan traditions"
            ]
        },
        {
            title: "Honeymoon Safari – 4 Days / 3 Nights",
            duration: "4 Days / 3 Nights",
            location: "Masai Mara",
            description: "Celebrate love in the heart of the Masai Mara, where endless golden plains and breathtaking sunsets create the perfect romantic backdrop. Over four days and three nights, enjoy intimate moments together in the wild, with optional morning and afternoon game drives to spot elephants, lions, giraffes, and more.",
            additionalInfo: "For a truly magical experience, rise early for a hot air balloon safari, drifting over the savannah as the sun illuminates the landscape, followed by a champagne breakfast in the bush. Unwind together in luxury and privacy, share quiet moments under the vast African skies, and toast to unforgettable memories amid the iconic beauty of the Mara.",
            conclusion: "Every detail of this honeymoon safari is designed for romance, adventure, and connection a once-in-a-lifetime escape for two."
        },
        {
            title: "Elephant Safari – Amboseli & Tsavo East",
            duration: "4 Days / 3 Nights",
            location: "Amboseli & Tsavo East",
            description: "Embark on a 4-day wildlife adventure focused on Kenya's gentle giants the elephants. Begin in Amboseli National Park, where vast savannahs unfold beneath the snow-capped Mount Kilimanjaro. Spend two days on game drives, watching majestic elephant herds move gracefully across the plains, while lions, giraffes, buffalo, and a rich variety of birds complete the iconic African scene.",
            additionalInfo: "Next, journey to Tsavo East, a stunning wilderness of red-earth landscapes and open plains, home to some of Kenya's largest elephant populations. Explore the park on game drives through diverse habitats, spotting elephants in their natural environment and learning about local conservation efforts from your expert guides.",
            conclusion: "This safari is perfect for elephant lovers and wildlife enthusiasts, offering immersive encounters with these magnificent creatures while experiencing the beauty and diversity of Kenya's premier national parks."
        },
        {
            title: "Coastal Escape – Diani",
            duration: "3 Days / 2 Nights",
            location: "Diani Beach",
            description: "Unwind on the white-sand beaches of Diani, where turquoise waters and swaying palms set the perfect backdrop. Enjoy dolphin-watching excursions or a sunset dhow cruise for unforgettable moments on the Indian Ocean.",
            additionalInfo: "Travel via flight or the scenic SGR rail/road route, combining convenience with adventure. Relax, explore marine life, and soak up the magic of Kenya's coast."
        },
        {
            title: "Kenya Golf & Safari Adventure",
            duration: "10 Days / 9 Nights",
            location: "Nairobi, Mount Kenya, Lake Naivasha, Masai Mara",
            description: "Experience the perfect blend of world-class golf and Kenya's iconic wildlife on this unforgettable journey. Begin in Nairobi, where you visit the Giraffe Centre to meet endangered Rothschild giraffes up close. After your city introduction, unwind at the Windsor Golf & Country Club, teeing off on lush fairways or enjoying the lodge's tranquil surroundings.",
            details: [
                "Venture into the Central Highlands to the legendary Mount Kenya Safari Club, where golf takes on a unique twist crossing the Equator mid-round while enjoying panoramic mountain views. The manicured fairways and serene water features make this a memorable golfing experience while providing a perfect setting to relax amidst nature.",
                "Continue to Lake Naivasha, set in the heart of the Great Rift Valley. Tee off on the scenic Lake Naivasha Golf Course, surrounded by beautiful landscapes and wildlife. Explore the lake on a boat ride, spotting hippos, exotic birds, and other aquatic wildlife. Take a walking safari on Crescent Island, encountering giraffes, zebras, impalas, and waterbucks in their natural habitat.",
                "The journey culminates in the legendary Masai Mara, where rolling plains and acacia trees are home to lions, elephants, leopards, buffalo, and rhinos. Enjoy morning and afternoon game drives, witnessing Africa's Big Five and breathtaking wildlife scenes."
            ],
            conclusion: "From the precision of a perfect putt to the thrill of spotting elephants and giraffes in the wild, this safari combines golfing excellence, immersive wildlife encounters, and luxury relaxation — perfect for adventure seekers and golf enthusiasts alike."
        },
        {
            title: "Ladies Safari & Coastal Escape",
            duration: "8 Days",
            location: "Nairobi, Ol Pejeta, Lake Nakuru, Lake Naivasha, Masai Mara, Mombasa",
            description: "Celebrate friendship, freedom, and adventure on this unforgettable journey through Kenya's most iconic destinations. Your experience begins in Nairobi, where you'll meet rescued baby elephants at a renowned elephant orphanage and feed endangered Rothschild giraffes at a peaceful urban sanctuary the perfect introduction to Kenya's inspiring conservation efforts.",
            details: [
                "Travel north with a stop at the Equator before enjoying exciting game drives in one of Kenya's leading conservancies. Visit a special chimpanzee sanctuary, home to rescued and rehabilitated chimps, and spot rhinos, elephants, lions, and other wildlife roaming freely across the plains.",
                "Continue to Lake Nakuru, famous for its flamingo-lined shores and thriving rhino population. Game drives here reveal black and white rhinos, Rothschild giraffes, lions, leopards, and abundant birdlife. Nearby Lake Naivasha offers an optional boat ride among hippos and colorful water birds in a serene lakeside setting.",
                "The adventure deepens in the legendary Masai Mara, where sweeping golden plains and acacia trees create the ultimate safari backdrop. Enjoy immersive game drives in search of the Big Five, alongside cheetahs, giraffes, zebras, and dramatic African sunsets.",
                "From the savannah, journey back to Nairobi and continue to the coast. Discover centuries of Swahili history during a city tour before unwinding on pristine white-sand beaches. Enjoy swimming, snorkeling, sailing, bird watching, and a magical sunset dhow cruise on the Indian Ocean."
            ],
            conclusion: "This Ladies Safari is a seamless blend of wildlife, culture, coastal serenity, and shared adventure designed for women seeking connection, exploration, and unforgettable memories together.",
            highlights: [
                "Nairobi – Rescued baby elephants and endangered Rothschild giraffes",
                "Ol Pejeta Conservancy – Equator crossing, rhino sanctuary, Big Five, chimpanzee sanctuary",
                "Lake Nakuru – Flamingos, rhinos, Rothschild giraffes, lions, leopards",
                "Lake Naivasha – Scenic boat ride among hippos and water birds",
                "Masai Mara – Big Five game drives, sweeping savannah landscapes",
                "Mombasa Coast – Historic Fort Jesus, beaches, swimming, snorkeling, dhow cruise",
                "Leisure & Relaxation – Luxury lodges, beachfront stays, time to unwind"
            ]
        }
    ];

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1770894402/custom3_cvzpla.jpg")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">CUSTOM ITINERARIES</h1>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="space-y-16">
                        {itineraries.map((itinerary, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-8">
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
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

                                <div className="p-6 md:p-8">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {itinerary.description}
                                    </p>

                                    {itinerary.additionalInfo && (
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            {itinerary.additionalInfo}
                                        </p>
                                    )}

                                    {itinerary.details && (
                                        <div className="space-y-4 mb-4">
                                            {itinerary.details.map((detail, idx) => (
                                                <p key={idx} className="text-gray-700 leading-relaxed">
                                                    {detail}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    {itinerary.conclusion && (
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            {itinerary.conclusion}
                                        </p>
                                    )}

                                    {itinerary.highlights && (
                                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                                {itinerary.highlights.length > 3 ? 'What You Will See & Experience' : 'Why Book This Safari'}
                                            </h3>
                                            <ul className="space-y-2">
                                                {itinerary.highlights.map((highlight, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                        <span className="text-primary mt-1">•</span>
                                                        <span>{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Link to="/contact">
                                        <Button size="lg" className="w-full md:w-auto">
                                            Book This Safari
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default CustomItineraries;

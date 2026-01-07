import { useState } from 'react';
import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin, Check, X, Calendar, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import TourItinerary from '@/components/tours/TourItinerary';
import api from '@/lib/api';
import { createBookingMessage } from '@/lib/bookingUtils';
import { Tour } from '@/types';

const TourDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();


    const { data: tourData, error: tourError } = useSWR<{ data: Tour }>(id ? `tour-${id}` : null, () => api.tours.getById(id!));
    const tour = tourData?.data || null;
    const loading = !tourData && !tourError;
    const error = tourError ? "Failed to load tour details." : null;

    const [guestCount, setGuestCount] = useState(1);
    const [travelDate, setTravelDate] = useState('');

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tour) return;

        const total = (typeof tour.price === 'number' ? tour.price : parseInt(String(tour.price).replace(/[^0-9]/g, '') || '0')) * guestCount;

        const whatsappLink = createBookingMessage({
            type: 'Tour',
            title: tour.title,
            date: travelDate,
            guests: guestCount,
            duration: tour.duration,
            pricePerPerson: tour.price,
            totalPrice: total,
            link: window.location.href
        });

        window.open(whatsappLink, '_blank');
    };

    const scrollToBooking = () => {
        document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <Layout>
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    if (error || !tour) {
        return (
            <Layout>
                <Container className="py-20 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600">{error || "Tour not found"}</p>
                    <Button onClick={() => navigate('/tours')} className="mt-4">Back to Tours</Button>
                </Container>
            </Layout>
        );
    }

    const priceValue = typeof tour.price === 'number' ? tour.price : parseInt(String(tour.price).replace(/[^0-9]/g, '') || '0');
    const totalPrice = priceValue * guestCount;

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-end pb-12 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("${tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80'}")` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <Container className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary-light mb-2 font-medium">
                                <MapPin size={18} />
                                {tour.location || "East Africa"}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{tour.title}</h1>
                            <div className="flex flex-wrap gap-4 md:gap-8 text-sm md:text-base text-gray-200">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    {tour.duration}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={18} />
                                    {tour.groupSize || "Flexible"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={18} className="text-accent fill-accent" />
                                    {tour.rating || 5.0} ({tour.reviews || 0} Reviews)
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 min-w-[280px]">
                            <div className="text-sm text-gray-200 mb-1">Starting From</div>
                            <div className="text-3xl font-bold text-white mb-4">KSH {tour.price} <span className="text-sm font-normal text-gray-300">/ person</span></div>
                            <Button className="w-full" onClick={scrollToBooking}>Book This Tour</Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Main Content */}
                        <div className="lg:w-2/3">
                            <div className="mb-10">
                                <h2 className="text-2xl font-serif font-bold mb-4 text-white">Overview</h2>
                                <div className="text-gray-100 leading-relaxed mb-6 prose max-w-none">
                                    {tour.description}
                                </div>

                                {tour.highlights && tour.highlights.length > 0 && (
                                    <>
                                        <h3 className="text-xl font-bold mb-3 text-white">Highlights</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {tour.highlights.map((highlight: string, index: number) => (
                                                <li key={index} className="flex items-start gap-2 text-gray-100">
                                                    <Check size={18} className="text-accent mt-1 shrink-0" />
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            {tour.itinerary && <TourItinerary days={tour.itinerary} />}

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                                    <h3 className="font-bold text-lg mb-4 text-green-800">What's Included</h3>
                                    <ul className="space-y-2">
                                        {tour.included && tour.included.map((item: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                                <Check size={16} className="text-green-600 mt-1 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                        {!tour.included && <li className="text-gray-500 italic">Information not available</li>}
                                    </ul>
                                </div>
                                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                                    <h3 className="font-bold text-lg mb-4 text-red-800">What's Excluded</h3>
                                    <ul className="space-y-2">
                                        {tour.excluded && tour.excluded.map((item: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                                <X size={16} className="text-red-500 mt-1 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                        {!tour.excluded && <li className="text-gray-500 italic">Information not available</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3">
                            <div id="booking-form" className="bg-secondary-light p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="text-xl font-serif font-bold mb-6">Book Your Adventure</h3>
                                <form className="space-y-4" onSubmit={handleBooking}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="date"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                required
                                                value={travelDate}
                                                onChange={(e) => setTravelDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                                            ))}
                                            <option value="11">10+ People</option>
                                        </select>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Base Price</span>
                                            <span className="font-medium">KSH {tour.price}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-primary mt-4 mb-6">
                                            <span>Total</span>
                                            <span>KSH {totalPrice}</span>
                                        </div>
                                        <Button type="submit" className="w-full">Proceed to Booking</Button>
                                        <p className="text-xs text-center text-gray-500 mt-3">No payment required today</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default TourDetail;

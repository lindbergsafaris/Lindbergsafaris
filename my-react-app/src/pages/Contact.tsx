import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import LocationMap from '@/components/ui/LocationMap';

const Contact = () => {
    const form = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.current) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            await emailjs.sendForm(
                'service_3vdy70u',
                'template_6yeyvl4',
                form.current,
                'C-W21o3Kn1O6qbiGI'
            );
            setStatus('success');
            form.current.reset();
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again later or contact us directly.');
        }
    };

    return (
        <Layout>
            {/* Hero */}
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Contact Us</h1>
                    <p className="text-xl font-light tracking-wide">Let's plan your dream safari.</p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-serif font-bold mb-6 text-white">Get in Touch</h2>
                            <p className="text-gray-100 mb-8">
                                Have a question or ready to book? Fill out the form below and our team will get back to you within 24 hours.
                            </p>

                            {status === 'success' ? (
                                <div className="bg-green-500/10 border border-green-500/50 p-8 rounded-xl text-center">
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-gray-200 mb-6">Thank you for reaching out. We've received your inquiry and will get back to you shortly.</p>
                                    <Button
                                        onClick={() => setStatus('idle')}
                                        variant="outline"
                                        className="text-white border-white/20 hover:bg-white/10"
                                    >
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                                    {status === 'error' && (
                                        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-200 mb-6">
                                            <AlertCircle size={20} className="shrink-0" />
                                            <p className="text-sm">{errorMessage}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-200 mb-1">First Name</label>
                                            <input
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-200 mb-1">Last Name</label>
                                            <input
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-200 mb-1">Email Address</label>
                                        <input
                                            id="user_email"
                                            name="user_email"
                                            type="email"
                                            required
                                            className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-1">Subject</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 [&>option]:text-gray-900"
                                        >
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Booking Request">Booking Request</option>
                                            <option value="Partnership">Partnership</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            required
                                            className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                                        ></textarea>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={status === 'loading'}
                                        className="w-full md:w-auto min-w-[160px]"
                                    >
                                        {status === 'loading' ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 size={20} className="animate-spin" />
                                                Sending...
                                            </span>
                                        ) : 'Send Message'}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="bg-secondary p-8 rounded-xl h-fit">
                            <h3 className="text-xl font-serif font-bold mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Our Office</h4>
                                        <p className="text-gray-600">United Bible Society, Ground Floor, Ndemi Rd</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Phone</h4>
                                        <p className="text-gray-600">+254743377948</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email</h4>
                                        <p className="text-gray-600">lindberg@lindbergsafari.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Business Hours</h4>
                                        <p className="text-gray-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                                        <p className="text-gray-600">Sat: 9:00 AM - 1:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <LocationMap className="mt-8 h-64 rounded-lg shadow-md" />
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Contact;

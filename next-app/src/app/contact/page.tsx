import { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import LocationMap from '@/components/ui/LocationMap';
import ContactForm from '@/components/contact/ContactForm';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Contact Us | Plan Your African Safari',
  description:
    'Contact Lindberg Safaris to plan your customized Kenya safari, book wildlife tours, or inquire about luxury holidays in East Africa. Get in touch.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact Lindberg Safaris | Plan Your Safari',
    description:
      'Contact Lindberg Safaris to plan your customized Kenya safari, book wildlife tours, or inquire about luxury holidays.',
    url: `${SITE_URL}/contact`,
  },
  twitter: { card: 'summary_large_image' },
};

export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Lindberg Safaris',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'TravelAgency',
      name: 'Lindberg Safaris',
      url: SITE_URL,
      telephone: '+254743377948',
      email: 'info@lindbergsafaris.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'United Bible Societies Building',
        addressLocality: 'Nairobi',
        addressCountry: 'Kenya',
      },
    },
  };

  return (
    <>
      <JsonLd schema={schema} />

      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Contact Lindberg Safaris | Plan Your Safari
          </h1>
          <p className="text-xl font-light tracking-wide">Let&apos;s plan your dream safari.</p>
        </Container>
      </div>

      <Section className="bg-primary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-white">Get in Touch</h2>
              <p className="text-gray-100 mb-8">
                Have a question or ready to book? Fill out the form below and our team will get back to
                you within 24 hours.
              </p>
              <ContactForm />
            </div>

            {/* Contact Details & Map */}
            <div className="space-y-8">
              <div className="bg-white/10 p-8 rounded-xl border border-white/20 text-white space-y-6">
                <h3 className="text-2xl font-serif font-bold mb-4">Office &amp; Contact Info</h3>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary-light shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Physical Address</h4>
                    <p className="text-gray-200">
                      United Bible Societies Building, Off Ngong Road, Nairobi, Kenya
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary-light shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Phone &amp; WhatsApp</h4>
                    <p className="text-gray-200">+254 743 377 948 / +254 722 000 000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary-light shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email Address</h4>
                    <p className="text-gray-200">info@lindbergsafaris.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary-light shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Working Hours</h4>
                    <p className="text-gray-200">Monday - Friday: 8:00 AM - 5:00 PM (EAT)</p>
                    <p className="text-gray-200">Saturday: 9:00 AM - 1:00 PM (EAT)</p>
                    <p className="text-gray-300 text-xs mt-1">24/7 Safari Emergency Hotline for Active Travelers</p>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="h-72 rounded-xl overflow-hidden shadow-lg border border-white/20">
                <LocationMap />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

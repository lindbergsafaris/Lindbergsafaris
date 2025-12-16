import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check, FileCheck, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Visa = () => {
    const features = [
        "Expert guidance on visa requirements",
        "Application form assistance",
        "Document verification and review",
        "Appointment scheduling",
        "Embassy interview preparation"
    ];

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://res.cloudinary.com/di5ga8z9i/image/upload/v1765555649/visas_vc54gx.jpg")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Visa Applications</h1>
                    <p className="text-xl font-light tracking-wide">Seamless Entry. Hassle-Free Travel.</p>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-serif font-bold mb-6">Navigating Borders Made Easy</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Visa applications can be complex and time-consuming. At Lindberg Safaris, we simplify the process
                                so you can focus on planning your adventure. Our team of experts stays up-to-date with the latest
                                immigration regulations to ensure your application is accurate and submitted on time.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-700">
                                        <div className="bg-primary/10 p-1 rounded-full text-primary">
                                            <Check size={16} />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/contact">
                                <Button size="lg">Start Application</Button>
                            </Link>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://res.cloudinary.com/di5ga8z9i/image/upload/v1765555649/visas_vc54gx.jpg"
                                alt="Visa Documents"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Global Coverage</h3>
                            <p className="text-gray-600">Assistance for visas to major destinations worldwide, including Schengen, UK, USA, and Dubai.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Document Review</h3>
                            <p className="text-gray-600">Thorough checking of all required documents to minimize the risk of rejection.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure Process</h3>
                            <p className="text-gray-600">Your personal information is handled with the utmost confidentiality and security.</p>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Visa;

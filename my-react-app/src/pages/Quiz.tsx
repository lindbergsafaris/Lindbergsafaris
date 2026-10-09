import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SafariQuiz from '@/components/quiz/SafariQuiz';
import SEO from '@/components/SEO';

const Quiz = () => {
    return (
        <Layout>
            <SEO
                title="Find Your Perfect Safari Quiz | Lindberg Safaris"
                description="Take our quick safari quiz to find your ideal Kenya safari, wildlife adventure, or luxury holiday package matched to your travel preferences."
            />
            <div className="bg-primary py-20 text-center text-white">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Find Your Perfect Safari</h1>
                    <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                        Answer a few quick questions and let us recommend the ideal itinerary for you.
                    </p>
                </Container>
            </div>

            <Section className="bg-primary min-h-[60vh]">
                <Container>
                    <SafariQuiz />
                </Container>
            </Section>
        </Layout>
    );
};

export default Quiz;

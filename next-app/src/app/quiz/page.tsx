import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SafariQuiz from '@/components/quiz/SafariQuiz';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Find Your Perfect Safari Quiz',
  description:
    'Take our quick safari quiz to find your ideal Kenya safari, wildlife adventure, or luxury holiday package matched to your travel preferences.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/quiz` },
};

export default function QuizPage() {
  return (
    <>
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
    </>
  );
}

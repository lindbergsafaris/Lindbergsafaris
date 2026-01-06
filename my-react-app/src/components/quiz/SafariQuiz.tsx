import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Check, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
    {
        id: 1,
        question: "What is your primary goal for this safari?",
        options: [
            { id: 'wildlife', text: "Seeing the Big Five" },
            { id: 'migration', text: "Witnessing the Great Migration" },
            { id: 'culture', text: "Cultural Immersion" },
            { id: 'relaxation', text: "Relaxation & Luxury" }
        ]
    },
    {
        id: 2,
        question: "Who are you traveling with?",
        options: [
            { id: 'solo', text: "Solo" },
            { id: 'couple', text: "Partner / Spouse" },
            { id: 'family', text: "Family with Kids" },
            { id: 'friends', text: "Group of Friends" }
        ]
    },
    {
        id: 3,
        question: "What is your preferred accommodation style?",
        options: [
            { id: 'luxury', text: "Luxury Lodges & Tented Camps" },
            { id: 'midrange', text: "Comfortable Mid-Range Lodges" },
            { id: 'budget', text: "Budget / Camping" },
            { id: 'mix', text: "A Mix of Everything" }
        ]
    },
    {
        id: 4,
        question: "How many days do you plan to spend on safari?",
        options: [
            { id: 'short', text: "3-5 Days" },
            { id: 'medium', text: "6-9 Days" },
            { id: 'long', text: "10+ Days" }
        ]
    }
];

const SafariQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResult, setShowResult] = useState(false);

    const handleOptionSelect = (optionId: string) => {
        setAnswers({ ...answers, [questions[currentQuestion].id]: optionId });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResult(false);
    };

    const getRecommendation = () => {
        // Simple logic for demo purposes
        const goal = answers[1];
        const duration = answers[4];

        if (goal === 'migration') return {
            title: "Great Migration Safari",
            description: "Based on your interest in the migration, we recommend our 7-day Masai Mara migration special.",
            link: "/tours/1"
        };
        if (duration === 'short') return {
            title: "Short & Sweet Safari",
            description: "For a quick getaway, our 3-day Amboseli safari is perfect for seeing elephants and Mt. Kilimanjaro.",
            link: "/tours/2"
        };
        return {
            title: "Classic Kenya Safari",
            description: "A well-rounded experience visiting the best parks in Kenya, perfect for first-timers.",
            link: "/tours/1"
        };
    };

    if (showResult) {
        const recommendation = getRecommendation();
        return (
            <div className="bg-secondary-light p-8 rounded-xl shadow-lg text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-4">We've Found Your Perfect Match!</h2>
                <p className="text-gray-600 mb-8">Based on your preferences, we recommend:</p>

                <div className="bg-secondary p-6 rounded-lg border border-gray-200 mb-8">
                    <h3 className="text-xl font-bold mb-2">{recommendation.title}</h3>
                    <p className="text-gray-600 mb-4">{recommendation.description}</p>
                    <Link to={recommendation.link}>
                        <Button>View Tour Details</Button>
                    </Link>
                </div>

                <button
                    onClick={handleRestart}
                    className="text-gray-500 hover:text-primary flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                    <RefreshCw size={16} /> Start Over
                </button>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="bg-secondary-light p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Completed</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <h2 className="text-2xl font-serif font-bold mb-6">{question.question}</h2>

            <div className="space-y-3 mb-8">
                {question.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${answers[question.id] === option.id
                            ? 'border-primary bg-primary/5 text-primary font-medium'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-secondary'
                            }`}
                    >
                        {option.text}
                    </button>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    className="flex items-center gap-2"
                >
                    {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
                    <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
};

export default SafariQuiz;

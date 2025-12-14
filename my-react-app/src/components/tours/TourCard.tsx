import { Link } from 'react-router-dom';
import { Clock, Users, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TourCardProps {
    id: string;
    title: string;
    image: string;
    duration: string;
    groupSize: string;
    price: number | string;
    rating?: number;
    reviews?: number;
}

const TourCard: React.FC<TourCardProps> = ({
    id, title, image, duration, groupSize, price, rating = 0, reviews = 0
}) => {
    return (
        <Card className="flex flex-col h-full group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="text-accent fill-accent" />
                    {rating} ({reviews})
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                    <Link to={`/tours/${id}`}>{title}</Link>
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{groupSize}</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-xs text-gray-500 block">From</span>
                        <span className="text-lg font-bold text-primary">KSH {price}</span>
                    </div>
                    <Link to={`/tours/${id}`}>
                        <Button size="sm" variant="outline">View Details</Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default TourCard;

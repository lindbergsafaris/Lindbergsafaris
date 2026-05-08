import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface DestinationCardProps {
    id: string;
    name: string;
    image: string;
    tourCount: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ id, name, image, tourCount }) => {
    return (
        <Link to={`/destinations/${id}`} className="group relative rounded-xl overflow-hidden h-80 block">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500 z-10" />
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                <span className="text-xs font-black uppercase tracking-widest mb-1 block opacity-90 text-primary-light">
                    {tourCount} Tours
                </span>
                <h3 className="text-2xl font-serif font-bold mb-3">{name}</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-primary-light group-hover:text-white transition-all duration-300">
                    Explore Destination <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
};

export default DestinationCard;

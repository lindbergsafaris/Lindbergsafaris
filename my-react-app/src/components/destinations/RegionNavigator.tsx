import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import api from '@/lib/api';

const RegionNavigator = ({ currentRegion }: { currentRegion?: string }) => {

    const [regions, setRegions] = useState<any[]>([]);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const { data } = await api.destinationCategory.getAll();
                setRegions(data || []);
            } catch (error) {
                console.error('Failed to fetch regions:', error);
            }
        };
        fetchRegions();
    }, []);

    // Filter out current region from the list
    const otherRegions = regions.filter(r => !currentRegion || r.slug !== currentRegion);

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
                <Globe size={20} className="text-white" />
                <h3 className="text-lg font-bold text-white">Explore Other Regions</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {otherRegions.map((region) => (
                    <Link
                        key={region._id}
                        to={`/regions/${region.slug}`}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm font-medium transition-all text-center border border-white/10 hover:border-white/30"
                    >
                        {region.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RegionNavigator;

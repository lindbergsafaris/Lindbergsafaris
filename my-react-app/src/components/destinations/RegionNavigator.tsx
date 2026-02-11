import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface RegionQuickLink {
    key: string;
    path: string;
}

const RegionNavigator = ({ currentRegion }: { currentRegion?: string }) => {
    const { t } = useTranslation('common');

    const regions: RegionQuickLink[] = [
        { key: 'africa', path: '/regions/africa' },
        { key: 'middleEast', path: '/regions/middle-east' },
        { key: 'europe', path: '/regions/europe' },
        { key: 'america', path: '/regions/america' },
        { key: 'oceania', path: '/regions/oceania' },
        { key: 'southAmerica', path: '/regions/south-america' },
        { key: 'northAmerica', path: '/regions/north-america' },
    ];

    // Filter out current region from the list
    const otherRegions = regions.filter(r => !currentRegion || !r.path.includes(currentRegion));

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
                <Globe size={20} className="text-white" />
                <h3 className="text-lg font-bold text-white">Explore Other Regions</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {otherRegions.map((region) => (
                    <Link
                        key={region.key}
                        to={region.path}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm font-medium transition-all text-center border border-white/10 hover:border-white/30"
                    >
                        {t(`destinations.${region.key}`)}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RegionNavigator;

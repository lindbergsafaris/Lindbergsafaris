import { Search, SlidersHorizontal } from 'lucide-react';
import Button from '@/components/ui/Button';

const TourFilter = () => {
    return (
        <div className="bg-secondary-light p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-lg">Filters</h3>
                <SlidersHorizontal size={18} className="text-gray-400" />
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Where do you want to go?"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Duration</label>
                    <div className="space-y-2">
                        {['1-3 Days', '4-7 Days', '8-14 Days', '15+ Days'].map((duration) => (
                            <label key={duration} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                                <span className="text-sm text-gray-600">{duration}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Price Range</label>
                    <input type="range" min="0" max="10000" className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>KSH 0</span>
                        <span>KSH 10,000+</span>
                    </div>
                </div>

                {/* Tour Type */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Tour Type</label>
                    <div className="space-y-2">
                        {['Safari', 'Beach', 'Cultural', 'Hiking', 'Luxury'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                                <span className="text-sm text-gray-600">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
            </div>
        </div>
    );
};

export default TourFilter;

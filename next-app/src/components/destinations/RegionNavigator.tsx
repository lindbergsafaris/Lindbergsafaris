'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { DestinationCategory } from '@/types';

interface RegionNavigatorProps {
  currentRegion?: string;
  initialRegions?: DestinationCategory[];
}

const RegionNavigator = ({ currentRegion, initialRegions }: RegionNavigatorProps) => {
  const [regions, setRegions] = useState<DestinationCategory[]>(initialRegions || []);

  useEffect(() => {
    if (initialRegions && initialRegions.length > 0) return;
    const fetchRegions = async () => {
      try {
        const res = await fetch('/api/regions');
        if (!res.ok) return;
        const data = await res.json();
        setRegions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    };
    fetchRegions();
  }, [initialRegions]);

  const otherRegions = regions.filter((r) => !currentRegion || r.slug !== currentRegion);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={20} className="text-white" />
        <h3 className="text-lg font-bold text-white">Explore Other Regions</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {otherRegions.map((region) => (
          <Link
            key={region._id}
            href={`/regions/${region.slug}`}
            className="flex-grow basis-[calc(50%-0.75rem)] md:basis-[calc(25%-0.75rem)] lg:basis-[calc(16.666%-0.75rem)] px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-sm font-medium transition-all text-center border border-white/10 hover:border-white/30"
          >
            {region.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RegionNavigator;

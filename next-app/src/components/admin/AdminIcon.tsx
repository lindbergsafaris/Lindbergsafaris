'use client';

import {
  ArrowRightLeft,
  BedDouble,
  Car,
  Compass,
  FileText,
  Flame,
  FolderKanban,
  Globe,
  Handshake,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  MapPin,
  Package,
  Presentation,
  Sparkles,
  Users,
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  Compass,
  FileText,
  BedDouble,
  Flame,
  Sparkles,
  Globe,
  MapPin,
  Layers,
  Package,
  Users,
  Image: ImageIcon,
  Car,
  Presentation,
  Handshake,
  ArrowRightLeft,
  FolderKanban,
};

export function AdminIcon({
  name,
  className = 'w-4 h-4',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name as keyof typeof ICON_MAP] ?? FolderKanban;
  return <Icon className={className} />;
}

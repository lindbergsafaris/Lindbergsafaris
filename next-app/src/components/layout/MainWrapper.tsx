'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  return (
    <main className={isAdmin ? 'flex-grow' : 'flex-grow pt-24'}>
      {children}
    </main>
  );
}

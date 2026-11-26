import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lindberg Safaris CMS Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-gray-900 relative z-10">
      {children}
    </div>
  );
}

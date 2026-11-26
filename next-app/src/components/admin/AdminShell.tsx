'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import type { CmsProfile } from '@/lib/supabase/auth';
import type { ContentTypeConfig } from '@/lib/cms/types';
import { AdminIcon } from './AdminIcon';

interface AdminShellProps {
  profile: CmsProfile;
  configs: Pick<ContentTypeConfig, 'slug' | 'plural' | 'icon'>[];
  showUsersLink?: boolean;
  children: React.ReactNode;
}

export default function AdminShell({
  profile,
  configs,
  showUsersLink = false,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-stone-200 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-serif font-bold text-lg">
            L
          </span>
          <div>
            <p className="font-serif font-bold text-base text-gray-900 leading-tight">
              Lindberg CMS
            </p>
            <p className="text-[11px] text-stone-500">Content Admin</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-md text-stone-500 hover:bg-stone-100"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/admin'
              ? 'bg-primary text-white'
              : 'text-stone-700 hover:bg-secondary/60 hover:text-primary-dark'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </Link>

        <div className="pt-3 pb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          Content Types
        </div>

        {configs.map((cfg) => {
          const href = `/admin/${cfg.slug}`;
          const active =
            pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={cfg.slug}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'text-stone-700 hover:bg-secondary/60 hover:text-primary-dark'
              }`}
            >
              <AdminIcon name={cfg.icon} className="w-4 h-4 shrink-0" />
              <span className="truncate">{cfg.plural}</span>
            </Link>
          );
        })}

        {showUsersLink && profile.role === 'admin' && (
          <>
            <div className="pt-3 pb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Administration
            </div>
            <Link
              href="/admin/users"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/admin/users'
                  ? 'bg-primary text-white'
                  : 'text-stone-700 hover:bg-secondary/60 hover:text-primary-dark'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Users & Roles</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-3 border-t border-stone-200 bg-stone-50/80 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">RLS enforced ({profile.role})</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-gray-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-surface border-r border-stone-200 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-surface border-r border-stone-200 z-50 flex flex-col">
            {navContent}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-surface border-b border-stone-200">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-md text-stone-600 hover:bg-stone-100"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-stone-600 truncate">
                Lindberg Safaris CMS
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {profile.full_name || profile.email}
                </p>
                <p className="text-xs text-stone-500">{profile.email}</p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  profile.role === 'admin'
                    ? 'bg-primary/15 text-primary-dark'
                    : 'bg-accent/20 text-amber-900'
                }`}
              >
                {profile.role}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
              </button>
            </div>
          </div>

          {/* Live on site notice banner */}
          <div className="bg-amber-50 border-t border-amber-200 px-4 sm:px-6 py-2 text-xs text-amber-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Live on site notice:</strong> Edits made here save to Supabase Postgres and do not reach the public site (<code className="font-mono">lindbergsafaris.com</code>) until the data layer is switched from Sanity.
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

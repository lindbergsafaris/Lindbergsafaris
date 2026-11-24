import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './server';

export type CmsRole = 'admin' | 'editor';

export interface CmsProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: CmsRole;
}

export interface CmsSession {
  userId: string;
  email: string;
  profile: CmsProfile;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
}

export function isValidCmsRole(role: unknown): role is CmsRole {
  return role === 'admin' || role === 'editor';
}

/**
 * Reads the currently authenticated user and verifies their role in public.profiles
 * using the signed-in user's own SSR Supabase client (enforced by RLS).
 * Returns null if unauthenticated, or `{ unauthorized: true }` if authenticated without a CMS role.
 */
export async function getCmsSessionState(): Promise<
  | { status: 'authenticated'; session: CmsSession }
  | { status: 'unauthenticated' }
  | { status: 'unauthorized' }
> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: 'unauthenticated' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || !isValidCmsRole(profile.role)) {
    return { status: 'unauthorized' };
  }

  return {
    status: 'authenticated',
    session: {
      userId: user.id,
      email: profile.email || user.email || '',
      profile: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role,
      },
      supabase,
    },
  };
}

/**
 * Server Component / Page guard: redirects to /admin/login if unauthenticated or unauthorized.
 */
export async function requireCmsSession(): Promise<CmsSession> {
  const state = await getCmsSessionState();
  if (state.status === 'unauthenticated') {
    redirect('/admin/login');
  }
  if (state.status === 'unauthorized') {
    redirect('/admin/login?error=no-access');
  }
  return state.session;
}

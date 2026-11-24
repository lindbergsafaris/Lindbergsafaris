import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabasePublicEnv } from '@/lib/supabase/env';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const isAuthApi =
    pathname === '/api/admin/auth/login' || pathname === '/api/admin/auth/logout';
  const isLoginPage = pathname === '/admin/login';

  // Let login/logout auth endpoints execute directly (they manage cookies & profile checks themselves)
  if (isAuthApi) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute = pathname.startsWith('/api/admin');

  if (!user) {
    if (isLoginPage) {
      return response;
    }
    if (isApiRoute) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify role in public.profiles via signed-in user's client (RLS enforced)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();

  const hasAccess =
    !profileError &&
    profile &&
    (profile.role === 'admin' || profile.role === 'editor');

  if (!hasAccess) {
    // Sign out users with no profile or invalid role and clear cookies on the response
    await supabase.auth.signOut();

    if (isApiRoute) {
      const jsonResp = NextResponse.json({ error: 'No access' }, { status: 403 });
      response.cookies.getAll().forEach((c) => jsonResp.cookies.set(c));
      return jsonResp;
    }

    if (isLoginPage) {
      if (request.nextUrl.searchParams.get('error') !== 'no-access') {
        const noAccessUrl = request.nextUrl.clone();
        noAccessUrl.searchParams.set('error', 'no-access');
        const redirectResp = NextResponse.redirect(noAccessUrl);
        response.cookies.getAll().forEach((c) => redirectResp.cookies.set(c));
        return redirectResp;
      }
      return response;
    }

    const noAccessUrl = request.nextUrl.clone();
    noAccessUrl.pathname = '/admin/login';
    noAccessUrl.search = '?error=no-access';
    const redirectResp = NextResponse.redirect(noAccessUrl);
    response.cookies.getAll().forEach((c) => redirectResp.cookies.set(c));
    return redirectResp;
  }

  // Already signed in as valid CMS user -> don't linger on /admin/login
  if (isLoginPage) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = '/admin';
    adminUrl.search = '';
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

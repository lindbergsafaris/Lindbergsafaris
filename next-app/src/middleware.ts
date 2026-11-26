import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabasePublicEnv } from '@/lib/supabase/env';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import { isUUID, slugify } from '@/lib/slugUtils';

function withNoIndex(res: NextResponse): NextResponse {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

const UUID_TABLE_BY_PREFIX: Array<{ prefix: string; table: string; targetPrefix: string; isAcc?: boolean }> = [
  { prefix: '/tours/', table: 'tours', targetPrefix: '/tours/' },
  { prefix: '/blog/', table: 'blog_posts', targetPrefix: '/blog/' },
  { prefix: '/destinations/', table: 'destination_posts', targetPrefix: '/destinations/' },
  { prefix: '/accommodation/view/', table: 'accommodations', targetPrefix: '/accommodation/', isAcc: true },
  { prefix: '/accommodation/', table: 'accommodations', targetPrefix: '/accommodation/', isAcc: true },
];

async function handlePublicUuidRedirect(request: NextRequest): Promise<NextResponse | null> {
  if (process.env.CMS_SOURCE !== 'supabase') return null;
  const { pathname } = request.nextUrl;

  for (const rule of UUID_TABLE_BY_PREFIX) {
    if (!pathname.startsWith(rule.prefix)) continue;
    const rawId = pathname.slice(rule.prefix.length);
    if (!rawId || rawId.includes('/') || !isUUID(rawId)) return null;

    try {
      const supabase = createSupabasePublicClient();
      const selectCols = rule.isAcc ? 'slug, name' : 'slug, title';
      const { data } = await supabase
        .from(rule.table)
        .select(selectCols)
        .eq('status', 'published')
        .or(`id.eq.${rawId},legacy_sanity_id.eq.${rawId}`)
        .maybeSingle();

      if (data) {
        const rec = data as { slug?: string | null; name?: string | null; title?: string | null };
        const clean = rec.slug || slugify(rec.name || rec.title || '');
        if (clean) {
          return NextResponse.redirect(
            new URL(`${rule.targetPrefix}${clean}`, request.url),
            308
          );
        }
      }

      const { data: redir } = await supabase
        .from('redirects')
        .select('new_path, status_code')
        .eq('old_path', pathname)
        .maybeSingle();

      if (redir?.new_path) {
        return NextResponse.redirect(
          new URL(redir.new_path, request.url),
          redir.status_code || 308
        );
      }
    } catch {
      // Fall through to page handler if middleware lookup cannot resolve
    }
    return null;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    const uuidRedirect = await handlePublicUuidRedirect(request);
    if (uuidRedirect) return uuidRedirect;
    return NextResponse.next();
  }

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
    return withNoIndex(response);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute = pathname.startsWith('/api/admin');

  if (!user) {
    if (isLoginPage) {
      return withNoIndex(response);
    }
    if (isApiRoute) {
      return withNoIndex(NextResponse.json({ error: 'Authentication required' }, { status: 401 }));
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);
    return withNoIndex(NextResponse.redirect(loginUrl));
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
      return withNoIndex(jsonResp);
    }

    if (isLoginPage) {
      if (request.nextUrl.searchParams.get('error') !== 'no-access') {
        const noAccessUrl = request.nextUrl.clone();
        noAccessUrl.searchParams.set('error', 'no-access');
        const redirectResp = NextResponse.redirect(noAccessUrl);
        response.cookies.getAll().forEach((c) => redirectResp.cookies.set(c));
        return withNoIndex(redirectResp);
      }
      return withNoIndex(response);
    }

    const noAccessUrl = request.nextUrl.clone();
    noAccessUrl.pathname = '/admin/login';
    noAccessUrl.search = '?error=no-access';
    const redirectResp = NextResponse.redirect(noAccessUrl);
    response.cookies.getAll().forEach((c) => redirectResp.cookies.set(c));
    return withNoIndex(redirectResp);
  }

  // Already signed in as valid CMS user -> don't linger on /admin/login
  if (isLoginPage) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = '/admin';
    adminUrl.search = '';
    return withNoIndex(NextResponse.redirect(adminUrl));
  }

  return withNoIndex(response);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/tours/:id([0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+)',
    '/blog/:id([0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+)',
    '/destinations/:id([0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+)',
    '/accommodation/:id([0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+)',
    '/accommodation/view/:id([0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+)',
  ],
};

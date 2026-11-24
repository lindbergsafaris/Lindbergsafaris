import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { getSupabasePublicEnv } from '@/lib/supabase/env';
import { formatCmsError } from '@/lib/cms/errors';

const inviteSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  full_name: z.string().trim().optional(),
  role: z.enum(['admin', 'editor']),
});

/**
 * Admin-only user invite handler.
 * This is the ONLY route handler permitted to use SUPABASE_SERVICE_ROLE_KEY,
 * and only after verifying on the server that the caller is an admin.
 */
export async function POST(request: Request) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  if (auth.session.profile.role !== 'admin') {
    return NextResponse.json(
      { error: 'Only admins can invite new users.' },
      { status: 403 }
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          'SUPABASE_SERVICE_ROLE_KEY is not configured on the server. Add it to your server environment variables to invite users.',
      },
      { status: 501 }
    );
  }

  try {
    const rawBody = await request.json();
    const parsed = inviteSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid invite details' },
        { status: 400 }
      );
    }

    const { email, full_name, role } = parsed.data;
    const { url } = getSupabasePublicEnv();

    const adminClient = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: inviteData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        data: full_name ? { full_name } : undefined,
      });

    if (inviteError || !inviteData.user) {
      return NextResponse.json(
        { error: inviteError?.message || 'Failed to invite user' },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: inviteData.user.id,
        email: inviteData.user.email ?? email,
        full_name: full_name || null,
        role,
      })
      .select('id, email, full_name, avatar_url, role, created_at, updated_at')
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: formatCmsError(profileError, 'User invited, but profile creation failed.') },
        { status: 400 }
      );
    }

    return NextResponse.json({ profile }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: formatCmsError(err, 'Failed to invite user') },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { formatCmsError } from '@/lib/cms/errors';

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'editor']),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  if (auth.session.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can change user roles.' }, { status: 403 });
  }

  const { id } = await context.params;
  if (id === auth.session.userId) {
    return NextResponse.json(
      { error: 'You cannot change your own role.' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const parsed = updateRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Role must be admin or editor.' }, { status: 400 });
    }

    const { data, error } = await auth.session.supabase
      .from('profiles')
      .update({ role: parsed.data.role })
      .eq('id', id)
      .select('id, email, full_name, avatar_url, role, created_at, updated_at')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json({ user: data });
  } catch (err) {
    return NextResponse.json(
      { error: formatCmsError(err, 'Failed to update role') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  if (auth.session.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can remove users.' }, { status: 403 });
  }

  const { id } = await context.params;
  if (id === auth.session.userId) {
    return NextResponse.json(
      { error: 'You cannot delete your own account.' },
      { status: 400 }
    );
  }

  const { error } = await auth.session.supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

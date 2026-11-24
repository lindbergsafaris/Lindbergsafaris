import { NextResponse } from 'next/server';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { formatCmsError } from '@/lib/cms/errors';

export async function GET() {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  if (auth.session.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { data, error } = await auth.session.supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, created_at, updated_at')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
  }

  return NextResponse.json({ users: data ?? [] });
}

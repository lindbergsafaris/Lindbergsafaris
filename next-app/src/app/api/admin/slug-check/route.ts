import { NextResponse } from 'next/server';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { getContentTypeConfig } from '@/lib/cms/registry';

export async function GET(request: Request) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || '';
  const slug = (searchParams.get('slug') || '').trim();
  const field = searchParams.get('field') || 'slug';
  const excludeId = searchParams.get('excludeId') || '';

  const config = getContentTypeConfig(type);
  if (!config) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });
  }
  if (!slug) {
    return NextResponse.json({ available: false });
  }

  // Only allow checking a slug field declared in the config
  const allowedSlugField = config.slugField || 'slug';
  if (field !== allowedSlugField) {
    return NextResponse.json({ error: 'Invalid slug field' }, { status: 400 });
  }

  let query = auth.session.supabase
    .from(config.tableName)
    .select('id', { count: 'exact', head: true })
    .eq(allowedSlugField, slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ available: (count ?? 0) === 0 });
}

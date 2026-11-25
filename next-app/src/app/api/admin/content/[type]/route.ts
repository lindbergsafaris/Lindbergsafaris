import { NextResponse } from 'next/server';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { getContentTypeConfig } from '@/lib/cms/registry';
import { buildZodSchema } from '@/lib/cms/validation';
import { formatCmsError } from '@/lib/cms/errors';
import { revalidatePublicContent } from '@/lib/cms/revalidate';

export async function GET(
  request: Request,
  context: { params: Promise<{ type: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { type } = await context.params;
  const config = getContentTypeConfig(type);
  if (!config) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').trim();
  const status = (searchParams.get('status') || '').trim();
  const sort = searchParams.get('sort') || config.listView.defaultSort.field;
  const dir = searchParams.get('dir') === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)));

  const allowedSortFields = new Set([
    ...config.listView.columns.filter((c) => c.sortable).map((c) => c.field),
    config.listView.defaultSort.field,
    'created_at',
    'updated_at',
  ]);
  const safeSort = allowedSortFields.has(sort) ? sort : config.listView.defaultSort.field;

  let query = auth.session.supabase
    .from(config.tableName)
    .select('*', { count: 'exact' });

  if (config.hasStatusWorkflow !== false && status && status !== 'all') {
    query = query.eq('status', status);
  }

  // Faceted filters defined in config
  for (const filter of config.listView.filters) {
    const val = (searchParams.get(`filter_${filter.field}`) || '').trim();
    if (val && val !== 'all') {
      query = query.eq(filter.field, val);
    }
  }

  if (search && config.listView.searchFields.length > 0) {
    const safeSearch = search.replace(/[%_,]/g, ' ').trim();
    if (safeSearch) {
      const orExpr = config.listView.searchFields
        .map((field) => `${field}.ilike.%${safeSearch}%`)
        .join(',');
      query = query.or(orExpr);
    }
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query
    .order(safeSort, { ascending: dir === 'asc' })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
  }

  return NextResponse.json({
    items: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ type: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { type } = await context.params;
  const config = getContentTypeConfig(type);
  if (!config) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });
  }

  try {
    const rawBody = (await request.json()) as Record<string, unknown>;
    const schema = buildZodSchema(config);
    const parsed = schema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || 'Validation failed',
          fieldErrors: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = { ...parsed.data };

    // Status workflow: publishing sets published_at to now if empty
    if (config.hasStatusWorkflow !== false) {
      if (payload.status === 'published' && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await auth.session.supabase
      .from(config.tableName)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
    }

    revalidatePublicContent(config, data as Record<string, unknown>);

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: formatCmsError(err, 'Failed to create record') },
      { status: 500 }
    );
  }
}

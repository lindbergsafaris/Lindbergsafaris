import { NextResponse } from 'next/server';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { getContentTypeConfig } from '@/lib/cms/registry';
import { buildZodSchema } from '@/lib/cms/validation';
import { formatCmsError } from '@/lib/cms/errors';

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string; id: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { type, id } = await context.params;
  const config = getContentTypeConfig(type);
  if (!config) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });
  }

  const { data, error } = await auth.session.supabase
    .from(config.tableName)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }

  return NextResponse.json({ item: data });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ type: string; id: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { type, id } = await context.params;
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

    if (config.hasStatusWorkflow !== false) {
      if (payload.status === 'published' && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await auth.session.supabase
      .from(config.tableName)
      .update(payload)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ item: data });
  } catch (err) {
    return NextResponse.json(
      { error: formatCmsError(err, 'Failed to update record') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ type: string; id: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  if (auth.session.profile.role !== 'admin') {
    return NextResponse.json(
      { error: 'Only admins can delete content records.' },
      { status: 403 }
    );
  }

  const { type, id } = await context.params;
  const config = getContentTypeConfig(type);
  if (!config) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });
  }

  const { error } = await auth.session.supabase
    .from(config.tableName)
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

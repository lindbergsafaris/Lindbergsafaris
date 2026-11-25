import { NextResponse } from 'next/server';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { getContentTypeConfig } from '@/lib/cms/registry';
import { buildZodSchema } from '@/lib/cms/validation';
import { formatCmsError } from '@/lib/cms/errors';
import { revalidatePublicContent } from '@/lib/cms/revalidate';

const SLUG_REDIRECT_PREFIXES: Record<string, string> = {
  tours: '/tours/',
  'blog-posts': '/blog/',
  accommodations: '/accommodation/',
  'destination-posts': '/destinations/',
};

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

    const redirectPrefix = SLUG_REDIRECT_PREFIXES[type];
    let previousSlug: string | null = null;
    let wasPublished = false;

    if (redirectPrefix) {
      const { data: existing } = await auth.session.supabase
        .from(config.tableName)
        .select('slug, status')
        .eq('id', id)
        .maybeSingle();
      if (existing) {
        previousSlug = typeof existing.slug === 'string' ? existing.slug : null;
        wasPublished = existing.status === 'published';
      }
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

    // Automatically insert redirect & rewrite chains when a published item changes its slug
    let redirectCreated: { old_path: string; new_path: string } | null = null;
    const nextSlug = typeof data.slug === 'string' ? data.slug : null;

    if (
      redirectPrefix &&
      wasPublished &&
      previousSlug &&
      nextSlug &&
      previousSlug !== nextSlug
    ) {
      const oldPath = `${redirectPrefix}${previousSlug}`;
      const newPath = `${redirectPrefix}${nextSlug}`;
      const supabase = auth.session.supabase;

      // 1. Update any existing redirects pointing to oldPath -> newPath (prevent chains)
      await supabase
        .from('redirects')
        .update({ new_path: newPath })
        .eq('new_path', oldPath);

      // 2. If a redirect from newPath previously existed, remove it (admin) to prevent loops
      if (auth.session.profile.role === 'admin') {
        await supabase.from('redirects').delete().eq('old_path', newPath);
      }

      // 3. Upsert (via select + insert/update so editors stay within RLS privileges)
      const { data: existingRedirect } = await supabase
        .from('redirects')
        .select('id')
        .eq('old_path', oldPath)
        .maybeSingle();

      if (existingRedirect) {
        await supabase
          .from('redirects')
          .update({ new_path: newPath, status_code: 301 })
          .eq('id', existingRedirect.id);
      } else {
        await supabase
          .from('redirects')
          .insert({ old_path: oldPath, new_path: newPath, status_code: 301 });
      }

      redirectCreated = { old_path: oldPath, new_path: newPath };
    }

    revalidatePublicContent(config, data as Record<string, unknown>, previousSlug);

    return NextResponse.json({ item: data, redirectCreated });
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

  const { data: existing } = await auth.session.supabase
    .from(config.tableName)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const { error } = await auth.session.supabase
    .from(config.tableName)
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: formatCmsError(error) }, { status: 400 });
  }

  revalidatePublicContent(config, existing as Record<string, unknown> | null);

  return NextResponse.json({ ok: true });
}

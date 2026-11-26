import { NextResponse } from 'next/server';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';
import { CONTENT_TYPE_CONFIGS } from '@/lib/cms/registry';

const ALLOWED_TABLES = new Set(CONTENT_TYPE_CONFIGS.map((c) => c.tableName));
const SAFE_COL_REGEX = /^[a-z_][a-z0-9_]*$/;

export async function GET(
  request: Request,
  context: { params: Promise<{ table: string }> }
) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { table } = await context.params;
  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: 'Invalid target table' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const labelField = searchParams.get('labelField') || 'name';
  const valueField = searchParams.get('valueField') || 'id';
  const q = (searchParams.get('q') || '').trim();

  if (!SAFE_COL_REGEX.test(labelField) || !SAFE_COL_REGEX.test(valueField)) {
    return NextResponse.json({ error: 'Invalid column name' }, { status: 400 });
  }

  let query = auth.session.supabase
    .from(table)
    .select(`${valueField}, ${labelField}`)
    .order(labelField, { ascending: true })
    .limit(50);

  if (q) {
    query = query.ilike(labelField, `%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const rows = ((data ?? []) as unknown) as Array<Record<string, unknown>>;
  const options = rows.map((row) => ({
    label: String(row[labelField] ?? ''),
    value: String(row[valueField] ?? ''),
  }));

  return NextResponse.json({ options });
}

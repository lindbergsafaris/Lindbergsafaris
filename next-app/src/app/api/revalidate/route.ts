import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret') || req.headers.get('x-webhook-secret');
    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const tag = body._type || req.nextUrl.searchParams.get('tag');

    if (!tag) {
      return NextResponse.json({ message: 'Missing document type or tag to revalidate' }, { status: 400 });
    }

    revalidateTag(tag);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error revalidating' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const headerSecret = req.headers.get('x-webhook-secret')?.trim();
    const querySecret = req.nextUrl.searchParams.get('secret')?.trim();

    const secret = bearerSecret || headerSecret || querySecret;
    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { message: 'Invalid or missing revalidation secret' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const tag = body._type || req.nextUrl.searchParams.get('tag');

    if (!tag) {
      return NextResponse.json(
        { message: 'Missing document type (_type) or tag to revalidate' },
        { status: 400 }
      );
    }

    // Invalidate document tag cache
    revalidateTag(tag, 'default');

    // Invalidate specific page path if slug is provided
    const slug = body.slug?.current || body.slug;
    if (slug) {
      if (tag === 'tour') {
        revalidatePath(`/tours/${slug}`);
      } else if (tag === 'blogPost') {
        revalidatePath(`/blog/${slug}`);
      } else if (tag === 'destinationPost' || tag === 'destinationCategory') {
        revalidatePath(`/destinations/${slug}`);
      } else if (tag === 'accommodation') {
        revalidatePath(`/accommodation/${slug}`);
      }
    }

    // Always invalidate listing if relevant
    if (tag === 'tour') revalidatePath('/tours');
    if (tag === 'blogPost') revalidatePath('/blog');
    if (tag === 'hotDeal' || tag === 'heroSlide' || tag === 'popupOffer') revalidatePath('/');

    return NextResponse.json({
      revalidated: true,
      tag,
      slug: slug || null,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error executing revalidation' },
      { status: 500 }
    );
  }
}

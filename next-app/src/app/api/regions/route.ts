import { NextResponse } from 'next/server';
import { getDestinationCategories } from '@/lib/data';

export async function GET() {
  try {
    const categories = await getDestinationCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error('[/api/regions] Failed to load destination categories:', err);
    return NextResponse.json([], { status: 500 });
  }
}

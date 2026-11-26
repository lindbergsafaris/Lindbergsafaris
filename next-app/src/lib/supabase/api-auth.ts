import { NextResponse } from 'next/server';
import { getCmsSessionState, type CmsSession } from './auth';

export async function requireApiCmsSession(): Promise<
  { session: CmsSession; errorResponse?: never } | { session?: never; errorResponse: NextResponse }
> {
  const state = await getCmsSessionState();
  if (state.status === 'unauthenticated') {
    return {
      errorResponse: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }
  if (state.status === 'unauthorized') {
    return {
      errorResponse: NextResponse.json({ error: 'No access' }, { status: 403 }),
    };
  }
  return { session: state.session };
}

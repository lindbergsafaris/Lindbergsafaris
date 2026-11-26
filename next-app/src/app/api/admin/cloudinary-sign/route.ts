import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { requireApiCmsSession } from '@/lib/supabase/api-auth';

function getCloudinaryServerConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  return {
    cloudName,
    apiKey,
    apiSecret,
    uploadEnabled: Boolean(cloudName && apiKey && apiSecret),
  };
}

export async function GET() {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { uploadEnabled, cloudName } = getCloudinaryServerConfig();
  return NextResponse.json({
    uploadEnabled,
    cloudName: uploadEnabled ? cloudName : null,
  });
}

export async function POST(request: Request) {
  const auth = await requireApiCmsSession();
  if (auth.errorResponse) return auth.errorResponse;

  const { uploadEnabled, cloudName, apiKey, apiSecret } = getCloudinaryServerConfig();
  if (!uploadEnabled) {
    return NextResponse.json(
      { error: 'Direct Cloudinary upload is not configured on the server.' },
      { status: 501 }
    );
  }

  let folder = 'lindberg-safaris';
  try {
    const body = (await request.json()) as { folder?: string };
    if (body?.folder && /^[a-zA-Z0-9/_-]+$/.test(body.folder)) {
      folder = body.folder;
    }
  } catch {
    // default folder
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash('sha1').update(toSign).digest('hex');

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}

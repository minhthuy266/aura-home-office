import { NextRequest, NextResponse } from 'next/server';
import { submitToIndexNow } from '@/src/utils/indexNow';

type IndexNowPayload = {
  secret?: string;
  urls?: string[];
};

function readSecret(request: NextRequest, body: IndexNowPayload) {
  return (
    request.headers.get('x-indexnow-secret') ||
    request.headers.get('x-revalidate-secret') ||
    request.nextUrl.searchParams.get('secret') ||
    body.secret ||
    ''
  );
}

async function handleIndexNow(request: NextRequest) {
  if (!process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { submitted: false, message: 'REVALIDATION_SECRET is not configured.' },
      { status: 500 },
    );
  }

  let body: IndexNowPayload = {};
  try {
    body = (await request.json()) as IndexNowPayload;
  } catch {
    body = {};
  }

  if (readSecret(request, body) !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ submitted: false, message: 'Invalid secret.' }, { status: 401 });
  }

  const result = await submitToIndexNow(body.urls || []);
  return NextResponse.json(result, { status: result.submitted && !result.ok ? 502 : 200 });
}

export async function POST(request: NextRequest) {
  return handleIndexNow(request);
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { AUTHORS, LEGACY_WP_AUTHOR_IDS } from '@/src/config/authors';

const DEFAULT_PATHS = [
  '/',
  '/about',
  '/search',
  '/reviews',
  '/[category]',
  '/[category]/[slug]',
  '/author/[slug]',
  '/sitemap.xml',
  '/author-sitemap.xml',
  '/post-sitemap.xml',
  '/category-sitemap.xml',
  '/page-sitemap.xml',
];

const DEFAULT_TAGS = [
  'wp-posts',
  'wp-taxonomies',
  ...AUTHORS.flatMap((author) => (author.wpUserId ? [`wp-author:${author.wpUserId}`] : [])),
  ...LEGACY_WP_AUTHOR_IDS.map((authorId) => `wp-author:${authorId}`),
];

type RevalidatePayload = {
  secret?: string;
  paths?: string[];
  tags?: string[];
};

function invalidatePath(path: string) {
  if (path.includes('[')) {
    revalidatePath(path, 'page');
    return;
  }

  revalidatePath(path);
}

function readSecret(request: NextRequest, body: RevalidatePayload) {
  return (
    request.headers.get('x-revalidate-secret') ||
    request.nextUrl.searchParams.get('secret') ||
    body.secret ||
    ''
  );
}

async function handleRevalidate(request: NextRequest) {
  if (!process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: 'REVALIDATION_SECRET is not configured.' },
      { status: 500 },
    );
  }

  let body: RevalidatePayload = {};
  if (request.method !== 'GET') {
    try {
      body = (await request.json()) as RevalidatePayload;
    } catch {
      body = {};
    }
  }

  const secret = readSecret(request, body);
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret.' }, { status: 401 });
  }

  const paths = Array.from(new Set([...(body.paths || []), ...DEFAULT_PATHS]));
  const tags = Array.from(new Set([...(body.tags || []), ...DEFAULT_TAGS]));

  for (const path of paths) {
    invalidatePath(path);
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  return NextResponse.json({
    revalidated: true,
    paths: Array.from(paths),
    tags: Array.from(tags),
    now: Date.now(),
  });
}

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

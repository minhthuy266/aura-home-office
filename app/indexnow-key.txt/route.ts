import { getIndexNowKey } from '@/src/utils/indexNow';

export async function GET() {
  const key = getIndexNowKey();

  if (!key) {
    return new Response('INDEXNOW_KEY is not configured.\n', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  return new Response(`${key}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Robots-Tag': 'noindex',
    },
  });
}

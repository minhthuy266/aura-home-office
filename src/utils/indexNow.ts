const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const SITE_URL = 'https://aurahomeoffice.com';

export type IndexNowResult =
  | { submitted: false; reason: 'missing-key' | 'no-urls' }
  | { submitted: true; status: number; ok: boolean };

function normalizeUrl(value: string): string | null {
  try {
    const url = new URL(value, SITE_URL);
    if (url.hostname !== 'aurahomeoffice.com') return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

export function getIndexNowKey() {
  return process.env.INDEXNOW_KEY || process.env.BING_INDEXNOW_KEY || '';
}

export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = getIndexNowKey();
  if (!key) return { submitted: false, reason: 'missing-key' };

  const urlList = Array.from(new Set(urls.map(normalizeUrl).filter(Boolean))) as string[];
  if (urlList.length === 0) return { submitted: false, reason: 'no-urls' };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      host: 'aurahomeoffice.com',
      key,
      keyLocation: `${SITE_URL}/indexnow-key.txt`,
      urlList,
    }),
  });

  return {
    submitted: true,
    status: response.status,
    ok: response.ok,
  };
}

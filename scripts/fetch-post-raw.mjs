import { existsSync, readFileSync, writeFileSync } from 'node:fs';

function readDotEnv() {
  if (!existsSync('.env')) return;
  const raw = readFileSync('.env', 'utf8');
  for (const line of raw.split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!process.env[key]) process.env[key] = rest.join('=').replace(/^["']|["']$/g, '');
  }
}

function readLegacySeedCredential() {
  if (!existsSync('seed_english.js')) return {};
  const raw = readFileSync('seed_english.js', 'utf8');
  const user = raw.match(/WP_USER\s*=\s*['"]([^'"]+)['"]/)?.[1];
  const pass = raw.match(/WP_APP_PASS\s*=\s*['"]([^'"]+)['"]/)?.[1];
  const url = raw.match(/WP_URL\s*=\s*['"]([^'"]+)['"]/)?.[1]?.replace(/\/wp-json\/wp\/v2\/?$/, '');
  return { user, pass, url };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    }
  }
  return args;
}

function getConfig() {
  readDotEnv();
  const legacy = readLegacySeedCredential();
  const siteUrl = (
    process.env.WP_URL ||
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WP_API_URL ||
    legacy.url ||
    'https://cms.aurahomeoffice.com'
  ).replace(/\/wp-json\/wp\/v2\/?$/, '').replace(/\/$/, '');

  const user = process.env.WP_USER || process.env.WORDPRESS_USER || legacy.user;
  const pass = process.env.WP_APP_PASS || process.env.WORDPRESS_APP_PASSWORD || legacy.pass;
  if (!user || !pass) throw new Error('Missing WordPress credentials. Set WP_USER and WP_APP_PASS.');

  return { siteUrl, user, pass };
}

async function wpRequest({ siteUrl, user, pass }, endpoint) {
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const response = await fetch(`${siteUrl}/wp-json/wp/v2/${endpoint.replace(/^\//, '')}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`WordPress API ${response.status}: ${json?.message || text}`);
  }

  return json;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const postId = args['post-id'];
  const expectSlug = args['expect-slug'];
  const file = args.file || (postId ? `post-${postId}.html` : null);
  const force = Boolean(args.force);
  const stdout = Boolean(args.stdout);

  if (!postId || !expectSlug) {
    console.error('Usage: node scripts/fetch-post-raw.mjs --post-id <id> --expect-slug <slug> [--file post-<id>.html] [--stdout] [--force]');
    process.exit(2);
  }

  const config = getConfig();
  const post = await wpRequest(config, `posts/${postId}?context=edit`);
  if (post.slug !== expectSlug) {
    throw new Error(`Refusing to fetch: post ${postId} slug is "${post.slug}", expected "${expectSlug}".`);
  }

  const raw = post.content?.raw;
  if (typeof raw !== 'string') {
    throw new Error(`Post ${postId} did not return content.raw. Check credentials and context=edit access.`);
  }

  if (stdout) {
    process.stdout.write(raw);
    return;
  }

  if (existsSync(file) && !force) {
    throw new Error(`Refusing to overwrite ${file}. Use --force after reviewing local changes.`);
  }

  writeFileSync(file, raw, 'utf8');
  console.log(JSON.stringify({
    id: post.id,
    slug: post.slug,
    status: post.status,
    link: post.link,
    file,
    bytes: Buffer.byteLength(raw, 'utf8'),
    wpBlocks: (raw.match(/<!--\s*wp:/gi) || []).length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

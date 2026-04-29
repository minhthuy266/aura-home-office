import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { auditFile } from './audit-post-file.mjs';

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

async function wpRequest({ siteUrl, user, pass }, endpoint, options = {}) {
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const response = await fetch(`${siteUrl}/wp-json/wp/v2/${endpoint.replace(/^\//, '')}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
      ...(options.headers || {}),
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
  const file = args.file;
  const postId = args['post-id'];
  const status = args.status || 'publish';
  const force = Boolean(args.force);
  const dryRun = Boolean(args['dry-run']);
  const expectSlug = args['expect-slug'];
  const confirmPublish = Boolean(args['confirm-publish']);

  if (!file || !postId) {
    console.error('Usage: node scripts/publish-post-file.mjs --post-id <id> --file <post-html-file> --expect-slug <slug> [--status publish] [--dry-run] [--confirm-publish] [--force]');
    process.exit(2);
  }
  if (!expectSlug) {
    console.error('Publish aborted: --expect-slug is required so the target post cannot be mixed up.');
    process.exit(2);
  }

  const audit = auditFile(file);
  const structuralFailures = audit.failures.filter((failure) => (
    failure.includes('serialized Gutenberg block markup') ||
    failure.includes('rendered ACMS product cards') ||
    failure.includes('rendered WordPress block classes') ||
    failure.includes('full Next/HTML page') ||
    failure.includes('non-JSON-LD <script>') ||
    failure.includes('Gutenberg block comments look malformed')
  ));
  if (structuralFailures.length > 0) {
    console.error(JSON.stringify({ file, structuralFailures, audit }, null, 2));
    console.error('Publish aborted because the file is not safe WordPress content.raw block markup. This cannot be bypassed with --force.');
    process.exit(1);
  }
  if (!audit.ok && !force) {
    console.error(JSON.stringify({ file, audit }, null, 2));
    console.error('Publish aborted because audit failed. Use --force only after manual review.');
    process.exit(1);
  }

  if (audit.warnings.length > 0) {
    console.warn(JSON.stringify({ warnings: audit.warnings, metrics: audit.metrics }, null, 2));
  }

  const config = getConfig();
  const html = readFileSync(file, 'utf8');
  const existing = await wpRequest(config, `posts/${postId}?context=edit`, { method: 'GET' });
  if (expectSlug && existing.slug !== expectSlug) {
    throw new Error(`Refusing to publish: post ${postId} slug is "${existing.slug}", expected "${expectSlug}".`);
  }

  if (dryRun) {
    console.log(JSON.stringify({
      id: existing.id,
      slug: existing.slug,
      status: existing.status,
      link: existing.link,
      dryRun: true,
      audit: audit.metrics,
    }, null, 2));
    return;
  }
  if (!confirmPublish) {
    console.error('Publish aborted: rerun with --confirm-publish after reviewing the dry-run target.');
    process.exit(2);
  }

  mkdirSync('backups', { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backups/wp-post-${postId}-${timestamp}.html`;
  writeFileSync(backupFile, existing.content?.raw || '', 'utf8');

  const updated = await wpRequest(config, `posts/${postId}`, {
    method: 'POST',
    body: JSON.stringify({
      content: html,
      status,
    }),
  });

  console.log(JSON.stringify({
    id: updated.id,
    slug: updated.slug,
    status: updated.status,
    link: updated.link,
    previousModified: existing.modified_gmt,
    modified: updated.modified_gmt,
    backupFile,
    audit: audit.metrics,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

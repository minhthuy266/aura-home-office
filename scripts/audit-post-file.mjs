import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

const forbiddenPhrases = [
  'proven reliable',
  'guaranteed',
  'premium pick',
  'top choice',
  'quiet motor operation',
  'reduces strain',
  'prevents pain',
  'health benefit',
  'no customer reviews',
  'zero reviews',
  'buyer feedback unavailable',
  'crawl',
  'scraped',
  'scraper',
  'parser',
  'source data',
];

const brokenPatterns = [
  /motor noise is worth checking in recent owner reviews\s*\(0\.8 inches per second lift speed\)\s*allows position changes without disrupting focus or video calls/i,
  /motor noise is worth checking in recent owner reviews\s+under\s+45\s*dB\s+means it won['’]?t disrupt video calls or nearby work/i,
  /Motor reliability and long-term durability are not worth checking in recent owner reviews by specs alone/i,
  /without jumping to a higher-priced desk or more on a larger desk/i,
  /without spending a listed price/i,
  /\breduces neck(?: and shoulder)? strain\b/i,
  /\breducing neck(?: and shoulder)? strain\b/i,
  /\bwithout wobble\b/i,
  /\b220-lb capacity covers most home office equipment loads\b/i,
];

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]+/g, '')
    .trim();
}

function textOf($, root) {
  const clone = root.clone();
  clone.find('script, style, noscript').remove();
  return clone.text().replace(/\s+/g, ' ').trim();
}

function countWords(value) {
  return (value.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?/g) || []).length;
}

function findUnsafePriceMentions(text) {
  const matches = [...text.matchAll(/\$\s?\d[\d,]*(?:\.\d{2})?/g)];
  return matches.filter((match) => {
    const index = match.index || 0;
    const context = text.slice(Math.max(0, index - 48), index + 72).toLowerCase();
    return !/\b(?:under|below|over|above|sub)\s+\$\s?\d/.test(context);
  });
}

function getUnsafeScripts($) {
  return $('script').toArray().filter((el) => {
    const type = ($(el).attr('type') || '').trim().toLowerCase();
    return type !== 'application/ld+json';
  });
}

export function auditHtml(html, options = {}) {
  const $ = cheerio.load(html, null, false);
  const bodyText = textOf($, $.root());
  const failures = [];
  const warnings = [];
  const wpBlockCount = (html.match(/<!--\s*wp:/gi) || []).length;
  const wpBlockCloseCount = (html.match(/<!--\s*\/wp:/gi) || []).length;

  if (wpBlockCount === 0) {
    failures.push('content is not serialized Gutenberg block markup; use WordPress content.raw/context=edit');
  }
  if (wpBlockCloseCount > wpBlockCount) {
    failures.push('Gutenberg block comments look malformed: more closing blocks than opening blocks');
  }
  if (getUnsafeScripts($).length > 0) failures.push('content contains non-JSON-LD <script>; do not publish app-rendered page shells to WordPress');
  if ($('iframe').length > 0) warnings.push('content contains <iframe>; verify it is intentional and crawl-safe');
  if (/__next|self\.__next_f|<html\b|<body\b/i.test(html)) {
    failures.push('content looks like a full Next/HTML page, not a WordPress post body fragment');
  }
  if (/<!--\s*ACMS Product List\s*-->/i.test(html) || $('.acms-list__item').length > 0) {
    failures.push('content contains rendered ACMS product cards; publish the [acms_list] shortcode block, not rendered frontend HTML');
  }
  if ($('[class*="wp-block-"]').length > 0 && !/<!--\s*wp:/i.test(html)) {
    failures.push('content contains rendered WordPress block classes but no Gutenberg block comments; use content.raw/context=edit, not content.rendered');
  }

  for (const phrase of forbiddenPhrases) {
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(bodyText)) failures.push(`forbidden phrase still rendered: "${phrase}"`);
  }

  for (const pattern of brokenPatterns) {
    if (pattern.test(bodyText)) failures.push(`broken or unsafe sentence pattern found: ${pattern}`);
  }

  const unsafePriceMentions = findUnsafePriceMentions(bodyText);
  if (unsafePriceMentions.length > 0) failures.push('hardcoded price pattern "$[0-9]" found');
  if (/\salt="[^"]*"\s+(?:[a-z][a-z0-9:-]*=""){2,}/i.test(html)) {
    failures.push('possible broken image alt attribute from unescaped quote');
  }

  const h2 = $('h2').map((_, el) => normalize($(el).text())).get().filter(Boolean);
  const h3 = $('h3').map((_, el) => normalize($(el).text())).get().filter(Boolean);
  if (h2.length < 4) warnings.push(`only ${h2.length} H2 headings found; long product guides usually need clearer sections`);
  if (!h2.includes('quick picks')) warnings.push('missing Quick Picks H2');
  if (!h2.some((heading) => heading.includes('how we evaluated'))) warnings.push('missing methodology / How We Evaluated section');
  if (!h2.includes('final verdict')) warnings.push('missing Final Verdict H2');
  if (!h2.includes('faqs') && h3.filter((heading) => heading.endsWith('?')).length < 3) warnings.push('missing FAQ section or at least three FAQ-style H3s');

  const headingCounts = new Map();
  $('h2, h3').not('[data-toc="false"]').each((_, el) => {
    const key = normalize($(el).text());
    if (!key) return;
    headingCounts.set(key, (headingCounts.get(key) || 0) + 1);
  });
  for (const [heading, count] of headingCounts) {
    if (count > 1) failures.push(`duplicate h2/h3 heading: "${heading}" (${count})`);
  }

  const comparisonTables = $('.comparison-table-wrapper').length;
  if (comparisonTables > 1) failures.push(`duplicate comparison table wrappers found (${comparisonTables})`);

  const productCards = $('.acms-list__item').length;
  if (productCards > 0 && productCards < 3) warnings.push(`only ${productCards} product cards found`);

  const amazonLinks = $('a[href*="amazon."]').toArray();
  for (const el of amazonLinks) {
    const rel = ($(el).attr('rel') || '').toLowerCase();
    if (!rel.includes('nofollow') || !rel.includes('sponsored')) {
      failures.push(`Amazon link missing nofollow/sponsored rel: ${$(el).attr('href') || ''}`);
      break;
    }
  }

  const images = $('img').toArray();
  let missingAlt = 0;
  for (const el of images) {
    const alt = $(el).attr('alt');
    if (!alt || !alt.trim()) missingAlt += 1;
  }
  if (missingAlt > 0) failures.push(`${missingAlt} image(s) missing alt text`);

  const wordCount = countWords(bodyText);
  if (wordCount < 1200) warnings.push(`thin content risk: ${wordCount} words`);

  const firstParagraph = $('p').first().text().replace(/\s+/g, ' ').trim();
  if (firstParagraph && firstParagraph.length > 320) warnings.push('first paragraph is long; consider tightening for snippet readability');
  if (!/research-based|compared|tested|reviewed|evaluated/i.test(bodyText)) warnings.push('missing clear evaluation framing');
  if (!/owner reviews|owner feedback|recent reviews/i.test(bodyText)) warnings.push('missing owner-feedback verification language');

  return {
    ok: failures.length === 0,
    failures,
    warnings,
    metrics: {
      words: wordCount,
      h2: h2.length,
      h3: h3.length,
      productCards,
      images: images.length,
      amazonLinks: amazonLinks.length,
      comparisonTables,
      wpBlocks: wpBlockCount,
      wpBlockClosers: wpBlockCloseCount,
      shortcodes: (html.match(/<!--\s*wp:shortcode\s*-->/gi) || []).length,
    },
  };
}

export function auditFile(file, options = {}) {
  return auditHtml(readFileSync(file, 'utf8'), options);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/audit-post-file.mjs <post-html-file>');
    process.exit(2);
  }

  const result = auditFile(file);
  console.log(JSON.stringify({ file, ...result }, null, 2));
  process.exit(result.ok ? 0 : 1);
}

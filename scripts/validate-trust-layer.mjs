import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('Usage: npm run validate:trust -- <rendered-html-file> [more-files]');
  process.exit(2);
}

const marketingBadges = [
  'Best Seller',
  "Editor's Pick",
  'Limited Time',
  'Top Rated',
];

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

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]+/g, '')
    .trim();
}

function getJsonLdObjects($) {
  const objects = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).text().trim();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        objects.push(...parsed);
      } else if (Array.isArray(parsed?.['@graph'])) {
        objects.push(...parsed['@graph']);
      } else {
        objects.push(parsed);
      }
    } catch {
      objects.push({ __invalidJsonLd: raw.slice(0, 120) });
    }
  });

  return objects;
}

function schemaTypes(schema) {
  const type = schema?.['@type'];
  return Array.isArray(type) ? type : [type].filter(Boolean);
}

function schemaAuthorName(author) {
  if (!author) return '';
  if (typeof author === 'string') return author;
  if (Array.isArray(author)) return schemaAuthorName(author[0]);
  return author.name || '';
}

let failed = false;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  const failures = [];
  const schemas = getJsonLdObjects($);

  const metaAuthors = $('meta[name="author"]');
  if (metaAuthors.length > 1) {
    failures.push(`multiple meta author tags (${metaAuthors.length})`);
  }

  const articleSchemas = schemas.filter((schema) => schemaTypes(schema).includes('Article'));
  if (articleSchemas.length > 1) {
    failures.push(`duplicate Article schema (${articleSchemas.length})`);
  }

  const articleSchema = articleSchemas[0];
  const schemaAuthor = schemaAuthorName(articleSchema?.author);
  const metaAuthor = metaAuthors.first().attr('content') || '';
  const ogAuthor = $('meta[property="article:author"]').first().attr('content') || '';
  const visibleRoot = $.root().clone();
  visibleRoot.find('script, style, noscript').remove();
  const bodyText = visibleRoot.text().replace(/\s+/g, ' ');
  const bylineMatch = bodyText.match(/\bBY\s+(.+?)(?=REVIEWED BY|LAST UPDATED|$)/);
  const reviewedByMatch = bodyText.match(/\bREVIEWED BY\s+(.+?)(?=LAST UPDATED|$)/);
  const schemaReviewer = schemaAuthorName(articleSchema?.reviewedBy);

  if (schemaAuthor && bylineMatch && normalize(schemaAuthor) !== normalize(bylineMatch[1])) {
    failures.push(`article author/schema mismatch: byline "${bylineMatch[1]}" vs schema "${schemaAuthor}"`);
  }

  if (schemaAuthor && metaAuthor && normalize(schemaAuthor) !== normalize(metaAuthor)) {
    failures.push(`meta author/schema mismatch: meta "${metaAuthor}" vs schema "${schemaAuthor}"`);
  }

  if (schemaAuthor && ogAuthor && normalize(schemaAuthor) !== normalize(ogAuthor)) {
    failures.push(`article:author/schema mismatch: og "${ogAuthor}" vs schema "${schemaAuthor}"`);
  }

  if (reviewedByMatch && schemaReviewer && normalize(reviewedByMatch[1]) !== normalize(schemaReviewer)) {
    failures.push(`reviewedBy mismatch: UI "${reviewedByMatch[1]}" vs schema "${schemaReviewer}"`);
  }

  const schemaText = JSON.stringify(schemas);
  for (const phrase of ['top choice', 'premium pick']) {
    if (new RegExp(phrase, 'i').test(schemaText)) {
      failures.push(`Product schema contains "${phrase}"`);
    }
  }

  for (const badge of marketingBadges) {
    if (new RegExp(`\\b${badge.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(bodyText)) {
      failures.push(`marketing badge still rendered: "${badge}"`);
    }
  }

  if (/\$\s?\d/.test(bodyText) || /\$\s?\d/.test(schemaText)) {
    failures.push('hardcoded price pattern "$[0-9]" found');
  }

  if (/\salt="[^"]*"\s+(?:[a-z][a-z0-9:-]*=""){2,}/i.test(html)) {
    failures.push('possible broken alt attribute from unescaped quote');
  }

  const headingCounts = new Map();
  $('h2, h3').not('[data-toc="false"]').each((_, el) => {
    const key = normalize($(el).text());
    if (!key) return;
    headingCounts.set(key, (headingCounts.get(key) || 0) + 1);
  });

  for (const [heading, count] of headingCounts) {
    if (count > 1) {
      failures.push(`duplicate h2/h3 heading: "${heading}" (${count})`);
    }
  }

  for (const phrase of forbiddenPhrases) {
    if (new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(bodyText)) {
      failures.push(`forbidden phrase still rendered: "${phrase}"`);
    }
  }

  if (failures.length > 0) {
    failed = true;
    console.error(`\n${file}`);
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
  } else {
    console.log(`${file}: trust-layer checks passed`);
  }
}

process.exit(failed ? 1 : 0);

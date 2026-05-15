/**
 * processContent.ts — Server-side content processor
 *
 * WordPress content is mostly rendered as-is.
 * We only resolve editorial placeholders before sending the HTML to the article.
 */
import * as cheerio from 'cheerio';
import { replaceDynamicPlaceholders } from './placeholders';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface ProcessedContent {
  html: string;
  toc: TOCItem[];
  products?: ProductData[];
  faqs?: { question: string; answer: string }[];
}

export interface ProductData {
  name: string;
  url: string;
  image: string;
  score: string;
  award?: string;
  description?: string;
  pros: string[];
  cons: string[];
  asin?: string;
}

function stripHtmlToText(html: string): string {
  return cheerio.load(html, null, false).text().replace(/\s+/g, ' ').trim();
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const dollarAmountPattern = '\\$\\s?\\d[\\d,]*(?:\\.\\d{2})?';
const optionalPriceNounPattern = '(?:\\s+(?:price\\s+point|price\\s+range|range))?';
const hardPriceClaimPatterns: Array<[RegExp, string]> = [
  [new RegExp(`\\b(?:for\\s+)?under[\\s-]+(${dollarAmountPattern})${optionalPriceNounPattern}\\b`, 'gi'), 'around the $1 price range'],
  [new RegExp(`\\bbelow\\s+(${dollarAmountPattern})${optionalPriceNounPattern}\\b`, 'gi'), 'around the $1 price range'],
  [new RegExp(`\\bless\\s+than\\s+(${dollarAmountPattern})${optionalPriceNounPattern}\\b`, 'gi'), 'around the $1 price range'],
  [new RegExp(`\\b(?:for\\s+)?under\\s+check\\s+current\\s+price\\b`, 'gi'), 'near the current Amazon price'],
  [new RegExp(`\\bbelow\\s+check\\s+current\\s+price\\b`, 'gi'), 'near the current Amazon price'],
  [new RegExp(`\\bless\\s+than\\s+check\\s+current\\s+price\\b`, 'gi'), 'near the current Amazon price'],
];

function softenHardPriceClaims(value: string): string {
  return hardPriceClaimPatterns.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
}

function prepareHtml(html: string): { html: string; toc: TOCItem[] } {
  const $ = cheerio.load(html, null, false);
  const toc: TOCItem[] = [];
  const usedHeadingIds = new Map<string, number>();

  $('script[type="application/ld+json"]').remove();

  $('a[href]').each((_, el) => {
    const link = $(el);
    const href = link.attr('href') || '';
    if (/^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?aurahomeoffice\.com\b/i.test(href)) {
      link.attr('target', '_blank');
      link.attr('rel', 'nofollow sponsored noopener noreferrer');
    }
  });

  const marketingBadges = new Set([
    'best seller',
    "editor's pick",
    'limited time',
    'top rated',
  ]);

  $('*').each((_, el) => {
    const element = $(el);
    const text = element.text().replace(/\s+/g, ' ').trim().toLowerCase();
    if (marketingBadges.has(text)) {
      element.remove();
    }
  });

  $('*').contents().each((_, node) => {
    if (node.type !== 'text') return;
    const current = node.data || '';
    const cleaned = current
      .replace(/\bBest Seller\b/gi, '')
      .replace(/\bEditor's Pick\b/gi, '')
      .replace(/\bLimited Time\b/gi, '')
      .replace(/\bTop Rated\b/gi, '')
      .replace(/\bguaranteed\b/gi, 'not assured')
      .replace(/\bquiet motor operation\b/gi, 'motor noise');

    const trustCleaned = softenHardPriceClaims(cleaned);

    if (trustCleaned !== current) node.data = trustCleaned;
  });

  $('h2, h3').each((index, el) => {
    if ($(el).attr('data-toc') === 'false') return;

    const text = stripHtmlToText($(el).html() || '');
    if (!text) return;

    const baseId = slugifyHeading(text) || `toc-heading-${index}`;
    const count = usedHeadingIds.get(baseId) || 0;
    usedHeadingIds.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    $(el).attr('id', id);

    toc.push({
      id,
      text,
      level: Number(el.tagName.replace('h', '')),
    });
  });

  return { html: $.html(), toc };
}

export function processPostContent(contentHtml: string, title = ''): ProcessedContent {
  const html = replaceDynamicPlaceholders(contentHtml, {
    title,
    contentHtml,
  });
  const prepared = prepareHtml(html);

  return {
    html: prepared.html,
    toc: prepared.toc,
  };
}

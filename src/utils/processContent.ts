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

export interface ProcessContentOptions {
  fallbackUpdatedAt?: string;
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

function formatUpdatedDate(value?: string): string {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function fillMissingProductUpdateDates($: cheerio.CheerioAPI, fallbackUpdatedAt?: string) {
  const formattedDate = formatUpdatedDate(fallbackUpdatedAt);
  if (!formattedDate) return;

  $('.acms-list__update').each((_, el) => {
    const update = $(el);
    const label = update.children('span').first();

    if (label.length && /^updated:\s*$/i.test(label.text().replace(/\s+/g, ' ').trim())) {
      label.text(`Updated: ${formattedDate}`);
    }

    const tooltip = update.children('.acms-list__update-tooltip').first();
    if (tooltip.length && /^last update on\s*(?:\/.*)?$/i.test(tooltip.text().replace(/\s+/g, ' ').trim())) {
      tooltip.text(
        `Last update on ${formattedDate} / Affiliate links / Images, Product Titles, and Product Highlights from Amazon Product Advertising API.`,
      );
    }
  });
}

function shortenProductTitle(value: string): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= 72) return clean;

  const split = clean.match(/^(.{28,72}?)(?:\s+(?:with|for|featuring|including|compatible with|fits)\b|[,|-])/i);
  if (split?.[1]) return split[1].trim();

  const words = clean.split(' ');
  return words.slice(0, Math.min(words.length, 7)).join(' ').trim();
}

function extractProducts($: cheerio.CheerioAPI): ProductData[] {
  const products: ProductData[] = [];

  $('.acms-product-card, .acms-product-item, .acms-list__item, .wp-block-product-card').each((_, el) => {
    const item = $(el);
    const titleEl = item.find('.acms-list__title, .acms-product-title, .product-title, h3, h4').first();
    const rawName = stripHtmlToText(titleEl.html() || titleEl.text());
    if (!rawName) return;

    const link = titleEl.find('a[href]').first().attr('href') || item.find('a[href]').first().attr('href') || '';
    const image = item.find('img').first().attr('src') || item.find('img').first().attr('data-src') || '';
    const score = stripHtmlToText(item.find('.acms-score, .acms-list__score, .score').first().html() || '');
    const description = stripHtmlToText(
      item.find('.acms-list__desc, .acms-product-description, .product-description, p').first().html() || '',
    );

    products.push({
      name: shortenProductTitle(rawName),
      url: link,
      image,
      score,
      description,
      pros: [],
      cons: [],
    });
  });

  return products;
}

function prepareHtml(html: string, options: ProcessContentOptions = {}): { html: string; toc: TOCItem[] } {
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

  fillMissingProductUpdateDates($, options.fallbackUpdatedAt);

  $('.acms-list__title, .acms-product-title, .product-title').each((_, el) => {
    const heading = $(el);
    if (!/^h[1-6]$/i.test(el.tagName)) return;

    const link = heading.find('a').first();
    const originalText = stripHtmlToText(heading.html() || '');
    const shortTitle = shortenProductTitle(originalText);
    if (shortTitle && shortTitle !== originalText) {
      if (link.length) {
        link.text(shortTitle);
      } else {
        heading.text(shortTitle);
      }
    }
  });

  const authorNames = new Set(['Alex Carter', 'Jordan Lee', 'Morgan Davis']);
  $('h2, h3, h4').each((_, el) => {
    const heading = $(el);
    const text = stripHtmlToText(heading.html() || '');
    if (!authorNames.has(text)) return;

    const authorName = $('<p></p>');
    const attrs = el.attribs || {};
    Object.entries(attrs).forEach(([key, value]) => {
      if (!/^id$/i.test(key)) authorName.attr(key, value);
    });
    authorName.addClass('author-name');
    authorName.text(text);
    heading.replaceWith(authorName);
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

export function processPostContent(
  contentHtml: string,
  title = '',
  options: ProcessContentOptions = {},
): ProcessedContent {
  const html = replaceDynamicPlaceholders(contentHtml, {
    title,
    contentHtml,
  });
  const prepared = prepareHtml(html, options);
  const $ = cheerio.load(prepared.html, null, false);

  return {
    html: prepared.html,
    toc: prepared.toc,
    products: extractProducts($),
  };
}

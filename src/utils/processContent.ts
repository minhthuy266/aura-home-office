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

function extractToc(html: string): TOCItem[] {
  const $ = cheerio.load(html, null, false);
  const toc: TOCItem[] = [];

  $('h2, h3').each((index, el) => {
    if ($(el).attr('data-toc') === 'false') return;

    const text = stripHtmlToText($(el).html() || '');
    if (!text) return;

    toc.push({
      id: `toc-heading-${index}`,
      text,
      level: Number(el.tagName.replace('h', '')),
    });
  });

  return toc;
}

export function processPostContent(contentHtml: string, title = ''): ProcessedContent {
  const html = replaceDynamicPlaceholders(contentHtml, {
    title,
    contentHtml,
  });

  return {
    html,
    toc: extractToc(html),
  };
}

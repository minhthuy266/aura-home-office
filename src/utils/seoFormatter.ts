/**
 * Utility to process WordPress HTML content for Next.js frontend.
 */

const CMS_URL = 'https://cms.aurahomeoffice.com';

/**
 * Advanced SEO Formatter — Handles placeholders and cleans up AI repetition.
 */
export function formatSEOText(text: string, title: string = '', category: string = '', fullContent: string = ''): string {
  if (!text) return '';

  let processed = text.replace(/<[^>]*>/g, '').trim();

  // 1. Extract dynamic values from Title (e.g., "Best 10 Chairs" -> 10, Chairs)
  const productCountMatch = title.match(/(\d+)/);
  const productCount = productCountMatch ? productCountMatch[0] : '10';
  // 2. Replace Placeholders in Title (just in case)
  const cleanTitle = title.replace(/<[^>]*>/g, '').replace(/The \d+ Best | of \d{4}/gi, '').trim();
  const currentYear = new Date().getFullYear().toString();

  // 3. Smart Filtering: Split by sentences and remove the first one ONLY if there's more content
  let sentences = processed.split(/(\.|\?|!)\s+/);
  
  if (sentences.length > 2 && sentences[0] && (
    sentences[0].startsWith('We compared') || 
    sentences[0].startsWith('In this guide') ||
    sentences[0].includes('by specs, owner feedback, practical features') // Bắt đúng cái câu trong Prompt của mày
  )) {
    // Only remove if there is significant content left
    const testRemainder = sentences.slice(2).join('').trim();
    if (testRemainder.length > 10) {
      sentences.splice(0, 2);
      processed = sentences.join(' ');
    }
  }

  // 4. Final placeholder replacement in the cleaned text
  processed = processed.replace(/%keyword%/gi, cleanTitle);
  processed = processed.replace(/%product_count%/gi, productCount);
  processed = processed.replace(/%year%/gi, currentYear);

  return formatPostContent(processed.trim());
}

export function formatPostContent(html: string): string {
  if (!html) return '';

  let processedHtml = html;

  // Domain Rewriting
  const cmsLinkRegex = new RegExp(CMS_URL, 'g');
  processedHtml = processedHtml.replace(cmsLinkRegex, '');

  // Cleanup links
  processedHtml = processedHtml.replace(/href="\/\//g, 'href="/');

  // Smart Link classification
  processedHtml = processedHtml.replace(/ target="_blank"/g, '');
  processedHtml = processedHtml.replace(
    /<a href="(http[^"]+)"/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer nofollow"'
  );
  
  return processedHtml;
}

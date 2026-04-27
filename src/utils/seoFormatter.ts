/**
 * Utility to process WordPress HTML content for Next.js frontend.
 */

const CMS_URL = 'https://cms.aurahomeoffice.com';

/**
 * Decodes common HTML entities.
 */
export function decodeHTMLEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '—');
}

/**
 * Advanced SEO Formatter — Handles placeholders and cleans up AI repetition.
 */
export function formatSEOText(text: string, title: string = '', category: string = '', fullContent: string = ''): string {
  if (!text) return '';

  let processed = decodeHTMLEntities(text).replace(/<[^>]*>/g, '').trim();

  // 1. Extract dynamic values from Title (e.g., "Best 10 Chairs" -> 10, Chairs)
  const productCountMatch = title.match(/(\d+)/);
  const productCount = productCountMatch ? productCountMatch[0] : '';
  // 2. Replace Placeholders in Title (just in case)
  const cleanTitle = title.replace(/<[^>]*>/g, '').replace(/The \d+ Best | of \d{4}/gi, '').trim();
  const currentYear = new Date().getFullYear().toString();

  // 3. Smart Filtering: Extract the core value proposition sentence
  // Match sentences properly keeping punctuation
  let sentenceMatches = processed.match(/[^.!?]+[.!?]+/g) || [processed];
  
  let coreSentence = sentenceMatches.find(s => 
    s.trim().toLowerCase().startsWith('we compared') || 
    s.trim().toLowerCase().startsWith('in this guide') ||
    s.toLowerCase().includes('by specs, owner feedback, practical features')
  );

  if (coreSentence) {
    // Convert "We compared 6 wireless..." to "Compare 6 wireless..."
    processed = coreSentence.trim().replace(/^(We compared|In this guide,? we compared)\s+/i, 'Compare ');
  } else if (sentenceMatches.length > 0) {
    // Keep first sentence at least so it doesn't cut mid-word abruptly
    processed = sentenceMatches[0].trim();
  }

  // 4. Final placeholder replacement in the cleaned text
  processed = processed.replace(/%keyword%/gi, cleanTitle);
  if (productCount) {
    processed = processed.replace(/%product_count%/gi, productCount);
  } else {
    processed = processed.replace(/\s*%product_count%\s*/gi, ' ');
  }
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

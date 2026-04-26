/**
 * processContent.ts — Server-side content processor
 *
 * Replaces the client-side DOMParser + useEffect logic with
 * pure-string operations that run during build / SSR so that
 * article HTML is baked directly into the static page.
 */

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface ProcessedContent {
  html: string;
  toc: TOCItem[];
}

/**
 * Replace editorial placeholders (%keyword%, %year%, etc.) in raw WP HTML.
 */
function replacePlaceholders(
  html: string,
  title: string,
): string {
  const cleanTitle = title.replace(/<[^>]*>/g, '');
  const keyword = cleanTitle
    .replace(/The \d+ Best /gi, '')
    .replace(/ of \d{4}/gi, '')
    .replace(/Best /gi, '')
    .trim();

  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = now.toLocaleString('en-US', { month: 'long' });
  const currentMonthNum = (now.getMonth() + 1).toString();

  return html
    .replace(/%keyword%/gi, keyword)
    .replace(/%Keyword%/gi, keyword)
    .replace(/%product_count%/gi, '10') // safe fallback
    .replace(/%brand_list%/gi, 'top-tier manufacturers')
    .replace(/%month_text%/gi, currentMonth)
    .replace(/%month%/gi, currentMonthNum)
    .replace(/%year%/gi, currentYear);
}

/**
 * Extract headings from HTML to build the Table of Contents,
 * and inject `id` attributes into each heading for anchor linking.
 *
 * Works entirely with regex – no DOM required.
 */
function extractTocAndInjectIds(html: string): ProcessedContent {
  const toc: TOCItem[] = [];
  let index = 0;

  // Match <h2 ...> or <h3 ...> tags
  const processed = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs, inner) => {
      // Strip HTML tags from heading text
      const text = inner.replace(/<[^>]*>/g, '').trim();
      const level = parseInt(tag.substring(1));

      const slug = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const id = `${slug || 'section'}-${index}`;
      index++;

      toc.push({ id, text, level });

      // Inject id attribute — preserve any existing attributes
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );

  return { html: processed, toc };
}

/**
 * Ensure score-tooltip links open in new tabs.
 */
function fixTooltipLinks(html: string): string {
  return html.replace(
    /(<a\b[^>]*class="[^"]*acms-list__score-tooltip[^"]*"[^>]*)(>)/gi,
    '$1 target="_blank" rel="noopener noreferrer nofollow"$2',
  );
}

/**
 * Rewrite internal CMS links to relative paths and inject categories.
 * Example: https://cms.aurahomeoffice.com/my-post/ -> /furniture/my-post/
 */
function resolveInternalLinks(html: string, routeMap: Record<string, string>, categoryMap: Set<string> = new Set()): string {
  const CMS_URL = 'https://cms.aurahomeoffice.com';
  
  // 1. First, make everything relative by removing domain
  let processed = html.replace(new RegExp(CMS_URL, 'g'), '');

  // 2. Flatten hierarchical category links if necessary
  // Example: /furniture/footrests-mats/ -> /footrests-mats/ (if footrests-mats is a category)
  processed = processed.replace(/href="\/([^"/]+)\/([^"/]+)\/?"/g, (match, parent, child) => {
    if (categoryMap.has(child)) {
      return `href="/${child}/"`;
    }
    return match;
  });

  // 3. Use the routeMap to find slugs and inject categories
  processed = processed.replace(/href="\/([^"/]+)\/?"/g, (match, slug) => {
    const category = routeMap[slug];
    if (category) {
      return `href="/${category}/${slug}"`;
    }
    return match;
  });

  // 4. SMART LINK HANDLING
  processed = processed.replace(
    /<a href="(http[^"]+)"/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer nofollow"'
  );

  return processed;
}

/**
 * Main entry point — call from Server Components.
 */
export function processPostContent(
  contentHtml: string,
  titleRendered: string,
  routeMap: Record<string, string> = {},
  categoryMap: Set<string> = new Set()
): ProcessedContent {
  let html = resolveInternalLinks(contentHtml, routeMap, categoryMap);
  html = replacePlaceholders(html, titleRendered);
  html = fixTooltipLinks(html);
  const result = extractTocAndInjectIds(html);
  return result;
}

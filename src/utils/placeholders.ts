interface PlaceholderContext {
  title?: string;
  contentHtml?: string;
  now?: Date;
}

interface PlaceholderValues {
  keyword: string;
  keywordForOptions: string;
  productCount?: number;
  brandList: string;
  monthText: string;
  month: string;
  year: string;
}

export function decodeHTMLEntities(text: string): string {
  if (!text) return '';

  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _;
    })
    .replace(/&#(\d+);/g, (_, decimal) => {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _;
    });
}

function stripHtmlToPlainText(html: string): string {
  return decodeHTMLEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function singularizeWord(word: string): string {
  if (word.length < 4) return word;
  if (/ss$/i.test(word)) return word;
  if (/ies$/i.test(word)) return word.replace(/ies$/i, 'y');
  if (/(ches|shes|xes|zes)$/i.test(word)) return word.replace(/es$/i, '');
  if (/s$/i.test(word)) return word.replace(/s$/i, '');
  return word;
}

function keywordForOptions(keyword: string): string {
  const parts = keyword.split(/\b(for|with|under|over|to|in|on)\b/i);
  const leadPhrase = parts[0]?.trim();
  if (!leadPhrase) {
    const words = keyword.split(/\s+/);
    words[words.length - 1] = singularizeWord(words[words.length - 1]);
    return words.join(' ');
  }

  const words = leadPhrase.split(/\s+/);
  words[words.length - 1] = singularizeWord(words[words.length - 1]);

  return [words.join(' '), ...parts.slice(1)].join('').replace(/\s+/g, ' ').trim();
}

export function deriveKeywordFromTitle(title = ''): string {
  let keyword = stripHtmlToPlainText(title);

  keyword = keyword
    .replace(/\s+\|\s+.*$/g, '')
    .replace(/\s+-\s+Aura Home Office.*$/i, '');

  const colonIndex = keyword.indexOf(':');
  if (colonIndex > 0) {
    keyword = keyword.slice(0, colonIndex);
  }

  keyword = keyword
    .replace(/^\s*(?:the\s+)?(?:\d+\s+)?(?:best|top)\s+/i, '')
    .replace(/^\s*(?:best|top)\s+\d+\s+/i, '')
    .replace(/\b(?:of|in|for)\s+20\d{2}\b/gi, '')
    .replace(/\b20\d{2}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  return keyword || stripHtmlToPlainText(title).toLowerCase();
}

function extractProductCountFromTitle(title = ''): number | undefined {
  const plainTitle = stripHtmlToPlainText(title);
  const numbers = plainTitle.match(/\b\d+\+?\b/g) || [];

  for (const raw of numbers) {
    const value = Number.parseInt(raw, 10);
    if (!Number.isFinite(value)) continue;
    if (value >= 2000 && value <= 2099) continue;
    if (value > 0 && value < 100) return value;
  }

  return undefined;
}

export function extractProductCountFromContent(contentHtml = '', title = ''): number | undefined {
  const productCardMatches = contentHtml.match(/class=(["'])[^"']*(?:acms-product-card|acms-product-item|wp-block-product-card)[^"']*\1/gi);
  if (productCardMatches?.length) return productCardMatches.length;

  const shortcodeMatches = Array.from(
    contentHtml.matchAll(/\[acms_list[^\]]*asin=(?:"|&quot;|')([^"'&\]]+)(?:"|&quot;|')[^\]]*]/gi),
  );
  const shortcodeAsins = shortcodeMatches.flatMap((match) =>
    match[1]
      .split(',')
      .map((asin) => asin.trim())
      .filter(Boolean),
  );
  if (shortcodeAsins.length) return new Set(shortcodeAsins).size;

  const uniqueAsins = new Set(contentHtml.match(/\bB0[A-Z0-9]{8}\b/gi) || []);
  if (uniqueAsins.size) return uniqueAsins.size;

  return extractProductCountFromTitle(title);
}

function extractBrandListFromContent(contentHtml = ''): string {
  const brands = new Set<string>();

  const schemaBrandMatches = Array.from(
    contentHtml.matchAll(/"brand"\s*:\s*(?:\{[^}]*"name"\s*:\s*"([^"]+)"|"([^"]+)")/gi),
  );
  schemaBrandMatches.forEach((match) => {
    const brand = (match[1] || match[2] || '').trim();
    if (brand) brands.add(brand);
  });

  const productTitleMatches = Array.from(
    contentHtml.matchAll(/<(?:h3|h4)[^>]*class=(["'])[^"']*(?:acms-product-title|product-title)[^"']*\1[^>]*>([\s\S]*?)<\/(?:h3|h4)>/gi),
  );
  productTitleMatches.forEach((match) => {
    const firstWord = stripHtmlToPlainText(match[2]).split(/\s+/)[0];
    if (firstWord && firstWord.length > 2) brands.add(firstWord);
  });

  const brandList = Array.from(brands).slice(0, 5);
  if (brandList.length === 0) return 'top-tier manufacturers';
  if (brandList.length === 1) return brandList[0];

  return `${brandList.slice(0, -1).join(', ')} and ${brandList[brandList.length - 1]}`;
}

function buildPlaceholderValues(context: PlaceholderContext): PlaceholderValues {
  const now = context.now || new Date();
  const keyword = deriveKeywordFromTitle(context.title || '');

  return {
    keyword,
    keywordForOptions: keywordForOptions(keyword),
    productCount: extractProductCountFromContent(context.contentHtml || '', context.title || ''),
    brandList: extractBrandListFromContent(context.contentHtml || ''),
    monthText: now.toLocaleString('en-US', { month: 'long' }),
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  };
}

export function replaceDynamicPlaceholders(text: string, context: PlaceholderContext): string {
  if (!text) return '';

  const values = buildPlaceholderValues(context);
  let processed = text;

  processed = processed.replace(/%keyword%\s+options/gi, `${values.keywordForOptions} options`);
  processed = processed.replace(/%keyword%/gi, values.keyword);
  processed = processed.replace(/%Keyword%/g, values.keyword);

  if (values.productCount !== undefined) {
    processed = processed.replace(/%product_count%/gi, String(values.productCount));
  } else {
    processed = processed.replace(/\s*%product_count%\s*/gi, ' ');
  }

  processed = processed
    .replace(/%brand_list%/gi, values.brandList)
    .replace(/%month_text%/gi, values.monthText)
    .replace(/%month%/gi, values.month)
    .replace(/%year%/gi, values.year);

  return processed;
}

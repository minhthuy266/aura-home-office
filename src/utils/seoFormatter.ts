import { format } from 'date-fns';

export function formatSEOText(
  text: string, 
  title?: string, 
  fallbackKeyword: string = '',
  contentHtml?: string
): string {
  if (!text) return '';
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = format(new Date(), 'MMMM');
  
  let productCount = '';
  let brandList = '';

  if (contentHtml) {
    const productMatches = contentHtml.match(/class="[^"]*\b(?:acms-product-card|acms-product-item|wp-block-product-card)\b[^"]*"/gi);
    if (productMatches && productMatches.length > 0) {
      productCount = productMatches.length.toString();
    }

    const titleRegex = /class="[^"]*\b(?:acms-product-title|product-title)\b[^"]*"[^>]*>([^<]+)</gi;
    let match;
    const brandSet = new Set<string>();
    while ((match = titleRegex.exec(contentHtml)) !== null) {
      const brand = match[1].trim().split(' ')[0];
      if (brand && brand.length > 2) {
        brandSet.add(brand.replace(/[^a-zA-Z0-9-]/g, ''));
      }
    }

    if (brandSet.size === 0) {
      const h3Regex = /<h3[^>]*>([^<]+)<\/h3>/gi;
      while ((match = h3Regex.exec(contentHtml)) !== null) {
        const h3Text = match[1].trim();
        const words = h3Text.split(' ');
        const potentialBrand = words[0].match(/^\d+/) ? words[1] : words[0]; 
        if (potentialBrand && potentialBrand.length > 2 && /[A-Z]/.test(potentialBrand[0])) {
          brandSet.add(potentialBrand.replace(/[^a-zA-Z0-9-]/g, ''));
        }
      }
    }

    const brands = Array.from(brandSet).slice(0, 5);
    if (brands.length > 0) {
      brandList = brands.slice(0, -1).join(', ') + (brands.length > 1 ? ' and ' : '') + brands.slice(-1);
    }
  }
  
  let result = text
    .replace(/%year%/gi, currentYear)
    .replace(/%month_text%/gi, currentMonth)
    .replace(/%(?:currentmonth|month)%/gi, currentMonth);

  // Smartly handle product counts without stupid defaults
  if (productCount) {
    result = result.replace(/%product_count%/gi, productCount);
  } else {
    // Completely remove the variable and surrounding whitespace (e.g. "The 10 Best" -> "The Best")
    result = result.replace(/\s*%product_count%\s*/gi, ' ');
  }

  if (brandList) {
    result = result.replace(/%brand_list%/gi, brandList);
  } else {
    // Only use a very generic, harmless fallback if explicitly requested template
    result = result.replace(/%brand_list%/gi, 'top brands');
  }

  // KEYWORD EXTRACTION
  let extractedKeyword = '';
  if (title) {
    const cleanTitle = title.replace(/<[^>]*>/g, '');
    let keywordMatch = cleanTitle
      .replace(/The\s+(?:%product_count%|\d+)?\s*Best\s+/gi, '')
      .replace(/\s+of\s+(?:%year%|\d{4})/gi, '')
      .replace(/Best\s+/gi, '')
      .replace(/%(?:product_count|year|month_text)%/gi, '')
      .trim();

    if (keywordMatch.toLowerCase() !== '%keyword%') {
      extractedKeyword = keywordMatch;
    }
  }

  // FINAL KEYWORD ASSIGNMENT
  // Fallback to Category Name, properly formatted
  let finalKeyword = extractedKeyword || fallbackKeyword.replace(/-/g, ' ');
  if (!finalKeyword) {
    finalKeyword = 'Products'; 
  }
  // Title Casing
  const finalKeywordCased = finalKeyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  result = result
    .replace(/%keyword%/gi, finalKeywordCased)
    .replace(/%Keyword%/gi, finalKeywordCased);

  // NUKE ALL REMAINING DYNAMIC VARIABLES TO GUARANTEE NO LEAKS
  result = result.replace(/%[a-zA-Z0-9_]+%/g, '');

  // Cleanup potential double spaces left from nuking, and trim
  return result.replace(/\s{2,}/g, ' ').trim();
}

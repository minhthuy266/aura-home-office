import 'dotenv/config';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';

const CONFIG = {
  domain: process.env.SEO_AUDIT_DOMAIN || 'https://aurahomeoffice.com',
  sitemapUrl: process.env.SEO_AUDIT_SITEMAP || 'https://aurahomeoffice.com/sitemap.xml',
  port: Number(process.env.SEO_AUDIT_PORT || process.env.PORT || 3001),
  outputDir: process.env.SEO_AUDIT_OUTPUT_DIR || 'outputs/seo-audit',
  userAgent: 'AuraSEOAudit/1.0 (+https://aurahomeoffice.com)',
  requestTimeoutMs: 20000,
  concurrency: Number(process.env.SEO_AUDIT_CONCURRENCY || 4),
  maxUrls: Number(process.env.SEO_AUDIT_MAX_URLS || 10000),
  indexNowEndpoint: 'https://api.indexnow.org/IndexNow',
  amazonDomains: ['amazon.com', 'amzn.to', 'amazon-adsystem.com', 'amazon.co.uk', 'amazon.ca'],
  disclosurePhrases: [
    'as an amazon associate',
    'earn from qualifying purchases',
    'affiliate disclosure',
    'affiliate links',
    'we may earn',
  ],
  fakeTestingPatterns: [
    /\bwe tested\b/i,
    /\bi tested\b/i,
    /\bhands-on tested\b/i,
    /\breal-world testing\b/i,
    /\blab-tested\b/i,
    /\bafter testing\b/i,
  ],
  hardPricePatterns: [
    /\bunder\s+\$\s?\d/i,
    /\bbelow\s+\$\s?\d/i,
    /\bless than\s+\$\s?\d/i,
    /\bguaranteed\b/i,
    /\bbest seller\b/i,
    /\btop rated\b/i,
  ],
};

mkdirSync(CONFIG.outputDir, { recursive: true });

const REPORT_PATH = join(CONFIG.outputDir, 'audit-report.json');
const HISTORY_DIR = join(CONFIG.outputDir, 'history');
mkdirSync(HISTORY_DIR, { recursive: true });

let job = {
  status: 'idle',
  startedAt: null,
  finishedAt: null,
  progress: 0,
  total: 0,
  current: '',
  error: '',
};

function json(res, status, value) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(value));
}

function text(res, status, value, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  res.end(value);
}

function loadReport() {
  if (!existsSync(REPORT_PATH)) {
    return {
      generatedAt: null,
      config: CONFIG,
      sitemap: null,
      bing: null,
      summary: emptySummary(),
      results: [],
      issueTypes: [],
    };
  }
  return JSON.parse(readFileSync(REPORT_PATH, 'utf8'));
}

function saveReport(report) {
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(join(HISTORY_DIR, `${stamp}.json`), JSON.stringify(report, null, 2));
}

function emptySummary() {
  return {
    urls: 0,
    indexable: 0,
    fatalUrls: 0,
    warningUrls: 0,
    passedUrls: 0,
    totalFatal: 0,
    totalWarnings: 0,
    affiliateIssues: 0,
    schemaIssues: 0,
    linkIssues: 0,
    duplicateIssues: 0,
    avgScore: 0,
  };
}

function normalizeUrl(value, base = CONFIG.domain) {
  try {
    const u = new URL(value, base);
    u.hash = '';
    if (u.hostname.replace(/^www\./, '') !== new URL(CONFIG.domain).hostname.replace(/^www\./, '')) return null;
    if (u.pathname.endsWith('/index.html')) u.pathname = u.pathname.replace(/\/index\.html$/, '/');
    return u.toString().replace(/\/$/, '') || CONFIG.domain;
  } catch {
    return null;
  }
}

function pathOf(value) {
  try {
    return new URL(value).pathname || '/';
  } catch {
    return '/';
  }
}

function classifyUrl(url) {
  const parts = pathOf(url).split('/').filter(Boolean);
  if (parts.length === 0) return 'home';
  if (['about', 'contact', 'disclosure', 'privacy', 'terms', 'reviews', 'search'].includes(parts[0])) return 'page';
  if (parts[0] === 'author') return 'author';
  if (parts[0] === 'tag') return 'tag';
  if (parts.length === 1) return 'category';
  return 'post';
}

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs);
  try {
    return await fetch(url, {
      redirect: options.redirect || 'follow',
      method: options.method || 'GET',
      headers: { 'User-Agent': CONFIG.userAgent, ...(options.headers || {}) },
      signal: controller.signal,
      cache: 'no-store',
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchSitemapLocs(sitemapUrl) {
  const response = await fetchText(sitemapUrl);
  if (!response.ok) throw new Error(`SITEMAP_HTTP_${response.status}: ${sitemapUrl}`);
  const xml = await response.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  const locs = [];
  $('loc').each((_, el) => {
    const normalized = normalizeUrl($(el).text().trim());
    if (normalized) locs.push(normalized);
  });
  return {
    url: sitemapUrl,
    status: response.status,
    isIndex: $('sitemapindex').length > 0,
    locs,
    count: locs.length,
  };
}

async function discoverUrls() {
  const root = await fetchSitemapLocs(CONFIG.sitemapUrl);
  const sitemaps = [root];
  const urlSources = new Map();

  if (root.isIndex) {
    for (const sitemapUrl of root.locs) {
      const child = await fetchSitemapLocs(sitemapUrl);
      sitemaps.push(child);
      for (const url of child.locs) {
        if (!url.endsWith('.xml')) urlSources.set(url, child.url);
      }
    }
  } else {
    for (const url of root.locs) {
      if (!url.endsWith('.xml')) urlSources.set(url, root.url);
    }
  }

  return {
    root,
    sitemaps,
    urls: Array.from(urlSources.keys()).slice(0, CONFIG.maxUrls),
    urlSources,
  };
}

async function auditRobots() {
  const robotsUrl = new URL('/robots.txt', CONFIG.domain).toString();
  const result = { url: robotsUrl, ok: false, status: 0, sitemapLines: [], disallows: [] };
  try {
    const response = await fetchText(robotsUrl);
    result.status = response.status;
    result.ok = response.ok;
    const body = await response.text();
    result.sitemapLines = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^sitemap:/i.test(line))
      .map((line) => line.replace(/^sitemap:\s*/i, '').trim());
    result.disallows = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^disallow:/i.test(line))
      .map((line) => line.replace(/^disallow:\s*/i, '').trim())
      .filter(Boolean);
  } catch (error) {
    result.error = error.message;
  }
  return result;
}

function robotsBlocksPath(robots, url) {
  const p = pathOf(url);
  return (robots.disallows || []).some((rule) => rule !== '/' && p.startsWith(rule.replace(/\*.*$/, '')));
}

async function auditIndexNowKey() {
  const keyUrl = new URL('/indexnow-key.txt', CONFIG.domain).toString();
  const result = { url: keyUrl, configured: false, live: false, status: 0, keyLength: 0 };
  const envKey = process.env.INDEXNOW_KEY || process.env.BING_INDEXNOW_KEY || '';
  result.configured = Boolean(envKey);
  try {
    const response = await fetchText(keyUrl);
    result.status = response.status;
    const body = (await response.text()).trim();
    result.live = response.ok && body.length >= 8 && !/not configured/i.test(body);
    result.keyLength = body.length;
    result.matchesEnv = envKey ? body === envKey : null;
  } catch (error) {
    result.error = error.message;
  }
  return result;
}

function addIssue(result, severity, code, message, fix = '') {
  result.issues.push({ severity, code, message, fix });
}

function scoreFor(result) {
  const fatal = result.issues.filter((i) => i.severity === 'fatal').length;
  const warning = result.issues.filter((i) => i.severity === 'warning').length;
  const info = result.issues.filter((i) => i.severity === 'info').length;
  return Math.max(0, Math.min(100, 100 - fatal * 25 - warning * 8 - info * 2));
}

function textContent($) {
  $('script, style, noscript').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

function schemaTypesFromJson(value, types = new Set()) {
  if (!value || typeof value !== 'object') return types;
  if (Array.isArray(value)) {
    value.forEach((item) => schemaTypesFromJson(item, types));
    return types;
  }
  const type = value['@type'];
  if (Array.isArray(type)) type.forEach((item) => types.add(String(item)));
  else if (type) types.add(String(type));
  if (value['@graph']) schemaTypesFromJson(value['@graph'], types);
  Object.values(value).forEach((item) => {
    if (item && typeof item === 'object') schemaTypesFromJson(item, types);
  });
  return types;
}

function collectLinks($, pageUrl) {
  const internal = [];
  const external = [];
  $('a[href]').each((_, el) => {
    const raw = $(el).attr('href') || '';
    if (/^(mailto|tel|javascript):/i.test(raw) || raw.startsWith('#')) return;
    const normalized = normalizeUrl(raw, pageUrl);
    if (!normalized) {
      try {
        external.push({ href: new URL(raw, pageUrl).toString(), rel: ($(el).attr('rel') || '').toLowerCase(), text: $(el).text().trim() });
      } catch {}
      return;
    }
    internal.push({ href: normalized, text: $(el).text().trim() });
  });
  return { internal, external };
}

async function auditPage(url, source, robots) {
  const result = {
    url,
    source,
    type: classifyUrl(url),
    finalUrl: url,
    status: 0,
    indexable: false,
    title: '',
    titleLength: 0,
    metaDescription: '',
    metaDescriptionLength: 0,
    h1: [],
    wordCount: 0,
    canonical: '',
    robotsMeta: '',
    xRobotsTag: '',
    schemaTypes: [],
    internalLinks: [],
    externalLinks: [],
    amazonLinks: 0,
    score: 0,
    issues: [],
    scannedAt: new Date().toISOString(),
  };

  try {
    if (robotsBlocksPath(robots, url)) {
      addIssue(result, 'fatal', 'ROBOTS_BLOCKED', 'URL appears blocked by robots.txt.', 'Remove disallow rule or remove URL from sitemap.');
    }

    const response = await fetchText(url);
    result.status = response.status;
    result.finalUrl = response.url || url;
    result.xRobotsTag = response.headers.get('x-robots-tag') || '';

    if (!response.ok) {
      addIssue(result, 'fatal', 'HTTP_NOT_OK', `HTTP status is ${response.status}.`, 'Fix the URL or remove it from sitemap.');
      result.score = scoreFor(result);
      return result;
    }

    if (normalizeUrl(result.finalUrl) !== normalizeUrl(url)) {
      addIssue(result, 'warning', 'REDIRECTED', `URL redirects to ${result.finalUrl}.`, 'Use final canonical URL in internal links and sitemaps.');
    }

    const contentType = response.headers.get('content-type') || '';
    const html = await response.text();
    if (!/html/i.test(contentType) && /^\s*</.test(html) && /<urlset|<sitemapindex/i.test(html)) {
      addIssue(result, 'fatal', 'XML_AUDITED_AS_PAGE', 'XML sitemap was audited as a page.', 'Fix sitemap discovery so only page URLs are audited.');
      result.score = scoreFor(result);
      return result;
    }

    const $ = cheerio.load(html);
    const bodyText = textContent(cheerio.load(html));
    const lowerText = bodyText.toLowerCase();
    result.wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    result.title = $('title').first().text().replace(/\s+/g, ' ').trim();
    result.titleLength = result.title.length;
    result.metaDescription = $('meta[name="description"]').attr('content')?.replace(/\s+/g, ' ').trim() || '';
    result.metaDescriptionLength = result.metaDescription.length;
    result.h1 = $('h1').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get().filter(Boolean);
    result.canonical = $('link[rel="canonical"]').attr('href') || '';
    result.robotsMeta = $('meta[name="robots"]').attr('content') || '';

    if (!result.title) addIssue(result, 'fatal', 'MISSING_TITLE', 'Missing title tag.', 'Add a unique title.');
    else if (result.titleLength > 70) addIssue(result, 'warning', 'TITLE_TOO_LONG', `Title is ${result.titleLength} characters.`, 'Keep title near 40-70 characters.');
    else if (result.titleLength < 25) addIssue(result, 'warning', 'TITLE_TOO_SHORT', `Title is ${result.titleLength} characters.`, 'Use a more descriptive title.');

    if (!result.metaDescription) addIssue(result, 'warning', 'MISSING_META_DESCRIPTION', 'Missing meta description.', 'Add a unique meta description.');
    else if (result.metaDescriptionLength > 165) addIssue(result, 'warning', 'META_DESCRIPTION_TOO_LONG', `Meta description is ${result.metaDescriptionLength} characters.`, 'Keep it near 140-160 characters.');

    if (result.h1.length === 0) addIssue(result, 'fatal', 'MISSING_H1', 'Missing H1.', 'Add exactly one H1.');
    if (result.h1.length > 1) addIssue(result, 'warning', 'MULTIPLE_H1', `Found ${result.h1.length} H1 tags.`, 'Use exactly one H1.');

    if (!result.canonical) {
      addIssue(result, 'fatal', 'MISSING_CANONICAL', 'Missing canonical tag.', 'Add a self-referencing canonical URL.');
    } else {
      const canonical = normalizeUrl(result.canonical, url);
      result.canonical = canonical || result.canonical;
      if (!canonical) addIssue(result, 'fatal', 'BAD_CANONICAL', 'Canonical URL is invalid.', 'Use an absolute canonical URL.');
      else if (canonical !== normalizeUrl(result.finalUrl)) addIssue(result, 'warning', 'CANONICAL_NOT_SELF', `Canonical points to ${canonical}.`, 'Confirm this is intentional; otherwise use self canonical.');
    }

    if (/noindex/i.test(result.robotsMeta) || /noindex/i.test(result.xRobotsTag)) {
      addIssue(result, 'fatal', 'NOINDEX', 'Page has noindex directive.', 'Remove noindex if this URL should rank.');
    }

    if (['post', 'page'].includes(result.type) && result.wordCount < 500) {
      addIssue(result, 'warning', 'THIN_CONTENT', `Only ${result.wordCount} words detected.`, 'Add useful content or remove thin URL from sitemap.');
    }

    const { internal, external } = collectLinks($, url);
    result.internalLinks = internal.map((link) => link.href);
    result.externalLinks = external.map((link) => link.href);
    if (result.type === 'post' && internal.length < 3) addIssue(result, 'warning', 'LOW_INTERNAL_LINKS', `Only ${internal.length} internal links found.`, 'Add relevant links to hubs and related articles.');

    const amazonLinks = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!CONFIG.amazonDomains.some((domain) => href.includes(domain))) return;
      const rel = ($(el).attr('rel') || '').toLowerCase();
      amazonLinks.push({ href, rel });
      if (!rel.includes('nofollow') || !rel.includes('sponsored')) {
        addIssue(result, 'fatal', 'AMAZON_REL_MISSING', 'Amazon link missing rel="nofollow sponsored".', 'Add rel="nofollow sponsored noopener noreferrer".');
      }
      if (/amazon\.com/i.test(href) && !/\/dp\/B[0-9A-Z]{9}/i.test(href)) {
        addIssue(result, 'warning', 'AMAZON_BAD_FORMAT', 'Amazon link is not /dp/ASIN format.', 'Use clean /dp/ASIN links where possible.');
      }
    });
    result.amazonLinks = amazonLinks.length;

    const hasDisclosure = CONFIG.disclosurePhrases.some((phrase) => lowerText.includes(phrase));
    result.hasDisclosure = hasDisclosure;
    if ((result.type === 'post' || amazonLinks.length > 0) && !hasDisclosure) {
      addIssue(result, 'fatal', 'MISSING_AFFILIATE_DISCLOSURE', 'Affiliate disclosure was not found on a monetized/article URL.', 'Show disclosure near the top of the article.');
    }

    if (CONFIG.fakeTestingPatterns.some((pattern) => pattern.test(bodyText)) && !/hands-on tested|showroom checked/i.test(bodyText)) {
      addIssue(result, 'warning', 'UNSUPPORTED_TESTING_CLAIM', 'Testing language found without a clear evidence label.', 'Use research-based wording unless first-party testing exists.');
    }
    if (CONFIG.hardPricePatterns.some((pattern) => pattern.test(bodyText))) {
      addIssue(result, 'warning', 'RISKY_MARKETING_OR_PRICE_CLAIM', 'Hard price/marketing claim found.', 'Use softer wording and tell users to verify retailer price.');
    }

    let schemaParseErrors = 0;
    const types = new Set();
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        schemaTypesFromJson(JSON.parse($(el).text()), types);
      } catch {
        schemaParseErrors++;
      }
    });
    result.schemaTypes = Array.from(types).sort();
    if (schemaParseErrors) addIssue(result, 'warning', 'SCHEMA_PARSE_ERROR', `${schemaParseErrors} JSON-LD block(s) failed to parse.`, 'Fix invalid JSON-LD.');
    if (result.type === 'post' && !types.has('Article')) addIssue(result, 'warning', 'MISSING_ARTICLE_SCHEMA', 'Post is missing Article schema.', 'Add Article JSON-LD.');
    if (!types.has('BreadcrumbList') && ['post', 'category'].includes(result.type)) addIssue(result, 'info', 'MISSING_BREADCRUMB_SCHEMA', 'Breadcrumb schema not found.', 'Add BreadcrumbList JSON-LD.');
    if (types.has('Product') || types.has('AggregateRating') || types.has('Offer')) {
      addIssue(result, 'warning', 'PRODUCT_SCHEMA_RISK', 'Product/Offer/AggregateRating schema found.', 'Use only with defensible first-party review/offer data.');
    }

    $('img').each((_, el) => {
      if (!($(el).attr('alt') || '').trim()) result.missingAlt = (result.missingAlt || 0) + 1;
      const src = $(el).attr('src') || '';
      if (/m\.media-amazon\.com|images-na\.ssl-images-amazon/i.test(src)) result.amazonImages = (result.amazonImages || 0) + 1;
    });
    if (result.missingAlt) addIssue(result, 'warning', 'MISSING_IMAGE_ALT', `${result.missingAlt} image(s) missing alt text.`, 'Add descriptive alt text.');
    if (result.amazonImages) addIssue(result, 'fatal', 'AMAZON_IMAGE_HOTLINK', `${result.amazonImages} Amazon-hosted image(s) found.`, 'Avoid hotlinking Amazon images outside approved API usage.');

    result.indexable = result.status === 200 && !result.issues.some((issue) => ['HTTP_NOT_OK', 'NOINDEX', 'ROBOTS_BLOCKED', 'MISSING_CANONICAL', 'XML_AUDITED_AS_PAGE'].includes(issue.code));
    result.score = scoreFor(result);
    return result;
  } catch (error) {
    addIssue(result, 'fatal', 'CRAWL_ERROR', error.message, 'Check server availability, timeout, DNS, or crawler parsing.');
    result.score = scoreFor(result);
    return result;
  }
}

async function runPool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function addGlobalIssues(results) {
  const titleMap = new Map();
  const descMap = new Map();
  for (const result of results) {
    if (result.title) {
      const key = result.title.toLowerCase();
      titleMap.set(key, [...(titleMap.get(key) || []), result]);
    }
    if (result.metaDescription) {
      const key = result.metaDescription.toLowerCase();
      descMap.set(key, [...(descMap.get(key) || []), result]);
    }
  }
  for (const group of titleMap.values()) {
    if (group.length > 1) group.forEach((result) => addIssue(result, 'warning', 'DUPLICATE_TITLE', `Same title used on ${group.length} URLs.`, 'Make titles unique.'));
  }
  for (const group of descMap.values()) {
    if (group.length > 1) group.forEach((result) => addIssue(result, 'warning', 'DUPLICATE_META_DESCRIPTION', `Same meta description used on ${group.length} URLs.`, 'Make meta descriptions unique.'));
  }

  const audited = new Set(results.map((result) => normalizeUrl(result.url)));
  for (const result of results) {
    const brokenInternal = result.internalLinks.filter((link) => {
      const normalized = normalizeUrl(link);
      if (!normalized) return false;
      if (pathOf(normalized).startsWith('/api/')) return false;
      return !audited.has(normalized) && !pathOf(normalized).includes('/search');
    });
    result.offSitemapInternalLinks = Array.from(new Set(brokenInternal)).slice(0, 20);
    if (result.offSitemapInternalLinks.length > 5) {
      addIssue(result, 'info', 'INTERNAL_LINKS_NOT_IN_AUDIT_SET', `${result.offSitemapInternalLinks.length} internal link(s) point outside audited sitemap URLs.`, 'Verify these URLs are intentional/indexable.');
    }
    result.score = scoreFor(result);
    result.indexable = result.indexable && !result.issues.some((issue) => issue.severity === 'fatal');
  }
}

function summarize(results) {
  const summary = emptySummary();
  summary.urls = results.length;
  summary.indexable = results.filter((r) => r.indexable).length;
  summary.fatalUrls = results.filter((r) => r.issues.some((i) => i.severity === 'fatal')).length;
  summary.warningUrls = results.filter((r) => r.issues.some((i) => i.severity === 'warning')).length;
  summary.passedUrls = results.filter((r) => r.issues.length === 0).length;
  summary.totalFatal = results.reduce((sum, r) => sum + r.issues.filter((i) => i.severity === 'fatal').length, 0);
  summary.totalWarnings = results.reduce((sum, r) => sum + r.issues.filter((i) => i.severity === 'warning').length, 0);
  summary.affiliateIssues = results.filter((r) => r.issues.some((i) => /AMAZON|AFFILIATE|DISCLOSURE/.test(i.code))).length;
  summary.schemaIssues = results.filter((r) => r.issues.some((i) => /SCHEMA|PRODUCT_SCHEMA/.test(i.code))).length;
  summary.linkIssues = results.filter((r) => r.issues.some((i) => /LINK|CANONICAL|REDIRECT/.test(i.code))).length;
  summary.duplicateIssues = results.filter((r) => r.issues.some((i) => /DUPLICATE/.test(i.code))).length;
  summary.avgScore = results.length ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0;
  return summary;
}

function issueTypes(results) {
  return Array.from(new Set(results.flatMap((r) => r.issues.map((i) => i.code)))).sort();
}

async function runAudit() {
  job = { status: 'running', startedAt: new Date().toISOString(), finishedAt: null, progress: 0, total: 0, current: '', error: '' };
  try {
    const [discovery, robots, indexNow] = await Promise.all([discoverUrls(), auditRobots(), auditIndexNowKey()]);
    job.total = discovery.urls.length;

    const results = await runPool(discovery.urls, CONFIG.concurrency, async (url, index) => {
      job.current = url;
      const result = await auditPage(url, discovery.urlSources.get(url), robots);
      job.progress = index + 1;
      return result;
    });

    addGlobalIssues(results);

    const report = {
      generatedAt: new Date().toISOString(),
      config: {
        domain: CONFIG.domain,
        sitemapUrl: CONFIG.sitemapUrl,
        maxUrls: CONFIG.maxUrls,
        concurrency: CONFIG.concurrency,
      },
      sitemap: {
        root: discovery.root,
        sitemaps: discovery.sitemaps.map((sitemap) => ({ url: sitemap.url, count: sitemap.count, isIndex: sitemap.isIndex, status: sitemap.status })),
        discoveredUrls: discovery.urls.length,
      },
      bing: {
        robots,
        indexNow,
        ready: Boolean(robots.ok && robots.sitemapLines.length && indexNow.live),
      },
      summary: summarize(results),
      issueTypes: issueTypes(results),
      results,
    };
    saveReport(report);
    job.status = 'completed';
    job.finishedAt = new Date().toISOString();
    job.current = '';
  } catch (error) {
    job.status = 'error';
    job.error = error.stack || error.message;
    job.finishedAt = new Date().toISOString();
  }
}

async function submitIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY || process.env.BING_INDEXNOW_KEY || '';
  if (!key) return { ok: false, error: 'INDEXNOW_KEY is missing' };
  const urlList = Array.from(new Set(urls.map((url) => normalizeUrl(url)).filter(Boolean)));
  if (!urlList.length) return { ok: false, error: 'No URLs to submit' };
  const response = await fetch(CONFIG.indexNowEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': CONFIG.userAgent },
    body: JSON.stringify({
      host: new URL(CONFIG.domain).hostname,
      key,
      keyLocation: new URL('/indexnow-key.txt', CONFIG.domain).toString(),
      urlList,
    }),
  });
  const body = await response.text();
  return { ok: response.ok, status: response.status, submitted: urlList.length, body };
}

function filteredResults(report, url) {
  const filter = url.searchParams.get('filter') || 'all';
  const issue = url.searchParams.get('issue') || '';
  const q = (url.searchParams.get('q') || '').toLowerCase();
  let results = report.results || [];
  if (filter === 'fatal') results = results.filter((r) => r.issues.some((i) => i.severity === 'fatal'));
  if (filter === 'warning') results = results.filter((r) => r.issues.some((i) => i.severity === 'warning'));
  if (filter === 'passed') results = results.filter((r) => r.issues.length === 0);
  if (filter === 'indexable') results = results.filter((r) => r.indexable);
  if (filter === 'affiliate') results = results.filter((r) => r.issues.some((i) => /AMAZON|AFFILIATE|DISCLOSURE/.test(i.code)));
  if (filter === 'schema') results = results.filter((r) => r.issues.some((i) => /SCHEMA/.test(i.code)));
  if (filter === 'links') results = results.filter((r) => r.issues.some((i) => /LINK|CANONICAL|REDIRECT/.test(i.code)));
  if (issue) results = results.filter((r) => r.issues.some((i) => i.code === issue));
  if (q) results = results.filter((r) => r.url.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.issues.some((i) => i.code.toLowerCase().includes(q)));
  return results.sort((a, b) => {
    const af = a.issues.filter((i) => i.severity === 'fatal').length;
    const bf = b.issues.filter((i) => i.severity === 'fatal').length;
    if (bf !== af) return bf - af;
    return a.score - b.score;
  });
}

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function toCsv(results) {
  const headers = ['url', 'type', 'status', 'indexable', 'score', 'title', 'metaDescriptionLength', 'h1Count', 'wordCount', 'amazonLinks', 'issueCount', 'fatalCount', 'warningCount', 'issues'];
  const rows = results.map((r) => [
    r.url,
    r.type,
    r.status,
    r.indexable,
    r.score,
    r.title,
    r.metaDescriptionLength,
    r.h1.length,
    r.wordCount,
    r.amazonLinks,
    r.issues.length,
    r.issues.filter((i) => i.severity === 'fatal').length,
    r.issues.filter((i) => i.severity === 'warning').length,
    r.issues.map((i) => `${i.severity}:${i.code}`).join('|'),
  ]);
  return [headers.join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');
}

function dashboardHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aura SEO Ops</title>
  <style>
    :root{--bg:#f5f6f8;--card:#fff;--ink:#172033;--muted:#65738a;--line:#dfe5ee;--accent:#4f46e5;--good:#059669;--warn:#d97706;--bad:#dc2626}
    *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .wrap{max-width:1500px;margin:0 auto;padding:28px}.top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}.title h1{margin:0;font-size:28px}.title p{margin:6px 0 0;color:var(--muted)}
    .btn{border:0;border-radius:8px;padding:11px 16px;font-weight:700;cursor:pointer;background:var(--accent);color:#fff}.btn.secondary{background:#111827}.btn.ghost{background:#eef2ff;color:var(--accent)}.btn:disabled{opacity:.55;cursor:not-allowed}
    .grid{display:grid;grid-template-columns:repeat(8,1fr);gap:14px;margin-bottom:18px}.stat{background:var(--card);border:1px solid var(--line);border-top:4px solid var(--accent);border-radius:10px;padding:18px}.stat b{font-size:30px;display:block}.stat span{color:var(--muted);font-size:13px}
    .panel{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px;margin-bottom:18px}.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.progress{height:9px;background:#e6ebf2;border-radius:99px;overflow:hidden;margin-top:12px}.bar{height:100%;background:linear-gradient(90deg,var(--accent),#10b981);width:0%}
    input,select{border:1px solid var(--line);border-radius:8px;padding:10px 12px;font:inherit;background:white}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.tab{padding:9px 12px;border:1px solid var(--line);border-radius:8px;background:#fff;cursor:pointer}.tab.active{background:var(--accent);border-color:var(--accent);color:white}
    table{width:100%;border-collapse:collapse;font-size:13px}th,td{border-bottom:1px solid #edf1f6;padding:11px;text-align:left;vertical-align:top}th{background:#f8fafc;color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em}.url{max-width:360px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--accent);font-weight:700}
    .pill{display:inline-block;padding:3px 8px;border-radius:999px;font-size:12px;font-weight:800}.fatal{background:#fee2e2;color:var(--bad)}.warning{background:#fef3c7;color:var(--warn)}.info{background:#e0f2fe;color:#0369a1}.ok{background:#dcfce7;color:var(--good)}.score{font-weight:900;font-size:18px}.details{display:none;background:#fbfdff}.details.open{display:table-row}.issues{display:flex;gap:6px;flex-wrap:wrap}.muted{color:var(--muted)} pre{white-space:pre-wrap;background:#0f172a;color:#dbeafe;padding:14px;border-radius:8px;overflow:auto}
    @media(max-width:1100px){.grid{grid-template-columns:repeat(2,1fr)}.wrap{padding:14px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="title"><h1>Aura SEO Ops</h1><p>Indexability, Bing, affiliate, schema, links, and content QA for aurahomeoffice.com</p></div>
      <div class="row"><button class="btn" id="start">Start Full Audit</button><button class="btn ghost" id="refresh">Refresh</button><button class="btn secondary" id="csv">Export CSV</button><button class="btn secondary" id="json">Export JSON</button></div>
    </div>
    <div class="grid" id="stats"></div>
    <div class="panel">
      <div class="row"><b>Status:</b><span id="status">idle</span><span id="progressText" class="muted"></span></div>
      <div class="progress"><div class="bar" id="bar"></div></div>
      <div id="bing" style="margin-top:12px"></div>
    </div>
    <div class="panel">
      <div class="row">
        <input id="q" placeholder="Search URL, title, issue..." style="min-width:340px;flex:1" />
        <select id="issue"><option value="">All issue types</option></select>
      </div>
      <div class="tabs" id="tabs"></div>
      <div style="overflow:auto"><table><thead><tr><th>URL</th><th>Status</th><th>Type</th><th>Score</th><th>Index</th><th>Title</th><th>Words</th><th>Issues</th></tr></thead><tbody id="rows"></tbody></table></div>
    </div>
  </div>
  <script>
    let filter='all', report=null;
    const filters=[['all','All'],['fatal','Fatal'],['warning','Warnings'],['indexable','Indexable'],['affiliate','Affiliate'],['schema','Schema'],['links','Links'],['passed','Passed']];
    function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
    function pill(text, cls){return '<span class="pill '+cls+'">'+esc(text)+'</span>'}
    async function api(path, opts){const r=await fetch(path,opts); if(!r.ok) throw new Error(await r.text()); return r.json()}
    async function load(){
      report=await api('/api/report');
      renderStats(); renderBing(); renderIssues(); renderTabs(); renderRows();
    }
    async function poll(){
      const j=await api('/api/status'); document.getElementById('status').textContent=j.status;
      document.getElementById('progressText').textContent=(j.total?j.progress+'/'+j.total:'')+' '+(j.current||'');
      document.getElementById('bar').style.width=j.total?Math.round(j.progress/j.total*100)+'%':'0%';
      document.getElementById('start').disabled=j.status==='running';
      if(j.status==='running') setTimeout(poll,1500); else load();
    }
    function renderStats(){
      const s=report.summary||{}; const items=[['URLs',s.urls],['Indexable',s.indexable],['Fatal URLs',s.fatalUrls],['Warning URLs',s.warningUrls],['Passed',s.passedUrls],['Fatal Issues',s.totalFatal],['Affiliate',s.affiliateIssues],['Avg Score',(s.avgScore||0)+'%']];
      document.getElementById('stats').innerHTML=items.map(([k,v])=>'<div class="stat"><b>'+esc(v??0)+'</b><span>'+esc(k)+'</span></div>').join('');
    }
    function renderBing(){
      const b=report.bing||{}; const sm=(report.sitemap?.sitemaps||[]).map(s=>esc(s.url.split('/').pop())+': '+s.count).join(' · ');
      document.getElementById('bing').innerHTML='<div class="row">'+pill(b.ready?'Bing Ready':'Bing Check',''+(b.ready?'ok':'warning'))+pill('Robots '+(b.robots?.ok?'OK':'Issue'),b.robots?.ok?'ok':'fatal')+pill('IndexNow '+(b.indexNow?.live?'OK':'Missing'),b.indexNow?.live?'ok':'warning')+'<span class="muted">'+sm+'</span></div>';
    }
    function renderIssues(){
      const sel=document.getElementById('issue'); const old=sel.value;
      sel.innerHTML='<option value="">All issue types</option>'+((report.issueTypes||[]).map(i=>'<option value="'+esc(i)+'">'+esc(i)+'</option>').join(''));
      sel.value=old;
    }
    function renderTabs(){document.getElementById('tabs').innerHTML=filters.map(([k,l])=>'<button class="tab '+(k===filter?'active':'')+'" data-f="'+k+'">'+l+'</button>').join('')}
    async function renderRows(){
      const q=encodeURIComponent(document.getElementById('q').value); const issue=encodeURIComponent(document.getElementById('issue').value);
      const data=await api('/api/results?filter='+filter+'&issue='+issue+'&q='+q+'&limit=500');
      document.getElementById('rows').innerHTML=data.results.map((r,i)=>{
        const fatal=r.issues.filter(x=>x.severity==='fatal').length, warn=r.issues.filter(x=>x.severity==='warning').length;
        return '<tr onclick="toggle('+i+')"><td><a class="url" href="'+esc(r.url)+'" target="_blank" onclick="event.stopPropagation()">'+esc(r.url)+'</a><div class="muted">'+esc(r.source||'')+'</div></td><td>'+esc(r.status)+'</td><td>'+esc(r.type)+'</td><td class="score">'+esc(r.score)+'%</td><td>'+(r.indexable?pill('yes','ok'):pill('no','fatal'))+'</td><td>'+esc(r.title||'-')+'</td><td>'+esc(r.wordCount||0)+'</td><td><div class="issues">'+(fatal?pill(fatal+' fatal','fatal'):'')+(warn?pill(warn+' warn','warning'):'')+(!r.issues.length?pill('pass','ok'):'')+'</div></td></tr><tr class="details" id="d'+i+'"><td colspan="8"><b>Issues</b><div style="margin:10px 0">'+(r.issues.map(x=>'<div>'+pill(x.severity,x.severity)+' <b>'+esc(x.code)+'</b>: '+esc(x.message)+' <span class="muted">'+esc(x.fix||'')+'</span></div>').join('')||'No issues')+'</div><pre>'+esc(JSON.stringify({canonical:r.canonical,robotsMeta:r.robotsMeta,xRobotsTag:r.xRobotsTag,h1:r.h1,schemaTypes:r.schemaTypes,internalLinks:r.internalLinks?.length,externalLinks:r.externalLinks?.length,offSitemapInternalLinks:r.offSitemapInternalLinks},null,2))+'</pre></td></tr>';
      }).join('');
    }
    function toggle(i){document.getElementById('d'+i)?.classList.toggle('open')}
    document.getElementById('start').onclick=async()=>{await api('/api/start',{method:'POST'}); poll()};
    document.getElementById('refresh').onclick=load; document.getElementById('csv').onclick=()=>location.href='/api/export.csv'; document.getElementById('json').onclick=()=>location.href='/api/export.json';
    document.getElementById('q').oninput=()=>renderRows(); document.getElementById('issue').onchange=()=>renderRows();
    document.getElementById('tabs').onclick=e=>{if(e.target.dataset.f){filter=e.target.dataset.f;renderTabs();renderRows()}};
    load(); poll();
  </script>
</body>
</html>`;
}

createServer(async (req, res) => {
  try {
    const requestUrl = req.url === '//' ? '/' : req.url;
    const url = new URL(requestUrl, `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/') return text(res, 200, dashboardHtml(), 'text/html; charset=utf-8');
    if (url.pathname === '/api/status') return json(res, 200, job);
    if (url.pathname === '/api/report') return json(res, 200, loadReport());
    if (url.pathname === '/api/start' && req.method === 'POST') {
      if (job.status === 'running') return json(res, 409, { ok: false, error: 'Audit already running' });
      runAudit();
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/results') {
      const report = loadReport();
      const all = filteredResults(report, url);
      const limit = Number(url.searchParams.get('limit') || 100);
      const page = Number(url.searchParams.get('page') || 1);
      const results = all.slice((page - 1) * limit, page * limit);
      return json(res, 200, { total: all.length, page, totalPages: Math.ceil(all.length / limit), results });
    }
    if (url.pathname === '/api/export.csv') {
      return text(res, 200, toCsv(loadReport().results || []), 'text/csv; charset=utf-8');
    }
    if (url.pathname === '/api/export.json') {
      return json(res, 200, loadReport());
    }
    if (url.pathname === '/api/indexnow/submit' && req.method === 'POST') {
      const report = loadReport();
      const mode = url.searchParams.get('mode') || 'indexable';
      let urls = (report.results || []).map((r) => r.url);
      if (mode === 'indexable') urls = (report.results || []).filter((r) => r.indexable).map((r) => r.url);
      if (mode === 'fatal') urls = (report.results || []).filter((r) => r.issues.some((i) => i.severity === 'fatal')).map((r) => r.url);
      return json(res, 200, await submitIndexNow(urls));
    }

    return text(res, 404, 'Not found');
  } catch (error) {
    return json(res, 500, { ok: false, error: error.stack || error.message });
  }
}).listen(CONFIG.port, '0.0.0.0', () => {
  console.log(`Aura SEO Ops dashboard running at http://0.0.0.0:${CONFIG.port}`);
  console.log(`Auditing ${CONFIG.domain}`);
});

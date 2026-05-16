import { getPostBySlug, getLatestPosts, getSitemapPosts } from '../../../src/services/wpService';
import { processPostContent } from '../../../src/utils/processContent';
import { formatSEOText } from '../../../src/utils/seoFormatter';
import { notFound } from 'next/navigation';
import PostArticle from '../../../src/components/PostArticle';
import { Metadata } from 'next';
import { getAuthorForPost } from '../../../src/config/authors';

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const revalidate = 60; // Cập nhật sau mỗi 1 phút

function stripTitle(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const currentYear = new Date().getUTCFullYear();

function toSchemaDate(value?: string): string {
  const date = new Date(value || '');
  if (Number.isNaN(date.getTime())) return value || '';

  return date.toISOString();
}

function normalizeMetadataTitle(title: string): string {
  let normalized = stripTitle(title)
    .replace(/\s*\|\s*Aura(?:\s+Home\s+Office)?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const numberedBestMatch = normalized.match(/^The\s+(\d+)\s+Best\s+(.+?)\s+of\s+20\d{2}$/i);
  if (numberedBestMatch) {
    normalized = `${numberedBestMatch[1]} Best ${numberedBestMatch[2]} in ${currentYear}`;
  }

  if (normalized.length > 62 && /^(\d+\s+)?best\b/i.test(normalized) && normalized.includes(':')) {
    normalized = normalized.split(':')[0].trim();
  }

  if (!/\b20\d{2}\b/.test(normalized) && /^(\d+\s+)?best\b/i.test(normalized)) {
    const withYear = `${normalized} (${currentYear})`;
    if (withYear.length <= 62) normalized = withYear;
  }

  if (normalized.length > 70) {
    normalized = normalized
      .replace(/\s+[-–—|:]\s+.*$/, '')
      .replace(/\s+That\s+.*$/i, '')
      .trim();
  }

  return normalized;
}

function normalizeMetadataDescription(title: string, excerpt: string): string {
  let normalized = excerpt.replace(/\s+/g, ' ').trim();
  const normalizedTitle = normalizeMetadataTitle(title);
  const bestTopicMatch = normalizedTitle.match(/^(?:\d+\s+)?Best\s+(.+?)(?:\s+\(?20\d{2}\)?|\s+in\s+20\d{2})?$/i);

  normalized = normalized
    .replace(/^Compare\s+best\b/i, 'Compare the best')
    .replace(/\bin\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})\b/gi, 'in $2')
    .replace(/\bof\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})\b/gi, 'of $2');

  if (bestTopicMatch) {
    const topic = bestTopicMatch[1].trim();
    const singularTopic = topic.replace(/s\b/i, '');
    if (singularTopic !== topic) {
      normalized = normalized.replace(
        new RegExp(`\\bbest\\s+${singularTopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
        `best ${topic.toLowerCase()}`,
      );
    }
  }

  return normalized;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found' };

  const cleanTitle = formatSEOText(post.title.rendered, post.title.rendered, category, post.content.rendered);
  const cleanExcerpt = formatSEOText(post.excerpt?.rendered || '', post.title.rendered, category, post.content.rendered);
  const metadataTitle = normalizeMetadataTitle(cleanTitle);
  const metadataDescription = normalizeMetadataDescription(cleanTitle, cleanExcerpt);
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const author = getAuthorForPost(post.id, post.author);

  const postUrl = `https://aurahomeoffice.com/${category}/${slug}`;

  return {
    title: metadataTitle,
    description: metadataDescription,
    authors: [{ name: author.name, url: `https://aurahomeoffice.com/author/${author.id}` }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      url: postUrl,
      images: [featuredImage],
      type: 'article',
      publishedTime: toSchemaDate(post.date),
      modifiedTime: toSchemaDate(post.modified || post.date),
      authors: [author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataTitle,
      description: metadataDescription,
      images: [featuredImage],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getSitemapPosts();
  return posts.map((post) => ({
    category: post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized',
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const latestPosts = await getLatestPosts(6);

  // Article and Breadcrumb JSON-LD are rendered by PostArticle.tsx to keep one source of truth.

  // JSON-LD: FAQPage — extract Q&A from WP content
  const faqEntries: { question: string; answer: string }[] = [];
  const content = post.content.rendered;
  const faqSectionMatch = content.match(/FAQs?<\/h2>([\s\S]*?)(?:<h2|$)/i);
  if (faqSectionMatch) {
    const faqHtml = faqSectionMatch[1];
    const qaRegex = /<(?:strong|h3|h4)[^>]*>\s*(.*?)\s*<\/(?:strong|h3|h4)>\s*(?:<\/p>)?\s*<p[^>]*>\s*([\s\S]*?)\s*<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = qaRegex.exec(faqHtml)) !== null) {
      const q = m[1].replace(/<[^>]*>/g, '').trim();
      const a = m[2].replace(/<[^>]*>/g, '').trim();
      if (q.length > 10 && a.length > 10) {
        faqEntries.push({ question: q, answer: a });
      }
    }
  }

  const faqJsonLd = faqEntries.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      }
    }))
  } : null;

  const { html: processedHtml, toc, products } = processPostContent(post.content.rendered, post.title.rendered, {
    fallbackUpdatedAt: post.modified || post.date,
  });

  return (
    <>
      {/* FAQ schema — Article & Breadcrumb schema is handled by PostArticle.tsx */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <PostArticle 
        post={post} 
        latestPosts={latestPosts} 
        processedHtml={processedHtml}
        toc={toc}
        products={products}
      />
    </>
  );
}

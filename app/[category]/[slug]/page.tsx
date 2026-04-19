import { getPostBySlug, getLatestPosts, getAllPosts } from '../../../src/services/wpService';
import { processPostContent } from '../../../src/utils/processContent';
import { notFound } from 'next/navigation';
import PostArticle from '../../../src/components/PostArticle';
import { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found' };

  const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
  const cleanExcerpt = post.excerpt?.rendered.replace(/<[^>]*>/g, '').substring(0, 160);
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

  const postUrl = `https://aurahomeoffice.com/${category}/${slug}`;

  return {
    title: cleanTitle,
    description: cleanExcerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: cleanExcerpt,
      url: postUrl,
      images: [featuredImage],
      type: 'article',
      publishedTime: post.date,
      authors: [post._embedded?.author?.[0]?.name || 'Aura Editorial Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanExcerpt,
      images: [featuredImage],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
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
  const baseUrl = 'https://aurahomeoffice.com';
  const postUrl = `${baseUrl}/${category}/${slug}`;
  const publishDate = new Date(post.date).toISOString();
  const modifiedDate = new Date(post.modified).toISOString();
  const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

  // JSON-LD: Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cleanTitle,
    image: featuredImage,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: post._embedded?.author?.[0]?.name || 'Aura Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aura Home Office',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    description: post.excerpt?.rendered.replace(/<[^>]*>/g, '').substring(0, 160)
  };

  // JSON-LD: BreadcrumbList
  const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || category;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `${baseUrl}/${category}` },
      { '@type': 'ListItem', position: 3, name: cleanTitle, item: postUrl }
    ]
  };

  // JSON-LD: FAQPage — extract Q&A from WP content
  const faqEntries: { question: string; answer: string }[] = [];
  const content = post.content.rendered;
  // Match FAQ items: <strong>Q: ...</strong> or <h3>Q: ...</h3> followed by answer text
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

  const { html: processedHtml, toc } = processPostContent(
    post.content.rendered,
    post.title.rendered,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
      />
    </>
  );
}

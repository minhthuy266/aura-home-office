import { getPostBySlug, getLatestPosts } from '../../../src/services/wpService';
import { notFound } from 'next/navigation';
import PostArticle from '../../../src/components/PostArticle';
import { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found' };

  const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
  const cleanExcerpt = post.excerpt?.rendered.replace(/<[^>]*>/g, '').substring(0, 160);
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

  return {
    title: cleanTitle,
    description: cleanExcerpt,
    openGraph: {
      title: cleanTitle,
      description: cleanExcerpt,
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
  const posts = await getLatestPosts(100); // Pre-render top 100 most recent posts
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
  const postUrl = `${baseUrl}/category/${category}/${slug}`;
  const publishDate = new Date(post.date).toISOString();
  const modifiedDate = new Date(post.modified).toISOString();

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.rendered.replace(/<[^>]*>/g, ''),
    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
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
    description: post.excerpt?.rendered.replace(/<[^>]*>/g, '').substring(0, 160)
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: category, item: `${baseUrl}/category/${category}` },
      { '@type': 'ListItem', position: 3, name: post.title.rendered.replace(/<[^>]*>/g, ''), item: postUrl }
    ]
  };

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
      <PostArticle post={post} latestPosts={latestPosts} />
    </>
  );
}

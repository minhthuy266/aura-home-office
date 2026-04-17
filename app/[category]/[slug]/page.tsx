import React from 'react';
import { getPostBySlug, getLatestPosts } from '../../../src/services/wpService';
import { notFound } from 'next/navigation';
import PostClient from '../../../src/components/PostClient';

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getLatestPosts(20); // Pre-render 20 most recent posts
  return posts.map((post) => ({
    category: post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized',
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const latestPosts = await getLatestPosts(6);

  return (
    <PostClient post={post} latestPosts={latestPosts} />
  );
}

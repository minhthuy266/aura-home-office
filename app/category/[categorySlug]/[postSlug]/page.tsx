import React from 'react';
import { getPostBySlug, getLatestPosts } from '../../../../src/services/wpService';
import { notFound } from 'next/navigation';
import PostClient from '../../../../src/components/PostClient';

interface PostPageProps {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { postSlug } = await params;
  const post = await getPostBySlug(postSlug);

  if (!post) {
    notFound();
  }

  const latestPosts = await getLatestPosts(6);

  return (
    <PostClient post={post} latestPosts={latestPosts} />
  );
}

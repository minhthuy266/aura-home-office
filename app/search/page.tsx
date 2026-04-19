import React from 'react';
import { searchPosts } from '../../src/services/wpService';
import PostCard from '../../src/components/PostCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search for articles, guides, and professional reviews on Aura Home Office.',
};

interface SearchPageProps {
  searchParams: Promise<{ q: string }>;
}

/**
 * Search Page — DESIGN.md compliant
 * Kickers in JetBrains Mono, story grid with hairline rules
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  
  const searchResult = query ? await searchPosts(query) : { posts: [] };
  const posts = searchResult.posts || [];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: 'var(--page-pt, 160px)', paddingBottom: '80px' }} className="[--page-pt:120px] md:[--page-pt:160px]">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)' }}>

        {/* Header */}
        <header style={{ marginBottom: 'var(--space-16)', borderBottom: '2px solid var(--color-rule-section)', paddingBottom: 'var(--space-8)' }}>
          {/* Kicker — JetBrains Mono, uppercase */}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 400,
            textTransform: 'uppercase' as const,
            letterSpacing: 'var(--tracking-mono)',
            color: 'var(--color-accent)',
            display: 'block',
            marginBottom: 'var(--space-2)',
          }}>
            Search Results
          </span>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, var(--text-3xl))',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-display)',
            marginBottom: 'var(--space-3)',
          }}>
            {query ? `"${query}"` : 'Search Archive'}
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '560px',
          }}>
            {posts.length > 0
              ? `Found ${posts.length} ${posts.length === 1 ? 'result' : 'results'} in our archive.`
              : query
                ? `No results for "${query}". Try broader terms like "chairs", "desks", or "monitors".`
                : 'Enter a keyword to search our archive of expert gear reviews.'
            }
          </p>
        </header>

        {/* Results — Story Grid with hairline rules */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 0, borderTop: '1px solid var(--color-rule-hard)', borderLeft: '1px solid var(--color-rule-hard)', borderRight: '1px solid var(--color-rule-hard)' }}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: 'var(--space-20) 0',
            textAlign: 'center',
            borderTop: '1px solid var(--color-rule-hard)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 400,
              textTransform: 'uppercase' as const,
              letterSpacing: 'var(--tracking-mono)',
              color: 'var(--color-text-muted)',
            }}>
              {query ? 'No results found' : 'Start your search above'}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}

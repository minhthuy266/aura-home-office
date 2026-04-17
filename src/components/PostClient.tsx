'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  List,
  ChevronDown,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  Award,
  CheckCircle,
  Twitter,
  Mail,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import type { WPPost } from '../types';

interface TOCItem { id: string; text: string; level: number; }

interface PostClientProps {
  post: WPPost;
  latestPosts: WPPost[];
}

export default function PostClient({ post, latestPosts }: PostClientProps) {
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string>('');
  const tocLinksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const rating = post.acf?.rating;
  const relatedPosts = latestPosts.filter(p => p.id !== post.id).slice(0, 3);
  const defaultPostImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1400";

  // TOC Generation and HTML Processing
  useEffect(() => {
    if (!post?.content.rendered) return;

    const currentYear = new Date().getFullYear().toString();
    const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
    const keyword = cleanTitle
      .replace(/The \d+ Best /gi, '')
      .replace(/ of \d{4}/gi, '')
      .replace(/Best /gi, '')
      .trim();

    const replacePlaceholders = (text: string, pCount: number, bList: string) => {
      return text
        .replace(/%keyword%/gi, keyword)
        .replace(/%Keyword%/gi, keyword)
        .replace(/%product_count%/gi, pCount.toString())
        .replace(/%brand_list%/gi, bList)
        .replace(/%year%/gi, currentYear);
    };

    const parser = new DOMParser();
    const tempDoc = parser.parseFromString(post.content.rendered, 'text/html');
    
    // Calculate product count and brand list
    const productItems = tempDoc.querySelectorAll('.acms-product-card, .acms-product-item, .wp-block-product-card');
    const productCount = productItems.length || 10; // Fallback to 10 if none found but it's a roundup
    
    const brandSet = new Set<string>();
    productItems.forEach(item => {
      const title = item.querySelector('.acms-product-title, .product-title, h3, h4')?.textContent;
      if (title) {
        const firstWord = title.trim().split(' ')[0];
        if (firstWord && firstWord.length > 2) brandSet.add(firstWord);
      }
    });
    
    const brands = Array.from(brandSet).slice(0, 5);
    const brandList = brands.length > 0 
      ? brands.slice(0, -1).join(', ') + (brands.length > 1 ? ' and ' : '') + brands.slice(-1)
      : 'top-tier manufacturers';

    const contentWithPlaceholders = replacePlaceholders(post.content.rendered, productCount, brandList);
    const doc = parser.parseFromString(contentWithPlaceholders, 'text/html');

    const headings = doc.querySelectorAll('h2, h3');
    const tocData: TOCItem[] = [];
    headings.forEach((heading, index) => {
      const text = heading.textContent || '';
      const slug = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const id = `${slug || 'section'}-${index}`;
      heading.id = id;
      tocData.push({ id, text, level: parseInt(heading.tagName.substring(1)) });
    });

    setProcessedHtml(doc.body.innerHTML || '');
    setToc(tocData);
  }, [post?.content.rendered, post?.title.rendered]);

  // Scroll Sync — Direct DOM manipulation, NO state updates, NO re-renders
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        // Update progress bar directly via ref
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        if (progressRef.current) {
          progressRef.current.style.width = `${progress}%`;
        }

        // Update TOC active link directly via DOM
        if (toc.length > 0) {
          const headerOffset = 250;
          let currentId = '';

          for (const item of toc) {
            const element = document.getElementById(item.id);
            if (element) {
              const top = element.getBoundingClientRect().top;
              if (top <= headerOffset) {
                currentId = item.id;
              } else {
                break;
              }
            }
          }

          if (currentId !== activeIdRef.current) {
            // Remove active from previous
            const prevLink = tocLinksRef.current.get(activeIdRef.current);
            if (prevLink) {
              prevLink.className = prevLink.className
                .replace('text-[var(--text-primary)]', '')
                .replace('border-[var(--accent-gold)]', 'border-transparent')
                .replace('font-bold', '')
                + ' border-transparent text-gray-400';
            }
            // Add active to current
            const newLink = tocLinksRef.current.get(currentId);
            if (newLink) {
              newLink.className = newLink.className
                .replace('border-transparent', 'border-[var(--accent-gold)]')
                .replace('text-gray-400', 'text-[var(--text-primary)]')
                + ' font-bold';
            }
            activeIdRef.current = currentId;
          }
        }

        timeoutId = undefined as any;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [toc]);

  const scrollToHeading = (id: string, isMobile: boolean = false) => {
    if (isMobile) {
      setIsMobileTocOpen(false);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -100;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 10);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -120;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Progress Bar — controlled via ref, not state */}
        <div
          ref={progressRef}
          className="fixed top-0 left-0 h-1 bg-[var(--accent-gold)] z-[100] transition-all duration-300 pointer-events-none"
          style={{ width: '0%' }}
        />

        {/* ── Post Hero Header ── */}
        <header className="container mx-auto px-4 md:px-8 max-w-5xl mt-28 md:mt-36 mb-12 text-center">
          {/* Category Badges — Refined for Editorial */}
          {categories.length > 0 && (
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {categories.map((cat: { id: number; name: string; slug: string }) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--accent-gold)] hover:text-[var(--accent-gold-dark)] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--accent-gold)] hover:after:w-full after:transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
 
          {/* Title — Using refined Heading Hero */}
          <h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] leading-[1.1] mb-8 tracking-[-0.03em]"
            dangerouslySetInnerHTML={{ 
              __html: post.title.rendered
                .replace(/%keyword%/gi, post.title.rendered.replace(/<[^>]*>/g, '').replace(/The \d+ Best | of \d{4}/gi, '').trim())
                .replace(/%year%/gi, new Date().getFullYear().toString()) 
            }}
          />
 
          {/* Excerpt — Better spacing and font weight */}
          {post.excerpt?.rendered && (
            <div
              className="text-lg md:text-2xl text-gray-400 font-serif italic max-w-3xl mx-auto mb-10 leading-relaxed [&>p]:m-0"
              dangerouslySetInnerHTML={{ 
                __html: post.excerpt.rendered
                  .replace(/%keyword%/gi, post.title.rendered.replace(/<[^>]*>/g, '').replace(/The \d+ Best | of \d{4}/gi, '').trim())
                  .replace(/%year%/gi, new Date().getFullYear().toString())
              }}
            />
          )}
 
          {/* Author & Date — Elegant Metadata Block */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pt-4 border-t border-[var(--border-light)] max-w-xs mx-auto">
            {author && (
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">By</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer">
                  {author.name}
                </span>
              </div>
            )}
            <time dateTime={post.date} className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-bold">
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
          </div>
        </header>

        {/* ── Featured Image ── */}
        <div className="container mx-auto px-4 md:px-8 max-w-5xl mb-12">
          <div className="relative aspect-[21/9] overflow-hidden rounded-sm shadow-lg border border-[var(--border-light)] bg-gray-100">
            <img
              src={featuredMedia?.source_url || defaultPostImage}
              alt={featuredMedia?.alt_text || (post.title.rendered ? post.title.rendered.replace(/<[^>]*>/g, '') : 'Post image')}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start">
            
            {/* Left Sidebar — TOC */}
            <aside className="hidden lg:block lg:col-span-2 sticky top-32 order-1">
              <div className="max-h-[calc(100vh-10rem)] overflow-y-auto w-full pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 block">Contents</span>
                <nav className="border-l border-[var(--border-light)]">
                  <ul className="space-y-0">
                    {toc.map((item) => (
                      <li key={item.id} className="relative">
                        <a 
                          href={`#${item.id}`}
                          ref={(el) => { if (el) tocLinksRef.current.set(item.id, el); }}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToHeading(item.id);
                          }}
                          className={`block py-2 leading-relaxed transition-all duration-300 border-l-2 -ml-[1px] border-transparent text-gray-400 hover:text-[var(--text-primary)] hover:border-gray-300 ${item.level === 3 ? 'pl-8 text-[11px]' : 'pl-4 text-xs'}`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main Article Content Card */}
            <main className="col-span-1 lg:col-span-8 order-2 min-w-0 bg-white p-5 md:p-14 border border-[var(--border-light)] shadow-md rounded-sm">
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 flex gap-3 text-sm text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Affiliate Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. This post may contain affiliate links. Read our full <Link href="/disclosure" className="text-[var(--accent-gold)] hover:underline">disclosure policy</Link>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-stone-50 border border-[var(--border-light)] mb-10 rounded-sm">
                <ShieldCheck className="text-[var(--accent-gold)] shrink-0" size={24} />
                <div className="text-[11px] leading-relaxed text-gray-500">
                  <strong className="text-[var(--text-primary)] uppercase tracking-[0.3em] block mb-1">Tested & Verified</strong>
                  Our editors independently research and test products. When you buy through our links, we may earn a commission. <Link href="/about" className="underline hover:text-[var(--accent-gold)] transition-colors">Learn more about our review process.</Link>
                </div>
              </div>

              <article className="gh-content max-w-none prose-premium">
                <div 
                  className="editorial-body" 
                  dangerouslySetInnerHTML={{ __html: processedHtml }} 
                />
              </article>

              {/* Share Footer */}
              <div className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Share</span>
                  <div className="flex gap-2">
                    {[Twitter, Mail, Share2].map((Icon, i) => (
                      <button key={i} className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Right Sidebar — Trending */}
            <aside className="hidden lg:block lg:col-span-2 sticky top-32 order-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 block">Trending</span>
              <div className="max-h-[calc(100vh-10rem)] overflow-y-auto w-full pb-4 space-y-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {relatedPosts.map((rp, i) => (
                  <Link
                    key={rp.id}
                    href={`/category/${rp._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${rp.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden mb-3 rounded-sm shadow-sm border border-[var(--border-light)]">
                      <img
                        src={rp._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultPostImage}
                        alt={rp.title.rendered}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 bg-white/95 px-2 py-1">
                        <span className="text-[9px] font-bold tracking-widest">0{i + 1}</span>
                      </div>
                    </div>
                    <h4
                      className="font-serif text-sm text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-gold)] transition-colors font-bold"
                      dangerouslySetInnerHTML={{ __html: rp.title.rendered }}
                    />
                  </Link>
                ))}

                {/* Newsletter Card */}
                <div className="p-6 bg-stone-50 border border-gray-100 rounded-sm space-y-4">
                  <h5 className="font-serif font-bold text-sm text-[var(--text-primary)]">The Aura Edit.</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-serif italic">Weekly reports on the finest home office artifacts.</p>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Email..."
                      className="w-full bg-white border border-gray-200 rounded-sm px-3 py-2 text-[10px] focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors"
                    />
                    <button className="w-full py-2.5 rounded-sm bg-black text-white text-[9px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Footer Navigation */}
          <div className="mt-20 pt-16 border-t border-[var(--border-light)]">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent-gold)] mb-8 block">Up Next</span>
            {relatedPosts[0] && (
              <Link
                href={`/category/${relatedPosts[0]._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized'}/${relatedPosts[0].slug}`}
                className="group flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="relative w-full md:w-1/3 aspect-[4/3] overflow-hidden rounded-sm bg-stone-100">
                  <img
                    src={relatedPosts[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultPostImage}
                    alt={relatedPosts[0].title.rendered}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <h4
                    className="font-serif text-3xl md:text-5xl text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors leading-tight"
                    dangerouslySetInnerHTML={{ __html: relatedPosts[0].title.rendered }}
                  />
                  <div
                    className="text-gray-500 text-lg line-clamp-2 italic font-serif"
                    dangerouslySetInnerHTML={{ __html: relatedPosts[0].excerpt.rendered }}
                  />
                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[var(--accent-gold)] pt-2 border-b border-[var(--accent-gold)]/20 group-hover:border-[var(--accent-gold)] transition-all">
                    Continue Reading <ArrowRight size={14} className="ml-2" />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

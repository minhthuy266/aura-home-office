"use client";
import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const categories = [
    { label: 'Reviews', href: '/category/reviews' },
    { label: 'Gaming PCs', href: '/category/gaming-pcs' },
    { label: 'Components', href: '/category/components' },
    { label: 'Peripherals', href: '/category/peripherals' },
    { label: 'Standing Desks', href: '/category/standing-desks' },
    { label: 'Air Purifiers', href: '/category/air-purifiers' },
    { label: 'Blog', href: '/category/blog' },
  ];

  const legal = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Affiliate Disclosure', href: '/disclosure' },
  ];

  return (
    <footer className="bg-[#F5F4F0] text-[#1A1A1A] mt-auto relative overflow-hidden border-t border-black/[0.08]">
      <div className="gold-line"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Logo isDark={true} />
            <p className="text-[13px] text-[#6B6B6B] leading-relaxed max-w-sm font-light">
              Elevating the home office through meticulous research and ergonomic obsession. Curating the best gear for a more productive life.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4A265]/40 animate-pulse"></div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A9A9A]">
                Independent & Reader Supported
              </span>
            </div>
          </div>

          {/* Categories Column */}
          <div className="md:col-span-4 md:col-start-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C4A265] mb-5">Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
              {categories.map(link => (
                <Link key={link.label} href={link.href} className="flex items-center gap-1.5 text-[12px] text-[#1A1A1A] hover:text-[#C4A265] transition-colors duration-300 font-medium group">
                  {link.label}
                  <ArrowUpRight size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C4A265] mb-5">Company</h4>
            <div className="space-y-3">
              {legal.map(link => (
                <Link key={link.label} href={link.href} className="block text-[12px] text-[#1A1A1A] hover:text-[#C4A265] transition-colors duration-300 font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Box */}
        <div className="mt-12 p-5 rounded-2xl bg-white/50 border border-black/[0.04] shadow-sm">
          <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
            <strong className="text-[#1A1A1A] font-bold">Affiliate Disclosure</strong> — Aura Home Office is reader-supported. We may earn a commission from Amazon and other partners when you purchase through links on our site, at no extra cost to you. 
            <Link href="/disclosure" className="text-[#C4A265] font-bold hover:underline ml-1">Learn more about our process →</Link>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-black/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-[0.25em] font-bold text-[#9A9A9A]">
          <p>&copy; {new Date().getFullYear()} Aura Media International. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A265]/30"></span>
              Designed with Intent
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

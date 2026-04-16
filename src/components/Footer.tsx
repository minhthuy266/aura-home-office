"use client";
import React from 'react';
import Link from 'next/link';
import { Monitor } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-900">
                <Monitor size={24} className="text-amber-600 opacity-80" />
                <span className="font-display font-bold tracking-tight text-xl">
                  Aura<span className="font-sans text-amber-600 font-medium text-base ml-1.5 tracking-normal">Home Office</span>
                </span>
             </div>
             <p className="text-sm font-light leading-relaxed max-w-sm mx-auto md:mx-0">
               We meticulously test and evaluate workspace gear to bring you definitive recommendations for a more productive life.
             </p>
          </div>

          <div className="space-y-6 text-center md:text-right">
             <div className="flex gap-6 justify-center md:justify-end">
                <Link href="/about-us" className="font-mono text-[10px] uppercase tracking-widest hover:text-zinc-900 transition-colors">About Us</Link>
                <Link href="/contact-us" className="font-mono text-[10px] uppercase tracking-widest hover:text-zinc-900 transition-colors">Contact</Link>
                <Link href="/privacy-policy" className="font-mono text-[10px] uppercase tracking-widest hover:text-zinc-900 transition-colors">Privacy Policy</Link>
             </div>
             
             <div className="mt-4 p-5 rounded-2xl border border-zinc-200 bg-[#FAF9F6] text-xs leading-relaxed opacity-90 inline-block text-left max-w-md shadow-inner shadow-zinc-100">
                <strong className="text-zinc-900 font-bold uppercase tracking-wide">⚠️ Affiliate Disclosure:</strong> Aura Home Office is reader-supported. When you buy through links on our site, we may earn an affiliate commission from Amazon and other partners. <Link href="/affiliate-disclosure" className="underline text-amber-700 hover:text-zinc-900">Learn more.</Link>
             </div>
          </div>
          
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-100 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-mono">
           <p>&copy; {new Date().getFullYear()} AURA MEDIA. All rights reserved.</p>
           <p className="opacity-50">DESIGNED IN CALIFORNIA • BUILT FOR THE WORLD</p>
        </div>
      </div>
    </footer>
  );
}

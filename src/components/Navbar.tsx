"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Monitor, Search, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MENU_ITEMS = [
  {
    title: 'Furniture',
    path: '/category/furniture',
    sub: [
      { name: 'Standing Desks', path: '/category/standing-desks' },
      { name: 'Ergonomic Chairs', path: '/category/ergonomic-chairs' },
      { name: 'Desk Converters', path: '/category/desk-converters' },
      { name: 'Desk Storage', path: '/category/desk-storage' },
      { name: 'Footrests & Mats', path: '/category/footrests-mats' },
    ]
  },
  {
    title: 'Setup',
    path: '/category/setup',
    sub: [
      { name: 'Monitor Arms', path: '/category/monitor-arms' },
      { name: 'Desk Lighting', path: '/category/desk-lighting' },
      { name: 'Cable Management', path: '/category/cable-management' },
      { name: 'Keyboards & Mice', path: '/category/keyboards-mice' },
      { name: 'Desk Accessories', path: '/category/desk-accessories' },
    ]
  },
  {
    title: 'Guides',
    path: '/category/guides',
    sub: [
      { name: 'Ergonomics & Health', path: '/category/ergonomics-health' },
      { name: 'Workspace Ideas', path: '/category/workspace-ideas' },
      { name: 'Productivity', path: '/category/productivity' },
    ]
  }
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-full px-6 py-3 flex justify-between items-center shadow-lg shadow-zinc-200/30"
        >
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Monitor size={20} className="text-zinc-900 group-hover:text-amber-600 transition-colors opacity-80" />
            <span className="font-display font-bold tracking-tight text-xl text-zinc-900">
              Aura<span className="font-sans text-amber-600 font-medium text-base ml-1.5 tracking-normal">Home Office</span>
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-2">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Home</Link>
            
            {MENU_ITEMS.map((item) => (
              <div 
                key={item.title}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.title)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link 
                  href={item.path} 
                  className={`px-4 py-2 text-sm font-medium flex items-center gap-1 transition-colors ${activeMenu === item.title ? 'text-amber-600' : 'text-zinc-600 hover:text-zinc-900'}`}
                >
                  {item.title}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === item.title ? 'rotate-180' : ''}`} />
                </Link>
                
                <AnimatePresence>
                  {activeMenu === item.title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-xl shadow-zinc-200/50 py-3 overflow-hidden"
                    >
                      {item.sub.map((subItem) => (
                        <Link 
                          key={subItem.name} 
                          href={subItem.path}
                          className="block px-5 py-2 text-sm text-zinc-600 hover:text-amber-700 hover:bg-amber-50/50 hover:pl-6 transition-all"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <button className="text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block">
              <Search size={18} />
            </button>
            <button className="hidden sm:block text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-full transition-all shadow-sm">
              Subscribe
            </button>
            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

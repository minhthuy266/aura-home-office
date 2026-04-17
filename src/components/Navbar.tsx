"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  {
    label: 'Furniture',
    href: '/category/furniture',
    children: [
      { label: 'Standing Desks', href: '/category/standing-desks', desc: 'Adjustable electric & manual desks' },
      { label: 'Ergonomic Chairs', href: '/category/ergonomic-chairs', desc: 'Superior posture & mesh comfort' },
      { label: 'Desk Converters', href: '/category/desk-converters', desc: 'Turn any desk into a standing one' },
      { label: 'Desk Storage', href: '/category/desk-storage', desc: 'Minimalist filing & organization' },
      { label: 'Footrests & Mats', href: '/category/footrests-mats', desc: 'Anti-fatigue standing solutions' },
    ]
  },
  {
    label: 'Setup',
    href: '/category/setup',
    children: [
      { label: 'Monitor Arms', href: '/category/monitor-arms', desc: 'Single & dual display elevation' },
      { label: 'Desk Lighting', href: '/category/desk-lighting', desc: 'Screenbars & bias lighting setup' },
      { label: 'Cable Management', href: '/category/cable-management', desc: 'Clean, wire-free workspace kits' },
      { label: 'Keyboards & Mice', href: '/category/keyboards-mice', desc: 'Mechanical & ergonomic peripherals' },
      { label: 'Desk Accessories', href: '/category/desk-accessories', desc: 'Pads, stands, & essentials' },
    ]
  },
  {
    label: 'Guides',
    href: '/category/guides',
    children: [
      { label: 'Ergonomics & Health', href: '/category/ergonomics-health', desc: 'Setup rules & pain relief' },
      { label: 'Workspace Ideas', href: '/category/workspace-ideas', desc: 'Visual inspiration & aesthetics' },
      { label: 'Productivity', href: '/category/productivity', desc: 'Flow state & WFH techniques' },
    ]
  }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-3'
      }`}
    >
      {/* Background layer */}
      <div className={`absolute inset-0 transition-all duration-500 bg-white/95 backdrop-blur-md border-b border-black/[0.06] ${
        isScrolled ? 'shadow-sm' : ''
      }`}></div>

      <div className="max-w-[1100px] mx-auto px-5 flex justify-between items-center relative z-10">
        <Link href="/" className="relative z-10">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 rounded-full hover:bg-black/[0.03] ${
                  activeDropdown === item.label ? 'text-[#C4A265]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                {item.label}
                <ChevronDown size={10} className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                  activeDropdown === item.label ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <div className="w-[280px] bg-white rounded-2xl shadow-luxury border border-black/[0.04] p-3 overflow-hidden">
                  <div className="space-y-1">
                    {item.children.map((child) => (
                      <Link 
                        key={child.label} 
                        href={child.href}
                        className="flex flex-col p-3 rounded-xl hover:bg-[#F5F4F0] transition-colors group"
                      >
                        <span className="text-[11px] font-bold text-[#1A1A1A] group-hover:text-[#C4A265] transition-colors">{child.label}</span>
                        <span className="text-[9px] text-[#9A9A9A] font-medium leading-tight mt-0.5">{child.desc}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/[0.04]">
                    <Link 
                      href={item.href} 
                      className="flex items-center justify-center gap-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-[#C4A265] hover:bg-[#C4A265]/5 rounded-lg transition-colors"
                    >
                      View All {item.label} <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-black/[0.04] transition-all duration-300">
            <Search size={15} strokeWidth={2} />
          </button>
          
          <Link href="/subscribe" className="hidden sm:inline-flex btn-premium btn-dark text-[9px] py-2 px-5">
            Subscribe
            <ArrowRight size={10} />
          </Link>

          <button 
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/[0.04] transition-all text-[#1A1A1A]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 overflow-y-auto ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-white/98 backdrop-blur-2xl"></div>
        <div className="relative z-10 flex flex-col pt-24 pb-12 px-8 min-h-screen">
          {navItems.map((item) => (
            <div key={item.label} className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C4A265] mb-4">{item.label}</h3>
              <div className="space-y-4">
                {item.children.map((child) => (
                  <Link 
                    key={child.label} 
                    href={child.href}
                    className="block text-2xl font-display font-bold text-[#1A1A1A] hover:text-[#C4A265] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-4 gold-line w-12"></div>
          <Link 
            href="/subscribe"
            className="btn-premium btn-gold mt-8 text-[10px] w-full justify-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Subscribe To The Aura Edit
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </header>
  );
}

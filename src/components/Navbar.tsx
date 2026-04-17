"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  {
    label: 'Reviews',
    href: '/category/reviews',
    children: [
      { label: 'All Reviews', href: '/category/reviews', desc: 'Expert gear analysis & verdicts' },
      { label: 'Gaming PCs', href: '/category/gaming-pcs', desc: 'High-performance rigs & setups' },
      { label: 'Components', href: '/category/components', desc: 'Internal hardware & upgrades' },
      { label: 'Peripherals', href: '/category/peripherals', desc: 'Keyboards, mice & monitors' },
    ]
  },
  {
    label: 'Gear by Tag',
    href: '#',
    children: [
      { label: 'Standing Desks', href: '/category/standing-desks', desc: 'Ergonomic height-adjustable desks' },
      { label: 'Air Purifiers', href: '/category/air-purifiers', desc: 'Cleaner air for your office' },
      { label: 'Amazon News', href: '/category/amazon-news', desc: 'Latest from the world of e-commerce' },
    ]
  },
  {
    label: 'Editorial',
    href: '/category/blog',
    children: [
      { label: 'Latest Blog', href: '/category/blog', desc: 'Office trends & productivity tips' },
      { label: 'Lifestyle', href: '/category/blog', desc: 'Balancing work and wellness' },
    ]
  }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-500 flex items-center min-h-[72px] ${
        isScrolled ? 'py-3' : 'py-4'
      }`}
    >
      {/* Background layer */}
      <div className={`absolute inset-0 transition-all duration-500 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-black/[0.06] ${
        isScrolled || mobileMenuOpen ? 'shadow-sm opacity-100' : ''
      } ${mobileMenuOpen ? 'z-[105]' : 'z-0'}`}></div>

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 flex justify-between items-center relative z-[110]">
        <Link href="/" className="relative z-10" onClick={() => setMobileMenuOpen(false)}>
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
                <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                  activeDropdown === item.label ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <div className="w-[300px] bg-white rounded-2xl shadow-luxury border border-black/[0.04] p-3 overflow-hidden">
                  <div className="space-y-1">
                    {item.children.map((child) => (
                      <Link 
                        key={child.label} 
                        href={child.href}
                        className="flex flex-col p-3 rounded-xl hover:bg-[#F5F4F0] transition-colors group"
                      >
                        <span className="text-[13px] font-bold text-[#1A1A1A] group-hover:text-[#C4A265] transition-colors">{child.label}</span>
                        <span className="text-[11px] text-[#9A9A9A] font-medium leading-relaxed mt-0.5">{child.desc}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/[0.04]">
                    <Link 
                      href={item.href} 
                      className="flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#C4A265] hover:bg-[#C4A265]/5 rounded-lg transition-colors"
                    >
                      View All {item.label} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-black/[0.04] transition-all duration-300"
          >
            <Search size={16} strokeWidth={2} />
          </button>
          
          <Link href="/about" className="hidden lg:flex items-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B6B6B] hover:text-[#1A1A1A] px-3 py-2 transition-colors">
            About
          </Link>


          <button 
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/[0.04] transition-all text-[#1A1A1A]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-[#FAFAF7] backdrop-blur-xl"></div>
        
        {/* Mobile Content */}
        <div className="relative z-10 flex flex-col px-6 pt-[90px] pb-10 overflow-y-auto h-full">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-8 relative">
            <input
              type="text"
              placeholder="Search gear, reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F4F0] border border-black/[0.05] rounded-xl py-3 pl-4 pr-12 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#C4A265]/20 focus:border-[#C4A265]/30 transition-all"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A9A9A]">
              <Search size={18} />
            </button>
          </form>

          {navItems.map((item) => (
            <div key={item.label} className="mb-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C4A265] mb-5">{item.label}</h3>
              <div className="flex flex-col gap-5">
                {item.children.map((child) => (
                  <Link 
                    key={child.label} 
                    href={child.href}
                    className="group flex flex-col"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl font-display font-medium text-[#1A1A1A] group-hover:text-[#C4A265] transition-colors">
                      {child.label}
                    </span>
                    <span className="text-[13px] text-[#9A9A9A] font-medium leading-relaxed mt-1">
                      {child.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          <div className="pt-6 border-t border-black/[0.06] mt-auto">
            <div className="flex flex-col gap-4 mb-6">
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-display font-bold text-[#1A1A1A]">About Our Process</Link>
              <Link href="/disclosure" onClick={() => setMobileMenuOpen(false)} className="text-lg font-display font-bold text-[#1A1A1A]">Affiliate Disclosure</Link>
            </div>

          </div>
        </div>
      </div>

      {/* Desktop Search Overlay */}
      <div 
        className={`fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4 transition-all duration-500 ${
          isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-md"
          onClick={() => setIsSearchOpen(false)}
        ></div>
        
        <div className={`relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 delay-75 transform ${
          isSearchOpen ? 'translate-y-0 scale-100' : '-translate-y-8 scale-95'
        }`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C4A265]">Search The Aura Archive</h2>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.05] text-[#9A9A9A] hover:text-[#1A1A1A] transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search ergonomic chairs, mechanical keyboards, desk setups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F4F0] border-none rounded-2xl py-5 pl-7 pr-14 text-xl font-display font-medium focus:ring-2 focus:ring-[#C4A265]/20 transition-all placeholder:text-[#9A9A9A]"
              />
              <button 
                type="submit"
                className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[#1A1A1A] text-white rounded-xl hover:bg-[#C4A265] transition-all shadow-lg"
              >
                <Search size={18} />
              </button>
            </form>
            
            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9A9A9A] mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2.5">
                {['Herman Miller', 'Mechanical Keyboards', 'OLED Monitors', 'Standing Desks', 'Cable Management'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-[#F5F4F0] hover:bg-[#C4A265] hover:text-white rounded-full text-[13px] font-bold text-[#6B6B6B] transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

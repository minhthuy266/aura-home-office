"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
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
  const searchInputRef = useRef<HTMLInputElement>(null!);
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
    <>
      <header
        className="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        minHeight: '64px',
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-rule-hard)',
        padding: isScrolled ? 'var(--space-2) 0' : 'var(--space-3) 0',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-8 flex justify-between items-center relative z-[110]">
        <Link href="/" className="relative z-10" onClick={() => setMobileMenuOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="flex items-center gap-1 px-4 py-2"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: activeDropdown === item.label ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  transition: 'color 0.12s ease',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {item.label}
                <ChevronDown size={13} style={{
                  transform: activeDropdown === item.label ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.12s ease'
                }} />
              </button>

              {/* Dropdown */}
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                style={{
                  opacity: activeDropdown === item.label ? 1 : 0,
                  transform: `translateX(-50%) translateY(${activeDropdown === item.label ? '0' : '6px'})`,
                  pointerEvents: activeDropdown === item.label ? 'auto' : 'none',
                  transition: 'opacity 0.12s ease, transform 0.12s ease',
                }}
              >
                <div style={{
                  width: '280px',
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  padding: '8px',
                  overflow: 'hidden',
                }}>
                  {item.children.map((child) => (
                    <Link 
                      key={child.label} 
                      href={child.href}
                      className="flex flex-col p-3"
                      style={{
                        borderRadius: 'var(--radius-md)',
                        transition: 'background 0.12s ease',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}>{child.label}</span>
                      <span style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                        marginTop: '2px',
                        lineHeight: '1.5',
                      }}>{child.desc}</span>
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--color-border-subtle)', margin: '8px 0 4px' }}>
                    <Link 
                      href={item.href} 
                      className="flex items-center justify-center py-2.5"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                      }}
                    >
                      View All {item.label} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-center w-9 h-9"
            style={{ 
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              cursor: 'pointer',
            }}
            aria-label="Search"
          >
            <Search size={16} strokeWidth={2} />
          </button>
          
          <Link 
            href="/about" 
            className="hidden lg:flex items-center px-4 py-2"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
            }}
          >
            About
          </Link>

          <button 
            className="lg:hidden flex items-center justify-center w-10 h-10"
            style={{ color: 'var(--color-text-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-[100] ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          opacity: mobileMenuOpen ? 1 : 0,
          transition: 'opacity 0.12s ease',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'var(--color-bg)' }} />
        
        <div className="relative z-10 flex flex-col px-6 pt-[80px] pb-10 overflow-y-auto h-full">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-8 relative">
            <input
              type="text"
              placeholder="Search gear, reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-4 pr-12"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-base)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-body)',
                outline: 'none',
              }}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)', background: 'transparent', border: 'none' }}>
              <Search size={18} />
            </button>
          </form>

          {navItems.map((item) => (
            <div key={item.label} className="mb-8">
              {/* Kicker — JetBrains Mono, uppercase */}
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-mono)',
                color: 'var(--color-accent)',
                marginBottom: '16px',
              }}>{item.label}</p>
              <div className="flex flex-col gap-4">
                {item.children.map((child) => (
                  <Link 
                    key={child.label} 
                    href={child.href}
                    className="flex flex-col"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}>{child.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                      marginTop: '4px',
                    }}>{child.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          <div className="pt-6 mt-auto" style={{ borderTop: '1px solid var(--color-rule-hard)' }}>
            <div className="flex flex-col gap-4">
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
              }}>About Our Process</Link>
              <Link href="/disclosure" onClick={() => setMobileMenuOpen(false)} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
              }}>Affiliate Disclosure</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Search Overlay */}
      <div 
        className={`fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 ${
          isSearchOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          opacity: isSearchOpen ? 1 : 0,
          transition: 'opacity 0.12s ease',
        }}
      >
        <div 
          className="absolute inset-0"
          style={{ background: 'rgba(17, 17, 16, 0.35)' }}
          onClick={() => setIsSearchOpen(false)}
        />
        
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          transform: isSearchOpen ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'transform 0.12s ease',
        }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              {/* Search label — JetBrains Mono kicker */}
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-mono)',
                color: 'var(--color-text-muted)',
              }}>Search Aura Home Office</p>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-center w-8 h-8"
                style={{
                  color: 'var(--color-text-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search ergonomic chairs, standing desks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-xl)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 56px 16px 20px',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9"
                style={{
                  background: 'var(--color-accent)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Submit search"
              >
                <Search size={16} />
              </button>
            </form>
            
            <div className="mt-6">
              {/* Kicker — JetBrains Mono */}
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-mono)',
                color: 'var(--color-text-muted)',
                marginBottom: '12px',
              }}>Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Herman Miller', 'Mechanical Keyboards', 'OLED Monitors', 'Standing Desks', 'Cable Management'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '6px 14px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-pill)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      transition: 'border-color 0.12s ease, color 0.12s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

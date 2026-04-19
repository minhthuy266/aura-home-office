"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  {
    label: 'Furniture',
    href: '/furniture',
    children: [
      { label: 'Standing Desks', href: '/standing-desks', desc: 'Height-adjustable workspaces' },
      { label: 'Ergonomic Chairs', href: '/ergonomic-chairs', desc: 'Comfort for long hours' },
      { label: 'Desk Converters', href: '/desk-converters', desc: 'Sit-stand solutions' },
      { label: 'Desk Storage', href: '/desk-storage', desc: 'Organization & drawers' },
      { label: 'Footrests & Mats', href: '/footrests-mats', desc: 'Under-desk support' },
    ]
  },
  {
    label: 'Setup',
    href: '/setup',
    children: [
      { label: 'Monitor Arms', href: '/monitor-arms', desc: 'Display mounting solutions' },
      { label: 'Desk Lighting', href: '/desk-lighting', desc: 'Lamps & ambient lights' },
      { label: 'Cable Management', href: '/cable-management', desc: 'Keep wires hidden' },
      { label: 'Keyboards & Mice', href: '/keyboards-mice', desc: 'Input devices' },
      { label: 'Desk Accessories', href: '/desk-accessories', desc: 'Essential add-ons' },
    ]
  },
  {
    label: 'Guides',
    href: '/guides',
    children: [
      { label: 'Ergonomics & Health', href: '/ergonomics-health', desc: 'Posture & wellness tips' },
      { label: 'Workspace Ideas', href: '/workspace-ideas', desc: 'Inspiration & aesthetics' },
      { label: 'Productivity', href: '/productivity', desc: 'Work smarter & faster' },
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
        className="nav-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-rule-hard)',
          transition: 'transform 0.3s ease',
          transform: isScrolled ? 'translateY(-36px)' : 'translateY(0)', // Hide utility bar on scroll
        }}
      >
        {/* ROW 1: Utility Bar (Above) */}
        <div style={{
          height: '34px',
          background: 'var(--color-text-primary)', // Standardized charcoal
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.1)' }}></span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-accent-light)', fontWeight: 700, letterSpacing: '0.05em' }}>Independent Research & Testing</span>
            </div>
            
            <nav style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'About', href: '/about' },
                { label: 'Disclosure', href: '/disclosure' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <Link key={link.label} href={link.href} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ROW 2: Branding & Main Nav */}
        <div style={{
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: 'var(--color-bg)',
        }}>
          <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Branding (Left) */}
            <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center' }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                <Logo />
              </Link>
            </div>

            {/* Main Navigation (Center) */}
            <nav className="hidden lg:flex items-center gap-10" style={{ flex: '0 0 auto' }}>
              {navItems.map((item) => (
                <div 
                  key={item.label} 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button 
                    className="flex items-center gap-2 py-6 relative"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: activeDropdown === item.label ? 'var(--color-accent)' : 'var(--color-text-primary)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.label}
                    <ChevronDown size={12} style={{ opacity: 0.3, transform: activeDropdown === item.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                    
                    {/* Synchronized Underline */}
                    <span 
                      style={{ 
                        position: 'absolute', 
                        bottom: '22px', 
                        left: 0, 
                        width: activeDropdown === item.label ? '100%' : '0%', 
                        height: '2px', 
                        background: 'var(--color-accent)', 
                        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                        opacity: activeDropdown === item.label ? 1 : 0 
                      }} 
                    />
                  </button>

                  {/* Enhanced Dropdown — Using Design Tokens */}
                  <div 
                    className="absolute top-full left-0 pt-0"
                    style={{
                      opacity: activeDropdown === item.label ? 1 : 0,
                      transform: `translateY(${activeDropdown === item.label ? '0' : '10px'})`,
                      pointerEvents: activeDropdown === item.label ? 'auto' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                      zIndex: 200,
                    }}
                  >
                    <div style={{
                      width: '280px',
                      background: 'var(--color-bg)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--color-rule-soft)',
                      padding: '8px',
                    }}>
                      {item.children.map((child) => (
                        <Link 
                          key={child.label} 
                          href={child.href}
                          className="flex flex-col p-3"
                          style={{
                            transition: 'background 0.2s ease',
                            textDecoration: 'none',
                            borderRadius: '2px',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{child.label}</span>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: '1.4' }}>{child.desc}</span>
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--color-rule-soft)', marginTop: '8px', padding: '8px 0 4px' }}>
                        <Link href={item.href} className="flex items-center justify-center py-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Explore {item.label} Archive →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Practical Utilities (Right) */}
            <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="group"
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--color-text-primary)',
                  padding: '8px 0',
                }}
              >
                <Search size={19} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="hidden xl:block">Search</span>
              </button>
              
              <Link 
                href="/reviews" 
                className="hidden lg:flex items-center px-6 py-3 transition-all"
                style={{
                  background: 'var(--color-text-primary)',
                  color: 'var(--color-bg)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Go Reviews
              </Link>

              <button 
                className="lg:hidden"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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

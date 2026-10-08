import React, { useState } from 'react';
import { PhoneCall, Menu, X } from 'lucide-react';
import { PageId, GeneralSettings } from '../types';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  general?: GeneralSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, general }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = general?.brandName || 'SI PROPERTY';
  const logoSrc = general?.logoUrl || '/logo-si-property.svg';
  const hotline = general?.hotline || '0938.889.688';
  const vipCta = general?.vipCtaText || 'Giỏ Hàng VIP';

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'about', label: 'Giới Thiệu' },
    { id: 'projects', label: 'Dự Án' },
    { id: 'advisors', label: 'Chuyên Viên' },
    { id: 'news', label: 'Tin Tức' },
    { id: 'careers', label: 'Tuyển Dụng' },
    { id: 'contact', label: 'Liên Hệ' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#062920]/95 backdrop-blur-md border-b border-[#c59b27]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          {/* Brand Logo with Official Vector Emblem - Borderless & Clean */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer shrink-0 transition-opacity hover:opacity-95"
          >
            <div className="h-11 w-11 sm:h-12 sm:w-12 flex items-center justify-center transition-transform group-hover:scale-105">
              <img 
                src={logoSrc} 
                alt={brandName} 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(229,175,37,0.3)]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-si-property-icon.svg';
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg md:text-xl font-cinzel font-bold tracking-widest gold-gradient-text block leading-none whitespace-nowrap">
                {brandName}
              </span>
              <span className="text-[9px] md:text-[10px] tracking-wider text-stone-300 font-sans leading-none mt-1 whitespace-nowrap opacity-90">
                Chuyên tâm • Chuyên nghiệp • Chuyên sâu
              </span>
            </div>
          </button>

          {/* Desktop Navigation Items - strictly ONE line with nowrap */}
          <nav className="hidden md:flex items-center flex-nowrap space-x-1 lg:space-x-1.5 xl:space-x-2 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 lg:px-3 xl:px-3.5 py-1.5 rounded-full text-[11px] lg:text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  currentPage === item.id
                    ? 'text-white bg-gradient-to-r from-[#c59b27]/30 to-[#dfa837]/20 border border-[#c59b27]/70 shadow-[0_0_15px_rgba(197,155,39,0.25)]'
                    : 'text-stone-300 hover:text-amber-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
            <a
              href={`tel:${hotline.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#c59b27]/40 text-amber-200 hover:border-[#c59b27] transition whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{hotline}</span>
            </a>
            <button
              onClick={() => handleNavClick('contact')}
              className="gold-btn px-3.5 xl:px-4 py-1.5 text-xs uppercase tracking-wider rounded-lg shadow-md whitespace-nowrap"
            >
              {vipCta}
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-amber-300 hover:bg-emerald-900/60"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#c59b27]/30 bg-[#062920] px-4 pt-2 pb-6 space-y-1.5 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold ${
                currentPage === item.id
                  ? 'bg-emerald-900/80 text-amber-300 border-l-4 border-[#c59b27]'
                  : 'text-stone-200 hover:bg-emerald-900/50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-emerald-800/40">
            <a
              href={`tel:${hotline.replace(/[^0-9]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold text-amber-300 bg-emerald-950/80 border border-[#c59b27]/40"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Hotline: {hotline}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};


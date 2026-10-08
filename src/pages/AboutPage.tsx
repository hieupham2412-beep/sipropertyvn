import React from 'react';
import { Newspaper, ExternalLink, HeartHandshake, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { AboutContent } from '../types';
import { INITIAL_ABOUT } from '../data/initialData';

interface AboutPageProps {
  content?: AboutContent;
}

export const AboutPage: React.FC<AboutPageProps> = ({ content = INITIAL_ABOUT }) => {
  const icons = [HeartHandshake, ShieldCheck, TrendingUp, Sparkles];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-[#c59b27]/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          {content.badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white leading-tight">
          {content.title}
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
          {content.subtitle}
        </p>
      </div>

      {/* Press / Strategic Partner Feature Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#062920] via-[#093a2f] to-[#031711] border border-[#c59b27]/50 shadow-2xl space-y-8">
        <div className="flex items-center gap-3 border-b border-emerald-900/80 pb-4">
          <div className="p-2 rounded-lg bg-[#c59b27]/20 border border-[#c59b27]/40 text-[#dfa837]">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#dfa837] font-semibold">
              Góc Nhìn Báo Chí • CafeLand.vn
            </span>
            <h3 className="text-base sm:text-xl font-bold text-white">
              {content.quoteTitle}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
          <p>{content.quoteText1}</p>
          <p>{content.quoteText2}</p>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-[#c59b27]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-300">
            {content.sourceLabel}
          </div>
          {content.sourceUrl && (
            <a
              href={content.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-[#c59b27]/20 hover:bg-[#c59b27] hover:text-black border border-[#c59b27] text-amber-300 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <span>Xem Bài Báo Gốc Tại CafeLand</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* 3 Chuyên Core Values */}
      <div className="space-y-10">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#dfa837]">
            Kim Chỉ Nam Hành Động
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
            TRIẾT LÝ HÀNH ĐỘNG TẠI SI PROPERTY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.values.map((v, idx) => {
            const IconComponent = icons[idx % icons.length];
            return (
              <div key={v.id || idx} className="p-8 rounded-2xl glass-card text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/80 border border-[#c59b27]/50 flex items-center justify-center text-amber-400">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold gold-gradient-text font-serif-luxury tracking-wider">
                  {v.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

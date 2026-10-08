import React from 'react';
import { TrendingUp, Building2, Award, Sparkles } from 'lucide-react';
import { CareersContent, PageId } from '../types';
import { INITIAL_CAREERS } from '../data/initialData';

interface CareersPageProps {
  content?: CareersContent;
  onNavigate: (page: PageId) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ 
  content = INITIAL_CAREERS, 
  onNavigate 
}) => {
  const benefitIcons = [TrendingUp, Building2, Award, Sparkles];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-[#c59b27]/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          {content.badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
          {content.title}
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
          {content.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.benefits.map((b, idx) => {
          const Icon = benefitIcons[idx % benefitIcons.length];
          return (
            <div key={b.id || idx} className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-[#c59b27]/40 flex items-center justify-center text-amber-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{b.title}</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                {b.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif-luxury font-bold text-white">
            VỊ TRÍ ĐANG TUYỂN DỤNG ({content.jobs.length})
          </h2>
          <span className="text-xs text-[#c59b27] font-semibold">
            Chi trả hoa hồng trong 72h
          </span>
        </div>

        <div className="space-y-4">
          {[...(content.jobs || [])]
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            .map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded border border-emerald-800">
                    {job.department}
                  </span>
                  <span className="text-xs text-stone-400">📍 {job.location}</span>
                </div>
                <h3 className="text-lg font-bold text-white hover:text-amber-300 transition">
                  {job.title}
                </h3>
                <p className="text-xs text-stone-300 font-light leading-relaxed">{job.desc}</p>
                <div className="text-xs font-semibold text-amber-300">💰 {job.salary}</div>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider shrink-0 shadow-md"
              >
                Ứng Tuyển Ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

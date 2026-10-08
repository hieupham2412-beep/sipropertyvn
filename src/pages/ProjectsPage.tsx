import React, { useState } from 'react';
import { MapPin, Layers, ArrowUpRight } from 'lucide-react';
import { Project, PageHeadersSettings } from '../types';

interface ProjectsPageProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  pageHeaders?: PageHeadersSettings;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onOpenProject, pageHeaders }) => {
  const [filter, setFilter] = useState<string>('all');

  const badge = pageHeaders?.projectsBadge || 'Giỏ Hàng Chiến Lược • SI Property';
  const title = pageHeaders?.projectsTitle || 'DANH MỤC DỰ ÁN BẤT ĐỘNG SẢN CAO CẤP';
  const subtitle = pageHeaders?.projectsSubtitle || 'Tuyển chọn những bất động sản chuẩn pháp lý, vị trí đón đầu hạ tầng cao tốc Biên Hòa - Vũng Tàu và sân bay Long Thành cùng CĐT HODECO.';

  const sortedProjects = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const filteredProjects = sortedProjects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'the-light-city') return p.id.includes('the-light-city');
    if (filter === 'blanca') return p.id.includes('blanca');
    if (filter === 'legacy-66') return p.id.includes('legacy-66');
    if (filter === 'villa') {
      return (
        p.type.toLowerCase().includes('biệt thự') ||
        p.type.toLowerCase().includes('dinh thự')
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-[#c59b27]/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          {badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
          {subtitle}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {[
            { id: 'all', label: 'Tất Cả Dự Án' },
            { id: 'the-light-city', label: 'The Light City (HODECO)' },
            { id: 'blanca', label: 'Dinh Thự Blanca' },
            { id: 'legacy-66', label: 'Legacy 66' },
            { id: 'villa', label: 'Biệt Thự / Nghỉ Dưỡng' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                filter === tab.id
                  ? 'gold-btn'
                  : 'glass-card text-stone-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl overflow-hidden glass-card flex flex-col group transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
          >
            <div
              onClick={() => onOpenProject(p.id)}
              className="relative h-60 overflow-hidden cursor-pointer"
              title="Bấm để xem thông tin dự án"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062920] via-transparent to-black/40" />
              <span className="absolute top-3 left-3 bg-[#062920]/90 border border-[#c59b27]/60 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                {p.badge}
              </span>
              <span className="absolute bottom-3 right-3 text-xs font-semibold text-emerald-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30">
                {p.status}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-[#dfa837] font-medium mb-1">CĐT: {p.developer}</div>
                <h3
                  onClick={() => onOpenProject(p.id)}
                  className="text-xl font-bold text-white group-hover:text-amber-300 transition cursor-pointer"
                >
                  {p.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 mt-1 font-light">{p.tagline}</p>
              </div>

              <div className="space-y-2 py-3 border-y border-emerald-900/60 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{p.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{p.scale}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 block">Khoảng giá dự kiến</span>
                  <span className="text-base font-bold gold-gradient-text">{p.price}</span>
                </div>
                <button
                  onClick={() => onOpenProject(p.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-950 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 text-xs font-semibold border border-[#c59b27]/50 transition flex items-center gap-1.5"
                >
                  <span>{p.actionType === 'landing' && p.landingUrl ? 'Landing Page' : 'Chi Tiết'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

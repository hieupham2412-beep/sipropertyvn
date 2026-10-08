import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Newspaper, 
  ArrowUpRight, 
  ArrowRight, 
  Star, 
  Phone, 
  Building2, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Project, Advisor, NewsArticle, PageId, GeneralSettings } from '../types';

interface HomePageProps {
  projects: Project[];
  advisors: Advisor[];
  news: NewsArticle[];
  onNavigate: (page: PageId) => void;
  onOpenProject: (id: string) => void;
  onOpenArticle: (id: string) => void;
  general?: GeneralSettings;
}

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  advisors,
  news,
  onNavigate,
  onOpenProject,
  onOpenArticle,
  general,
}) => {
  const featuredAdvisor =
    advisors.find((a) => a.isFeatured) ||
    [...advisors].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))[0];

  const [advisorBioExpanded, setAdvisorBioExpanded] = useState(false);

  const heroBg = general?.heroBgImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';
  const heroBadge = general?.heroBadge || 'Thành Viên Chiến Lược Của CĐT HODECO';
  const heroTitle = general?.heroTitle || 'TÁI ĐỊNH HÌNH CHUẨN MỰC';
  const heroTitleHighlight = general?.heroTitleHighlight || 'BẤT ĐỘNG SẢN CAO CẤP';
  const heroSubtitle = general?.heroSubtitle || 'SI Property kết hợp khắt khe giữa phân tích quy hoạch, năng lực thẩm định pháp lý và giỏ hàng bất động sản ven biển cao cấp, mang lại thịnh vượng bền vững cho nhà đầu tư tinh hoa.';

  const m1Val = general?.metric1Value || (general as any)?.metric1Val || '100%';
  const m1Lbl = general?.metric1Label || 'Pháp Lý 1/500 Chuẩn Chỉnh';
  const m2Val = general?.metric2Value || (general as any)?.metric2Val || '5+';
  const m2Lbl = general?.metric2Label || 'Đại Dự Án Trọng Điểm';
  const m3Val = general?.metric3Value || (general as any)?.metric3Val || '65%';
  const m3Lbl = general?.metric3Label || 'Hoa Hồng Tối Đa Trong 72h';
  const m4Val = general?.metric4Value || (general as any)?.metric4Val || '24/7';
  const m4Lbl = general?.metric4Label || 'Private Wealth Concierge';

  const homeProjBadge = general?.homeProjectsBadge || 'Giỏ Hàng Độc Quyền Phân Phối';
  const homeProjTitle = general?.homeProjectsTitle || 'CÁC DỰ ÁN TIÊU BIỂU CỦA CĐT HODECO & ĐỐI TÁC';
  const homeNewsBadge = general?.homeNewsBadge || 'Báo Chí & Nhận Định Chuyên Gia';
  const homeNewsTitle = general?.homeNewsTitle || 'TIN TỨC & GÓC NHÌN ĐẦU TƯ';

  return (
    <div className="space-y-24">
      {/* Hero Banner */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-1000 scale-105"
          style={{
            backgroundImage: `url('${heroBg}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031711] via-[#062920]/90 to-[#031711]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-[#c59b27]/70 text-[#e5c158] text-xs font-semibold uppercase tracking-widest shadow-[0_0_20px_rgba(197,155,39,0.3)] animate-pulse">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold tracking-tight text-white leading-tight">
            {heroTitle} <br />
            <span className="gold-gradient-text">{heroTitleHighlight}</span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-stone-300 font-light leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('projects')}
              className="gold-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg"
            >
              Khám Phá Giỏ Hàng Độc Quyền
            </button>
            <button
              onClick={() => onNavigate('advisors')}
              className="px-7 py-3.5 rounded-xl glass-card text-amber-200 font-semibold text-xs uppercase tracking-wider hover:border-amber-400 transition"
            >
              Gặp Gỡ Đội Ngũ Cố Vấn
            </button>
            <button
              onClick={() => onNavigate('news')}
              className="px-6 py-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-2 transition"
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>Góc Nhìn Báo Chí CafeLand</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-emerald-900/60 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl glass-card text-center">
              <div className="text-2xl sm:text-3xl font-bold gold-gradient-text font-cinzel">{m1Val}</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">{m1Lbl}</div>
            </div>
            <div className="p-4 rounded-xl glass-card text-center">
              <div className="text-2xl sm:text-3xl font-bold gold-gradient-text font-cinzel">{m2Val}</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">{m2Lbl}</div>
            </div>
            <div className="p-4 rounded-xl glass-card text-center">
              <div className="text-2xl sm:text-3xl font-bold gold-gradient-text font-cinzel">{m3Val}</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">{m3Lbl}</div>
            </div>
            <div className="p-4 rounded-xl glass-card text-center">
              <div className="text-2xl sm:text-3xl font-bold gold-gradient-text font-cinzel">{m4Val}</div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">{m4Lbl}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Advisor Spotlight */}
      {featuredAdvisor && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062920] via-[#093a2f] to-[#031711] border-2 border-[#c59b27]/60 shadow-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-[#c59b27] via-[#dfa837] to-[#e5c158] rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000" />
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#e5c158] bg-[#02130e] flex flex-col items-center justify-center p-2 shadow-2xl">
                    <img
                      src={featuredAdvisor.image}
                      alt={featuredAdvisor.name}
                      className="w-full h-auto max-h-[480px] object-contain rounded-xl transform transition duration-500 group-hover:scale-102"
                    />
                    <div className="w-full mt-2 pt-2 border-t border-emerald-900/60 bg-[#062920]/70 rounded-xl p-3 text-center">
                      <p className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
                        Thành Viên Chiến Lược CĐT HODECO
                      </p>
                      <p className="text-[11px] text-stone-300">Đồng hành kiến tạo thịnh vượng</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#02140f] border border-[#c59b27]/40 text-[#dfa837] text-xs font-semibold uppercase">
                  <Star className="w-3.5 h-3.5 fill-[#dfa837]" />
                  <span>Chuyên Gia Chiến Lược Tiêu Biểu</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
                  {featuredAdvisor.name}
                </h2>
                <div className="text-sm font-semibold text-emerald-300">
                  {featuredAdvisor.title}
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light whitespace-pre-line">
                    {featuredAdvisor.bio && featuredAdvisor.bio.length > 280 && !advisorBioExpanded
                      ? `${featuredAdvisor.bio.slice(0, 260)}...`
                      : featuredAdvisor.bio}
                  </div>
                  {featuredAdvisor.bio && featuredAdvisor.bio.length > 280 && (
                    <button
                      onClick={() => setAdvisorBioExpanded(!advisorBioExpanded)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 transition py-0.5"
                    >
                      {advisorBioExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Thu gọn tiểu sử</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Xem toàn bộ tiểu sử chuyên viên</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-2 py-3 border-y border-emerald-900/60 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-amber-200">Danh hiệu:</strong> {featuredAdvisor.awards}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-amber-200">Kinh nghiệm:</strong> {featuredAdvisor.experience} thực chiến
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-amber-200">Dự án:</strong> {featuredAdvisor.specialty}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Đặt Lịch Tư Vấn 1-1
                  </button>
                  <a
                    href={`tel:${featuredAdvisor.phone.replace(/[^0-9]/g, '')}`}
                    className="px-5 py-3 rounded-xl glass-card text-amber-200 hover:border-amber-300 font-semibold text-xs flex items-center gap-2 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{featuredAdvisor.phone}</span>
                  </a>
                  <button
                    onClick={() => onNavigate('advisors')}
                    className="px-5 py-3 rounded-xl border border-stone-600 text-stone-300 hover:text-white text-xs font-semibold transition"
                  >
                    Xem Toàn Bộ Đội Ngũ ({advisors.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects on Homepage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e5c158] uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{homeProjBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-white">
              {homeProjTitle}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition"
          >
            <span>Xem tất cả danh mục dự án</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...projects]
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            .slice(0, 3)
            .map((p) => (
            <div
              key={p.id}
              className="rounded-2xl overflow-hidden glass-card flex flex-col group transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
            >
              <div
                onClick={() => onOpenProject(p.id)}
                className="relative h-56 overflow-hidden cursor-pointer"
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
                  <div className="text-xs text-[#dfa837] font-medium mb-1">{p.developer}</div>
                  <h3
                    onClick={() => onOpenProject(p.id)}
                    className="text-xl font-bold text-white group-hover:text-amber-300 transition cursor-pointer"
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-1 font-light">{p.tagline}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 block">Mức giá tham chiếu</span>
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
      </section>

      {/* Featured Press & Insights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e5c158] uppercase tracking-widest mb-1.5">
              <Newspaper className="w-4 h-4" />
              <span>{homeNewsBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-white">
              {homeNewsTitle}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition"
          >
            <span>Đọc tất cả bài phân tích</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...news]
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            .slice(0, 3)
            .map((n) => (
            <div
              key={n.id}
              onClick={() => onOpenArticle(n.id)}
              className="p-5 rounded-2xl glass-card cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-1 transition"
            >
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-[#062920]/90 border border-[#c59b27]/60 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {n.category}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-2 mb-2">
                  <span>{n.date}</span>
                  <span>•</span>
                  <span>{n.author}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                  {n.title}
                </h3>
                <p className="text-xs text-stone-300 mt-2 line-clamp-2 font-light">
                  {n.summary}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-emerald-950 flex items-center justify-between text-xs text-amber-300">
                <span>{n.readTime}</span>
                <span className="group-hover:translate-x-1 transition flex items-center gap-1 font-semibold">
                  Đọc tiếp &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

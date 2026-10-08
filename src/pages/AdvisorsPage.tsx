import React, { useState } from 'react';
import { Award, Clock, Sparkles, Phone, MessageSquare, ChevronDown, ChevronUp, Eye, ShieldCheck, UserCheck } from 'lucide-react';
import { Advisor, PageId, PageHeadersSettings } from '../types';
import { AdvisorDetailModal } from '../components/AdvisorDetailModal';

interface AdvisorsPageProps {
  advisors: Advisor[];
  onNavigate: (page: PageId) => void;
  pageHeaders?: PageHeadersSettings;
}

export const AdvisorsPage: React.FC<AdvisorsPageProps> = ({ advisors, onNavigate, pageHeaders }) => {
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const [featuredExpanded, setFeaturedExpanded] = useState<boolean>(false);
  const [selectedAdvisorForDetail, setSelectedAdvisorForDetail] = useState<Advisor | null>(null);

  const featured = advisors.find((a) => a.isFeatured) || null;
  // If an advisor is marked as featured (tiêu biểu), do not show in the list below
  const regularAdvisors = advisors
    .filter((a) => !a.isFeatured)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const badge = pageHeaders?.advisorsBadge || 'Đội Ngũ Tinh Hoa • SI Property';
  const title = pageHeaders?.advisorsTitle || 'CHUYÊN VIÊN TƯ VẤN BẤT ĐỘNG SẢN CAO CẤP';
  const subtitle = pageHeaders?.advisorsSubtitle || 'Mỗi chuyên viên tại SI Property là một cố vấn đầu tư am tường thị trường, được đào tạo chuẩn mực về thẩm định pháp lý và tận tâm bảo toàn giá trị cho khách hàng.';

  const toggleCardExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
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
      </div>

      {/* Featured Advisor Hero Spotlight */}
      {featured && (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#062920] via-[#093a2f] to-[#031711] border-2 border-[#e5c158] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 gold-btn text-[11px] font-extrabold uppercase tracking-wider px-6 py-1.5 rounded-bl-xl shadow-md">
            Chiến Lược Gia HODECO Xuất Sắc
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                className="relative max-w-sm w-full cursor-pointer group"
                onClick={() => setSelectedAdvisorForDetail(featured)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-300" />
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="relative rounded-2xl w-full max-h-[480px] object-contain border border-amber-300 shadow-2xl bg-[#02130e]/80 p-1 group-hover:scale-[1.01] transition duration-300"
                />
                <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md rounded-xl p-2 text-center border border-amber-400/40 opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Xem Chi Tiết Hồ Sơ & Tiểu Sử
                  </span>
                </div>
              </div>
            </div>

            {/* Content with robust Long Bio support */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#dfa837] font-bold block">
                Thành Viên Chiến Lược • SI Property & CĐT HODECO
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
                {featured.name}
              </h2>
              <div className="text-sm font-semibold text-emerald-300">{featured.title}</div>

              {/* Long Bio Display with Expand / Collapse */}
              <div className="space-y-2">
                <div className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light whitespace-pre-line">
                  {featured.bio && featured.bio.length > 280 && !featuredExpanded ? (
                    <>
                      {featured.bio.slice(0, 260)}...
                    </>
                  ) : (
                    featured.bio
                  )}
                </div>

                {featured.bio && featured.bio.length > 280 && (
                  <button
                    onClick={() => setFeaturedExpanded(!featuredExpanded)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 transition py-0.5"
                  >
                    {featuredExpanded ? (
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

              {/* Achievements & Metrics */}
              <div className="space-y-2 py-3 border-y border-emerald-900/60 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-amber-200">Thành tích:</span>
                  <span>{featured.awards}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-amber-200">Kinh nghiệm:</span>
                  <span>{featured.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-amber-200">Dự án:</span>
                  <span>{featured.specialty}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedAdvisorForDetail(featured)}
                  className="px-4 py-2.5 rounded-xl border border-[#c59b27] bg-[#c59b27]/20 hover:bg-[#c59b27]/30 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hồ Sơ Chi Tiết</span>
                </button>
                <a
                  href={`tel:${featured.phone.replace(/[^0-9]/g, '')}`}
                  className="gold-btn px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-950" />
                  <span>Hotline: {featured.phone}</span>
                </a>
                <a
                  href={`https://zalo.me/${featured.zalo || featured.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Zalo Trực Tiếp</span>
                </a>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2.5 rounded-xl glass-card text-amber-200 hover:border-amber-300 font-semibold text-xs transition"
                >
                  Đặt Lịch 1-1
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Advisors Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <h3 className="text-lg font-serif-luxury font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <span>DANH SÁCH CHUYÊN VIÊN TƯ VẤN VIP</span>
          </h3>
          <span className="text-xs text-stone-400">
            {regularAdvisors.length > 0 ? `Đội ngũ tư vấn: ${regularAdvisors.length} chuyên gia` : 'Đang cập nhật thêm'}
          </span>
        </div>

        {regularAdvisors.length === 0 ? (
          <div className="text-center py-10 rounded-2xl glass-card p-6">
            <p className="text-sm text-stone-400">
              Chuyên viên tiêu biểu đang được giới thiệu trang trọng phía trên. Bạn có thể thêm các chuyên viên tư vấn khác trong Quản trị CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularAdvisors.map((a) => {
              const isExpanded = !!expandedCardIds[a.id];
              const isLongBio = (a.bio?.length || 0) > 130;

              return (
                <div
                  key={a.id}
                  className="rounded-2xl overflow-hidden glass-card flex flex-col justify-between group shadow-xl hover:-translate-y-1 transition duration-300 border border-emerald-900/50 hover:border-[#c59b27]/60"
                >
                  <div>
                    {/* Portrait - Clickable to open Full Profile Modal */}
                    <div 
                      onClick={() => setSelectedAdvisorForDetail(a)}
                      className="relative h-80 overflow-hidden bg-[#02130e] flex items-center justify-center p-2 border-b border-emerald-950 cursor-pointer"
                    >
                      <img
                        src={a.image}
                        alt={a.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-3">
                        <span className="px-3 py-1 rounded-full bg-black/80 border border-amber-400/50 text-amber-300 text-[11px] font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm">
                          <Eye className="w-3 h-3" />
                          Xem chi tiết hồ sơ
                        </span>
                      </div>
                    </div>

                    {/* Card Content with Long Bio Support */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 
                            onClick={() => setSelectedAdvisorForDetail(a)}
                            className="text-xl font-serif-luxury font-bold text-white group-hover:text-amber-300 transition cursor-pointer"
                          >
                            {a.name}
                          </h3>
                          <p className="text-xs font-medium text-emerald-400 mt-0.5">{a.title}</p>
                        </div>
                      </div>

                      {/* Bio with Multi-paragraph & Inline Expand / Collapse */}
                      <div className="text-xs text-stone-300 leading-relaxed font-light space-y-1">
                        <div className={`whitespace-pre-line transition-all duration-300 ${!isExpanded && isLongBio ? 'line-clamp-3' : ''}`}>
                          {a.bio}
                        </div>

                        {isLongBio && (
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={(e) => toggleCardExpand(a.id, e)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition py-0.5"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3" />
                                  <span>Thu gọn</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" />
                                  <span>Đọc thêm tiểu sử</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedAdvisorForDetail(a)}
                              className="text-[11px] text-stone-400 hover:text-amber-300 underline underline-offset-2 transition"
                            >
                              Xem toàn bộ hồ sơ
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-emerald-900/60 text-xs text-stone-300">
                        <div className="text-[11px] text-amber-300 font-semibold truncate">
                          ⭐ {a.awards}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          Kinh nghiệm: {a.experience} • Dự án: {a.specialty}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 space-y-2">
                    <div className="flex gap-2">
                      <a
                        href={`tel:${a.phone.replace(/[^0-9]/g, '')}`}
                        className="flex-1 py-2 rounded-lg border border-[#c59b27]/50 text-amber-200 text-xs font-semibold text-center hover:bg-[#c59b27]/20 transition flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Gọi Ngay</span>
                      </a>
                      <a
                        href={`https://zalo.me/${a.zalo || a.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center transition"
                        title="Zalo Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onNavigate('contact')}
                        className="flex-1 py-2 rounded-lg gold-btn text-xs text-center font-bold"
                      >
                        Đặt Lịch 1-1
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedAdvisorForDetail(a)}
                      className="w-full py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/40 text-stone-300 hover:text-amber-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>Xem Hồ Sơ & Triết Lý Tư Vấn Đầy Đủ</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Luxury Advisor Detail Modal */}
      <AdvisorDetailModal
        advisor={selectedAdvisorForDetail}
        onClose={() => setSelectedAdvisorForDetail(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};

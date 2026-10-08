import React from 'react';
import { X, Award, Clock, Sparkles, Phone, MessageSquare, ShieldCheck, Mail, Calendar, CheckCircle } from 'lucide-react';
import { Advisor, PageId } from '../types';

interface AdvisorDetailModalProps {
  advisor: Advisor | null;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

export const AdvisorDetailModal: React.FC<AdvisorDetailModalProps> = ({
  advisor,
  onClose,
  onNavigate,
}) => {
  if (!advisor) return null;

  const handleBookConsultation = () => {
    onClose();
    onNavigate('contact');
  };

  // Split bio by newlines if any, or paragraphs
  const bioParagraphs = advisor.bio
    ? advisor.bio.split('\n').filter((p) => p.trim().length > 0)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-br from-[#062920] via-[#08352b] to-[#02140f] border-2 border-[#e5c158]/70 shadow-[0_0_50px_rgba(229,193,88,0.25)] overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#02120d]/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Hồ Sơ Chuyên Viên Tư Vấn VIP • SI Property
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-emerald-900/50 transition"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[78vh] overflow-y-auto custom-scrollbar">
          {/* Top Profile Intro */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Portrait */}
            <div className="sm:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden bg-[#010e0a] border border-[#e5c158]/50 shadow-xl p-1 group">
                <img
                  src={advisor.image}
                  alt={advisor.name}
                  className="w-full h-full object-contain rounded-xl"
                />
                {advisor.isFeatured && (
                  <div className="absolute top-2 right-2 gold-btn text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow">
                    Tiêu Biểu
                  </div>
                )}
              </div>
            </div>

            {/* Core Info */}
            <div className="sm:col-span-7 space-y-3 text-left">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#dfa837] font-semibold block">
                  Cố Vấn Đầu Tư Chiến Lược CĐT HODECO
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
                  {advisor.name}
                </h2>
                <p className="text-sm font-semibold text-emerald-300 mt-0.5">
                  {advisor.title}
                </p>
              </div>

              {/* Badges / Metrics */}
              <div className="space-y-2 py-3 border-y border-emerald-900/60 text-xs text-stone-200">
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-300 font-semibold">Danh hiệu & Thành tích: </span>
                    <span className="text-stone-300">{advisor.awards}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-300 font-semibold">Kinh nghiệm thực chiến: </span>
                    <span className="text-stone-300">{advisor.experience}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-300 font-semibold">Dự án chuyên trách: </span>
                    <span className="text-stone-300">{advisor.specialty}</span>
                  </div>
                </div>

                {advisor.email && (
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-amber-300 font-semibold">Email: </span>
                      <a href={`mailto:${advisor.email}`} className="text-stone-300 hover:text-amber-200">
                        {advisor.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Quick Contact Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`tel:${advisor.phone.replace(/[^0-9]/g, '')}`}
                  className="gold-btn px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-950" />
                  <span>Gọi: {advisor.phone}</span>
                </a>

                <a
                  href={`https://zalo.me/${advisor.zalo || advisor.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Zalo Chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Full Biography Section */}
          <div className="space-y-3 pt-2 border-t border-emerald-900/60">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif-luxury font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Tiểu Sử & Triết Lý Nghề Nghiệp</span>
              </h3>
              <span className="text-[11px] text-stone-400 italic">
                Chuyên tâm • Chuyên nghiệp • Chuyên sâu
              </span>
            </div>

            <div className="rounded-2xl bg-[#02140f]/90 border border-emerald-950 p-5 text-stone-200 text-xs sm:text-sm leading-relaxed space-y-3.5 shadow-inner">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((para, index) => (
                  <p key={index} className="text-stone-300 font-light leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-stone-400 italic">
                  Chuyên viên đang cập nhật tiểu sử chi tiết.
                </p>
              )}
            </div>
          </div>

          {/* Value Commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#031d16] border border-emerald-900/40 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Thẩm Định Pháp Lý</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Kiểm soát pháp lý 3 tầng, chuẩn xác 100% hồ sơ dự án.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#031d16] border border-emerald-900/40 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Tối Ưu Dòng Tiền</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Phân tích kịch bản tài chính và khai thác dòng tiền sinh lời bền vững.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#031d16] border border-emerald-900/40 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Đồng Hành Dài Hạn</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Hỗ trợ thủ tục chuyển nhượng, vận hành và quản lý tài sản trọn vòng đời.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#02100c] border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-stone-400">
            Sẵn sàng tư vấn trực tiếp hoặc qua phòng họp online riêng biệt.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition"
            >
              Đóng
            </button>
            <button
              onClick={handleBookConsultation}
              className="gold-btn px-5 py-2 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-950" />
              <span>Đặt Lịch Tư Vấn 1-1</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

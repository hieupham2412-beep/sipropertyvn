import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Globe, Lock } from 'lucide-react';
import { PageId, GeneralSettings, Project } from '../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenProject: (id: string) => void;
  general?: GeneralSettings;
  projects?: Project[];
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProject, general, projects }) => {
  const brandName = general?.brandName || 'SI PROPERTY';
  const logoSrc = general?.logoUrl || '/logo-si-property.svg';
  const footerDesc = general?.footerDescription || 'Sàn Giao dịch Bất động sản Cao cấp - Thành viên chiến lược của CĐT HODECO. Tái định hình chuẩn mực môi giới với tư duy của nhà phát triển dự án.';
  const footerQuote = general?.footerQuote || '“Chuyên tâm - Chuyên nghiệp - Chuyên sâu”';
  const hodecoTitle = general?.footerHodecoTitle || 'Hợp Tác HODECO';
  const hodecoDesc = general?.footerHodecoDesc || 'Đồng hành chiến lược kiến tạo thịnh vượng cùng Công ty Cổ phần Phát triển Nhà Bà Rịa - Vũng Tàu.';
  const copyright = general?.footerCopyright || '© 2026 SI Property (siproperty.vn). Thành viên chiến lược CĐT HODECO.';
  const hotline = general?.hotline || '0938.889.688';

  const keyProjects = projects && projects.length > 0 ? projects.slice(0, 5) : [
    { id: 'the-light-city', name: 'The Light City Vũng Tàu' },
    { id: 'blanca', name: 'Blanca - Dinh Thự Biển' },
    { id: 'legacy-66', name: 'Legacy 66 Căn Hộ Chuyên Gia' },
    { id: 'the-collection-688', name: 'The Collection 688' },
    { id: 'green-skyline', name: 'Green Skyline Biểu Tượng Xanh' },
  ];

  return (
    <footer className="bg-[#02100c] border-t border-[#c59b27]/30 pt-16 pb-12 text-stone-300 relative overflow-hidden mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 flex items-center justify-center">
                <img 
                  src={logoSrc} 
                  alt={brandName} 
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(229,175,37,0.3)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo-si-property-icon.svg';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-cinzel font-bold text-amber-300 tracking-wider leading-tight">{brandName}</span>
                <span className="text-[10px] text-stone-400 font-sans tracking-wide">Chuyên tâm • Chuyên nghiệp • Chuyên sâu</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              {footerDesc}
            </p>
            <div className="text-xs text-[#dfa837] font-serif-luxury italic">
              {footerQuote}
            </div>
          </div>

          {/* Col 2: Key Projects */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300 mb-4 border-b border-stone-800 pb-2">
              Dự Án Trọng Điểm
            </h4>
            <ul className="space-y-2 text-xs">
              {keyProjects.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => { onNavigate('projects'); onOpenProject(p.id); }}
                    className="text-stone-400 hover:text-amber-200 transition text-left"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Strategic Partnership */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300 mb-4 border-b border-stone-800 pb-2">
              {hodecoTitle}
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              {hodecoDesc}
            </p>
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-[#c59b27]/40 text-xs">
              <div className="font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Bảo Chứng Pháp Lý Toàn Diện</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                100% dự án có quy hoạch 1/500, giấy phép xây dựng và cam kết lộ trình sổ đỏ minh bạch.
              </p>
            </div>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300 mb-4 border-b border-stone-800 pb-2">
              Thông Tin Trụ Sở
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>TP. Hồ Chí Minh & TP. Vũng Tàu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{hotline} / 1900 6886</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@siproperty.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>siproperty.vn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>{copyright}</p>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <button onClick={() => onNavigate('news')} className="hover:text-amber-400 transition">
              Tin tức Báo chí
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('advisors')} className="hover:text-amber-400 transition">
              Đội ngũ Cố vấn
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#c59b27]/40 bg-emerald-950/70 text-amber-300 hover:text-white hover:border-[#c59b27] transition font-semibold"
              title="Cổng Quản Trị Hệ Thống (CMS)"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Quản trị CMS</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { X, Check, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onContactProject: (projectName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onContactProject,
}) => {
  if (!project) return null;

  const handleOpenLanding = () => {
    if (project.landingUrl) {
      if (project.landingUrl.startsWith('http://') || project.landingUrl.startsWith('https://')) {
        window.open(project.landingUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = project.landingUrl;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#062920] to-[#02130e] border-2 border-[#c59b27] shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-stone-300 hover:text-white transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062920] via-transparent to-black/40" />
          <div className="absolute bottom-4 left-4">
            <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold bg-black/70 px-3 py-1 rounded">
              {project.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
              {project.name}
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-amber-300 font-semibold uppercase">
            Chủ đầu tư / Đối tác: {project.developer}
          </div>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-[#c59b27]/30">
            <span className="text-stone-400 block text-[10px] uppercase">Quy mô</span>
            <span className="font-bold text-white">{project.scale}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-[#c59b27]/30">
            <span className="text-stone-400 block text-[10px] uppercase">Loại hình</span>
            <span className="font-bold text-white">{project.type}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-[#c59b27]/30">
            <span className="text-stone-400 block text-[10px] uppercase">Giá tham chiếu</span>
            <span className="font-bold text-amber-300">{project.price}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-[#c59b27]/30">
            <span className="text-stone-400 block text-[10px] uppercase">Trạng thái</span>
            <span className="font-bold text-emerald-400">{project.status}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300 mb-2">
            Đặc quyền tiện ích nổi bật
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.features.map((f, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-stone-200 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>{f}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-900/80">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-stone-600 text-stone-300 text-xs font-semibold hover:text-white transition"
          >
            Đóng
          </button>
          {project.landingUrl && (
            <button
              onClick={handleOpenLanding}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-[#c59b27] text-amber-300 hover:text-amber-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Khám Phá Landing Page Dự Án</span>
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              onContactProject(project.name);
            }}
            className="flex-1 py-3 rounded-xl gold-btn text-xs uppercase tracking-wider font-bold shadow-lg"
          >
            Nhận Bảng Giá & Đặt Tour VIP
          </button>
        </div>
      </div>
    </div>
  );
};

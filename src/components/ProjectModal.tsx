import React, { useState, useEffect } from 'react';
import { X, Upload, Building2, Plus, Trash2, Loader2 } from 'lucide-react';
import { Project } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface ProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    tagline: '',
    developer: 'HODECO & SI Property',
    location: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
    type: 'Biệt thự, Shophouse, Nhà phố',
    price: 'Từ 5 - 15 Tỷ/căn',
    scale: '10 ha | 200 căn',
    status: 'Đang mở bán',
    badge: 'Dự Án Độc Quyền',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    description: '',
    features: ['Sổ đỏ từng nền', 'Hạ tầng đồng bộ', 'Tiện ích 5 sao'],
    landingUrl: '',
    actionType: 'modal',
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        name: '',
        tagline: '',
        developer: 'HODECO & SI Property',
        location: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
        type: 'Biệt thự, Shophouse, Nhà phố',
        price: 'Từ 5 - 15 Tỷ/căn',
        scale: '10 ha | 200 căn',
        status: 'Đang mở bán',
        badge: 'Dự Án Độc Quyền',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        description: '',
        features: ['Sổ đỏ từng nền', 'Hạ tầng đồng bộ', 'Tiện ích 5 sao'],
        landingUrl: '',
        actionType: 'modal',
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const compressed = await compressImage(file, 1200, 800, 0.82);
        setFormData((prev) => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error('Lỗi khi nén ảnh dự án:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()],
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const finalProject: Project = {
      id: project ? project.id : 'proj-' + Date.now(),
      name: formData.name || '',
      tagline: formData.tagline || '',
      developer: formData.developer || 'HODECO & SI Property',
      location: formData.location || '',
      type: formData.type || 'Biệt thự cao cấp',
      price: formData.price || 'Liên hệ',
      scale: formData.scale || '',
      status: formData.status || 'Đang mở bán',
      badge: formData.badge || 'Dự Án Nổi Bật',
      image: formData.image || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      description: formData.description || '',
      features: formData.features && formData.features.length > 0 ? formData.features : ['Pháp lý hoàn chỉnh', 'Vị trí đắc địa'],
      order: project?.order,
      landingUrl: formData.landingUrl?.trim() || '',
      actionType: formData.actionType || 'modal',
    };

    onSave(finalProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#06241c] border border-[#c59b27]/60 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-emerald-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-[#c59b27]/40 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-white">
                {project ? 'Chỉnh Sửa Thông Tin Dự Án' : 'Thêm Dự Án Mới Vào Giỏ Hàng'}
              </h3>
              <p className="text-xs text-stone-400">
                Thông tin dự án sẽ hiển thị tại Trang Chủ và trang Danh Mục Dự Án
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-emerald-950 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Tên dự án (*)</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: The Light City Vũng Tàu"
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Huy hiệu hiển thị (Badge)</label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Ví dụ: Dự Án Tiêu Điểm HODECO"
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-medium mb-1">Khẩu hiệu / Tagline dự án</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Ví dụ: Khu Đô Thị Kiểu Mẫu Ven Biển Vũng Tàu"
              className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Chủ đầu tư / Đối tác</label>
              <input
                type="text"
                value={formData.developer || ''}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                placeholder="Ví dụ: HODECO"
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Mức giá tham chiếu</label>
              <input
                type="text"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ví dụ: Từ 4.5 - 18 Tỷ/căn"
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Tình trạng giỏ hàng</label>
              <input
                type="text"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="Ví dụ: Đang mở bán quỹ căn độc quyền"
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Vị trí địa lý</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ví dụ: Phường 12, TP. Vũng Tàu"
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Quy mô & Số lượng</label>
              <input
                type="text"
                value={formData.scale || ''}
                onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                placeholder="Ví dụ: 27.2 ha | 490 căn"
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-medium mb-1">Loại hình sản phẩm</label>
            <input
              type="text"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Ví dụ: Biệt thự, Shophouse, Nhà phố liên kế"
              className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          {/* Image URL & Upload */}
          <div className="space-y-2">
            <label className="block text-stone-300 font-medium">Hình ảnh đại diện dự án</label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={formData.image || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'}
                alt="Preview"
                className="w-32 h-20 rounded-xl object-cover border border-[#c59b27]"
              />
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Dán link ảnh (Unsplash, CDN hoặc URL trực tiếp)"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
                <div className="flex items-center gap-3">
                  <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition border ${
                    isCompressing
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed border-stone-700'
                      : 'bg-emerald-950 hover:bg-[#c59b27] hover:text-stone-950 text-amber-300 cursor-pointer border-[#c59b27]/40'
                  }`}>
                    {isCompressing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isCompressing ? 'Đang nén & tối ưu ảnh...' : 'Hoặc Tải Ảnh Lên Từ Máy Tính'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressing}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {isCompressing && <span className="text-[10px] text-amber-300 animate-pulse">Tự động nén siêu nhẹ cho web...</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-stone-300 font-medium mb-1">Mô tả dự án</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Giới thiệu điểm nhấn kiến trúc, tiện ích và tiềm năng sinh lời..."
              className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          {/* Features list */}
          <div>
            <label className="block text-stone-300 font-medium mb-1">Điểm nổi bật / Tiện ích đặc quyền</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Thêm tiện ích (vd: Hồ bơi vô cực, Sổ đỏ từng nền...)"
                className="flex-1 bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-lg bg-emerald-950 border border-[#c59b27] text-amber-300 hover:bg-[#c59b27] hover:text-stone-950 transition flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.features || []).map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-stone-300 text-[11px]"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-stone-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Landing Page Options */}
          <div className="p-4 rounded-2xl bg-[#010e0a] border border-[#c59b27]/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-amber-300 font-semibold text-sm flex items-center gap-2">
                <span>🌐 Tùy Chọn Điều Hướng Khi Bấm Xem Dự Án</span>
              </label>
              <span className="text-[11px] text-stone-400">Modal chi tiết hoặc Landing Page riêng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                formData.actionType !== 'landing'
                  ? 'bg-emerald-950/80 border-[#c59b27] text-white'
                  : 'bg-black/40 border-stone-800 text-stone-400 hover:border-stone-700'
              }`}>
                <input
                  type="radio"
                  name="actionType"
                  value="modal"
                  checked={formData.actionType !== 'landing'}
                  onChange={() => setFormData({ ...formData, actionType: 'modal' })}
                  className="accent-[#c59b27]"
                />
                <div>
                  <div className="text-xs font-bold text-amber-200">Mở Bảng Chi Tiết (Mặc định)</div>
                  <div className="text-[11px] text-stone-400">Hiển thị Popup chi tiết dự án như hiện tại</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                formData.actionType === 'landing'
                  ? 'bg-emerald-950/80 border-[#c59b27] text-white'
                  : 'bg-black/40 border-stone-800 text-stone-400 hover:border-stone-700'
              }`}>
                <input
                  type="radio"
                  name="actionType"
                  value="landing"
                  checked={formData.actionType === 'landing'}
                  onChange={() => setFormData({ ...formData, actionType: 'landing' })}
                  className="accent-[#c59b27]"
                />
                <div>
                  <div className="text-xs font-bold text-amber-200">Chuyển Sang Landing Page</div>
                  <div className="text-[11px] text-stone-400">Chuyển hướng đến link Landing Page riêng</div>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs text-stone-300 font-medium mb-1">
                Đường dẫn Landing Page (URL) {formData.actionType === 'landing' ? <span className="text-amber-400 font-bold">(*)</span> : <span className="text-stone-500">(Tùy chọn)</span>}
              </label>
              <input
                type="text"
                value={formData.landingUrl || ''}
                onChange={(e) => setFormData({ ...formData, landingUrl: e.target.value })}
                placeholder="Ví dụ: https://thelightcity.vn hoặc /landing-page/..."
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                * Nếu chọn "Mở Bảng Chi Tiết", khách vẫn có thể bấm nút "Xem Landing Page" nằm bên trong Popup nếu có nhập link ở đây.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-900">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="gold-btn px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-lg"
            >
              {project ? 'Cập Nhật Dự Án' : 'Lưu Dự Án Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

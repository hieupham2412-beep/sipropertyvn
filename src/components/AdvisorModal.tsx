import React, { useState, useEffect } from 'react';
import { X, Upload, Award, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Advisor } from '../types';
import { generateHodecoAdvisorCanvas } from '../data/initialData';
import { compressImage, PRESET_AVATARS } from '../utils/imageCompressor';

interface AdvisorModalProps {
  isOpen: boolean;
  advisor: Advisor | null;
  onClose: () => void;
  onSave: (advisor: Advisor) => void;
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({
  isOpen,
  advisor,
  onClose,
  onSave,
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [formData, setFormData] = useState<Partial<Advisor>>({
    name: '',
    title: 'Chuyên Viên Tư Vấn BĐS Cao Cấp',
    phone: '0938 889 688',
    zalo: '0938889688',
    experience: '5 năm',
    email: 'tuvan@siproperty.vn',
    specialty: 'The Light City, Blanca',
    awards: 'Chiến Binh Xuất Sắc SI Property',
    image: '',
    bio: 'Chuyên gia hoạch định dòng tiền và danh mục đầu tư bất động sản cao cấp.',
    isFeatured: false,
    order: 1,
  });

  useEffect(() => {
    if (advisor) {
      setFormData(advisor);
    } else {
      setFormData({
        name: '',
        title: 'Chuyên Viên Tư Vấn BĐS Cao Cấp',
        phone: '0938 889 688',
        zalo: '0938889688',
        experience: '5 năm',
        email: 'tuvan@siproperty.vn',
        specialty: 'The Light City, Blanca',
        awards: 'Chiến Binh Xuất Sắc SI Property',
        image: PRESET_AVATARS[0].url,
        bio: 'Chuyên gia hoạch định dòng tiền và danh mục đầu tư bất động sản cao cấp.',
        isFeatured: false,
        order: 1,
      });
    }
  }, [advisor, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        // Automatically resize and optimize to web-friendly JPEG (~30-50KB)
        const compressed = await compressImage(file, 500, 500, 0.82);
        setFormData((prev) => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error('Lỗi khi nén ảnh đại diện:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSetHodecoAvatar = () => {
    const canvasImg = generateHodecoAdvisorCanvas();
    setFormData((prev) => ({ ...prev, image: canvasImg }));
  };

  const handleSelectPreset = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const finalAdvisor: Advisor = {
      id: formData.id || `adv-${Date.now()}`,
      name: formData.name.trim(),
      title: formData.title?.trim() || 'Chuyên Viên Tư Vấn BĐS',
      phone: formData.phone.trim(),
      zalo: formData.zalo?.trim() || formData.phone.trim(),
      experience: formData.experience?.trim() || '5 năm',
      email: formData.email?.trim() || 'tuvan@siproperty.vn',
      specialty: formData.specialty?.trim() || 'The Light City, Blanca',
      awards: formData.awards?.trim() || 'Thành Viên Chiến Lược',
      image: formData.image || generateHodecoAdvisorCanvas(),
      bio: formData.bio?.trim() || '',
      isFeatured: !!formData.isFeatured,
      order: formData.order !== undefined && formData.order !== null && !isNaN(Number(formData.order)) ? Number(formData.order) : 1,
    };

    onSave(finalAdvisor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#062920] to-[#02140f] border-2 border-[#c59b27] shadow-2xl p-6 sm:p-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-stone-300 hover:text-white"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-emerald-900/80 pb-3">
          <h3 className="text-xl font-serif-luxury font-bold text-white">
            {advisor ? 'Chỉnh Sửa Thông Tin Chuyên Viên' : 'Thêm Chuyên Viên Tư Vấn Mới'}
          </h3>
          <p className="text-xs text-stone-400">
            Cập nhật thông tin chuyên sâu, thành tích và dự án phụ trách
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Họ và Tên (*)</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Chức danh (*)</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Số điện thoại (*)</label>
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Số Zalo</label>
              <input
                type="text"
                value={formData.zalo || ''}
                onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Kinh nghiệm</label>
              <input
                type="text"
                value={formData.experience || ''}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Dự án phụ trách / Thế mạnh</label>
              <input
                type="text"
                placeholder="The Light City, Blanca, Legacy 66..."
                value={formData.specialty || ''}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 mb-1 font-medium">Danh hiệu / Thành tích</label>
            <input
              type="text"
              placeholder="Top 1 Đại sứ bán hàng HODECO..."
              value={formData.awards || ''}
              onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
              className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          {/* Avatar Selection */}
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-amber-300 font-semibold text-sm">Hình ảnh đại diện (Avatar)</label>
              {isCompressing && (
                <span className="text-xs text-amber-400 flex items-center gap-1.5 animate-pulse font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang nén & tối ưu ảnh...</span>
                </span>
              )}
            </div>

            <div className="flex items-start gap-4">
              <div className="relative group shrink-0">
                <div className="w-24 h-32 rounded-xl border-2 border-[#c59b27] shadow-lg bg-[#02130e] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src={formData.image || PRESET_AVATARS[0].url}
                    alt="Avatar"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 bg-[#c59b27] text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Ảnh đầy đủ
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isCompressing
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-emerald-900 hover:bg-[#c59b27] text-amber-200 hover:text-stone-950 border border-[#c59b27]/40'
                  }`}>
                    {isCompressing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isCompressing ? 'Đang xử lý ảnh...' : 'Tải ảnh từ máy / điện thoại'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressing}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSetHodecoAvatar}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-stone-300 text-xs hover:border-[#c59b27] hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Huy hiệu CĐT HODECO</span>
                  </button>
                </div>

                {/* Preset Avatars Library */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-stone-400 font-medium">Hoặc chọn nhanh ảnh mẫu doanh nhân chuẩn:</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = formData.image === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset.url)}
                          className={`relative rounded-lg overflow-hidden border-2 transition group ${
                            isSelected
                              ? 'border-[#c59b27] ring-2 ring-[#c59b27]/50 scale-105'
                              : 'border-stone-700 opacity-70 hover:opacity-100 hover:border-amber-400'
                          }`}
                          title={preset.name}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-10 object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#c59b27]/30 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white font-bold" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Hoặc dán trực tiếp đường link ảnh (https://...)"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#010e0a] border border-stone-700 rounded-lg px-3 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27] placeholder:text-stone-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-stone-300 font-medium">
                Tiểu sử / Quá trình công tác & Triết lý tư vấn
              </label>
              <div className="text-[11px] text-amber-300/90 font-mono">
                {formData.bio?.length || 0} ký tự • {formData.bio?.trim() ? formData.bio.trim().split(/\s+/).length : 0} từ
              </div>
            </div>
            <textarea
              rows={7}
              placeholder="Chuyên viên có thể viết bài dài nhiều đoạn (nhấn Enter để xuống dòng):&#10;• Quá trình gắn bó với thị trường BĐS & HODECO&#10;• Thế mạnh phân tích dòng tiền, thẩm định pháp lý dự án&#10;• Cột mốc giao dịch nổi bật và cam kết quyền lợi cho khách hàng VIP&#10;• Triết lý nghề nghiệp tâm đắc..."
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-3 text-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#c59b27] leading-relaxed resize-y min-h-[150px]"
            />
            <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-stone-400">
              <span className="text-amber-400 font-bold">💡 Gợi ý:</span>
              <span>
                Hệ thống hỗ trợ tiểu sử dài không giới hạn. Trên trang web sẽ tự động định dạng nhiều đoạn văn bản, hiển thị nút <strong className="text-amber-300">"Đọc thêm / Thu gọn"</strong> và mở <strong className="text-amber-300">"Hồ sơ chi tiết VIP"</strong> giúp giao diện luôn sang trọng, cân đối.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-stone-300 mb-1 font-medium text-xs">
                Thứ tự sắp xếp vị trí (1 = đầu tiên, 2, 3...)
              </label>
              <input
                type="number"
                min={1}
                max={999}
                value={formData.order ?? 1}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Số càng nhỏ sẽ được ưu tiên hiển thị trước trong danh sách.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:pt-6">
              <input
                type="checkbox"
                id="advisor-isfeatured-checkbox"
                checked={!!formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded bg-[#010e0a] border-stone-700 text-[#c59b27] focus:ring-0"
              />
              <label
                htmlFor="advisor-isfeatured-checkbox"
                className="text-amber-300 font-semibold cursor-pointer select-none text-xs"
              >
                ⭐ Đặt làm Chuyên Viên Tiêu Biểu (Hiện nổi bật banner riêng)
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 font-semibold hover:bg-stone-800 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl gold-btn uppercase tracking-wider"
            >
              Lưu Chuyên Viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

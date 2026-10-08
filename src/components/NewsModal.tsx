import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { NewsArticle } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface NewsModalProps {
  isOpen: boolean;
  article: NewsArticle | null;
  onClose: () => void;
  onSave: (article: NewsArticle) => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  article,
  onClose,
  onSave,
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: '',
    category: 'Thị trường',
    author: 'SI Property Research',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 phút đọc',
    badge: 'Tin Mới',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    content: '',
    sourceUrl: '',
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({
        title: '',
        category: 'Thị trường',
        author: 'SI Property Research',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 phút đọc',
        badge: 'Tin Mới',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        summary: '',
        content: '',
        sourceUrl: '',
      });
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const compressed = await compressImage(file, 1200, 800, 0.82);
        setFormData((prev) => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error('Lỗi khi nén ảnh tin tức:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const finalNews: NewsArticle = {
      id: formData.id || `news-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category || 'Thị trường',
      author: formData.author?.trim() || 'SI Property',
      date: formData.date || new Date().toISOString().split('T')[0],
      readTime: formData.readTime || '5 phút đọc',
      badge: formData.badge || 'Tin Mới',
      image: formData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      summary: formData.summary?.trim() || '',
      content: formData.content.trim(),
      sourceUrl: formData.sourceUrl?.trim() || '',
    };

    onSave(finalNews);
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
            {article ? 'Chỉnh Sửa Bài Viết' : 'Soạn Thảo Bài Viết Mới'}
          </h3>
          <p className="text-xs text-stone-400">
            Xuất bản bài viết phân tích, báo cáo thị trường hoặc cập nhật dự án
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 mb-1 font-medium">Tiêu đề bài viết (*)</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Chuyên mục</label>
              <select
                value={formData.category || 'Thị trường'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              >
                <option value="Báo chí">Báo chí CafeLand</option>
                <option value="Dự án">Tin Dự Án</option>
                <option value="Thị trường">Thị Trường</option>
                <option value="Cẩm nang đầu tư">Cẩm Nang Đầu Tư</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Tác giả / Nguồn</label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
            <div>
              <label className="block text-stone-300 mb-1 font-medium">Ngày đăng</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-stone-300 font-medium text-sm">Hình Ảnh Bìa Bài Viết</label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={formData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                alt="Preview"
                className="w-32 h-20 rounded-xl object-cover border border-[#c59b27] bg-black"
              />
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Dán link ảnh https://... hoặc tải từ máy"
                  className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
                />
                <div className="flex items-center gap-3">
                  <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition border ${
                    isCompressing
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed border-stone-700'
                      : 'bg-emerald-950 hover:bg-[#c59b27] hover:text-stone-950 text-amber-300 cursor-pointer border-[#c59b27]/40'
                  }`}>
                    {isCompressing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isCompressing ? 'Đang nén & tối ưu ảnh...' : 'Tải Ảnh Bìa Từ Máy Tính'}</span>
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

          <div>
            <label className="block text-stone-300 mb-1 font-medium">Tóm tắt ngắn (Lead)</label>
            <textarea
              rows={2}
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div>
            <label className="block text-stone-300 mb-1 font-medium">Nội dung chi tiết bài viết (*)</label>
            <textarea
              rows={6}
              required
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div>
            <label className="block text-stone-300 mb-1 font-medium">Liên kết nguồn bài viết (nếu có)</label>
            <input
              type="url"
              placeholder="https://cafeland.vn/..."
              value={formData.sourceUrl || ''}
              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
              className="w-full bg-[#010e0a] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
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
              Xuất Bản Bài Viết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

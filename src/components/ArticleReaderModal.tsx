import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onContactArticle: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  onContactArticle,
}) => {
  if (!article) return null;

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

        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062920] via-transparent to-black/30" />
          <span className="absolute top-4 left-4 bg-[#062920]/90 border border-[#c59b27]/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
            {article.category}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs text-stone-400 border-b border-emerald-900/80 pb-3">
            <span>
              Tác giả / Nguồn: <strong className="text-amber-200">{article.author}</strong>
            </span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span className="text-amber-300">{article.readTime}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white leading-snug">
            {article.title}
          </h1>

          {article.summary && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border-l-4 border-[#c59b27] text-xs sm:text-sm text-stone-200 italic font-light leading-relaxed">
              {article.summary}
            </div>
          )}

          <div className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light space-y-4 whitespace-pre-line">
            {article.content}
          </div>

          {article.sourceUrl && (
            <div className="pt-2">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-amber-300 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem liên kết bài báo gốc CafeLand.vn</span>
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-900/80">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-stone-600 text-stone-300 text-xs font-semibold hover:text-white transition"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              onContactArticle();
            }}
            className="flex-1 py-2.5 rounded-xl gold-btn text-xs uppercase tracking-wider"
          >
            Liên Hệ Tư Vấn Dự Án Này
          </button>
        </div>
      </div>
    </div>
  );
};

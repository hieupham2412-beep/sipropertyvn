import React, { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { NewsArticle, PageHeadersSettings } from '../types';

interface NewsPageProps {
  news: NewsArticle[];
  onOpenArticle: (id: string) => void;
  pageHeaders?: PageHeadersSettings;
}

export const NewsPage: React.FC<NewsPageProps> = ({ news, onOpenArticle, pageHeaders }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const badge = pageHeaders?.newsBadge || 'Insights & Báo Chí • siproperty.vn';
  const title = pageHeaders?.newsTitle || 'TIN TỨC & PHÂN TÍCH THỊ TRƯỜNG BĐS';
  const subtitle = pageHeaders?.newsSubtitle || 'Cập nhật thông tin quy hoạch, góc nhìn báo chí CafeLand, tiến độ dự án The Light City, Blanca, Legacy 66 và những cẩm nang pháp lý chuẩn xác.';

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'Báo chí', label: 'Báo chí CafeLand' },
    { id: 'Dự án', label: 'Tin Dự Án' },
    { id: 'Thị trường', label: 'Thị Trường' },
    { id: 'Cẩm nang đầu tư', label: 'Cẩm Nang Pháp Lý' },
  ];

  const sortedNews = [...news].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const filteredNews = sortedNews.filter((n) => {
    const matchCat = currentCategory === 'all' || n.category === currentCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      query === '' ||
      n.title.toLowerCase().includes(query) ||
      n.summary.toLowerCase().includes(query) ||
      n.author.toLowerCase().includes(query);
    return matchCat && matchSearch;
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
      </div>

      {/* Search & Category Filter Bar */}
      <div className="p-4 rounded-2xl glass-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                currentCategory === cat.id
                  ? 'gold-btn'
                  : 'glass-card text-stone-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, dự án..."
            className="w-full bg-[#02140f] border border-stone-700 rounded-full pl-9 pr-4 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#c59b27]"
          />
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm">
          Không tìm thấy bài viết nào phù hợp với từ khóa &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((n) => (
            <div
              key={n.id}
              onClick={() => onOpenArticle(n.id)}
              className="rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between group shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062920] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 bg-[#062920]/90 border border-[#c59b27]/60 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {n.category}
                  </span>
                  <span className="absolute bottom-3 right-3 text-[11px] text-stone-300 bg-black/70 px-2 py-0.5 rounded">
                    {n.readTime}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[11px] text-stone-400 flex items-center justify-between">
                    <span>{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed font-light">
                    {n.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs text-[#dfa837] font-semibold border-t border-emerald-900/60 pt-4 mt-2">
                <span>Xem chi tiết phân tích</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

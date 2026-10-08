import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Property } from '../types';

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'The Metropole Thủ Thiêm - Phân khu The Opera',
    location: 'Khu đô thị mới Thủ Thiêm, TP. Thủ Đức, TP.HCM',
    price: '18.5 Tỷ',
    area: '115 m²',
    bedrooms: 3,
    bathrooms: 2,
    type: 'apartment',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    isHot: true
  },
  {
    id: 'p2',
    title: 'Biệt Thự Đơn Lập The Rivus Elie Saab',
    location: 'Đỗ Xuân Hợp, Phước Long B, TP. Thủ Đức',
    price: '95 Tỷ',
    area: '480 m²',
    bedrooms: 5,
    bathrooms: 6,
    type: 'villa',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    isHot: true
  },
  {
    id: 'p3',
    title: 'Căn Hộ Masteri Centre Point Vinhomes Grand Park',
    location: 'Đường Nguyễn Xiển, Long Thạnh Mỹ, TP. Thủ Đức',
    price: '3.8 Tỷ',
    area: '72 m²',
    bedrooms: 2,
    bathrooms: 2,
    type: 'apartment',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p4',
    title: 'Shophouse Thương Mại Global City',
    location: 'Đỗ Xuân Hợp, An Phú, Quận 2, TP.HCM',
    price: '38 Tỷ',
    area: '133 m²',
    bedrooms: 4,
    bathrooms: 5,
    type: 'townhouse',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  }
];

export const PropertyLandingPreview: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', note: '' });

  const filteredProperties = INITIAL_PROPERTIES.filter(p => {
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', phone: '', note: '' });
    }, 4000);
  };

  return (
    <div id="property-landing-component" className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Top Navbar */}
      <header id="site-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900 text-amber-400 flex items-center justify-center font-black text-xl shadow-md">
              SI
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                SI PROPERTY
              </div>
              <div className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
                siproperty.vn
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#projects" className="hover:text-indigo-600 transition-colors">Dự Án Nổi Bật</a>
            <a href="#types" className="hover:text-indigo-600 transition-colors">Phân Khúc</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">Về SI Property</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Liên Hệ Tư Vấn</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:0901234567"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Hotline: 090 123 4567</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section id="hero-search-section" className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
            Đại Lý Phân Phối Chiến Lược Bất Động Sản Cao Cấp
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Khám Phá Tổ Ấm & Cơ Hội Đầu Tư Cùng <span className="text-amber-400">SI Property</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Hệ thống dữ liệu dự án căn hộ, biệt thự, nhà phố thương mại vị trí vàng tại TP. Hồ Chí Minh và các vùng kinh tế trọng điểm.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-800 max-w-4xl mx-auto border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="property-search-input"
                  type="text"
                  placeholder="Nhập tên dự án, đường, hoặc khu vực (Thủ Thiêm, Quận 7...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  id="property-type-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tất cả loại hình</option>
                  <option value="apartment">Căn hộ cao cấp</option>
                  <option value="villa">Biệt thự ven sông / đơn lập</option>
                  <option value="townhouse">Nhà phố / Shophouse</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  id="property-filter-submit-btn"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  Tìm Kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Dự Án Đang Mở Bán
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Tuyển chọn các sản phẩm pháp lý minh bạch, chủ đầu tư uy tín hàng đầu
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-0 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'apartment', label: 'Căn hộ' },
              { id: 'villa', label: 'Biệt thự' },
              { id: 'townhouse', label: 'Nhà phố' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedType === tab.id
                    ? 'bg-indigo-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <div
              key={property.id}
              id={`property-card-${property.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.isHot && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      NỔI BẬT
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-amber-400 font-extrabold text-sm px-2.5 py-1 rounded-lg">
                    {property.price}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{property.location}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{property.bedrooms} PN</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{property.bathrooms} WC</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{property.area}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl transition-colors"
                >
                  <span>Nhận Bảng Giá Chi Tiết</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose SI Property */}
      <section id="about" className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Vì Sao Chọn SI Property (siproperty.vn)?
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Chúng tôi đồng hành cùng khách hàng trong từng giao dịch với chuẩn mực chuyên nghiệp cao nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Pháp Lý Minh Bạch 100%</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Kiểm định kỹ lưỡng quy hoạch, giấy phép xây dựng và tiến độ thi công của từng dự án trước khi phân phối.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Giỏ Hàng Độc Quyền</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Ưu tiên tiếp cận quỹ căn đẹp, căn góc, view sông và chính sách chiết khấu tốt nhất từ chủ đầu tư.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Đội Ngũ Chuyên Viên 24/7</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Tư vấn tài chính ngân hàng, hỗ trợ thủ tục sang tên công chứng trọn gói nhanh chóng, an tâm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Đăng Ký Tư Vấn & Nhận Thông Tin</h2>
              <p className="text-indigo-200 text-xs sm:text-sm">
                Để lại thông tin để chuyên viên SI Property liên hệ gửi bảng giá và sơ đồ mặt bằng chi tiết trong 15 phút.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-200 p-4 rounded-xl text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">Cảm ơn bạn! Chuyên viên SI Property sẽ liên hệ sớm nhất.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg mx-auto">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên của bạn *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-900/60 border border-indigo-700/60 text-white placeholder-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại Zalo / Di động *"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-900/60 border border-indigo-700/60 text-white placeholder-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    placeholder="Nhu cầu quan tâm (VD: Căn hộ 2PN Thủ Thiêm tầm 5-7 tỷ...)"
                    value={contactForm.note}
                    onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-900/60 border border-indigo-700/60 text-white placeholder-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg active:scale-95"
                >
                  GỬI YÊU CẦU TƯ VẤN NGAY
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-800 text-amber-400 flex items-center justify-center font-black text-base">
              SI
            </div>
            <div>
              <div className="font-bold text-white text-sm">SI PROPERTY VIETNAM</div>
              <div>Cổng thông tin & phân phối dự án BĐS siproperty.vn</div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div>Hotline: 090 123 4567 • Email: contact@siproperty.vn</div>
            <div className="text-slate-500 mt-1">© {new Date().getFullYear()} SI Property. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

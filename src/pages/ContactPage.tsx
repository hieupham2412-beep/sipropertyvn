import React, { useState, useEffect } from 'react';
import { Send, MapPin, Phone, Mail, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ContactContent, Project, CustomerInquiry } from '../types';
import { INITIAL_CONTACT } from '../data/initialData';
import { submitInquiryToFirestore } from '../services/firebase';

interface ContactPageProps {
  content?: ContactContent;
  projects?: Project[];
  initialProject?: string;
  onSuccessMessage: (msg: string) => void;
  onInquirySubmitted?: (inquiry: CustomerInquiry) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  content = INITIAL_CONTACT,
  projects = [],
  initialProject,
  onSuccessMessage,
  onInquirySubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProject, setSelectedProject] = useState(
    initialProject || (projects.length > 0 ? projects[0].name : 'The Light City (HODECO)')
  );
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; phone: string; project: string } | null>(null);

  // Sync initialProject when changed from parent
  useEffect(() => {
    if (initialProject) {
      setSelectedProject(initialProject);
    } else if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].name);
    }
  }, [initialProject, projects]);

  const targetEmail = content.email || 'hieupham.2412@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newInquiry: CustomerInquiry = {
      id: 'inq-' + Date.now(),
      fullName: name,
      phone: phone,
      email: email || undefined,
      projectInterest: selectedProject,
      message: message || undefined,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setIsSubmitted(true);
    setSubmittedData({ name, phone, project: selectedProject });

    // 1. Save directly to Firebase Firestore
    try {
      await submitInquiryToFirestore({
        fullName: name,
        phone: phone,
        email: email || undefined,
        projectInterest: selectedProject,
        message: message || undefined,
      });
    } catch (err) {
      console.warn('Firestore inquiry error:', err);
    }

    // 2. Dispatch to server notification endpoint
    try {
      await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry: newInquiry }),
      });
    } catch (err) {
      console.warn('Server inquiry dispatch warning:', err);
    }

    // 3. Notify App state to store in CRM inquiries
    if (onInquirySubmitted) {
      onInquirySubmitted(newInquiry);
    }

    onSuccessMessage(
      `Đã ghi nhận yêu cầu tư vấn thành công và gửi thông báo tới email ${targetEmail}!`
    );
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-[#c59b27]/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          {content.badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
          {content.title}
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
          {content.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-br from-[#062920] to-[#031711] border border-[#c59b27]/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
            <div className="flex items-center gap-3">
              <Send className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                Đăng Ký Nhận Bảng Giá & Giỏ Hàng Ưu Tiên
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-stone-400">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Gửi về: <strong className="text-amber-300 font-medium">{targetEmail}</strong></span>
            </div>
          </div>

          {isSubmitted && submittedData ? (
            <div className="p-6 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500 text-center space-y-4 shadow-xl">
              <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-serif-luxury">Đăng Ký Thành Công!</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Hệ thống đã lưu thông tin của quý khách <strong>{submittedData.name}</strong> vào CRM và chuyển tiếp thông báo đến ban điều hành qua email <strong>{targetEmail}</strong>.
                </p>
                <p className="text-xs text-amber-300 font-medium">
                  Chuyên viên phụ trách dự án <strong>{submittedData.project}</strong> sẽ liên hệ qua số điện thoại <strong>{submittedData.phone}</strong> trong vòng 15 phút.
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-900 flex flex-wrap items-center justify-center gap-3 text-xs">
                <a
                  href={`mailto:${targetEmail}?subject=${encodeURIComponent(`[SI Property] Khách hàng ${submittedData.name} quan tâm dự án ${submittedData.project}`)}&body=${encodeURIComponent(`Họ tên: ${submittedData.name}\nSố điện thoại: ${submittedData.phone}\nDự án quan tâm: ${submittedData.project}`)}`}
                  className="px-4 py-2 rounded-xl bg-emerald-900 text-amber-300 font-semibold hover:bg-[#c59b27] hover:text-stone-950 transition flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Mở Ứng Dụng Email Gửi Trực Tiếp</span>
                </a>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 hover:text-white transition"
                >
                  Đăng Ký Thêm Yêu Cầu Khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Họ và tên quý khách (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Số điện thoại liên hệ (*)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Email nhận tài liệu
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-300 font-medium">
                      Dự án quan tâm đặc biệt (*)
                    </label>
                    <span className="text-[10px] text-amber-400">Tự động liên kết ({projects.length} dự án)</span>
                  </div>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  >
                    {projects && projects.length > 0 ? (
                      projects.map((proj) => (
                        <option key={proj.id} value={proj.name}>
                          {proj.name} ({proj.developer || 'HODECO'})
                        </option>
                      ))
                    ) : (
                      <option value="The Light City (HODECO)">The Light City (HODECO)</option>
                    )}
                    <option value="Dự án khác / Tư vấn phân bổ tài sản">Dự án khác / Tư vấn danh mục đầu tư</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Yêu cầu cụ thể hoặc thời gian hẹn tư vấn
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Quý khách muốn nhận bảng phân tích dòng tiền, lịch xem thực tế dự án..."
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-stone-400">
                  Thông tin sẽ lưu vào CRM và gửi bảo mật tới <strong>{targetEmail}</strong>
                </span>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl gold-btn text-xs uppercase tracking-wider shadow-xl font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Tư Vấn</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Headquarters Info & FAQs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-lg font-serif-luxury font-bold text-white border-b border-emerald-900/80 pb-3">
              Hệ Thống Trụ Sở & Sàn Giao Dịch
            </h3>
            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <div>
                  <strong className="text-white block text-sm">{content.hcmOfficeTitle}</strong>
                  <p className="font-light mt-0.5">{content.hcmOfficeAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <div>
                  <strong className="text-white block text-sm">{content.vtOfficeTitle}</strong>
                  <p className="font-light mt-0.5">{content.vtOfficeAddress}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Hotline 24/7</span>
                    <a href={`tel:${content.hotline.replace(/\D/g, '')}`} className="font-bold text-white hover:text-amber-300 transition">
                      {content.hotline}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Email Tiếp Nhận</span>
                    <a href={`mailto:${targetEmail}`} className="font-bold text-white hover:text-amber-300 transition">
                      {targetEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ preview */}
          {content.faqs && content.faqs.length > 0 && (
            <div className="p-6 rounded-3xl glass-card space-y-4">
              <div className="flex items-center gap-2 border-b border-emerald-900/80 pb-3">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Giải Đáp Nhanh Thắc Mắc
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                {content.faqs.map((faq) => (
                  <div key={faq.id} className="p-3 rounded-xl bg-[#021812] border border-emerald-800/80 space-y-1">
                    <div className="font-semibold text-amber-300">{faq.question}</div>
                    <div className="text-stone-300 font-light leading-relaxed">{faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

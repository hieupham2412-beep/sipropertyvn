import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Settings, 
  Download, 
  Upload, 
  Users, 
  Newspaper, 
  Building2, 
  Briefcase, 
  PhoneCall, 
  Info, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Globe, 
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Code2,
  Image as ImageIcon,
  Check,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Copy,
  UserCheck
} from 'lucide-react';
import { 
  SiteData, 
  Project, 
  Advisor, 
  NewsArticle, 
  AboutContent, 
  CareersContent, 
  ContactContent, 
  JobPosition, 
  ContactFAQ,
  GeneralSettings,
  PageHeadersSettings,
  CustomerInquiry
} from '../types';
import { INITIAL_GENERAL, INITIAL_PAGE_HEADERS } from '../data/initialData';
import { HtmlQuickTester } from '../components/HtmlQuickTester';
import { SourceGuide } from '../components/SourceGuide';
import { CrmLeadsManager } from '../components/CrmLeadsManager';

interface AdminCMSPageProps {
  siteData: SiteData;
  onUpdateGeneral?: (general: GeneralSettings) => void;
  onUpdatePageHeaders?: (headers: PageHeadersSettings) => void;
  onUpdateAbout: (about: AboutContent) => void;
  onOpenProjectModal: (project?: Project) => void;
  onDeleteProject: (id: string) => void;
  onMoveProject?: (index: number, direction: 'up' | 'down') => void;
  onSetProjectOrder?: (id: string, newOrder: number) => void;
  onSortProjectsByOrder?: () => void;
  onOpenAdvisorModal: (advisor?: Advisor) => void;
  onDeleteAdvisor: (id: string) => void;
  onToggleFeaturedAdvisor: (id: string) => void;
  onMoveAdvisor?: (index: number, direction: 'up' | 'down') => void;
  onSetAdvisorOrder?: (id: string, newOrder: number) => void;
  onSortAdvisorsByOrder?: () => void;
  onOpenNewsModal: (article?: NewsArticle) => void;
  onDeleteNews: (id: string) => void;
  onMoveNews?: (index: number, direction: 'up' | 'down') => void;
  onSetNewsOrder?: (id: string, newOrder: number) => void;
  onSortNewsByOrder?: () => void;
  onUpdateCareers: (careers: CareersContent) => void;
  onMoveJob?: (index: number, direction: 'up' | 'down') => void;
  onSetJobOrder?: (id: string, newOrder: number) => void;
  onSortJobsByOrder?: () => void;
  onUpdateContact: (contact: ContactContent) => void;
  onUpdateInquiries?: (inquiries: CustomerInquiry[]) => void;
  onSaveAndPublish: () => void;
  onExportBackup: () => void;
  onImportBackup: (data: SiteData) => void;
  onResetFactory: () => void;
  showToast: (msg: string) => void;
  isSaving?: boolean;
}

const STORAGE_KEY_PIN = 'si_property_admin_pin_v2';

export const AdminCMSPage: React.FC<AdminCMSPageProps> = ({
  siteData,
  onUpdateGeneral,
  onUpdatePageHeaders,
  onUpdateAbout,
  onOpenProjectModal,
  onDeleteProject,
  onMoveProject,
  onSetProjectOrder,
  onSortProjectsByOrder,
  onOpenAdvisorModal,
  onDeleteAdvisor,
  onToggleFeaturedAdvisor,
  onMoveAdvisor,
  onSetAdvisorOrder,
  onSortAdvisorsByOrder,
  onOpenNewsModal,
  onDeleteNews,
  onMoveNews,
  onSetNewsOrder,
  onSortNewsByOrder,
  onUpdateCareers,
  onMoveJob,
  onSetJobOrder,
  onSortJobsByOrder,
  onUpdateContact,
  onUpdateInquiries,
  onSaveAndPublish,
  onExportBackup,
  onImportBackup,
  onResetFactory,
  showToast,
  isSaving = false,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const [activeTab, setActiveTab] = useState<
    'guide' | 'crm' | 'general' | 'headers' | 'about' | 'projects' | 'advisors' | 'news' | 'careers' | 'contact' | 'html' | 'security'
  >('guide');

  // Change Password Modal
  const [changePinModalOpen, setChangePinModalOpen] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinError, setChangePinError] = useState<string | null>(null);

  // Local edit states for sub-forms
  const [generalForm, setGeneralForm] = useState<GeneralSettings>(siteData.general || INITIAL_GENERAL);
  const [pageHeadersForm, setPageHeadersForm] = useState<PageHeadersSettings>(siteData.pageHeaders || INITIAL_PAGE_HEADERS);
  const [aboutForm, setAboutForm] = useState<AboutContent>(siteData.about);
  const [careersForm, setCareersForm] = useState<CareersContent>(siteData.careers);
  const [contactForm, setContactForm] = useState<ContactContent>(siteData.contact);

  // Modals for Careers Jobs & FAQs
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const [jobForm, setJobForm] = useState<Partial<JobPosition>>({
    title: '',
    department: 'Khối Kinh Doanh & Phân Phối',
    location: 'TP.HCM / Vũng Tàu',
    salary: 'Lương cứng 15M - 35M + Hoa hồng cao',
    desc: '',
  });

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<ContactFAQ | null>(null);
  const [faqForm, setFaqForm] = useState<{ question: string; answer: string }>({
    question: '',
    answer: '',
  });

  // Keep local forms updated when siteData changes
  useEffect(() => {
    if (siteData.general) setGeneralForm(siteData.general);
    if (siteData.pageHeaders) setPageHeadersForm(siteData.pageHeaders);
    setAboutForm(siteData.about);
    setCareersForm(siteData.careers);
    setContactForm(siteData.contact);
  }, [siteData]);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateGeneral) {
      onUpdateGeneral(generalForm);
    }
    showToast('Đã lưu Cài Đặt Chung & Logo! Nhấn "Xuất Bản Dữ Liệu Ngay" ở trên để hoàn tất.');
  };

  const handleSavePageHeaders = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePageHeaders) {
      onUpdatePageHeaders(pageHeadersForm);
    }
    showToast('Đã lưu Tiêu Đề Trang! Nhấn "Xuất Bản Dữ Liệu Ngay" ở trên để hoàn tất.');
  };

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const getSavedPin = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PIN);
      if (saved && saved.trim()) return saved.trim();
    } catch (e) {
      console.error(e);
    }
    return '6886';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const entered = pinInput.trim();
    const correctPin = getSavedPin();

    if (entered === correctPin) {
      setIsUnlocked(true);
      setPinError(null);
      setFailedAttempts(0);
      setPinInput('');
      showToast('Xác thực quản trị viên thành công. Chào mừng bạn Sale Admin!');
    } else {
      const newFailed = failedAttempts + 1;
      setFailedAttempts(newFailed);
      if (newFailed >= 5) {
        setLockoutSeconds(30);
        setPinError('Bạn đã nhập sai 5 lần. Tạm khóa bảo vệ hệ thống trong 30 giây.');
      } else {
        setPinError(`Mật khẩu không chính xác. Bạn còn ${5 - newFailed} lần thử.`);
      }
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getSavedPin();
    if (currentPinInput !== correctPin) {
      setChangePinError('Mật khẩu hiện tại không đúng.');
      return;
    }
    if (newPinInput.length < 4) {
      setChangePinError('Mật khẩu mới phải có ít nhất 4 ký tự.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setChangePinError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY_PIN, newPinInput);
      setChangePinModalOpen(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setChangePinError(null);
      showToast('Đã đổi mật khẩu quản trị CRM thành công!');
    } catch (e) {
      setChangePinError('Không thể lưu mật khẩu. Hãy thử lại.');
    }
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAbout(aboutForm);
    showToast('Đã cập nhật mục Giới Thiệu!');
  };

  const handleSaveCareersHeader = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCareers(careersForm);
    showToast('Đã cập nhật tiêu đề & quyền lợi Tuyển Dụng!');
  };

  const handleSaveContactHeader = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContact(contactForm);
    showToast('Đã cập nhật thông tin Liên Hệ & Trụ Sở!');
  };

  // Job Operations
  const handleOpenJobModal = (job?: JobPosition) => {
    if (job) {
      setEditingJob(job);
      setJobForm(job);
    } else {
      setEditingJob(null);
      setJobForm({
        title: '',
        department: 'Khối Kinh Doanh & Phân Phối',
        location: 'TP.HCM / Vũng Tàu',
        salary: 'Lương cứng 15M - 35M + Hoa hồng cao',
        desc: '',
      });
    }
    setJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title?.trim()) return;

    const newJob: JobPosition = {
      id: editingJob ? editingJob.id : 'job-' + Date.now(),
      title: jobForm.title || '',
      department: jobForm.department || 'Phòng Dự Án',
      location: jobForm.location || 'TP.HCM',
      salary: jobForm.salary || 'Thỏa thuận',
      desc: jobForm.desc || '',
    };

    let updatedJobs: JobPosition[] = [];
    if (editingJob) {
      updatedJobs = careersForm.jobs.map((j) => (j.id === editingJob.id ? newJob : j));
    } else {
      updatedJobs = [newJob, ...careersForm.jobs];
    }

    const updatedCareers = { ...careersForm, jobs: updatedJobs };
    setCareersForm(updatedCareers);
    onUpdateCareers(updatedCareers);
    setJobModalOpen(false);
    showToast(editingJob ? 'Đã cập nhật vị trí tuyển dụng!' : 'Đã thêm vị trí tuyển dụng mới!');
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa vị trí tuyển dụng này không?')) {
      const updatedJobs = careersForm.jobs.filter((j) => j.id !== id);
      const updatedCareers = { ...careersForm, jobs: updatedJobs };
      setCareersForm(updatedCareers);
      onUpdateCareers(updatedCareers);
      showToast('Đã xóa vị trí tuyển dụng!');
    }
  };

  const handleMoveJob = (index: number, direction: 'up' | 'down') => {
    const jobs = [...careersForm.jobs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= jobs.length) return;

    const temp = jobs[index];
    jobs[index] = jobs[targetIndex];
    jobs[targetIndex] = temp;

    const updatedJobs = jobs.map((j, idx) => ({ ...j, order: idx + 1 }));
    const updatedCareers = { ...careersForm, jobs: updatedJobs };
    setCareersForm(updatedCareers);
    onUpdateCareers(updatedCareers);
    showToast(`Đã chuyển vị trí tuyển dụng "${temp.title}" ${direction === 'up' ? 'lên' : 'xuống'}!`);
  };

  const handleSetJobOrder = (id: string, newOrder: number) => {
    const jobs = [...careersForm.jobs];
    const currentIdx = jobs.findIndex((j) => j.id === id);
    if (currentIdx === -1) return;

    const targetIdx = Math.max(0, Math.min(jobs.length - 1, newOrder - 1));
    const [item] = jobs.splice(currentIdx, 1);
    jobs.splice(targetIdx, 0, item);

    const updatedJobs = jobs.map((j, idx) => ({ ...j, order: idx + 1 }));
    const updatedCareers = { ...careersForm, jobs: updatedJobs };
    setCareersForm(updatedCareers);
    onUpdateCareers(updatedCareers);
    showToast(`Đã xếp vị trí tuyển dụng "${item.title}" vào thứ tự #${targetIdx + 1}!`);
  };

  const handleSortJobsByOrder = () => {
    const sorted = [...careersForm.jobs].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const updatedJobs = sorted.map((j, idx) => ({ ...j, order: idx + 1 }));
    const updatedCareers = { ...careersForm, jobs: updatedJobs };
    setCareersForm(updatedCareers);
    onUpdateCareers(updatedCareers);
    showToast('Đã sắp xếp lại toàn bộ danh sách tuyển dụng theo số thứ tự!');
  };

  // FAQ Operations
  const handleOpenFaqModal = (faq?: ContactFAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({ question: faq.question, answer: faq.answer });
    } else {
      setEditingFaq(null);
      setFaqForm({ question: '', answer: '' });
    }
    setFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    const newFaq: ContactFAQ = {
      id: editingFaq ? editingFaq.id : 'faq-' + Date.now(),
      question: faqForm.question,
      answer: faqForm.answer,
    };

    let updatedFaqs: ContactFAQ[] = [];
    if (editingFaq) {
      updatedFaqs = contactForm.faqs.map((f) => (f.id === editingFaq.id ? newFaq : f));
    } else {
      updatedFaqs = [...contactForm.faqs, newFaq];
    }

    const updatedContact = { ...contactForm, faqs: updatedFaqs };
    setContactForm(updatedContact);
    onUpdateContact(updatedContact);
    setFaqModalOpen(false);
    showToast(editingFaq ? 'Đã sửa câu hỏi FAQ!' : 'Đã thêm câu hỏi FAQ mới!');
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa câu hỏi FAQ này?')) {
      const updatedFaqs = contactForm.faqs.filter((f) => f.id !== id);
      const updatedContact = { ...contactForm, faqs: updatedFaqs };
      setContactForm(updatedContact);
      onUpdateContact(updatedContact);
      showToast('Đã xóa câu hỏi FAQ!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && (json.projects || json.advisors || json.news || json.about)) {
          onImportBackup(json);
          showToast('Đã nạp thành công bản sao lưu dữ liệu toàn site!');
        } else {
          alert('Tệp JSON không đúng định dạng dữ liệu của SI Property.');
        }
      } catch (err) {
        alert('Không thể đọc tệp JSON. Vui lòng kiểm tra lại định dạng file.');
      }
    };
    reader.readAsText(file);
  };

  // LOCKED STATE: Login Screen
  if (!isUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-[#06241c] via-[#093529] to-[#02120e] border border-[#c59b27]/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950 border border-[#c59b27]/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif-luxury font-bold text-white">
              CỔNG QUẢN TRỊ NỘI DUNG (CRM/CMS)
            </h1>
            <p className="text-xs text-stone-300 font-light">
              Khu vực dành riêng cho Quản Trị Viên & Sale Admin cập nhật thông tin lên website SI Property
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-300">
                Nhập Mật Khẩu Quản Trị
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pinInput}
                  disabled={lockoutSeconds > 0}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(null);
                  }}
                  placeholder="Nhập mật mã quản trị..."
                  className="w-full bg-[#02130e] border border-stone-700 rounded-xl p-3.5 pr-12 text-sm text-stone-200 focus:outline-none focus:border-[#c59b27] tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {lockoutSeconds > 0 && (
              <div className="text-center text-xs text-amber-400 font-semibold flex items-center justify-center gap-1.5 py-1">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Hệ thống tạm khóa: vui lòng đợi {lockoutSeconds} giây...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className="w-full py-3.5 rounded-xl gold-btn text-xs uppercase tracking-wider font-bold shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>Mở Bảng Điều Khiển Quản Trị</span>
            </button>
          </form>

          <div className="pt-4 border-t border-emerald-900/60 text-center">
            <p className="text-[11px] text-stone-400">
              🔒 Kết nối bảo mật chuẩn doanh nghiệp • Thay đổi xuất bản trực tiếp lên website
            </p>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE: Full Management Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Status & 1-Click Save to Web */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#06241c] via-[#093529] to-[#041a14] border border-[#c59b27]/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/80 text-emerald-300 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Google Cloud Firestore: Đã Kích Hoạt & Lưu Trữ Vĩnh Viễn Realtime (0đ)</span>
          </div>
          <h1 className="text-2xl font-serif-luxury font-bold text-white">
            TRUNG TÂM ĐIỀU HÀNH NỘI DUNG WEBSITE (CRM/CMS)
          </h1>
          <p className="text-xs text-stone-300 font-light">
            Chào bạn Sale Admin! Mọi thay đổi bạn thực hiện sẽ được áp dụng cho toàn bộ khách hàng và đối tác truy cập SI Property.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onSaveAndPublish}
            disabled={isSaving}
            className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-xl flex items-center gap-2"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Đang Xuất Bản...' : 'LƯU & XUẤT BẢN LÊN WEBSITE'}</span>
          </button>

          <button
            onClick={() => setChangePinModalOpen(true)}
            className="px-4 py-3 rounded-xl glass-card text-amber-200 text-xs font-semibold hover:border-[#c59b27] transition flex items-center gap-1.5"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Đổi Mật Khẩu</span>
          </button>

          <button
            onClick={() => {
              setIsUnlocked(false);
              showToast('Đã đăng xuất khỏi cổng Quản Trị.');
            }}
            className="px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 text-xs hover:text-white transition flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            <span>Khóa Lại</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Responsive Wrapped Grid/Pills */}
      <div className="p-2.5 rounded-2xl bg-[#021812]/90 border border-emerald-900/80 shadow-inner">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'guide', label: 'Hướng Dẫn', badge: 'Admin', icon: Info },
            { id: 'crm', label: 'Khách CRM', badge: `${siteData.inquiries?.length || 0}`, icon: UserCheck, highlight: true },
            { id: 'general', label: 'Cài Đặt Chung', icon: Settings },
            { id: 'headers', label: 'Tiêu Đề Trang', icon: Sparkles },
            { id: 'about', label: 'Giới Thiệu', icon: Sparkles },
            { id: 'projects', label: 'Dự Án', badge: `${siteData.projects.length}`, icon: Building2 },
            { id: 'advisors', label: 'Chuyên Viên', badge: `${siteData.advisors.length}`, icon: Users },
            { id: 'news', label: 'Tin Tức', badge: `${siteData.news.length}`, icon: Newspaper },
            { id: 'careers', label: 'Tuyển Dụng', badge: `${siteData.careers.jobs.length}`, icon: Briefcase, priority: true },
            { id: 'contact', label: 'Liên Hệ & Trụ Sở', icon: PhoneCall, priority: true },
            { id: 'html', label: 'Nạp & Test HTML', icon: Code2 },
            { id: 'security', label: 'Bảo Mật', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`cms-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                  isActive
                    ? 'bg-[#c59b27] text-stone-950 font-bold shadow-md scale-[1.02]'
                    : tab.priority
                    ? 'bg-emerald-950/80 border border-emerald-700/80 text-amber-200 hover:text-white hover:border-[#c59b27]'
                    : tab.highlight
                    ? 'bg-[#04241b] border border-amber-500/40 text-amber-300 hover:text-white hover:border-[#c59b27]'
                    : 'bg-[#031d16] border border-emerald-900/60 text-stone-300 hover:text-white hover:border-[#c59b27]/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-stone-950/20 text-stone-950'
                        : 'bg-emerald-900/80 text-amber-300 border border-emerald-700/60'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 0: HƯỚNG DẪN DÀNH CHO SALE ADMIN */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl glass-card space-y-6">
            <div className="border-b border-emerald-900 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#c59b27] font-bold">
                Quy Trình Chuẩn Doanh Nghiệp
              </span>
              <h2 className="text-xl font-serif-luxury font-bold text-white mt-1">
                HƯỚNG DẪN CƠ CHẾ CẬP NHẬT DỮ LIỆU DÀNH CHO SALE ADMIN
              </h2>
              <p className="text-xs text-stone-300 font-light mt-1">
                Các bước đơn giản để bạn Sale Admin chủ động cập nhật giá dự án, chuyên viên mới, bài viết và tin tuyển dụng lên trang web chính thức.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#c59b27] text-stone-950 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="text-sm font-bold text-white">Đăng Nhập Quản Trị</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  Bấm nút <strong>"Quản trị CMS"</strong> ở góc dưới cùng chân trang (Footer), nhập mật khẩu bí mật được Giám Đốc cấp.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#c59b27] text-stone-950 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="text-sm font-bold text-white">Chọn Mục Cần Sửa</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  Chuyển qua các tab: <strong>Dự Án</strong> (thêm/sửa căn, giá), <strong>Chuyên Viên</strong>, <strong>Tin Tức</strong>, <strong>Tuyển Dụng</strong>, <strong>Liên Hệ</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#c59b27] text-stone-950 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="text-sm font-bold text-white">Nhập Liệu & Tải Ảnh</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  Sửa nội dung trực tiếp trong các ô hoặc bấm nút <strong>"Thêm Mới"</strong>. Bạn có thể dán link ảnh hoặc tải ảnh từ máy tính.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#c59b27]/20 border border-[#c59b27] space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#c59b27] text-stone-950 font-bold flex items-center justify-center text-sm">
                  4
                </div>
                <h3 className="text-sm font-bold text-amber-300">Bấm "Lưu & Xuất Bản"</h3>
                <p className="text-xs text-stone-200 leading-relaxed font-light">
                  Bấm nút vàng <strong>"LƯU & XUẤT BẢN LÊN WEBSITE"</strong> ở góc trên bên phải. Ngay lập tức toàn bộ khách hàng vào web sẽ thấy nội dung mới!
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-2xl bg-[#031c15] border border-[#c59b27]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Cơ Chế Đồng Bộ Trực Tiếp (Direct Server Synchronization)</span>
                </div>
                <p className="text-xs text-stone-400">
                  Dữ liệu được lưu trữ tự động trên máy chủ backend (`/api/site-data`). Khách hàng trên toàn quốc truy cập đều nhận được nội dung mới nhất.
                </p>
              </div>
              <button
                onClick={onSaveAndPublish}
                disabled={isSaving}
                className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md shrink-0"
              >
                {isSaving ? 'Đang Xuất Bản...' : 'Xuất Bản Dữ Liệu Ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CRM: QUẢN LÝ KHÁCH HÀNG & LEADS TƯ VẤN */}
      {activeTab === 'crm' && (
        <CrmLeadsManager
          inquiries={siteData.inquiries || []}
          projects={siteData.projects || []}
          primaryEmail={siteData.contact?.email || 'hieupham.2412@gmail.com'}
          onUpdateInquiries={(updated) => {
            if (onUpdateInquiries) {
              onUpdateInquiries(updated);
            }
          }}
          showToast={showToast}
        />
      )}

      {/* TAB: CÀI ĐẶT CHUNG & LOGO */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="p-8 rounded-3xl glass-card space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-900 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Settings className="w-4 h-4" />
                <span>Toàn Quyền Quản Trị Hệ Thống</span>
              </div>
              <h2 className="text-xl font-bold text-white font-serif-luxury">
                Cài Đặt Chung, Nhận Diện Thương Hiệu & Logo
              </h2>
              <p className="text-xs text-stone-400 font-light mt-1">
                Tất cả các thông tin cốt lõi: Logo, Tên thương hiệu, Hotline, Banner Hero, 4 Chỉ số kinh doanh và Chân trang Footer.
              </p>
            </div>
            <button
              type="submit"
              className="gold-btn px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md shrink-0 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cài Đặt Chung</span>
            </button>
          </div>

          {/* Section 1: Logo & Nhận Diện */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-5">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>1. Nhận Diện Thương Hiệu & Logo Website</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Đường Dẫn Logo (URL hoặc Tệp SVG/PNG)</label>
                  <input
                    type="text"
                    value={generalForm.logoUrl}
                    onChange={(e) => setGeneralForm({ ...generalForm, logoUrl: e.target.value })}
                    placeholder="Ví dụ: /logo-si-property.svg"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-2">
                  <span className="block text-stone-400 text-[11px]">Chọn nhanh logo chính thức có sẵn:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setGeneralForm({ ...generalForm, logoUrl: '/logo-si-property.svg' })}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1.5 ${
                        generalForm.logoUrl === '/logo-si-property.svg'
                          ? 'border-[#c59b27] bg-[#c59b27]/20 text-amber-300'
                          : 'border-stone-700 bg-stone-900 text-stone-300 hover:text-white'
                      }`}
                    >
                      {generalForm.logoUrl === '/logo-si-property.svg' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Logo Ngang Đầy Đủ (/logo-si-property.svg)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGeneralForm({ ...generalForm, logoUrl: '/logo-si-property-icon.svg' })}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1.5 ${
                        generalForm.logoUrl === '/logo-si-property-icon.svg'
                          ? 'border-[#c59b27] bg-[#c59b27]/20 text-amber-300'
                          : 'border-stone-700 bg-stone-900 text-stone-300 hover:text-white'
                      }`}
                    >
                      {generalForm.logoUrl === '/logo-si-property-icon.svg' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Biểu Tượng Monogram SI (/logo-si-property-icon.svg)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGeneralForm({ ...generalForm, logoUrl: '/logo-si-property-badge.svg' })}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1.5 ${
                        generalForm.logoUrl === '/logo-si-property-badge.svg'
                          ? 'border-[#c59b27] bg-[#c59b27]/20 text-amber-300'
                          : 'border-stone-700 bg-stone-900 text-stone-300 hover:text-white'
                      }`}
                    >
                      {generalForm.logoUrl === '/logo-si-property-badge.svg' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Huy Hiệu Vuông Nền Xanh (/logo-si-property-badge.svg)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Logo Preview Box */}
              <div className="p-4 rounded-xl bg-black/50 border border-stone-800 flex flex-col items-center justify-center space-y-3 min-h-[140px]">
                <span className="text-[11px] text-stone-400">Xem Trước Logo Hiển Thị Trên Thanh Menu (Navbar):</span>
                <div className="p-3 rounded-lg bg-[#062920] flex items-center justify-center">
                  <img
                    src={generalForm.logoUrl || '/logo-si-property.svg'}
                    alt="Logo Preview"
                    className="h-11 w-auto object-contain max-w-[220px] filter drop-shadow-[0_2px_8px_rgba(229,175,37,0.3)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-si-property.svg';
                    }}
                  />
                </div>
                <span className="text-[10px] text-stone-500">Kích thước chuẩn vector SVG, không viền hộp, sắc nét mọi độ phân giải</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2 border-t border-emerald-950">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Tên Thương Hiệu</label>
                <input
                  type="text"
                  value={generalForm.brandName}
                  onChange={(e) => setGeneralForm({ ...generalForm, brandName: e.target.value })}
                  placeholder="SI PROPERTY"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Tiêu Đề Trình Duyệt (Site Title)</label>
                <input
                  type="text"
                  value={generalForm.siteTitle}
                  onChange={(e) => setGeneralForm({ ...generalForm, siteTitle: e.target.value })}
                  placeholder="SI Property • Thành Viên Chiến Lược CĐT HODECO"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Hotline Tổng Đài</label>
                <input
                  type="text"
                  value={generalForm.hotline}
                  onChange={(e) => setGeneralForm({ ...generalForm, hotline: e.target.value })}
                  placeholder="0938.889.688"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Chữ Nút VIP Header</label>
                <input
                  type="text"
                  value={generalForm.vipCtaText}
                  onChange={(e) => setGeneralForm({ ...generalForm, vipCtaText: e.target.value })}
                  placeholder="Giỏ Hàng VIP"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Banner Hero Trang Chủ */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>2. Banner Hero Trang Chủ (Khẩu Hiệu & Mặt Tiền Website)</span>
              </h3>
              <span className="text-[11px] text-amber-400/80 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                Hiển thị to nhất ở đầu Trang Chủ
              </span>
            </div>

            {/* Live Preview Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-[#c59b27]/40 text-center space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Xem trước câu khẩu hiệu trên đầu trang chủ:</div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 border border-[#c59b27]/60 text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
                {generalForm.heroBadge || 'Thành Viên Chiến Lược Của CĐT HODECO'}
              </div>
              <h4 className="text-lg sm:text-2xl font-serif-luxury font-bold text-white tracking-wide leading-snug">
                {generalForm.heroTitle || 'TÁI ĐỊNH HÌNH CHUẨN MỰC'} <br />
                <span className="gold-gradient-text">{generalForm.heroTitleHighlight || 'BẤT ĐỘNG SẢN CAO CẤP'}</span>
              </h4>
              <p className="text-xs text-stone-400 max-w-xl mx-auto line-clamp-2 font-light">
                {generalForm.heroSubtitle || 'SI Property kết hợp khắt khe giữa phân tích quy hoạch, năng lực thẩm định pháp lý và giỏ hàng bất động sản ven biển cao cấp...'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Huy Hiệu Nhỏ (Badge Trên Cùng)
                </label>
                <input
                  type="text"
                  value={generalForm.heroBadge || ''}
                  onChange={(e) => setGeneralForm({ ...generalForm, heroBadge: e.target.value })}
                  placeholder="Ví dụ: Thành Viên Chiến Lược Của CĐT HODECO"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Khẩu Hiệu Dòng 1 (Màu Trắng)
                </label>
                <input
                  type="text"
                  value={generalForm.heroTitle || ''}
                  onChange={(e) => setGeneralForm({ ...generalForm, heroTitle: e.target.value })}
                  placeholder="Ví dụ: TÁI ĐỊNH HÌNH CHUẨN MỰC"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Nửa đầu của câu khẩu hiệu chính</span>
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Khẩu Hiệu Dòng 2 (Màu Vàng Kim Nổi Bật)
                </label>
                <input
                  type="text"
                  value={generalForm.heroTitleHighlight || ''}
                  onChange={(e) => setGeneralForm({ ...generalForm, heroTitleHighlight: e.target.value })}
                  placeholder="Ví dụ: BẤT ĐỘNG SẢN CAO CẤP"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Nửa sau được mạ ánh vàng hoàng gia</span>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-stone-300 font-medium mb-1">Đoạn Văn Mô Tả Dưới Khẩu Hiệu</label>
              <textarea
                rows={2}
                value={generalForm.heroSubtitle || ''}
                onChange={(e) => setGeneralForm({ ...generalForm, heroSubtitle: e.target.value })}
                placeholder="Nhập lời tựa giới thiệu ngắn dưới câu khẩu hiệu..."
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>

            <div className="text-xs">
              <label className="block text-stone-300 font-medium mb-1">URL Hình Ảnh Nền Banner Hero</label>
              <input
                type="text"
                value={generalForm.heroBgImage || ''}
                onChange={(e) => setGeneralForm({ ...generalForm, heroBgImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          {/* Section 3: 4 Chỉ Số Thống Kê Nổi Bật (Key Metrics) */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>3. 4 Chỉ Số Thống Kê Nổi Bật (100% • 5+ • 65% • 24/7)</span>
              </h3>
              <span className="text-[11px] text-stone-400">
                Tự do thay đổi số liệu và nhãn tương ứng theo thực tế doanh nghiệp
              </span>
            </div>

            {/* Live Preview of 4 Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-black/60 border border-[#c59b27]/30 text-center">
              <div className="p-2">
                <div className="text-xl font-bold gold-gradient-text font-cinzel">
                  {(generalForm.metric1Value ?? (generalForm as any).metric1Val) || '100%'}
                </div>
                <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 line-clamp-1">
                  {generalForm.metric1Label || 'Pháp Lý 1/500 Chuẩn Chỉnh'}
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl font-bold gold-gradient-text font-cinzel">
                  {(generalForm.metric2Value ?? (generalForm as any).metric2Val) || '5+'}
                </div>
                <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 line-clamp-1">
                  {generalForm.metric2Label || 'Đại Dự Án Trọng Điểm'}
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl font-bold gold-gradient-text font-cinzel">
                  {(generalForm.metric3Value ?? (generalForm as any).metric3Val) || '65%'}
                </div>
                <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 line-clamp-1">
                  {generalForm.metric3Label || 'Hoa Hồng Tối Đa Trong 72h'}
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl font-bold gold-gradient-text font-cinzel">
                  {(generalForm.metric4Value ?? (generalForm as any).metric4Val) || '24/7'}
                </div>
                <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 line-clamp-1">
                  {generalForm.metric4Label || 'Private Wealth Concierge'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Chỉ số 1 */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Chỉ Số 1</span>
                  <span className="text-[10px] text-stone-400 font-cinzel">Mặc định: 100%</span>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Giá trị số / phần trăm:</label>
                  <input
                    type="text"
                    value={(generalForm.metric1Value ?? (generalForm as any).metric1Val) || ''}
                    onChange={(e) => setGeneralForm({ 
                      ...generalForm, 
                      metric1Value: e.target.value,
                      metric1Val: e.target.value as any
                    })}
                    placeholder="Ví dụ: 100% hoặc 34+..."
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 font-bold text-amber-300 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Nhãn tiêu đề bên dưới:</label>
                  <input
                    type="text"
                    value={generalForm.metric1Label || ''}
                    onChange={(e) => setGeneralForm({ ...generalForm, metric1Label: e.target.value })}
                    placeholder="Pháp Lý 1/500 Chuẩn Chỉnh"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              {/* Chỉ số 2 */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Chỉ Số 2</span>
                  <span className="text-[10px] text-stone-400 font-cinzel">Mặc định: 5+</span>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Giá trị số / phần trăm:</label>
                  <input
                    type="text"
                    value={(generalForm.metric2Value ?? (generalForm as any).metric2Val) || ''}
                    onChange={(e) => setGeneralForm({ 
                      ...generalForm, 
                      metric2Value: e.target.value,
                      metric2Val: e.target.value as any
                    })}
                    placeholder="Ví dụ: 5+ hoặc 30+ Ha..."
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 font-bold text-amber-300 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Nhãn tiêu đề bên dưới:</label>
                  <input
                    type="text"
                    value={generalForm.metric2Label || ''}
                    onChange={(e) => setGeneralForm({ ...generalForm, metric2Label: e.target.value })}
                    placeholder="Đại Dự Án Trọng Điểm"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              {/* Chỉ số 3 */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Chỉ Số 3</span>
                  <span className="text-[10px] text-stone-400 font-cinzel">Mặc định: 65%</span>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Giá trị số / phần trăm:</label>
                  <input
                    type="text"
                    value={(generalForm.metric3Value ?? (generalForm as any).metric3Val) || ''}
                    onChange={(e) => setGeneralForm({ 
                      ...generalForm, 
                      metric3Value: e.target.value,
                      metric3Val: e.target.value as any
                    })}
                    placeholder="Ví dụ: 65% hoặc 100%..."
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 font-bold text-amber-300 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Nhãn tiêu đề bên dưới:</label>
                  <input
                    type="text"
                    value={generalForm.metric3Label || ''}
                    onChange={(e) => setGeneralForm({ ...generalForm, metric3Label: e.target.value })}
                    placeholder="Hoa Hồng Tối Đa Trong 72h"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              {/* Chỉ số 4 */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Chỉ Số 4</span>
                  <span className="text-[10px] text-stone-400 font-cinzel">Mặc định: 24/7</span>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Giá trị số / phần trăm:</label>
                  <input
                    type="text"
                    value={(generalForm.metric4Value ?? (generalForm as any).metric4Val) || ''}
                    onChange={(e) => setGeneralForm({ 
                      ...generalForm, 
                      metric4Value: e.target.value,
                      metric4Val: e.target.value as any
                    })}
                    placeholder="Ví dụ: 24/7 hoặc VIP..."
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 font-bold text-amber-300 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 font-medium mb-1">Nhãn tiêu đề bên dưới:</label>
                  <input
                    type="text"
                    value={generalForm.metric4Label || ''}
                    onChange={(e) => setGeneralForm({ ...generalForm, metric4Label: e.target.value })}
                    placeholder="Private Wealth Concierge"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Tiêu Đề Mục Dự Án & Tin Tức Trên Trang Chủ */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span>4. Tiêu Đề Mục Dự Án & Tin Tức Trên Trang Chủ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3 p-3 rounded-xl bg-black/40 border border-stone-800">
                <span className="text-[11px] text-amber-400 font-bold">Mục Dự Án Tiêu Biểu</span>
                <div>
                  <label className="block text-stone-400 text-[10px] mb-1">Huy hiệu</label>
                  <input
                    type="text"
                    value={generalForm.homeProjBadge}
                    onChange={(e) => setGeneralForm({ ...generalForm, homeProjBadge: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[10px] mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={generalForm.homeProjTitle}
                    onChange={(e) => setGeneralForm({ ...generalForm, homeProjTitle: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-xl bg-black/40 border border-stone-800">
                <span className="text-[11px] text-amber-400 font-bold">Mục Tin Tức & Báo Chí</span>
                <div>
                  <label className="block text-stone-400 text-[10px] mb-1">Huy hiệu</label>
                  <input
                    type="text"
                    value={generalForm.homeNewsBadge}
                    onChange={(e) => setGeneralForm({ ...generalForm, homeNewsBadge: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[10px] mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={generalForm.homeNewsTitle}
                    onChange={(e) => setGeneralForm({ ...generalForm, homeNewsTitle: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Chân Trang Website (Footer) */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>5. Thông Tin Chân Trang (Footer)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Mô Tả Ngắn Về SI Property</label>
                <textarea
                  rows={3}
                  value={generalForm.footerDesc}
                  onChange={(e) => setGeneralForm({ ...generalForm, footerDesc: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Slogan Trích Dẫn Dưới Footer</label>
                <textarea
                  rows={3}
                  value={generalForm.footerQuote}
                  onChange={(e) => setGeneralForm({ ...generalForm, footerQuote: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Tiêu Đề Khối Hợp Tác CĐT HODECO</label>
                <input
                  type="text"
                  value={generalForm.footerPartnerTitle}
                  onChange={(e) => setGeneralForm({ ...generalForm, footerPartnerTitle: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Mô Tả Khối Hợp Tác HODECO</label>
                <input
                  type="text"
                  value={generalForm.footerPartnerDesc}
                  onChange={(e) => setGeneralForm({ ...generalForm, footerPartnerDesc: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-stone-300 font-medium mb-1">Dòng Bản Quyền (Copyright)</label>
              <input
                type="text"
                value={generalForm.footerCopyright}
                onChange={(e) => setGeneralForm({ ...generalForm, footerCopyright: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-emerald-900">
            <button
              type="submit"
              className="gold-btn px-8 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cài Đặt Chung</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: TIÊU ĐỀ CÁC TRANG (PAGE HEADERS) */}
      {activeTab === 'headers' && (
        <form onSubmit={handleSavePageHeaders} className="p-8 rounded-3xl glass-card space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-900 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Nội Dung Banner Các Trang Con</span>
              </div>
              <h2 className="text-xl font-bold text-white font-serif-luxury">
                Quản Lý Tiêu Đề & Huy Hiệu Các Trang Con
              </h2>
              <p className="text-xs text-stone-400 font-light mt-1">
                Tùy chỉnh tiêu đề H1, huy hiệu Badge và lời dẫn giải thích của trang Chuyên Viên, Dự Án và Tin Tức.
              </p>
            </div>
            <button
              type="submit"
              className="gold-btn px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md shrink-0 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Tiêu Đề Trang</span>
            </button>
          </div>

          {/* 1. Trang Chuyên Viên */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1. Trang Chuyên Viên Tư Vấn (Advisors)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Huy Hiệu (Badge)</label>
                <input
                  type="text"
                  value={pageHeadersForm.advisorsBadge}
                  onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, advisorsBadge: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">Tiêu Đề Lớn (Title)</label>
                <input
                  type="text"
                  value={pageHeadersForm.advisorsTitle}
                  onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, advisorsTitle: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-stone-300 font-medium mb-1">Mô Tả Phụ (Subtitle)</label>
              <textarea
                rows={2}
                value={pageHeadersForm.advisorsSubtitle}
                onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, advisorsSubtitle: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          {/* 2. Trang Danh Mục Dự Án */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>2. Trang Danh Mục Dự Án (Projects)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Huy Hiệu (Badge)</label>
                <input
                  type="text"
                  value={pageHeadersForm.projectsBadge}
                  onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, projectsBadge: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">Tiêu Đề Lớn (Title)</label>
                <input
                  type="text"
                  value={pageHeadersForm.projectsTitle}
                  onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, projectsTitle: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-stone-300 font-medium mb-1">Mô Tả Phụ (Subtitle)</label>
              <textarea
                rows={2}
                value={pageHeadersForm.projectsSubtitle}
                onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, projectsSubtitle: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          {/* 3. Trang Tin Tức & Báo Chí */}
          <div className="p-6 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span>3. Trang Tin Tức & Thị Trường (News)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Huy Hiệu (Badge)</label>
                <input
                  type="text"
                  value={pageHeadersForm.newsBadge}
                  onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, newsBadge: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">Tiêu Đề Lớn (Title)</label>
                <input
                  type="text"
                  value={pageHeadersForm.newsTitle}
                  onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, newsTitle: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-stone-300 font-medium mb-1">Mô Tả Phụ (Subtitle)</label>
              <textarea
                rows={2}
                value={pageHeadersForm.newsSubtitle}
                onChange={(e) => setPageHeadersForm({ ...pageHeadersForm, newsSubtitle: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-emerald-900">
            <button
              type="submit"
              className="gold-btn px-8 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Tiêu Đề Trang</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 1: QUẢN LÝ GIỚI THIỆU (ABOUT) */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="p-8 rounded-3xl glass-card space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-900 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Quản Lý Trang Giới Thiệu & Báo Chí</h2>
              <p className="text-xs text-stone-400">
                Chỉnh sửa tiêu đề, khung trích dẫn bài báo CafeLand và 3 triết lý hoạt động
              </p>
            </div>
            <button
              type="submit"
              className="gold-btn px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold"
            >
              Lưu Thay Đổi Giới Thiệu
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Huy hiệu trên đầu (Badge)</label>
              <input
                type="text"
                value={aboutForm.badge}
                onChange={(e) => setAboutForm({ ...aboutForm, badge: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-medium mb-1">Nguồn bài báo CafeLand</label>
              <input
                type="text"
                value={aboutForm.sourceLabel}
                onChange={(e) => setAboutForm({ ...aboutForm, sourceLabel: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-stone-300 font-medium mb-1">Tiêu đề chính trang Giới Thiệu</label>
            <input
              type="text"
              value={aboutForm.title}
              onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
              className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="text-xs">
            <label className="block text-stone-300 font-medium mb-1">Mô tả phụ (Subtitle)</label>
            <textarea
              rows={2}
              value={aboutForm.subtitle}
              onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
              className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          {/* CafeLand Quote Box */}
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-[#c59b27]/40 space-y-4 text-xs">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span>Nội Dung Khung Báo Chí CafeLand</span>
            </div>
            <div>
              <label className="block text-stone-300 font-medium mb-1">Tiêu đề trích dẫn bài báo</label>
              <input
                type="text"
                value={aboutForm.quoteTitle}
                onChange={(e) => setAboutForm({ ...aboutForm, quoteTitle: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Đoạn phân tích 1</label>
                <textarea
                  rows={4}
                  value={aboutForm.quoteText1}
                  onChange={(e) => setAboutForm({ ...aboutForm, quoteText1: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">Đoạn phân tích 2 (Đối tác HODECO)</label>
                <textarea
                  rows={4}
                  value={aboutForm.quoteText2}
                  onChange={(e) => setAboutForm({ ...aboutForm, quoteText2: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>
            <div>
              <label className="block text-stone-300 font-medium mb-1">Đường link bài báo gốc</label>
              <input
                type="text"
                value={aboutForm.sourceUrl}
                onChange={(e) => setAboutForm({ ...aboutForm, sourceUrl: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </div>

          {/* 3 Values */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">3 Triết Lý Hoạt Động (Chuyên Tâm, Chuyên Nghiệp, Chuyên Sâu)</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aboutForm.values.map((val, idx) => (
                <div key={val.id || idx} className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900 space-y-2 text-xs">
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => {
                      const updated = [...aboutForm.values];
                      updated[idx].title = e.target.value;
                      setAboutForm({ ...aboutForm, values: updated });
                    }}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 font-bold text-amber-300 focus:outline-none focus:border-[#c59b27]"
                  />
                  <textarea
                    rows={3}
                    value={val.desc}
                    onChange={(e) => {
                      const updated = [...aboutForm.values];
                      updated[idx].desc = e.target.value;
                      setAboutForm({ ...aboutForm, values: updated });
                    }}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-300 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: QUẢN LÝ DỰ ÁN (PROJECTS) */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Quản Lý & Sắp Xếp Danh Mục Dự Án</h2>
              <p className="text-xs text-stone-400">
                Thêm dự án mới, cập nhật giá bán, hình ảnh và chủ động sắp xếp vị trí hiển thị (Lên / Xuống) trên Website
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onSortProjectsByOrder && (
                <button
                  type="button"
                  onClick={onSortProjectsByOrder}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-950 border border-[#c59b27]/60 text-amber-300 hover:bg-[#c59b27] hover:text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Sắp xếp danh sách lại theo số thứ tự"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sắp Xếp Thứ Tự (1-N)</span>
                </button>
              )}
              <button
                onClick={() => onOpenProjectModal()}
                className="gold-btn px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Dự Án Mới</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-stone-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Mẹo sắp xếp vị trí:</strong> Bấm mũi tên <strong>Lên / Xuống</strong> hoặc nhập trực tiếp <strong>Thứ tự (1, 2, 3...)</strong> để đưa dự án trọng điểm lên đầu trang chủ và trang danh mục.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl glass-card relative flex flex-col justify-between space-y-4"
              >
                {/* Header position and reorder controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 font-mono font-bold text-[11px] border border-amber-400/40 shadow-sm">
                      Vị trí #{idx + 1}
                    </span>
                    {proj.order && proj.order !== idx + 1 && (
                      <span className="text-[10px] text-stone-400 font-mono">(Ưu tiên #{proj.order})</span>
                    )}
                  </div>

                  {onMoveProject && (
                    <div className="flex items-center bg-[#02130e] p-0.5 rounded border border-stone-700">
                      <button
                        type="button"
                        onClick={() => onMoveProject(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-stone-300 hover:text-amber-300 hover:bg-stone-800 disabled:opacity-20 disabled:hover:text-stone-300 disabled:hover:bg-transparent rounded transition"
                        title="Di chuyển lên trước"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveProject(idx, 'down')}
                        disabled={idx === siteData.projects.length - 1}
                        className="p-1 text-stone-300 hover:text-amber-300 hover:bg-stone-800 disabled:opacity-20 disabled:hover:text-stone-300 disabled:hover:bg-transparent rounded transition"
                        title="Di chuyển xuống sau"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-40 rounded-xl object-cover border border-[#c59b27]/40"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-950/90 text-amber-300 text-[10px] font-bold border border-[#c59b27]/40">
                      {proj.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-serif-luxury font-bold text-white">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-amber-300 font-semibold">{proj.price}</p>
                    <p className="text-[11px] text-stone-400">📍 {proj.location}</p>
                  </div>

                  <p className="text-xs text-stone-300 line-clamp-2 font-light">{proj.description}</p>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    ⚡ {proj.status}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-emerald-950">
                  {/* Order Input */}
                  {onSetProjectOrder && (
                    <div className="flex items-center justify-between text-xs bg-[#02130e]/80 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400">Số thứ tự hiển thị:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          max={siteData.projects.length}
                          value={proj.order ?? (idx + 1)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                              onSetProjectOrder(proj.id, val);
                            }
                          }}
                          className="w-12 bg-black border border-stone-700 rounded px-1.5 py-0.5 text-center text-amber-300 font-bold focus:outline-none focus:border-[#c59b27]"
                        />
                        <span className="text-[11px] text-stone-400">/ {siteData.projects.length}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenProjectModal(proj)}
                      className="p-2 rounded-lg bg-emerald-950 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 transition flex items-center gap-1 text-xs font-semibold"
                      title="Sửa dự án"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold"
                      title="Xóa dự án"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUẢN LÝ CHUYÊN VIÊN (ADVISORS) */}
      {activeTab === 'advisors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Quản Lý & Sắp Xếp Đội Ngũ Chuyên Viên</h2>
              <p className="text-xs text-stone-400">
                Thêm mới, đổi ảnh chân dung, chọn chuyên viên tiêu biểu và tùy chỉnh thứ tự vị trí hiển thị (lên / xuống)
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onSortAdvisorsByOrder && (
                <button
                  type="button"
                  onClick={onSortAdvisorsByOrder}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-950 border border-[#c59b27]/60 text-amber-300 hover:bg-[#c59b27] hover:text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Sắp xếp danh sách lại theo số thứ tự"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sắp Xếp Thứ Tự (1-N)</span>
                </button>
              )}
              <button
                onClick={() => onOpenAdvisorModal()}
                className="gold-btn px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Chuyên Viên Mới</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-stone-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Mẹo sắp xếp vị trí:</strong> Nhấn nút mũi tên <strong>Lên / Xuống</strong> hoặc nhập trực tiếp <strong>Thứ tự (1, 2, 3...)</strong> trên từng thẻ chuyên viên để quyết định ai xuất hiện trước trên Website.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.advisors.map((a, idx) => (
              <div
                key={a.id}
                className={`p-5 rounded-2xl glass-card relative flex flex-col justify-between ${
                  a.isFeatured ? 'border-[#e5c158] ring-1 ring-[#e5c158]/50' : ''
                }`}
              >
                {/* Header badges: Position & Featured */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 font-mono font-bold text-[11px] border border-amber-400/40 shadow-sm">
                      Vị trí #{idx + 1}
                    </span>
                    {a.order && a.order !== idx + 1 && (
                      <span className="text-[10px] text-stone-400 font-mono">(Ưu tiên #{a.order})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {onMoveAdvisor && (
                      <div className="flex items-center bg-[#02130e] p-0.5 rounded border border-stone-700">
                        <button
                          type="button"
                          onClick={() => onMoveAdvisor(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-stone-300 hover:text-amber-300 hover:bg-stone-800 disabled:opacity-20 disabled:hover:text-stone-300 disabled:hover:bg-transparent rounded transition"
                          title="Di chuyển lên trước"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveAdvisor(idx, 'down')}
                          disabled={idx === siteData.advisors.length - 1}
                          className="p-1 text-stone-300 hover:text-amber-300 hover:bg-stone-800 disabled:opacity-20 disabled:hover:text-stone-300 disabled:hover:bg-transparent rounded transition"
                          title="Di chuyển xuống sau"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {a.isFeatured && (
                      <span className="bg-[#c59b27] text-stone-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow">
                        ⭐ Tiêu Biểu
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => onOpenAdvisorModal(a)}
                    className="flex items-center gap-3 p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/60 hover:border-[#c59b27]/70 cursor-pointer transition group"
                    title="Bấm vào để chỉnh sửa thông tin & hình ảnh chuyên viên"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={a.image}
                        alt={a.name}
                        className="w-16 h-20 rounded-xl object-contain bg-black/60 border-2 border-[#c59b27] group-hover:scale-105 transition shadow-md p-0.5"
                      />
                      <span className="absolute -bottom-1 -right-1 p-1 bg-[#c59b27] text-stone-950 rounded-md text-[9px] shadow font-bold">
                        <Edit3 className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-serif-luxury font-bold text-white group-hover:text-amber-300 transition truncate">
                          {a.name}
                        </h3>
                      </div>
                      <p className="text-xs text-emerald-400 font-medium truncate">{a.title}</p>
                      <span className="text-[11px] text-stone-400">{a.experience}</span>
                    </div>
                  </div>
                  <div className="text-xs text-stone-300 space-y-1 pt-2 border-t border-emerald-950">
                    <div>📞 <strong>Hotline:</strong> {a.phone}</div>
                    <div>✉️ <strong>Email:</strong> {a.email}</div>
                    <div>🎯 <strong>Dự án:</strong> {a.specialty}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 mt-4 border-t border-emerald-950">
                  {/* Position order input */}
                  {onSetAdvisorOrder && (
                    <div className="flex items-center justify-between text-xs bg-[#02130e]/80 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400">Số thứ tự hiển thị:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          max={siteData.advisors.length}
                          value={a.order ?? (idx + 1)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                              onSetAdvisorOrder(a.id, val);
                            }
                          }}
                          className="w-12 bg-black border border-stone-700 rounded px-1.5 py-0.5 text-center text-amber-300 font-bold focus:outline-none focus:border-[#c59b27]"
                        />
                        <span className="text-[11px] text-stone-400">/ {siteData.advisors.length}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleFeaturedAdvisor(a.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${
                        a.isFeatured
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                          : 'bg-emerald-950 text-stone-400 border-stone-700 hover:text-white'
                      }`}
                    >
                      {a.isFeatured ? 'Hạ Tiêu Biểu' : '⭐ Chọn Tiêu Biểu'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenAdvisorModal(a)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 transition text-[11px] font-bold border border-emerald-800 shadow-sm"
                        title="Chỉnh sửa thông tin & hình ảnh"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa Chuyên Viên</span>
                      </button>
                      <button
                        onClick={() => onDeleteAdvisor(a.id)}
                        className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUẢN LÝ TIN TỨC (NEWS) */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Quản Lý & Sắp Xếp Tin Tức & Bài Báo</h2>
              <p className="text-xs text-stone-400">
                Soạn bài viết mới, cập nhật phân tích thị trường hoặc cẩm nang và điều chỉnh thứ tự hiển thị
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onSortNewsByOrder && (
                <button
                  type="button"
                  onClick={onSortNewsByOrder}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-950 border border-[#c59b27]/60 text-amber-300 hover:bg-[#c59b27] hover:text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Sắp xếp danh sách lại theo số thứ tự"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sắp Xếp Thứ Tự (1-N)</span>
                </button>
              )}
              <button
                onClick={() => onOpenNewsModal()}
                className="gold-btn px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Soạn Bài Viết Mới</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-stone-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Mẹo sắp xếp vị trí:</strong> Bấm mũi tên <strong>Lên / Xuống</strong> hoặc nhập trực tiếp <strong>Thứ tự (1, 2, 3...)</strong> để đưa bài phân tích hoặc tin báo chí nổi bật lên đầu trang.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {siteData.news.map((n, idx) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Position Badge & Move Controls */}
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 font-mono font-bold text-[10px] border border-amber-400/40">
                      #{idx + 1}
                    </span>
                    {onMoveNews && (
                      <div className="flex items-center bg-[#02130e] p-0.5 rounded border border-stone-700">
                        <button
                          type="button"
                          onClick={() => onMoveNews(idx, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 text-stone-300 hover:text-amber-300 disabled:opacity-20 transition"
                          title="Di chuyển lên trước"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveNews(idx, 'down')}
                          disabled={idx === siteData.news.length - 1}
                          className="p-0.5 text-stone-300 hover:text-amber-300 disabled:opacity-20 transition"
                          title="Di chuyển xuống sau"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-20 h-16 rounded-xl object-cover shrink-0 border border-stone-700"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {n.category}
                      </span>
                      <span className="text-xs text-stone-400">
                        {n.date} • {n.author}
                      </span>
                      {n.order && n.order !== idx + 1 && (
                        <span className="text-[10px] text-stone-400 font-mono">(Ưu tiên #{n.order})</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{n.title}</h3>
                    <p className="text-xs text-stone-300 line-clamp-1 font-light">{n.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {onSetNewsOrder && (
                    <div className="flex items-center gap-1.5 text-xs bg-[#02130e]/80 px-2 py-1 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[11px]">Thứ tự:</span>
                      <input
                        type="number"
                        min={1}
                        max={siteData.news.length}
                        value={n.order ?? (idx + 1)}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1) {
                            onSetNewsOrder(n.id, val);
                          }
                        }}
                        className="w-10 bg-black border border-stone-700 rounded px-1 text-center text-amber-300 font-bold focus:outline-none focus:border-[#c59b27]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenNewsModal(n)}
                      className="p-2 rounded-lg bg-emerald-950 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 transition"
                      title="Sửa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteNews(n.id)}
                      className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: QUẢN LÝ TUYỂN DỤNG (CAREERS) */}
      {activeTab === 'careers' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveCareersHeader} className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Tiêu Đề & Chính Sách Hoa Hồng Tuyển Dụng</h3>
                <p className="text-xs text-stone-400">Thay đổi thông điệp tuyển dụng và chế độ đãi ngộ 72h</p>
              </div>
              <button
                type="submit"
                className="gold-btn px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold"
              >
                Lưu Tiêu Đề
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Huy hiệu trên đầu</label>
                <input
                  type="text"
                  value={careersForm.badge}
                  onChange={(e) => setCareersForm({ ...careersForm, badge: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">Tiêu đề chính</label>
                <input
                  type="text"
                  value={careersForm.title}
                  onChange={(e) => setCareersForm({ ...careersForm, title: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-stone-300 font-medium mb-1">Mô tả phụ</label>
              <textarea
                rows={2}
                value={careersForm.subtitle}
                onChange={(e) => setCareersForm({ ...careersForm, subtitle: e.target.value })}
                className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
              />
            </div>
          </form>

          {/* Jobs List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Danh Sách & Thứ Tự Vị Trí Tuyển Dụng ({careersForm.jobs.length})
                </h3>
                <p className="text-xs text-stone-400">
                  Điều chỉnh thứ tự hiển thị vị trí tuyển dụng ưu tiên lên trước
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSortJobsByOrder}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-[#c59b27]/60 text-amber-300 hover:bg-[#c59b27] hover:text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Sắp xếp danh sách lại theo số thứ tự"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sắp Xếp Thứ Tự (1-N)</span>
                </button>
                <button
                  onClick={() => handleOpenJobModal()}
                  className="gold-btn px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Vị Trí Mới</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Mẹo sắp xếp vị trí:</strong> Bấm mũi tên <strong>Lên / Xuống</strong> hoặc nhập trực tiếp <strong>Thứ tự (1, 2, 3...)</strong> để đưa vị trí tuyển dụng cấp bách lên đầu trang Tuyển dụng.
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {careersForm.jobs.map((job, idx) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Position Badge & Move Controls */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 font-mono font-bold text-[10px] border border-amber-400/40">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center bg-[#02130e] p-0.5 rounded border border-stone-700">
                        <button
                          type="button"
                          onClick={() => handleMoveJob(idx, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 text-stone-300 hover:text-amber-300 disabled:opacity-20 transition"
                          title="Di chuyển lên trước"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveJob(idx, 'down')}
                          disabled={idx === careersForm.jobs.length - 1}
                          className="p-0.5 text-stone-300 hover:text-amber-300 disabled:opacity-20 transition"
                          title="Di chuyển xuống sau"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {job.department}
                        </span>
                        <span className="text-xs text-stone-400">📍 {job.location}</span>
                        {job.order && job.order !== idx + 1 && (
                          <span className="text-[10px] text-stone-400 font-mono">(Ưu tiên #{job.order})</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{job.title}</h4>
                      <p className="text-xs text-amber-300 font-semibold">💰 {job.salary}</p>
                      <p className="text-xs text-stone-300 line-clamp-1 font-light">{job.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="flex items-center gap-1.5 text-xs bg-[#02130e]/80 px-2 py-1 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[11px]">Thứ tự:</span>
                      <input
                        type="number"
                        min={1}
                        max={careersForm.jobs.length}
                        value={job.order ?? (idx + 1)}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1) {
                            handleSetJobOrder(job.id, val);
                          }
                        }}
                        className="w-10 bg-black border border-stone-700 rounded px-1 text-center text-amber-300 font-bold focus:outline-none focus:border-[#c59b27]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenJobModal(job)}
                        className="p-2 rounded-lg bg-emerald-950 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 transition"
                        title="Sửa vị trí"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white transition"
                        title="Xóa vị trí"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: QUẢN LÝ LIÊN HỆ & TRỤ SỞ (CONTACT) */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveContactHeader} className="p-8 rounded-3xl glass-card space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Thông Tin Hotline, Email & Địa Chỉ Trụ Sở</h2>
                <p className="text-xs text-stone-400">Cập nhật đường dây nóng, email hỗ trợ và văn phòng giao dịch</p>
              </div>
              <button
                type="submit"
                className="gold-btn px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold"
              >
                Lưu Thông Tin Liên Hệ
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Hotline chính 24/7 (*)</label>
                <input
                  type="text"
                  required
                  value={contactForm.hotline}
                  onChange={(e) => setContactForm({ ...contactForm, hotline: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">Tổng đài phụ</label>
                <input
                  type="text"
                  value={contactForm.hotlineAlt}
                  onChange={(e) => setContactForm({ ...contactForm, hotlineAlt: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-medium mb-1">Email nhận thư</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* HCM Office */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900 space-y-3">
                <div className="font-bold text-amber-300">Trụ Sở TP. Hồ Chí Minh</div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tên địa điểm</label>
                  <input
                    type="text"
                    value={contactForm.hcmOfficeTitle}
                    onChange={(e) => setContactForm({ ...contactForm, hcmOfficeTitle: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={contactForm.hcmOfficeAddress}
                    onChange={(e) => setContactForm({ ...contactForm, hcmOfficeAddress: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              {/* Vung Tau Office */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900 space-y-3">
                <div className="font-bold text-amber-300">Văn Phòng Vũng Tàu (HODECO Center)</div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tên địa điểm</label>
                  <input
                    type="text"
                    value={contactForm.vtOfficeTitle}
                    onChange={(e) => setContactForm({ ...contactForm, vtOfficeTitle: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={contactForm.vtOfficeAddress}
                    onChange={(e) => setContactForm({ ...contactForm, vtOfficeAddress: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* FAQs List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Câu Hỏi Thường Gặp FAQ ({contactForm.faqs.length})
              </h3>
              <button
                onClick={() => handleOpenFaqModal()}
                className="gold-btn px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Câu Hỏi Mới</span>
              </button>
            </div>

            <div className="space-y-3">
              {contactForm.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl glass-card flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-amber-300">❓ {faq.question}</h4>
                    <p className="text-stone-300 font-light leading-relaxed">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenFaqModal(faq)}
                      className="p-2 rounded-lg bg-emerald-950 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 transition"
                      title="Sửa FAQ"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white transition"
                      title="Xóa FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: BẢO MẬT & SAO LƯU (SECURITY) */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl glass-card space-y-6">
            <div className="border-b border-emerald-900 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#c59b27] font-bold">
                Bảo Vệ & Quản Trị Hệ Thống
              </span>
              <h2 className="text-xl font-serif-luxury font-bold text-white mt-1">
                BẢO MẬT, SAO LƯU DỮ LIỆU & QUYỀN TRUY CẬP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Change Pin */}
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Đổi Mật Khẩu Quản Trị</h3>
                <p className="text-xs text-stone-300 font-light">
                  Đổi mật khẩu mới định kỳ để bảo vệ quyền truy cập chỉnh sửa nội dung.
                </p>
                <button
                  onClick={() => setChangePinModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-emerald-900 text-amber-300 text-xs font-semibold hover:bg-[#c59b27] hover:text-stone-950 transition w-full"
                >
                  Đổi Mật Khẩu Ngay
                </button>
              </div>

              {/* Card 2: Export Backup */}
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-amber-400">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Xuất File Sao Lưu (JSON)</h3>
                <p className="text-xs text-stone-300 font-light">
                  Tải về máy tính một bản sao lưu toàn bộ dữ liệu trang web (dự án, bài viết, chuyên viên).
                </p>
                <button
                  onClick={onExportBackup}
                  className="px-4 py-2 rounded-lg bg-emerald-900 text-amber-300 text-xs font-semibold hover:bg-[#c59b27] hover:text-stone-950 transition w-full"
                >
                  Tải Bản Sao Lưu JSON
                </button>
              </div>

              {/* Card 3: Import Backup */}
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-amber-400">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Nạp Lại File Sao Lưu</h3>
                <p className="text-xs text-stone-300 font-light">
                  Khôi phục dữ liệu từ tệp JSON đã lưu trước đây chỉ với một cú nhấp chuột.
                </p>
                <label className="inline-block text-center px-4 py-2 rounded-lg bg-emerald-900 text-amber-300 text-xs font-semibold hover:bg-[#c59b27] hover:text-stone-950 transition cursor-pointer w-full">
                  <span>Chọn Tệp JSON Khôi Phục</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Card 4: Explanation & Permanent Storage Solution */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#031d16] via-[#05281e] to-[#031d16] border-2 border-[#c59b27] space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Cơ Chế Lưu Trữ Vĩnh Viễn & Giải Đáp "Vì Sao Sau 30 Phút Dữ Liệu Bị Trở Về Cũ?"</span>
              </div>
              <div className="text-xs text-stone-300 space-y-3 font-light leading-relaxed">
                <p>
                  <strong>1. Nguyên nhân:</strong> Máy chủ đám mây (Cloud Run Container) có cơ chế tiết kiệm tài nguyên: sau khoảng 15-30 phút không có người truy cập, máy chủ sẽ tự động tạm ngưng ("ngủ"). Khi bạn hoặc khách hàng vào lại, máy chủ sẽ tạo một phiên bản máy chủ mới từ mã nguồn gốc. Trước đây, phiên bản mới này vô tình gửi dữ liệu mẫu ban đầu đè lên trình duyệt của bạn.
                </p>
                <p>
                  <strong>2. Giải pháp đã kích hoạt trên hệ thống (Smart Timestamp Sync):</strong> Hệ thống hiện đã được nâng cấp cơ chế so khớp mốc thời gian thông minh (`updatedAt`). Trình duyệt của bạn sẽ <strong>tuyệt đối không bao giờ bị máy chủ đè mất dữ liệu</strong>. Ngay khi máy chủ mới thức dậy, trình duyệt sẽ tự động phát hiện và đồng bộ ngược dữ liệu mới nhất của bạn lên máy chủ!
                </p>
                <p>
                  <strong>3. Cách để lưu vĩnh viễn 100% cho mọi khách hàng mới trên toàn cầu:</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-800 space-y-2">
                    <div className="text-amber-300 font-semibold text-xs">Cách 1: Sao chép dữ liệu cấu hình mã nguồn</div>
                    <p className="text-[11px] text-stone-400">
                      Bấm nút bên dưới để sao chép JSON toàn bộ dữ liệu bạn vừa chỉnh sửa, sau đó gửi cho Lập trình viên / AI để cập nhật trực tiếp vào file gốc <code>src/data/initialData.ts</code>. Dữ liệu sẽ trở thành mặc định vĩnh viễn của website.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(siteData, null, 2));
                        showToast('Đã sao chép toàn bộ dữ liệu cấu hình vào bộ nhớ tạm (Clipboard)!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao Chép JSON Cấu Hình (1-Click)</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-800 space-y-2">
                    <div className="text-amber-300 font-semibold text-xs">Cách 2: Tải file sao lưu dự phòng định kỳ</div>
                    <p className="text-[11px] text-stone-400">
                      Sau khi nhập thông tin dự án hoặc chuyên viên mới, hãy bấm <strong>"Tải Bản Sao Lưu JSON"</strong> (ở thẻ bên trên) lưu vào máy tính. Khi cần bạn chỉ cần nạp lại trong 1 giây.
                    </p>
                    <button
                      type="button"
                      onClick={onExportBackup}
                      className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-[#c59b27] text-amber-300 hover:text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Bản Sao Lưu (.json)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Firebase & 0-Cost Instant Sync Explanation */}
            <div className="p-6 rounded-2xl bg-[#021812] border border-amber-500/50 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Globe className="w-5 h-5 text-[#c59b27]" />
                <span>Giải Đáp: Firebase Là Gì? Có Tốn Chi Phí Không? Giải Pháp Cập Nhật Tức Thì 0 Đồng</span>
              </div>
              <div className="text-xs text-stone-300 space-y-3 font-light leading-relaxed">
                <div>
                  <strong className="text-white block mb-1">1. Firebase là gì? Có tốn phí không?</strong>
                  <p>
                    <strong>Firebase</strong> là nền tảng cơ sở dữ liệu đám mây (Cloud Database) của Google. Google cung cấp gói <strong>Spark Plan hoàn toàn MIỄN PHÍ</strong> (cho phép lưu trữ 1 GB và 50.000 lượt đọc dữ liệu mỗi ngày). Với lưu lượng của một website bất động sản cao cấp như siproperty.vn, gói miễn phí của Firebase là <strong>hoàn toàn 0 đồng, không phát sinh bất kỳ chi phí nào</strong>.
                  </p>
                </div>

                <div>
                  <strong className="text-white block mb-1">2. Giải pháp cập nhật và lưu dữ liệu tức thì 0 đồng đã hoạt động trên website:</strong>
                  <p>
                    Hệ thống đã tích hợp sẵn cơ chế <strong>"Lưu Trực Tiếp + Tự Động Phục Hồi Thông Minh" (Smart Timestamp Sync)</strong>:
                  </p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-stone-300">
                    <li>Khi bạn bấm nút <strong>"Lưu"</strong> hoặc đổi vị trí thứ tự: Dữ liệu được ghi ngay lập tức vào file máy chủ và bộ nhớ trình duyệt của bạn (tốc độ 0 giây).</li>
                    <li>Sau 30 phút rảnh rỗi, nếu máy chủ Cloud Run tạm ngủ và khởi động lại, trình duyệt của bạn sẽ tự động nhận diện mốc thời gian mới hơn và <strong>tự động đẩy ngược dữ liệu lên khôi phục máy chủ</strong> hoàn toàn ngầm mà bạn không cần thao tác gì thêm.</li>
                    <li>Mọi thứ hoạt động tức thì, ổn định và <strong>100% MIỄN PHÍ vĩnh viễn</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Explanation */}
            <div className="p-6 rounded-2xl bg-[#031a14] border border-[#c59b27]/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Giải Thích Kỹ Thuật: Vì Sao Hacker Không Thể Phá Hỏng Dữ Liệu Website?</span>
              </div>
              <ul className="text-xs text-stone-300 space-y-2 font-light list-disc pl-5 leading-relaxed">
                <li>
                  <strong>Bảo vệ chống dò mật khẩu (Anti-Brute Force):</strong> Nếu nhập sai quá 5 lần liên tiếp, cổng quản trị sẽ tự động khóa 30 giây để ngăn chặn robot dò quét mã.
                </li>
                <li>
                  <strong>Mã hóa lưu trữ & xác thực kép:</strong> Mọi thay đổi đều được lưu qua tệp máy chủ an toàn (`/api/site-data`), đồng thời sao lưu dự phòng vào bộ nhớ cục bộ của bạn.
                </li>
                <li>
                  <strong>Không lộ thông tin nhạy cảm:</strong> Website không lưu trữ mật khẩu ở dạng công khai, các phím bấm và nút quản trị đều được đặt kín đáo dưới chân trang (Footer).
                </li>
              </ul>
            </div>

            {/* Factory Reset */}
            <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-between">
              <div className="text-xs text-stone-400">
                Khôi phục lại toàn bộ dữ liệu gốc chuẩn của SI Property ban đầu
              </div>
              <button
                onClick={() => {
                  if (confirm('CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ dữ liệu về mặc định ban đầu. Bạn có muốn tiếp tục?')) {
                    onResetFactory();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-semibold transition"
              >
                Khôi Phục Dữ Liệu Gốc Ban Đầu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: NẠP & TEST HTML TRỰC TIẾP TRONG CMS */}
      {activeTab === 'html' && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#06241c] via-[#093529] to-[#041a14] border border-[#c59b27]/60 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400 text-[11px] font-bold">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>CÔNG CỤ NẠP VÀ THỬ NGHIỆM HTML (DÀNH CHO SALE ADMIN & DEV)</span>
            </div>
            <h2 className="text-xl font-bold font-serif-luxury text-white">
              Không Gian Kiểm Thử & Nạp Mã HTML Nguồn
            </h2>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Quý vị có thể dán toàn bộ mã HTML (landing page dự án mới, bài PR báo chí, form thu thập khách hàng hoặc widget iframe) vào khung bên dưới để xem trước kết quả trực quan ngay lập tức.
            </p>
          </div>

          <HtmlQuickTester />

          <SourceGuide onGoToTester={() => window.scrollTo({ top: 300, behavior: 'smooth' })} />
        </div>
      )}

      {/* MODAL: ĐỔI MẬT KHẨU */}
      {changePinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#06241c] border border-[#c59b27]/70 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
              <h3 className="text-base font-serif-luxury font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Thiết Lập Mật Khẩu Mới</span>
              </h3>
              <button
                onClick={() => setChangePinModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={currentPinInput}
                  onChange={(e) => {
                    setCurrentPinInput(e.target.value);
                    setChangePinError(null);
                  }}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Mật khẩu mới (tối thiểu 4 ký tự)</label>
                <input
                  type="password"
                  required
                  value={newPinInput}
                  onChange={(e) => {
                    setNewPinInput(e.target.value);
                    setChangePinError(null);
                  }}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={confirmPinInput}
                  onChange={(e) => {
                    setConfirmPinInput(e.target.value);
                    setChangePinError(null);
                  }}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              {changePinError && (
                <div className="p-2 rounded bg-rose-950/70 border border-rose-600/50 text-rose-300 text-[11px]">
                  {changePinError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-900">
                <button
                  type="button"
                  onClick={() => setChangePinModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-900 text-stone-300 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 rounded-lg font-bold"
                >
                  Lưu Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM / SỬA VỊ TRÍ TUYỂN DỤNG */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#06241c] border border-[#c59b27]/70 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>{editingJob ? 'Sửa Vị Trí Tuyển Dụng' : 'Thêm Vị Trí Tuyển Dụng Mới'}</span>
              </h3>
              <button onClick={() => setJobModalOpen(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Chức danh tuyển dụng (*)</label>
                <input
                  type="text"
                  required
                  value={jobForm.title || ''}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="Ví dụ: Chuyên Viên Tư Vấn BĐS Cao Cấp"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Phòng ban</label>
                  <input
                    type="text"
                    value={jobForm.department || ''}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Địa điểm làm việc</label>
                  <input
                    type="text"
                    value={jobForm.location || ''}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Mức lương & Hoa hồng</label>
                <input
                  type="text"
                  value={jobForm.salary || ''}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  placeholder="Lương cứng 15M + Hoa hồng tới 65%..."
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Mô tả tóm tắt công việc</label>
                <textarea
                  rows={3}
                  value={jobForm.desc || ''}
                  onChange={(e) => setJobForm({ ...jobForm, desc: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-900">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-900 text-stone-300"
                >
                  Hủy
                </button>
                <button type="submit" className="gold-btn px-5 py-2 rounded-lg font-bold">
                  {editingJob ? 'Lưu Sửa Đổi' : 'Thêm Vị Trí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM / SỬA FAQ */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#06241c] border border-[#c59b27]/70 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{editingFaq ? 'Sửa Câu Hỏi FAQ' : 'Thêm Câu Hỏi FAQ Mới'}</span>
              </h3>
              <button onClick={() => setFaqModalOpen(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Câu hỏi (*)</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="Ví dụ: Đặt lịch tour xem nhà như thế nào?"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Câu trả lời (*)</label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Nội dung giải đáp chi tiết..."
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-900">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-900 text-stone-300"
                >
                  Hủy
                </button>
                <button type="submit" className="gold-btn px-5 py-2 rounded-lg font-bold">
                  {editingFaq ? 'Lưu Sửa Đổi' : 'Thêm FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

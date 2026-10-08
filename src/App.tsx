import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { AdvisorModal } from './components/AdvisorModal';
import { NewsModal } from './components/NewsModal';
import { ProjectModal } from './components/ProjectModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AdvisorsPage } from './pages/AdvisorsPage';
import { NewsPage } from './pages/NewsPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { AdminCMSPage } from './pages/AdminCMSPage';

import { SourceGuide } from './components/SourceGuide';
import { HtmlQuickTester } from './components/HtmlQuickTester';

import { INITIAL_SITE_DATA } from './data/initialData';
import { 
  fetchSiteData, 
  saveSiteDataToServer, 
  resetSiteDataToServer, 
  exportSiteDataAsJSON,
  subscribeToSiteData
} from './services/siteDataService';
import { 
  SiteData, 
  Project, 
  Advisor, 
  NewsArticle, 
  AboutContent, 
  CareersContent, 
  ContactContent, 
  GeneralSettings,
  PageHeadersSettings,
  CustomerInquiry,
  PageId 
} from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [siteData, setSiteData] = useState<SiteData>(INITIAL_SITE_DATA);
  const [isSaving, setIsSaving] = useState(false);

  // Modals state for public views
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Modals state for CMS
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);

  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-selected contact project
  const [contactPreselect, setContactPreselect] = useState<string | undefined>(undefined);

  // Fetch initial site data from Firestore / Server / Cache, and subscribe to real-time cloud updates
  useEffect(() => {
    let isMounted = true;
    fetchSiteData().then((loadedData) => {
      if (isMounted && loadedData) {
        setSiteData(loadedData);
      }
    });

    const unsubscribe = subscribeToSiteData((cloudData) => {
      if (isMounted && cloudData) {
        setSiteData(cloudData);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronize whole site data to server and state
  const persistData = async (newData: SiteData, successMsg: string) => {
    setSiteData(newData);
    setIsSaving(true);
    const result = await saveSiteDataToServer(newData);
    setIsSaving(false);
    showToast(successMsg || result.message);
  };

  const handleOpenProject = (id: string) => {
    const proj = siteData.projects.find((p) => p.id === id);
    if (proj && proj.actionType === 'landing' && proj.landingUrl) {
      if (proj.landingUrl.startsWith('http://') || proj.landingUrl.startsWith('https://')) {
        window.open(proj.landingUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = proj.landingUrl;
      }
      return;
    }
    setSelectedProjectId(id);
  };

  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
  };

  const handleContactProject = (projectName: string) => {
    setContactPreselect(projectName);
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactArticle = () => {
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CMS: Project Handlers
  const handleSaveProject = (project: Project) => {
    const existingIndex = siteData.projects.findIndex((p) => p.id === project.id);
    let updatedProjects: Project[];
    if (existingIndex >= 0) {
      updatedProjects = [...siteData.projects];
      updatedProjects[existingIndex] = project;
    } else {
      const newProjWithOrder: Project = {
        ...project,
        order: project.order ?? (siteData.projects.length + 1),
      };
      updatedProjects = [...siteData.projects, newProjWithOrder];
    }
    const updatedSiteData = { ...siteData, projects: updatedProjects };
    persistData(updatedSiteData, `Đã lưu dự án: ${project.name}`);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Quý vị có chắc chắn muốn xóa dự án này khỏi giỏ hàng?')) {
      const updatedProjects = siteData.projects.filter((p) => p.id !== id);
      const updatedSiteData = { ...siteData, projects: updatedProjects };
      persistData(updatedSiteData, 'Đã xóa dự án khỏi hệ thống.');
    }
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siteData.projects.length) return;

    const list = [...siteData.projects];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const reordered = list.map((proj, idx) => ({
      ...proj,
      order: idx + 1,
    }));

    const updatedSiteData = { ...siteData, projects: reordered };
    persistData(updatedSiteData, `Đã đổi vị trí dự án: ${temp.name}`);
  };

  const handleSetProjectOrder = (id: string, newOrder: number) => {
    const list = [...siteData.projects];
    const targetIdx = list.findIndex((p) => p.id === id);
    if (targetIdx === -1) return;

    list[targetIdx] = { ...list[targetIdx], order: newOrder };
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    const normalized = list.map((proj, idx) => ({
      ...proj,
      order: idx + 1,
    }));

    const updatedSiteData = { ...siteData, projects: normalized };
    persistData(updatedSiteData, 'Đã cập nhật số thứ tự vị trí dự án!');
  };

  const handleSortProjects = () => {
    const list = [...siteData.projects];
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const normalized = list.map((proj, idx) => ({ ...proj, order: idx + 1 }));
    const updatedSiteData = { ...siteData, projects: normalized };
    persistData(updatedSiteData, 'Đã sắp xếp lại danh mục dự án theo số thứ tự!');
  };

  // CMS: Advisor Handlers
  const handleSaveAdvisor = (saved: Advisor) => {
    const existingIndex = siteData.advisors.findIndex((a) => a.id === saved.id);
    let updatedAdvisors: Advisor[];
    if (existingIndex >= 0) {
      updatedAdvisors = [...siteData.advisors];
      updatedAdvisors[existingIndex] = saved;
    } else {
      const newAdvWithOrder: Advisor = {
        ...saved,
        order: saved.order ?? (siteData.advisors.length + 1)
      };
      updatedAdvisors = [...siteData.advisors, newAdvWithOrder];
    }
    // Respect order
    updatedAdvisors.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const updatedSiteData = { ...siteData, advisors: updatedAdvisors };
    persistData(updatedSiteData, `Đã lưu chuyên viên: ${saved.name}`);
  };

  const handleMoveAdvisor = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siteData.advisors.length) return;

    const list = [...siteData.advisors];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Renormalize order 1..N
    const reordered = list.map((adv, idx) => ({
      ...adv,
      order: idx + 1
    }));

    const updatedSiteData = { ...siteData, advisors: reordered };
    persistData(updatedSiteData, `Đã đổi vị trí chuyên viên: ${temp.name}`);
  };

  const handleSetAdvisorOrder = (id: string, newOrder: number) => {
    const list = [...siteData.advisors];
    const targetIdx = list.findIndex(a => a.id === id);
    if (targetIdx === -1) return;

    list[targetIdx] = { ...list[targetIdx], order: newOrder };
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    // Normalize order 1..N
    const normalized = list.map((adv, idx) => ({
      ...adv,
      order: idx + 1
    }));

    const updatedSiteData = { ...siteData, advisors: normalized };
    persistData(updatedSiteData, 'Đã cập nhật số thứ tự vị trí chuyên viên!');
  };

  const handleSortAdvisors = () => {
    const list = [...siteData.advisors];
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const normalized = list.map((adv, idx) => ({ ...adv, order: idx + 1 }));
    const updatedSiteData = { ...siteData, advisors: normalized };
    persistData(updatedSiteData, 'Đã sắp xếp lại danh sách chuyên viên!');
  };

  const handleDeleteAdvisor = (id: string) => {
    if (confirm('Quý vị có chắc chắn muốn xóa chuyên viên này?')) {
      const updatedAdvisors = siteData.advisors.filter((a) => a.id !== id);
      const updatedSiteData = { ...siteData, advisors: updatedAdvisors };
      persistData(updatedSiteData, 'Đã xóa chuyên viên khỏi hệ thống.');
    }
  };

  const handleToggleFeaturedAdvisor = (id: string) => {
    const updatedAdvisors = siteData.advisors.map((a) => {
      if (a.id === id) {
        return { ...a, isFeatured: !a.isFeatured };
      }
      return a;
    });
    const updatedSiteData = { ...siteData, advisors: updatedAdvisors };
    persistData(updatedSiteData, 'Đã cập nhật trạng thái Tiêu Biểu!');
  };

  // CMS: News Handlers
  const handleSaveNews = (saved: NewsArticle) => {
    const existingIndex = siteData.news.findIndex((n) => n.id === saved.id);
    let updatedNews: NewsArticle[];
    if (existingIndex >= 0) {
      updatedNews = [...siteData.news];
      updatedNews[existingIndex] = saved;
    } else {
      const newArtWithOrder: NewsArticle = {
        ...saved,
        order: saved.order ?? (siteData.news.length + 1),
      };
      updatedNews = [...siteData.news, newArtWithOrder];
    }
    const updatedSiteData = { ...siteData, news: updatedNews };
    persistData(updatedSiteData, `Đã xuất bản bài viết: ${saved.title}`);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Quý vị có chắc chắn muốn xóa bài viết này?')) {
      const updatedNews = siteData.news.filter((n) => n.id !== id);
      const updatedSiteData = { ...siteData, news: updatedNews };
      persistData(updatedSiteData, 'Đã xóa bài viết.');
    }
  };

  const handleMoveNews = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siteData.news.length) return;

    const list = [...siteData.news];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const reordered = list.map((art, idx) => ({
      ...art,
      order: idx + 1,
    }));

    const updatedSiteData = { ...siteData, news: reordered };
    persistData(updatedSiteData, `Đã đổi vị trí tin tức: ${temp.title}`);
  };

  const handleSetNewsOrder = (id: string, newOrder: number) => {
    const list = [...siteData.news];
    const targetIdx = list.findIndex((n) => n.id === id);
    if (targetIdx === -1) return;

    list[targetIdx] = { ...list[targetIdx], order: newOrder };
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    const normalized = list.map((art, idx) => ({
      ...art,
      order: idx + 1,
    }));

    const updatedSiteData = { ...siteData, news: normalized };
    persistData(updatedSiteData, 'Đã cập nhật số thứ tự bài viết!');
  };

  const handleSortNews = () => {
    const list = [...siteData.news];
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const normalized = list.map((art, idx) => ({ ...art, order: idx + 1 }));
    const updatedSiteData = { ...siteData, news: normalized };
    persistData(updatedSiteData, 'Đã sắp xếp lại danh sách tin tức theo số thứ tự!');
  };

  // CMS: About, Careers, Contact Handlers
  const handleUpdateAbout = (about: AboutContent) => {
    const updatedSiteData = { ...siteData, about };
    persistData(updatedSiteData, 'Đã cập nhật mục Giới Thiệu & Báo Chí thành công!');
  };

  const handleUpdateCareers = (careers: CareersContent) => {
    const updatedSiteData = { ...siteData, careers };
    persistData(updatedSiteData, 'Đã cập nhật thông tin Tuyển Dụng thành công!');
  };

  const handleUpdateContact = (contact: ContactContent) => {
    const updatedSiteData = { ...siteData, contact };
    persistData(updatedSiteData, 'Đã cập nhật thông tin Liên Hệ & Trụ Sở thành công!');
  };

  const handleUpdateInquiries = (inquiries: CustomerInquiry[]) => {
    const updatedSiteData = { ...siteData, inquiries };
    persistData(updatedSiteData, 'Đã cập nhật danh sách khách hàng CRM!');
  };

  const handleInquirySubmitted = (newInquiry: CustomerInquiry) => {
    const currentList = siteData.inquiries || [];
    const updatedInquiries = [newInquiry, ...currentList.filter((i) => i.id !== newInquiry.id)];
    const updatedSiteData = { ...siteData, inquiries: updatedInquiries };
    persistData(updatedSiteData, 'Đã tiếp nhận yêu cầu khách hàng mới vào CRM!');
  };

  const handleUpdateGeneral = (general: GeneralSettings) => {
    const updatedSiteData = { ...siteData, general };
    persistData(updatedSiteData, 'Đã cập nhật Cài Đặt Chung & Logo thành công!');
  };

  const handleUpdatePageHeaders = (pageHeaders: PageHeadersSettings) => {
    const updatedSiteData = { ...siteData, pageHeaders };
    persistData(updatedSiteData, 'Đã cập nhật Tiêu Đề Các Trang thành công!');
  };

  // CMS: 1-Click Publish
  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    const res = await saveSiteDataToServer(siteData);
    setIsSaving(false);
    showToast(res.message);
  };

  // CMS: Backup & Restore
  const handleExportBackup = () => {
    exportSiteDataAsJSON(siteData);
    showToast('Đã tải xuống file sao lưu toàn bộ website siproperty.vn!');
  };

  const handleImportBackup = (imported: SiteData) => {
    if (imported && (imported.projects || imported.advisors)) {
      persistData(imported, 'Đã phục hồi dữ liệu website từ file sao lưu thành công!');
    } else {
      alert('Tệp dữ liệu không hợp lệ.');
    }
  };

  const handleResetFactory = async () => {
    const result = await resetSiteDataToServer();
    if (result.success) {
      setSiteData(result.data);
      showToast('Đã đặt lại dữ liệu mặc định ban đầu của SI Property!');
    }
  };

  const activeProject = siteData.projects.find((p) => p.id === selectedProjectId) || null;
  const activeArticle = siteData.news.find((n) => n.id === selectedArticleId) || null;

  return (
    <div className="min-h-screen bg-[#031711] text-stone-100 flex flex-col font-sans selection:bg-[#c59b27] selection:text-stone-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#062920] border-2 border-[#c59b27] text-amber-200 px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        general={siteData.general}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            projects={siteData.projects}
            advisors={siteData.advisors}
            news={siteData.news}
            general={siteData.general}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProject={handleOpenProject}
            onOpenArticle={handleOpenArticle}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage content={siteData.about} />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            projects={siteData.projects}
            onOpenProject={handleOpenProject}
            pageHeaders={siteData.pageHeaders}
          />
        )}

        {currentPage === 'advisors' && (
          <AdvisorsPage
            advisors={siteData.advisors}
            pageHeaders={siteData.pageHeaders}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'news' && (
          <NewsPage
            news={siteData.news}
            pageHeaders={siteData.pageHeaders}
            onOpenArticle={handleOpenArticle}
          />
        )}

        {currentPage === 'careers' && (
          <CareersPage
            content={siteData.careers}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            content={siteData.contact}
            projects={siteData.projects}
            initialProject={contactPreselect}
            onSuccessMessage={showToast}
            onInquirySubmitted={handleInquirySubmitted}
          />
        )}

        {currentPage === 'admin' && (
          <AdminCMSPage
            siteData={siteData}
            onUpdateGeneral={handleUpdateGeneral}
            onUpdatePageHeaders={handleUpdatePageHeaders}
            onUpdateAbout={handleUpdateAbout}
            onOpenProjectModal={(proj) => {
              setEditingProject(proj || null);
              setProjectModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            onMoveProject={handleMoveProject}
            onSetProjectOrder={handleSetProjectOrder}
            onSortProjectsByOrder={handleSortProjects}
            onOpenAdvisorModal={(adv) => {
              setEditingAdvisor(adv || null);
              setAdvisorModalOpen(true);
            }}
            onDeleteAdvisor={handleDeleteAdvisor}
            onToggleFeaturedAdvisor={handleToggleFeaturedAdvisor}
            onMoveAdvisor={handleMoveAdvisor}
            onSetAdvisorOrder={handleSetAdvisorOrder}
            onSortAdvisorsByOrder={handleSortAdvisors}
            onOpenNewsModal={(art) => {
              setEditingNews(art || null);
              setNewsModalOpen(true);
            }}
            onDeleteNews={handleDeleteNews}
            onMoveNews={handleMoveNews}
            onSetNewsOrder={handleSetNewsOrder}
            onSortNewsByOrder={handleSortNews}
            onUpdateCareers={handleUpdateCareers}
            onUpdateContact={handleUpdateContact}
            onUpdateInquiries={handleUpdateInquiries}
            onUpdateSiteData={(newData) => persistData(newData, 'Đã đồng bộ thành công dữ liệu từ Google Sheet!')}
            onSaveAndPublish={handleSaveAndPublish}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onResetFactory={handleResetFactory}
            showToast={showToast}
            isSaving={isSaving}
          />
        )}

        {/* HTML Source Integration Workspace */}
        {currentPage === 'html-import' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                Trung Tâm Tích Hợp HTML Source
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
                ĐẨY MÃ NGUỒN HTML VÀO SIPROPERTY.VN
              </h1>
              <p className="text-xs sm:text-sm text-stone-300">
                Nếu quý vị đã có sẵn các đoạn mã HTML (từ landing page, web cũ hoặc template), quý vị có thể dán vào khung bên dưới để chạy trực tiếp trong iframe, hoặc gửi cho AI Studio để tự động chia tách thành các React component tương ứng!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <HtmlQuickTester />
              <SourceGuide onGoToTester={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setSelectedProjectId(null)}
        onContactProject={handleContactProject}
      />

      <ArticleReaderModal
        article={activeArticle}
        onClose={() => setSelectedArticleId(null)}
        onContactArticle={handleContactArticle}
      />

      {/* CMS Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        project={editingProject}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
      />

      <AdvisorModal
        isOpen={advisorModalOpen}
        advisor={editingAdvisor}
        onClose={() => setAdvisorModalOpen(false)}
        onSave={handleSaveAdvisor}
      />

      <NewsModal
        isOpen={newsModalOpen}
        article={editingNews}
        onClose={() => setNewsModalOpen(false)}
        onSave={handleSaveNews}
      />

      {/* Floating Zalo & Hotline */}
      <FloatingWidgets />

      {/* Global Footer */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenProject={handleOpenProject}
        general={siteData.general}
        projects={siteData.projects}
      />
    </div>
  );
}

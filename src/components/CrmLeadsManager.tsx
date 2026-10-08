import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MessageSquare, 
  AlertCircle,
  X,
  FileSpreadsheet,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CustomerInquiry, InquiryStatus, Project } from '../types';

interface CrmLeadsManagerProps {
  inquiries: CustomerInquiry[];
  projects: Project[];
  primaryEmail: string;
  onUpdateInquiries: (inquiries: CustomerInquiry[]) => void;
  showToast: (msg: string) => void;
}

const STATUS_LABELS: Record<InquiryStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'Mới Tiếp Nhận', color: 'text-rose-400', bg: 'bg-rose-950/80 border-rose-600' },
  contacted: { label: 'Đã Gọi Điện', color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-600' },
  appointment: { label: 'Hẹn Xem Thực Tế', color: 'text-sky-400', bg: 'bg-sky-950/80 border-sky-600' },
  closed: { label: 'Đã Chốt Cọc/Căn', color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-600' },
  cancelled: { label: 'Hủy / Chưa Phù Hợp', color: 'text-stone-400', bg: 'bg-stone-900 border-stone-700' },
};

export const CrmLeadsManager: React.FC<CrmLeadsManagerProps> = ({
  inquiries = [],
  projects = [],
  primaryEmail = 'hieupham.2412@gmail.com',
  onUpdateInquiries,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Manual Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    projectInterest: projects.length > 0 ? projects[0].name : 'The Light City (HODECO)',
    message: '',
    notes: '',
  });

  // KPI Calculations
  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((i) => i.status === 'new').length;
  const inProgressLeads = inquiries.filter((i) => i.status === 'contacted' || i.status === 'appointment').length;
  const closedLeads = inquiries.filter((i) => i.status === 'closed').length;

  // Filtered List
  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProject = filterProject === 'ALL' || item.projectInterest === filterProject;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;

    return matchesSearch && matchesProject && matchesStatus;
  });

  // Update single inquiry status
  const handleStatusChange = (id: string, newStatus: InquiryStatus) => {
    const updated = inquiries.map((i) => (i.id === id ? { ...i, status: newStatus } : i));
    onUpdateInquiries(updated);
    showToast(`Đã chuyển trạng thái sang: ${STATUS_LABELS[newStatus].label}`);
  };

  // Update single inquiry note
  const handleNoteChange = (id: string, noteText: string) => {
    const updated = inquiries.map((i) => (i.id === id ? { ...i, notes: noteText } : i));
    onUpdateInquiries(updated);
  };

  // Delete single inquiry
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Quý vị có chắc muốn xóa dữ liệu liên hệ của khách hàng "${name}" không?`)) {
      const updated = inquiries.filter((i) => i.id !== id);
      onUpdateInquiries(updated);
      showToast(`Đã xóa thông tin khách hàng ${name}.`);
    }
  };

  // Manual Add Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.fullName || !newLeadForm.phone) {
      alert('Vui lòng điền họ tên và số điện thoại!');
      return;
    }

    const lead: CustomerInquiry = {
      id: 'inq-' + Date.now(),
      fullName: newLeadForm.fullName,
      phone: newLeadForm.phone,
      email: newLeadForm.email || undefined,
      projectInterest: newLeadForm.projectInterest,
      message: newLeadForm.message || 'Tiếp nhận trực tiếp từ Sale Admin / Hotline',
      notes: newLeadForm.notes || undefined,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const updated = [lead, ...inquiries];
    onUpdateInquiries(updated);
    showToast(`Đã thêm khách hàng ${lead.fullName} vào hệ thống CRM!`);
    setNewLeadForm({
      fullName: '',
      phone: '',
      email: '',
      projectInterest: projects.length > 0 ? projects[0].name : 'The Light City (HODECO)',
      message: '',
      notes: '',
    });
    setAddModalOpen(false);
  };

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      alert('Chưa có dữ liệu khách hàng để xuất!');
      return;
    }

    const headers = ['Mã Lead', 'Họ Và Tên', 'Số Điện Thoại', 'Email', 'Dự Án Quan Tâm', 'Trạng Thái', 'Nội Dung Yêu Cầu', 'Ghi Chú Sale Admin', 'Thời Gian Gửi'];
    const rows = inquiries.map((i) => [
      `"${i.id}"`,
      `"${i.fullName.replace(/"/g, '""')}"`,
      `"${i.phone}"`,
      `"${i.email || ''}"`,
      `"${(i.projectInterest || '').replace(/"/g, '""')}"`,
      `"${STATUS_LABELS[i.status]?.label || i.status}"`,
      `"${(i.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(i.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${new Date(i.createdAt).toLocaleString('vi-VN')}"`,
    ]);

    // Add UTF-8 BOM so Excel opens Vietnamese characters correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `siproperty_leads_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Đã xuất danh sách khách hàng thành công ra file Excel/CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Header & Email Destination Alert */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#06241c] via-[#093529] to-[#041a14] border border-[#c59b27]/60 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-[#c59b27]/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Hệ Thống CRM Quản Lý Khách Hàng Bất Động Sản</span>
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-white">
            DANH SÁCH KHÁCH HÀNG & LEADS TƯ VẤN (INQUIRIES)
          </h2>
          <p className="text-xs text-stone-300 font-light leading-relaxed max-w-3xl">
            Tất cả yêu cầu tư vấn gửi từ website được lưu trữ vĩnh viễn trên <strong>Google Cloud Firestore</strong> và chuyển tiếp thông báo tức thì về email chính của quý vị: <strong className="text-amber-300 underline">{primaryEmail}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="gold-btn px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khách Thủ Công</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/80 border border-emerald-600 text-amber-200 text-xs font-semibold hover:bg-[#c59b27] hover:text-stone-950 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất File Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-emerald-800/80 space-y-1">
          <div className="text-xs text-stone-400 font-medium uppercase tracking-wider">Tổng Số Khách Hàng</div>
          <div className="text-3xl font-serif-luxury font-bold text-white">{totalLeads}</div>
          <div className="text-[11px] text-stone-400">Đã lưu trữ trên Firebase Cloud</div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-700/60 space-y-1">
          <div className="text-xs text-rose-300 font-medium uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Khách Mới Chưa Xử Lý</span>
          </div>
          <div className="text-3xl font-serif-luxury font-bold text-rose-200">{newLeads}</div>
          <div className="text-[11px] text-rose-300">Cần liên hệ trong 15 phút</div>
        </div>

        <div className="p-5 rounded-2xl bg-sky-950/40 border border-sky-700/60 space-y-1">
          <div className="text-xs text-sky-300 font-medium uppercase tracking-wider">Đang Chăm Sóc / Hẹn Gặp</div>
          <div className="text-3xl font-serif-luxury font-bold text-sky-200">{inProgressLeads}</div>
          <div className="text-[11px] text-sky-300">Đang trao đổi hoặc đặt lịch tour</div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-600/80 space-y-1">
          <div className="text-xs text-emerald-300 font-medium uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Đã Chốt Cọc / Giao Dịch</span>
          </div>
          <div className="text-3xl font-serif-luxury font-bold text-amber-300">{closedLeads}</div>
          <div className="text-[11px] text-emerald-400">Khách hàng thành công</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email, ghi chú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#021812] border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-[#c59b27]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Project Filter - Dynamically synced with projects */}
          <div className="flex items-center gap-1.5 text-xs text-stone-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#021812] border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-[#c59b27]"
            >
              <option value="ALL">Tất Cả Dự Án ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-300">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#021812] border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-[#c59b27]"
            >
              <option value="ALL">Tất Cả Trạng Thái</option>
              <option value="new">🔴 Mới Tiếp Nhận</option>
              <option value="contacted">🟡 Đã Gọi Điện</option>
              <option value="appointment">🔵 Hẹn Xem Thực Tế</option>
              <option value="closed">🟢 Đã Chốt Cọc/Căn</option>
              <option value="cancelled">⚪ Hủy / Chưa Phù Hợp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Leads List / Table */}
      {filteredInquiries.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card space-y-3">
          <Users className="w-12 h-12 text-stone-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Chưa Có Khách Hàng Nào Phù Hợp</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Khi khách hàng điền form trên website hoặc khi quý vị bấm "Thêm Khách Thủ Công", thông tin sẽ hiển thị đầy đủ tại đây.
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 rounded-xl gold-btn text-xs font-bold"
          >
            Thêm Khách Hàng Ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((lead) => {
            const statusConfig = STATUS_LABELS[lead.status] || STATUS_LABELS.new;
            return (
              <div
                key={lead.id}
                className="p-6 rounded-3xl glass-card border border-emerald-900/80 hover:border-[#c59b27]/60 transition space-y-4 shadow-lg"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
                  {/* Customer Identity */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white font-serif-luxury">
                        {lead.fullName}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300">
                      <a
                        href={`tel:${lead.phone.replace(/\D/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-amber-300 hover:underline font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lead.phone}</span>
                      </a>

                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white"
                        >
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{lead.email}</span>
                        </a>
                      )}

                      <span className="text-stone-500 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-stone-400">Trạng thái:</span>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as InquiryStatus)}
                        className="px-3 py-1.5 rounded-xl bg-[#021812] border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-[#c59b27]"
                      >
                        <option value="new">🔴 Mới Tiếp Nhận</option>
                        <option value="contacted">🟡 Đã Gọi Điện</option>
                        <option value="appointment">🔵 Hẹn Xem Thực Tế</option>
                        <option value="closed">🟢 Đã Chốt Cọc/Căn</option>
                        <option value="cancelled">⚪ Hủy / Chưa Phù Hợp</option>
                      </select>
                    </div>

                    <a
                      href={`tel:${lead.phone.replace(/\D/g, '')}`}
                      className="p-2 rounded-xl bg-emerald-900/60 text-amber-300 hover:bg-[#c59b27] hover:text-stone-950 transition"
                      title="Gọi điện ngay"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDelete(lead.id, lead.fullName)}
                      className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-rose-400 hover:border-rose-700 transition"
                      title="Xóa khách hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Project Interest */}
                  <div className="md:col-span-4 p-3.5 rounded-2xl bg-[#021812] border border-emerald-950 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Dự Án Quan Tâm Đặc Biệt
                    </span>
                    <span className="font-semibold text-white text-sm">
                      {lead.projectInterest || 'Tất cả dự án SI Property'}
                    </span>
                  </div>

                  {/* Customer Message */}
                  <div className="md:col-span-4 p-3.5 rounded-2xl bg-[#021812] border border-emerald-950 space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      Yêu Cầu / Nhu Cầu Cụ Thể
                    </span>
                    <p className="text-stone-300 leading-relaxed font-light">
                      {lead.message || 'Không có ghi chú thêm.'}
                    </p>
                  </div>

                  {/* Sale Admin Notes */}
                  <div className="md:col-span-4 p-3.5 rounded-2xl bg-[#032119] border border-emerald-800/80 space-y-1.5">
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Nhật Ký Chăm Sóc Của Sale Admin</span>
                      <span className="text-[9px] text-stone-400">Tự động lưu khi gõ</span>
                    </span>
                    <textarea
                      rows={2}
                      defaultValue={lead.notes || ''}
                      onBlur={(e) => handleNoteChange(lead.id, e.target.value)}
                      placeholder="Ghi chú: Đã gọi lúc 10h, hẹn gửi bảng giá căn góc qua Zalo..."
                      className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-2 text-stone-200 text-xs focus:outline-none focus:border-[#c59b27]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MANUAL ADD LEAD MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#062920] to-[#02130e] border-2 border-[#c59b27] shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-stone-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#c59b27] font-bold">
                Tiếp Nhận Khách Hàng Mới
              </span>
              <h2 className="text-xl font-serif-luxury font-bold text-white">
                Thêm Khách Hàng Vào Hệ Thống CRM
              </h2>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Họ và tên khách hàng (*)
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.fullName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Trần Văn Nam"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Số điện thoại liên hệ (*)
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Email khách hàng
                  </label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="khach@email.com"
                    className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Dự án quan tâm đặc biệt (Tự động liên kết)
                </label>
                <select
                  value={newLeadForm.projectInterest}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, projectInterest: e.target.value })}
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.name}>
                      {proj.name} ({proj.developer || 'HODECO'})
                    </option>
                  ))}
                  <option value="Dự án khác / Tư vấn phân bổ tài sản">Dự án khác / Tư vấn phân bổ tài sản</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Nhu cầu ban đầu của khách
                </label>
                <textarea
                  rows={2}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder="Khách quan tâm phân khu shophouse hoặc căn hộ nghỉ dưỡng..."
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Ghi chú nội bộ Sale Admin
                </label>
                <input
                  type="text"
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Ví dụ: Khách gọi từ hotline lúc 14h, hẹn tư vấn lại sáng mai"
                  className="w-full bg-[#02130e] border border-stone-700 rounded-lg p-3 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 text-stone-300 hover:text-white transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold shadow-lg uppercase tracking-wider"
                >
                  Lưu Khách Hàng Vào CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

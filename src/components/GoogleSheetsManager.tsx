import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Share2, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles,
  Info,
  LogOut,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { SiteData } from '../types';
import { 
  initAuth, 
  googleSignIn, 
  googleLogout, 
  getAccessToken 
} from '../services/googleAuth';
import { 
  createGoogleSheetForSite, 
  syncDataFromGoogleSheet, 
  formatDirectImageUrl 
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';

interface GoogleSheetsManagerProps {
  siteData: SiteData;
  onUpdateSiteData: (newData: SiteData) => void;
  showToast: (msg: string) => void;
}

export const GoogleSheetsManager: React.FC<GoogleSheetsManagerProps> = ({
  siteData,
  onUpdateSiteData,
  showToast,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [shareEmail, setShareEmail] = useState('hieupham.2412@gmail.com');
  const [activeSheetId, setActiveSheetId] = useState<string>('');
  const [activeSheetUrl, setActiveSheetUrl] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  // Helper image link converter
  const [rawDriveUrl, setRawDriveUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [copiedConverted, setCopiedConverted] = useState(false);

  useEffect(() => {
    // Check saved sheet info in localStorage
    const savedId = localStorage.getItem('si_property_google_sheet_id');
    const savedUrl = localStorage.getItem('si_property_google_sheet_url');
    if (savedId) setActiveSheetId(savedId);
    if (savedUrl) setActiveSheetUrl(savedUrl);

    // Init Auth listener
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setCurrentUser(res.user);
        showToast(`Đã đăng nhập Google thành công với tài khoản: ${res.user.email}`);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      showToast('Đăng nhập Google thất bại hoặc bạn đã đóng cửa sổ đăng nhập.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleLogout();
      setCurrentUser(null);
      showToast('Đã đăng xuất tài khoản Google.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleCreateSheet = async () => {
    let token = await getAccessToken();
    if (!token) {
      try {
        const loginRes = await googleSignIn();
        if (!loginRes) return;
        token = loginRes.accessToken;
        setCurrentUser(loginRes.user);
      } catch (e) {
        showToast('Vui lòng hoàn tất đăng nhập Google để tạo file.');
        return;
      }
    }

    if (!token) {
      showToast('Không có quyền truy cập Google Sheets. Vui lòng đăng nhập lại.');
      return;
    }

    setIsCreating(true);
    try {
      const result = await createGoogleSheetForSite(siteData, token, shareEmail.trim());
      setActiveSheetId(result.spreadsheetId);
      setActiveSheetUrl(result.spreadsheetUrl);
      showToast('Khởi tạo Google Sheet thành công và đã chia sẻ quyền Chỉnh sửa (Edit)!');
    } catch (err: any) {
      console.error('Error creating Google Sheet:', err);
      showToast(`Không thể tạo file: ${err.message || 'Lỗi kết nối'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSyncSheet = async () => {
    const sheetId = activeSheetId.trim();
    if (!sheetId) {
      showToast('Vui lòng nhập ID hoặc đường link Google Sheet cần đồng bộ.');
      return;
    }

    // Extract ID if user pasted full URL
    let cleanId = sheetId;
    const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      cleanId = match[1];
    }

    let token = await getAccessToken();
    if (!token) {
      try {
        const loginRes = await googleSignIn();
        if (!loginRes) return;
        token = loginRes.accessToken;
        setCurrentUser(loginRes.user);
      } catch (e) {
        showToast('Vui lòng đăng nhập Google để đồng bộ dữ liệu.');
        return;
      }
    }

    if (!token) return;

    setIsSyncing(true);
    try {
      const syncResult = await syncDataFromGoogleSheet(cleanId, token, siteData);
      if (syncResult.success && syncResult.updatedSiteData) {
        onUpdateSiteData(syncResult.updatedSiteData);
        setLastSyncResult(syncResult.message);
        showToast(syncResult.message);
      }
    } catch (err: any) {
      console.error('Sync error:', err);
      showToast(`Lỗi đồng bộ: ${err.message || 'Không thể đọc dữ liệu'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyLink = () => {
    if (!activeSheetUrl) return;
    navigator.clipboard.writeText(activeSheetUrl);
    setCopiedLink(true);
    showToast('Đã sao chép link Google Sheet vào bộ nhớ tạm.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleConvertDriveUrl = () => {
    if (!rawDriveUrl) return;
    const direct = formatDirectImageUrl(rawDriveUrl);
    setConvertedUrl(direct);
  };

  const handleCopyConverted = () => {
    if (!convertedUrl) return;
    navigator.clipboard.writeText(convertedUrl);
    setCopiedConverted(true);
    showToast('Đã sao chép Link ảnh Direct URL!');
    setTimeout(() => setCopiedConverted(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wider uppercase border border-emerald-500/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Tích Hợp Google Drive & Google Sheets
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-3">
              Quản Lý Nhập Liệu Qua Google Sheet
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Tạo file Google Sheet chuẩn bố cục website và chia sẻ quyền Chỉnh sửa (Edit) cho nhân viên. 
              Sau khi nhân viên nhập xong, bạn có thể bấm <span className="text-amber-400 font-semibold">1-Click Đồng Bộ</span> để đưa toàn bộ dữ liệu dự án, chuyên viên và chỉ số lên website ngay tức thì.
            </p>
          </div>

          {/* Google Auth Status & Button */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-slate-900/90 border border-slate-700/80">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs uppercase shadow">
                  {currentUser.email?.charAt(0) || 'G'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-200 truncate max-w-[160px]">
                    {currentUser.displayName || 'Google Account'}
                  </div>
                  <div className="text-slate-400 truncate max-w-[160px]">{currentUser.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                disabled={isAuthenticating}
                className="gsi-material-button inline-flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-xl shadow-md transition border border-slate-300"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isAuthenticating ? 'Đang kết nối...' : 'Đăng nhập Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Khởi Tạo File Google Sheet */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">1. Tạo File Google Sheet Mới</h3>
                <p className="text-xs text-slate-400">Chuẩn 6 sheet dữ liệu, nạp sẵn dự án và chuyên viên hiện tại</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                Email nhận quyền Chỉnh Sửa (Edit / Writer):
              </label>
              <input
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="hieupham.2412@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              />
              <p className="text-[11px] text-slate-400">
                File sẽ được cấp quyền Chỉnh sửa cho email trên và quyền Editor cho bất kỳ ai có link trong đội ngũ của bạn.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                6 Tab dữ liệu tự động khởi tạo:
              </div>
              <ul className="grid grid-cols-2 gap-1.5 text-slate-400 text-[11px]">
                <li>• <strong className="text-slate-300">1_DU_AN:</strong> 5 Đại dự án</li>
                <li>• <strong className="text-slate-300">2_CHUYEN_VIEN:</strong> Danh sách tư vấn</li>
                <li>• <strong className="text-slate-300">3_TRANG_CHU:</strong> 4 Chỉ số & slogan</li>
                <li>• <strong className="text-slate-300">4_TIN_TUC:</strong> Bài viết thị trường</li>
                <li>• <strong className="text-slate-300">5_TUYEN_DUNG:</strong> Vị trí kinh doanh</li>
                <li>• <strong className="text-slate-300">6_HUONG_DAN:</strong> Quy định ảnh & lưu ý</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateSheet}
            disabled={isCreating}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Đang khởi tạo trên Google Drive...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Khởi Tạo Google Sheet & Chia Sẻ Ngay
              </>
            )}
          </button>
        </div>

        {/* Box 2: Quản Lý File & Đồng Bộ Về Website */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">2. Đồng Bộ Dữ Liệu Về Website</h3>
                <p className="text-xs text-slate-400">Cập nhật thay đổi từ nhân viên vào website trong tích tắc</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                Google Sheet ID hoặc Đường Link File:
              </label>
              <input
                type="text"
                value={activeSheetId}
                onChange={(e) => {
                  setActiveSheetId(e.target.value);
                  if (e.target.value.includes('/spreadsheets/d/')) {
                    setActiveSheetUrl(e.target.value);
                  }
                }}
                placeholder="Dán ID hoặc link Google Sheet vào đây..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              />
            </div>

            {/* Active Sheet Card */}
            {activeSheetUrl ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    File Google Sheet đã sẵn sàng:
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedLink ? 'Đã copy' : 'Copy link'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activeSheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-medium truncate flex items-center gap-1"
                  >
                    Mở Google Sheet trên trình duyệt
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 italic">
                Chưa có file Google Sheet nào được liên kết. Hãy bấm nút "Khởi Tạo" bên trái hoặc dán link file sẵn có.
              </div>
            )}

            {lastSyncResult && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{lastSyncResult}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSyncSheet}
            disabled={isSyncing || !activeSheetId}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Đang đọc dữ liệu & đồng bộ website...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Đồng Bộ Dữ Liệu Từ Sheet Vào Website
              </>
            )}
          </button>
        </div>
      </div>

      {/* Special Section: Hướng Dẫn Chi Tiết Cho Nhân Viên Nhập Liệu & Ảnh Chuyên Viên */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Hướng Dẫn Nhân Viên Nhập Liệu
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                Quan Trọng: Phần Ảnh Chuyên Viên
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Quy tắc nhập hình ảnh và các trường thông tin quan trọng để website hiển thị đẹp nhất
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quy định 1 */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-sm flex items-center justify-center border border-amber-500/30">
              1
            </div>
            <h4 className="font-semibold text-sm text-slate-200">Không Dán Trực Tiếp File Vào Ô</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Sheet không hỗ trợ lấy dữ liệu nếu nhân viên chèn hình ảnh lơ lửng trên ô tính. 
              Hãy yêu cầu nhân viên <strong className="text-amber-300">dán đường Link URL của bức ảnh</strong> vào cột "Link Ảnh Chân Dung".
            </p>
          </div>

          {/* Quy định 2 */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-sm flex items-center justify-center border border-emerald-500/30">
              2
            </div>
            <h4 className="font-semibold text-sm text-slate-200">Nhập Qua Thư Mục Google Drive</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tạo thư mục Drive chứa ảnh chuyên viên &gt; Chia sẻ quyền <em>"Bất kỳ ai có liên kết đều có thể xem"</em> &gt; 
              Sao chép link chia sẻ của từng ảnh dán vào Google Sheet. Website đã có thuật toán tự chuyển thành ảnh hiển thị.
            </p>
          </div>

          {/* Quy định 3 */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-sm flex items-center justify-center border border-blue-500/30">
              3
            </div>
            <h4 className="font-semibold text-sm text-slate-200">Hoặc Gửi Ảnh Riêng Biệt</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nếu nhân viên không rành công nghệ, họ chỉ cần điền đầy đủ Tên, SĐT, Chức vụ trong Google Sheet. 
              Bộ ảnh chân dung sẽ được gửi riêng qua Zalo/Drive theo Tên hoặc Mã ID, Quản trị viên chỉ cần gắn ảnh 1 lần trong CMS.
            </p>
          </div>
        </div>

        {/* Tiện ích chuyển đổi link ảnh Google Drive nhanh cho nhân viên */}
        <div className="p-4.5 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-amber-400" />
              Công Cụ Chuyển Đổi Nhanh: Link Google Drive &rarr; Link Ảnh Web Trực Tiếp
            </span>
            <span className="text-[11px] text-slate-400">Dành cho nhân viên kiểm tra link ảnh trước khi dán</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={rawDriveUrl}
              onChange={(e) => setRawDriveUrl(e.target.value)}
              placeholder="Dán link ảnh Google Drive chia sẻ (ví dụ: https://drive.google.com/file/d/1ABC.../view?usp=sharing)"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleConvertDriveUrl}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              Chuyển Đổi Link
            </button>
          </div>

          {convertedUrl && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-300 font-mono truncate">
                {convertedUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyConverted}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shrink-0 flex items-center gap-1 transition"
              >
                {copiedConverted ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedConverted ? 'Đã chép' : 'Sao chép link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  CheckCircle2, 
  FileCode, 
  Sparkles, 
  AlertCircle,
  Eye,
  Maximize2
} from 'lucide-react';

const DEFAULT_SAMPLE_HTML = `<!-- Mẫu HTML siproperty.vn -->
<header style="background: #0f172a; color: white; padding: 20px; text-align: center; font-family: sans-serif;">
  <h1 style="margin: 0; font-size: 24px; color: #38bdf8;">SI PROPERTY VIETNAM</h1>
  <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">Chuyên trang tư vấn & đầu tư bất động sản cao cấp</p>
</header>

<section style="padding: 40px 20px; max-width: 900px; margin: 0 auto; font-family: sans-serif;">
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center;">
    <h2 style="color: #1e293b; margin-top: 0;">Tìm Kiếm Bất Động Sản</h2>
    <p style="color: #64748b; font-size: 14px;">Hơn 500+ dự án căn hộ, biệt thự và đất nền tiềm năng</p>
    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
      <input type="text" placeholder="Nhập khu vực, dự án (VD: Thủ Thiêm, Quận 7...)" style="padding: 10px 16px; border: 1px solid #cbd5e1; border-radius: 6px; width: 60%; font-size: 14px;" />
      <button style="background: #0284c7; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">Tìm Kiếm</button>
    </div>
  </div>
</section>`;

export const HtmlQuickTester: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState<string>(DEFAULT_SAMPLE_HTML);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Quick stats extraction
  const imgCount = (htmlInput.match(/<img/gi) || []).length;
  const linkCount = (htmlInput.match(/<a\b/gi) || []).length;
  const formCount = (htmlInput.match(/<form|<input|<select/gi) || []).length;
  const sectionCount = (htmlInput.match(/<section|<div|<header|<footer/gi) || []).length;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyChatPrompt = () => {
    const promptText = `Đây là toàn bộ mã nguồn HTML của siproperty.vn, hãy tích hợp nó vào file /src/App.tsx và các component giúp tôi:\n\n\`\`\`html\n${htmlInput}\n\`\`\``;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleResetSample = () => {
    setHtmlInput(DEFAULT_SAMPLE_HTML);
  };

  return (
    <div id="html-quick-tester-component" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-600" />
              Trình Dán & Xem Thử Mã HTML của siproperty.vn
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Dán bất kỳ đoạn mã HTML, CSS hoặc trang web nào của bạn vào đây để xem trước tức thì kết quả hiển thị.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="tester-reset-btn"
              onClick={handleResetSample}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              title="Đặt lại mẫu code siproperty"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nạp mẫu siproperty</span>
            </button>
            <button
              id="tester-copy-prompt-btn"
              onClick={handleCopyChatPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              {copiedPrompt ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{copiedPrompt ? 'Đã copy lời nhắc kèm code!' : 'Copy yêu cầu gửi AI'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Phân tích mã nguồn:</span>
          <span className="bg-slate-100 px-2 py-1 rounded">Khối layout: <strong>{sectionCount}</strong></span>
          <span className="bg-slate-100 px-2 py-1 rounded">Thẻ hình ảnh: <strong>{imgCount}</strong></span>
          <span className="bg-slate-100 px-2 py-1 rounded">Liên kết & nút: <strong>{linkCount}</strong></span>
          <span className="bg-slate-100 px-2 py-1 rounded">Trường nhập dữ liệu/form: <strong>{formCount}</strong></span>
        </div>
      </div>

      {/* Editor & Live Preview 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Code Input */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-900 text-slate-200 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-400 ml-2">Dán mã HTML siproperty.vn vào đây</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="tester-copy-raw-btn"
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã copy' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 p-2 bg-slate-950">
            <textarea
              id="html-raw-textarea"
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Dán mã nguồn HTML (kèm CSS style) của bạn tại đây..."
              className="w-full h-full p-3 font-mono text-xs text-emerald-400 bg-slate-950 focus:outline-none resize-none leading-relaxed border-0"
              spellCheck={false}
            />
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Dung lượng: {htmlInput.length} ký tự</span>
            <span className="text-indigo-600 font-medium">Bản xem trước tự động cập nhật bên phải</span>
          </div>
        </div>

        {/* Right Column: Live Iframe Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Xem trước kết quả hiển thị (Live Preview)</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
              Cách ly an toàn (Sandbox)
            </span>
          </div>

          <div className="flex-1 bg-white relative">
            {htmlInput.trim() ? (
              <iframe
                id="html-preview-iframe"
                title="Preview siproperty HTML"
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;">${htmlInput}</body></html>`}
                sandbox="allow-scripts"
                className="w-full h-full border-0 bg-white"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">Chưa có mã nguồn HTML</p>
                <p className="text-xs text-slate-400 mt-1">Hãy dán code vào khung bên trái để xem kết quả</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Hiển thị chuẩn theo render của trình duyệt</span>
            <span className="text-emerald-700 font-medium">Sẵn sàng tích hợp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

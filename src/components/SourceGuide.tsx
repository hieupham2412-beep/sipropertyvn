import React from 'react';
import { 
  FileCode, 
  FolderTree, 
  MessageSquareQuote, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  Layers,
  Terminal,
  Globe
} from 'lucide-react';

interface SourceGuideProps {
  onGoToTester: () => void;
}

export const SourceGuide: React.FC<SourceGuideProps> = ({ onGoToTester }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="source-guide-section" className="space-y-8">
      {/* Header Banner */}
      <div id="guide-hero-banner" className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>Xây dựng siproperty.vn</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Bạn có source HTML của siproperty.vn? Dưới đây là 3 cách đưa vào:
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Dự án này là môi trường web hoàn chỉnh (React + Vite + Tailwind CSS). Tuỳ theo định dạng mã nguồn bạn đang có, bạn có thể chọn phương án nhanh nhất dưới đây:
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              id="guide-test-now-btn"
              onClick={onGoToTester}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              <FileCode className="w-4 h-4" />
              <span>Dán thử mã HTML xem ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Main Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Method 1 */}
        <div id="method-chat-upload" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                01
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Khuyên Dùng ⭐
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-emerald-600" />
              Dán vào khung Chat
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Cách dễ nhất: Bạn chỉ cần copy mã HTML (hoặc gửi đính kèm file <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">.html</code> / file zip) trực tiếp vào đoạn chat với trợ lý AI.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>AI tự động convert HTML sang React component chuẩn</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Tự động tối ưu hoá responsive & Tailwind CSS</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Không cần tự sửa lỗi cú pháp JSX hay thẻ đóng</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 italic">
              Ví dụ chat: &quot;Đây là mã HTML trang chủ siproperty.vn của tôi: [dán code vào]&quot;
            </p>
          </div>
        </div>

        {/* Method 2 */}
        <div id="method-src-components" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                02
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Trực Tiếp Code
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-600" />
              Đưa vào src/App.tsx
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Chèn mã vào cấu trúc mã nguồn React tại thư mục <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">/src/</code>.
            </p>

            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-xs font-mono mb-4 space-y-1 overflow-x-auto">
              <div className="text-slate-400">// Vị trí các file:</div>
              <div>📂 /src/</div>
              <div>├── 📄 <span className="text-emerald-400">App.tsx</span> <span className="text-slate-400">(Chứa giao diện)</span></div>
              <div>├── 📄 <span className="text-indigo-400">index.css</span> <span className="text-slate-400">(CSS tuỳ biến)</span></div>
              <div>└── 📂 components/ <span className="text-slate-400">(Tách nhỏ)</span></div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Lưu ý đổi <code className="font-mono bg-slate-100 px-1 rounded">class=&quot;...&quot;</code> thành <code className="font-mono bg-slate-100 px-1 rounded">className=&quot;...&quot;</code> và đóng các thẻ như <code className="font-mono bg-slate-100 px-1 rounded">&lt;img /&gt;</code>, <code className="font-mono bg-slate-100 px-1 rounded">&lt;input /&gt;</code>.
            </p>
          </div>
        </div>

        {/* Method 3 */}
        <div id="method-public-folder" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                03
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                HTML Tĩnh & Tài nguyên
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Thư mục public/ & index.html
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Dành cho các file tài nguyên tĩnh như hình ảnh banner, logo, icon, hoặc các thư viện script ngoài.
            </p>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-2 mb-4">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800">1.</span>
                <span>Thẻ <code className="font-mono bg-slate-200 px-1 rounded">&lt;head&gt;</code>, fonts, script ngoài: Đặt vào <code className="font-mono text-indigo-600">/index.html</code></span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800">2.</span>
                <span>Hình ảnh, logo, tài liệu: Đặt vào <code className="font-mono text-indigo-600">/public/</code></span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Các file trong <code className="font-mono bg-slate-100 px-1 rounded">/public/logo.png</code> sẽ được truy cập trực tiếp qua đường dẫn <code className="font-mono bg-slate-100 px-1 rounded">/logo.png</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Interactive Tooltip / Reference Box */}
      <div id="guide-quick-cheat-sheet" className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-700" />
          Bảng tra cứu quy tắc chuyển đổi nhanh từ HTML sang React JSX
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-slate-400 font-mono mb-1">HTML thuần:</div>
            <div className="font-mono text-red-600 bg-red-50 p-1.5 rounded mb-2">&lt;div class=&quot;container&quot;&gt;</div>
            <div className="text-slate-400 font-mono mb-1">Sang React (App.tsx):</div>
            <div className="font-mono text-emerald-700 bg-emerald-50 p-1.5 rounded">&lt;div className=&quot;container&quot;&gt;</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-slate-400 font-mono mb-1">HTML thuần:</div>
            <div className="font-mono text-red-600 bg-red-50 p-1.5 rounded mb-2">&lt;img src=&quot;banner.jpg&quot;&gt;</div>
            <div className="text-slate-400 font-mono mb-1">Sang React (App.tsx):</div>
            <div className="font-mono text-emerald-700 bg-emerald-50 p-1.5 rounded">&lt;img src=&quot;banner.jpg&quot; alt=&quot;&quot; /&gt;</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-slate-400 font-mono mb-1">HTML thuần:</div>
            <div className="font-mono text-red-600 bg-red-50 p-1.5 rounded mb-2">&lt;div style=&quot;color: red;&quot;&gt;</div>
            <div className="text-slate-400 font-mono mb-1">Sang React (App.tsx):</div>
            <div className="font-mono text-emerald-700 bg-emerald-50 p-1.5 rounded">&lt;div style=&#123;&#123; color: &apos;red&apos; &#125;&#125;&gt;</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            💡 Bạn có thể dán toàn bộ file HTML của bạn vào khung &quot;Dán & Xem thử HTML&quot; ở tab bên cạnh để xem trước ngay!
          </span>
          <button
            id="guide-copy-example-prompt-btn"
            onClick={() => copyToClipboard('Đây là mã HTML website siproperty.vn của tôi, hãy chuyển nó sang giao diện chuẩn của website:', 1)}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            {copiedIndex === 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 1 ? 'Đã copy câu lệnh mẫu!' : 'Copy mẫu prompt chat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Phone } from 'lucide-react';

export const FloatingWidgets: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://zalo.me/0938889688"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl border-2 border-white/30 transition transform hover:scale-110 active:scale-95"
        title="Chat Zalo Tư Vấn"
        aria-label="Chat Zalo Tư Vấn"
      >
        <span className="text-xs font-bold font-sans">Zalo</span>
      </a>
      <a
        href="tel:0938889688"
        className="w-12 h-12 rounded-full gold-btn flex items-center justify-center shadow-xl border border-amber-300 transition transform hover:scale-110 active:scale-95 animate-pulse"
        title="Gọi Hotline 0938.889.688"
        aria-label="Gọi Hotline 0938.889.688"
      >
        <Phone className="w-5 h-5 text-stone-950" />
      </a>
    </div>
  );
};

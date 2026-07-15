"use client";

import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center gap-3"
        style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)" }}>
        <Link href="/messages" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 flex-1">浏览记录</h1>
      </header>

      <div className="flex flex-col items-center justify-center mt-24 px-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-5 text-3xl">
          👁️
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">暂无浏览记录</p>
        <p className="text-xs text-gray-400 text-center leading-relaxed">你浏览过的物品会出现在这里</p>
      </div>
    </div>
  );
}

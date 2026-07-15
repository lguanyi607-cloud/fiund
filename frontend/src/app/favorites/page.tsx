"use client";

import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-3">
        <Link href="/messages" className="text-gray-600 hover:text-blue-600 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 flex-1">我的收藏</h1>
      </header>

      <div className="flex flex-col items-center justify-center mt-24 px-8">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl">⭐</div>
        <p className="text-sm text-gray-500 mb-1">还没有收藏任何物品</p>
        <p className="text-xs text-gray-400 text-center">浏览物品时点击星标即可收藏</p>
      </div>
    </div>
  );
}

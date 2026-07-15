"use client";

import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/data/items";
import { useFavorites } from "@/data/favorites";

export default function FavoritesPage() {
  const allItems = useItems();
  const favIds = useFavorites();

  /* 根据收藏 ID 找到对应的物品 */
  const favItems = favIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean) as typeof allItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center gap-3"
        style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)" }}>
        <Link href="/messages" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 flex-1">我的收藏</h1>
        {favItems.length > 0 && (
          <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">{favItems.length} 件</span>
        )}
      </header>

      {/* 收藏列表 */}
      {favItems.length > 0 ? (
        <div className="p-4 grid grid-cols-2 gap-3 pb-24">
          {favItems.map((item, idx) => (
            <Link key={item.id} href={`/item/${item.id}`}
              className="animate-slide-up"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}>
              <ItemCard {...item} />
            </Link>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center mt-24 px-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">还没有收藏任何物品</p>
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            进入物品详情页，点击右上角星标即可收藏
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-2.5 bg-gradient-primary text-white rounded-full text-xs font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-95"
          >
            去逛逛
          </Link>
        </div>
      )}
    </div>
  );
}
